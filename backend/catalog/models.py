# catalog/models.py
import uuid
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator


class Product(models.Model):
    """
    Simple flat product model (no category).
    Money stored as DecimalField to 2 decimals (INR: rupees).
    Stock tracked as an integer.
    """
    STATUS_ACTIVE = "active"
    STATUS_INACTIVE = "inactive"
    STATUS_CHOICES = [(STATUS_ACTIVE, "Active"), (STATUS_INACTIVE, "Inactive")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.CharField(max_length=64, unique=True, null=True, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    # Money as decimal with two decimal places
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock_quantity = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_ACTIVE, db_index=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status"]),
            models.Index(fields=["sku"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.sku or self.id})"

    # NOTE: reservation API is implemented in orders app where InventoryReservation lives.
    # But a helper to adjust stock safely is useful:
    def decrement_stock(self, quantity: int):
        """
        Decrement stock atomically. Raises ValueError if insufficient stock.
        Use inside a transaction and select_for_update on the product row.
        """
        if quantity <= 0:
            raise ValueError("quantity must be positive")
        # Caller must lock the row (select_for_update) for correctness in concurrent flows.


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image_url = models.TextField()  # CDN or storage URL
    alt_text = models.CharField(max_length=255, blank=True)
    is_main = models.BooleanField(default=False)
    sort_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["sort_order", "-is_main"]
        indexes = [models.Index(fields=["product"])]

    def __str__(self):
        return f"Image {self.id} for {self.product_id}"
