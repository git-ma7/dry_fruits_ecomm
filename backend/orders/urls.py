# orders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # user routes
    path("orders/", views.OrderListCreateView.as_view(), name="order-list-create"),
    path("orders/<uuid:pk>/", views.OrderDetailView.as_view(), name="order-detail"),

    # admin routes
    path("admin/orders/", views.AdminOrderListView.as_view(), name="admin-order-list"),
    path("admin/orders/<uuid:pk>/", views.AdminOrderDetailView.as_view(), name="admin-order-detail"),
]
