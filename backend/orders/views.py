# orders/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from .models import Order, OrderItem, InventoryReservation
from catalog.models import Product
from users.models import Address
from .serializers import OrderSerializer,OrderItemSerializer


# ----- USER ORDER LIST + CREATE -----
class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-placed_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        """
        Style A: Create order + items in a single payload.
        Example payload:
        {
            "address_id": "uuid",
            "items": [{"product_id": "uuid1", "quantity": 2}]
        }
        """
        data = request.data
        address = get_object_or_404(Address, pk=data.get("address_id"), user=request.user)
        items = data.get("items", [])

        if not items:
            return Response({"detail": "No items provided."}, status=status.HTTP_400_BAD_REQUEST)

        order_total = 0
        order = Order.objects.create(
            user=request.user,
            address=address,
            total_amount=0,
            status=Order.STATUS_PENDING,
        )

        for item in items:
            product = get_object_or_404(Product, pk=item.get("product_id"), status="active")
            qty = int(item.get("quantity", 0))
            if qty <= 0:
                transaction.set_rollback(True)
                return Response({"detail": "Invalid quantity."}, status=status.HTTP_400_BAD_REQUEST)
            if product.stock_quantity < qty:
                transaction.set_rollback(True)
                return Response({"detail": f"Not enough stock for {product.name}."}, status=status.HTTP_400_BAD_REQUEST)

            price = product.price
            order_total += price * qty

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                sku=product.sku,
                quantity=qty,
                price_snapshot=price,
            )

            # Reserve stock
            InventoryReservation.create_reservation(product, qty, order=order)

        order.total_amount = order_total
        order.status = Order.STATUS_RESERVED
        order.save(update_fields=["total_amount", "status"])

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ----- USER ORDER DETAIL -----
class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


# ----- ADMIN ORDER VIEWS -----
class AdminOrderListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        orders = Order.objects.select_related("user", "address").order_by("-placed_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class AdminOrderDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
