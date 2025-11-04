# payments/models.py
import uuid
from django.db import models
from django.utils import timezone

class Payment(models.Model):
    """
    Tracks Razorpay payment lifecycle and raw webhook payload for audit/debug.
    Amount matches the order.total_amount (snapshot).
    """
    STATUS_CREATED = "created"
    STATUS_AUTHORIZED = "authorized"
    STATUS_CAPTURED = "captured"
    STATUS_FAILED = "failed"
    STATUS_REFUNDED = "refunded"

    STATUS_CHOICES = [
        (STATUS_CREATED, "Created"),
        (STATUS_AUTHORIZED, "Authorized"),
        (STATUS_CAPTURED, "Captured"),
        (STATUS_FAILED, "Failed"),
        (STATUS_REFUNDED, "Refunded"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # link to orders.Order; keep on_delete=CASCADE to remove payments when order deleted (orders shouldn't be deleted).
    order = models.ForeignKey('orders.Order', related_name="payments", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, db_index=True, default=STATUS_CREATED)
    razorpay_order_id = models.CharField(max_length=128, null=True, blank=True, db_index=True)
    razorpay_payment_id = models.CharField(max_length=128, null=True, blank=True, db_index=True)
    razorpay_signature = models.CharField(max_length=512, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    captured_at = models.DateTimeField(null=True, blank=True)
    raw_payload = models.JSONField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["order", "status"]), models.Index(fields=["razorpay_order_id"])]

    def __str__(self):
        return f"Payment {self.id} for order {self.order_id}"

    def mark_captured(self, payload=None):
        self.status = self.STATUS_CAPTURED
        self.captured_at = timezone.now()
        if payload:
            self.raw_payload = payload
        self.save(update_fields=["status", "captured_at", "raw_payload"])
