# catalog/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # public product routes
    path("products/", views.ProductListView.as_view(), name="product-list"),
    path("products/<uuid:pk>/", views.ProductDetailView.as_view(), name="product-detail"),

    # admin product routes
    path("admin/products/", views.AdminProductListCreateView.as_view(), name="admin-product-list-create"),
    path("admin/products/<uuid:pk>/", views.AdminProductDetailView.as_view(), name="admin-product-detail"),

    # product images (admin)
    path("admin/images/", views.ProductImageListCreateView.as_view(), name="admin-image-list-create"),
    path("admin/images/<uuid:pk>/", views.ProductImageDetailView.as_view(), name="admin-image-detail"),
]
