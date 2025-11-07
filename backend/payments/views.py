# payments/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Payment
from orders.models import Order
from .serializers import PaymentSerializer


# ----- USER PAYMENT CREATION + LIST -----
class PaymentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(user=request.user).order_by("-created_at")
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Expected payload:
        {
            "order_id": "uuid",
            "method": "razorpay",
            "amount": 999.99,
            "status": "success",
            "transaction_id": "txn_123"
        }
        """
        order = get_object_or_404(Order, pk=request.data.get("order_id"), user=request.user)

        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                user=request.user,
                order=order,
                paid_at=timezone.now() if request.data.get("status") == "success" else None,
            )
            order.status = Order.STATUS_PAID if request.data.get("status") == "success" else Order.STATUS_PAYMENT_FAILED
            order.save(update_fields=["status"])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----- ADMIN PAYMENT LIST/DETAIL -----
class AdminPaymentListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        payments = Payment.objects.select_related("order", "user").order_by("-created_at")
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)


class AdminPaymentDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    def put(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)
        serializer = PaymentSerializer(payment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
