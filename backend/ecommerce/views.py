from django.contrib.auth.models import User
from django.contrib.auth import login as django_login, logout as django_logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from .models import Product
from .serializers import ProductSerializer, RegisterSerializer, LoginSerializer

# =======================
# CSRF TOKEN (IMPORTANT)
# =======================
@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"message": "CSRF cookie set"})

# =======================
# REGISTER
# =======================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create session immediately
        django_login(request, user)
        return Response({
            "username": user.username,
            "full_name": user.profile.full_name
        })
    return Response(serializer.errors, status=400)

# =======================
# LOGIN
# =======================
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        # Create session (IMPORTANT)
        django_login(request, user)
        return Response({
            "username": user.username,
            "full_name": user.profile.full_name
        })
    return Response(serializer.errors, status=400)

# =======================
# LOGOUT
# =======================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    # Destroy session
    django_logout(request)
    return Response({"message": "Logout successful"})

# =======================
# PRODUCTS (PUBLIC)
# =======================
@api_view(['GET'])
@permission_classes([AllowAny])
def get_products(request):
    products = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer = ProductSerializer(products, many=True, context={"request": request})
    return Response(serializer.data)

# =======================
# PROFILE (PROTECTED)
# =======================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user

    return Response({
        "username": user.username,
        "full_name": user.profile.full_name,
        "phone": user.profile.phone_number
    })