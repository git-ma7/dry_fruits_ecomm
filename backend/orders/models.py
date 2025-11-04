# orders/models.py
import uuid
from datetime import timedelta

from django.db import models, transaction
from django.utils import timezone
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db.models import F

# import Product via string to avoid circular imports if needed
# from catalog.models import Product


class Order(models.Model):
    """
    Core order record. With client-side cart approach, server expects checkout items
    and creates an Order + OrderItems + InventoryReservations transactionally.
    """
    STATUS_PENDING = "pending"
    STATUS_RESERVED = "reserved"
    STATUS_PAID = "paid"
    STATUS_CANCELLED = "cancelled"
    STATUS_FAILED = "failed"
    STATUS_SHIPPED = "shipped"
    STATUS_DELIVERED = "delivered"
    STATUS_REFUNDED = "refunded"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_RESERVED, "Reserved"),
        (STATUS_PAID, "Paid"),
        (STATUS_CANCELLED, "Cancelled"),
        (STATUS_FAILED, "Failed"),
        (STATUS_SHIPPED, "Shipped"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_REFUNDED, "Refunded"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="orders", on_delete=models.CASCADE)
    # Store address as FK; keep snapshotting options if addresses change later.
    address = models.ForeignKey('users.Address', null=True, blank=True, on_delete=models.SET_NULL)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    placed_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    metadata = models.JSONField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["user", "status", "placed_at"])]

    def __str__(self):
        return f"Order {self.id} by {self.user_id}"

    def mark_paid(self):
        self.status = self.STATUS_PAID
        self.updated_at = timezone.now()
        self.save(update_fields=["status", "updated_at"])

    def cancel_and_release(self):
        """
        Cancel order and release any reservations (idempotent).
        """
        self.status = self.STATUS_CANCELLED
        self.save(update_fields=["status", "updated_at"])
        reservations = InventoryReservation.objects.filter(order=self, released=False)
        for r in reservations:
            r.release()


class OrderItem(models.Model):
    """
    Snapshot of ordered products. Preserve price and product name at purchase time.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey('catalog.Product', on_delete=models.PROTECT)
    product_name = models.CharField(max_length=255)
    sku = models.CharField(max_length=64, blank=True, null=True)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [models.Index(fields=["order", "product"])]

    def __str__(self):
        return f"{self.quantity} × {self.product_name}"


class InventoryReservation(models.Model):
    """
    Reserve stock for an order for a short TTL.
    Background worker must release expired reservations.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey('catalog.Product', related_name="reservations", on_delete=models.CASCADE)
    order = models.ForeignKey(Order, related_name="reservations", on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(db_index=True)
    released = models.BooleanField(default=False, db_index=True)
    released_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["product", "expires_at"]),
            models.Index(fields=["order", "released"]),
        ]

    def __str__(self):
        return f"Reservation {self.quantity} of {self.product_id}"

    @classmethod
    def create_reservation(cls, product, quantity, order=None, ttl_seconds: int = 900):
        """
        Atomically reserve stock for a product by decreasing product.stock_quantity.
        Caller should be inside transaction to guarantee ordering if needed.
        """
        if quantity <= 0:
            raise ValueError("quantity must be positive")
        with transaction.atomic():
            # Lock product row
            prod = product.__class__.objects.select_for_update().get(pk=product.pk)
            if prod.stock_quantity < quantity:
                raise ValueError("Insufficient stock")
            # decrement using F() for safety
            prod.stock_quantity = F("stock_quantity") - quantity
            prod.save(update_fields=["stock_quantity"])
            expires_at = timezone.now() + timedelta(seconds=ttl_seconds)
            reservation = cls.objects.create(
                product=product,
                order=order,
                quantity=quantity,
                expires_at=expires_at,
            )
            return reservation

    def release(self):
        """
        Release reserved stock (idempotent). Uses select_for_update to avoid races.
        """
        if self.released:
            return
        with transaction.atomic():
            prod = self.product.__class__.objects.select_for_update().get(pk=self.product.pk)
            prod.stock_quantity = F("stock_quantity") + self.quantity
            prod.save(update_fields=["stock_quantity"])
            self.released = True
            self.released_at = timezone.now()
            self.save(update_fields=["released", "released_at"])
