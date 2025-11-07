# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem, InventoryReservation
from catalog.serializers import ProductSerializer
from backend.users.serializers import AddressSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "sku",
            "quantity",
            "price_snapshot",
        ]
        read_only_fields = ["id", "product_name", "sku", "price_snapshot"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "address",
            "total_amount",
            "status",
            "placed_at",
            "items",
        ]
        read_only_fields = ["id", "user", "placed_at", "status", "total_amount", "items"]


class InventoryReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryReservation
        fields = ["id", "product", "order", "quantity", "reserved_at"]
        read_only_fields = ["id", "reserved_at"]
