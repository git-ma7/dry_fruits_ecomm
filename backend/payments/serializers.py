# payments/serializers.py
from rest_framework import serializers
from .models import Payment
from orders.serializers import OrderSerializer


class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "user",
            "amount",
            "method",
            "status",
            "transaction_id",
            "paid_at",
            "created_at",
        ]
        read_only_fields = ["id", "user", "order", "paid_at", "created_at"]
