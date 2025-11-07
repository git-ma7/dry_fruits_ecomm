from django.urls import path, include

urlpatterns = [
    path("api/users/", include("users.urls")),
    path("api/catalog/", include("catalog.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/payments/", include("payments.urls")),
]
