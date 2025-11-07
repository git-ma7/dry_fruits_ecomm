# catalog/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Product, ProductImage
from .serializers import ProductSerializer,ProductImageSerializer

# ----- PRODUCT -----
class ProductListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        products = Product.objects.filter(status="active")
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk, status="active")
        serializer = ProductSerializer(product)
        return Response(serializer.data)


# ----- ADMIN PRODUCT CRUD -----
class AdminProductListCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminProductDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(Product, pk=pk)

    def get(self, request, pk):
        serializer = ProductSerializer(self.get_object(pk))
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ----- PRODUCT IMAGE (ADMIN) -----
class ProductImageListCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        images = ProductImage.objects.all()
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductImageDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(ProductImage, pk=pk)

    def get(self, request, pk):
        serializer = ProductImageSerializer(self.get_object(pk))
        return Response(serializer.data)

    def put(self, request, pk):
        img = self.get_object(pk)
        serializer = ProductImageSerializer(img, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        img = self.get_object(pk)
        img.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
