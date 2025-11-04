# payments/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # user routes
    path("payments/", views.PaymentListCreateView.as_view(), name="payment-list-create"),

    # admin routes
    path("admin/payments/", views.AdminPaymentListView.as_view(), name="admin-payment-list"),
    path("admin/payments/<uuid:pk>/", views.AdminPaymentDetailView.as_view(), name="admin-payment-detail"),
]
