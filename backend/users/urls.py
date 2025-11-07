from django.urls import path, include
from . import views

urlpatterns = [
    # user profile
    path("me/", views.UserDetailView.as_view(), name="user-detail"),

    # addresses
    path("addresses/", views.AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<uuid:pk>/", views.AddressDetailView.as_view(), name="address-detail"),
]