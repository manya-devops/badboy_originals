from django.contrib.auth.models import User
from django.contrib.auth import login as django_login, logout as django_logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from .models import Product, CartItem, Order, OrderItem, Address
from .utils.shiprocket import ShiprocketClient, get_shipping_rate
from .serializers import ProductSerializer, RegisterSerializer, LoginSerializer
import razorpay
from django.conf import settings
from decimal import Decimal

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))
    product = Product.objects.get(id=product_id)
    cart_item, created = CartItem.objects.get_or_create(
        user=user,
        product=product
    )
    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity
    cart_item.save()
    return Response({"message": "Added to cart"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart_items = CartItem.objects.filter(user=request.user)
    data = []
    for item in cart_items:
        data.append({
            "id": item.product.id,
            "name": item.product.name,
            "price": float(item.product.final_price),
            "image": item.product.image.url,
            "quantity": item.quantity
        })
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    product_id = request.data.get("product_id")
    CartItem.objects.filter(
        user=request.user,
        product_id=product_id
    ).delete()
    return Response({"message": "Removed"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_address(request):
    user = request.user
    # LIMIT 3 ADDRESSES
    if Address.objects.filter(user=user).count() >= 3:
        return Response({"error": "Max 3 addresses allowed"}, status=400)
    data = request.data
    is_default = data.get("is_default", False)
    # FIRST ADDRESS AUTO DEFAULT
    if Address.objects.filter(user=user).count() == 0:
        is_default = True
    # IF NEW DEFAULT → REMOVE OLD DEFAULT
    if is_default:
        Address.objects.filter(user=user).update(is_default=False)
    address = Address.objects.create(
        user=user,
        full_name=data.get("full_name"),
        phone_number=data.get("phone_number"),
        address_line=data.get("address_line"),
        city=data.get("city"),
        state=data.get("state"),
        pincode=data.get("pincode"),
        is_default=is_default
    )
    return Response({"message": "Address added", "id": address.id})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_addresses(request):
    addresses = Address.objects.filter(user=request.user)
    return Response([
        {
            "id": a.id,
            "full_name": a.full_name,
            "phone": a.phone_number,
            "address": a.address_line,
            "city": a.city,
            "state": a.state,
            "pincode": a.pincode,
            "is_default": a.is_default
        }
        for a in addresses
    ])

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_default_address(request):
    address_id = request.data.get("address_id")
    Address.objects.filter(user=request.user).update(is_default=False)
    Address.objects.filter(id=address_id, user=request.user).update(is_default=True)
    return Response({"message": "Default updated"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_shipping_charge(request):
    user = request.user
    address_id = request.data.get("address_id")
    try:
        address = Address.objects.get(id=address_id, user=user)
    except Address.DoesNotExist:
        return Response({"error": "Invalid address"}, status=400)
    cart_items = CartItem.objects.filter(user=user)
    if not cart_items.exists():
        return Response({
            "subtotal": 0,
            "shipping_fee": 0,
            "total_price": 0
        })
    subtotal = sum(item.product.final_price * item.quantity for item in cart_items)
    shipping_fee = get_shipping_rate(
        pickup_pincode="500001",
        delivery_pincode=address.pincode
    )
    shipping_fee = Decimal(str(shipping_fee))
    total_price = subtotal + shipping_fee
    return Response({
        "subtotal": float(subtotal),
        "shipping_fee": float(shipping_fee),
        "total_price": float(total_price)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    cart_items = CartItem.objects.filter(user=user)
    if not cart_items.exists():
        return Response({"error": "Cart is empty"}, status=400)
    Order.objects.filter(
        user=user,
        status="PAYMENT_PENDING"
    ).delete()
    address_id = request.data.get("address_id")
    if address_id:
        try:
            address = Address.objects.get(id=address_id, user=user)
        except Address.DoesNotExist:
            return Response({"error": "Invalid address"}, status=400)
    else:
        address = Address.objects.filter(user=user, is_default=True).first()
        if not address:
            return Response({"error": "No default address found"}, status=400)
    subtotal = sum(item.product.final_price * item.quantity for item in cart_items)
    # Get shipping charge
    shipping_fee = get_shipping_rate(
        pickup_pincode="500001",  # CHANGE to your warehouse pincode
        delivery_pincode=address.pincode
    )
    # Final total
    shipping_fee = Decimal(str(shipping_fee))
    total_price = subtotal + shipping_fee
    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    razorpay_order = client.order.create({
        "amount": int(total_price * 100),
        "currency": "INR",
        "payment_capture": 1
    })
    
    order = Order.objects.create(
        user=user,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total_price=total_price,
        status="PAYMENT_PENDING",
        razorpay_order_id=razorpay_order["id"],

        full_name=address.full_name,
        shipping_address=address.address_line,
        shipping_city=address.city,
        shipping_state=address.state,
        shipping_zip_code=address.pincode,
        shipping_phone=address.phone_number,
    )
    # Create order items
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.final_price
        )
    return Response({"order_id": order.id, "order_number": order.order_number,"razorpay_order_id": razorpay_order["id"], "razorpay_key": settings.RAZORPAY_KEY_ID, "amount": int(total_price * 100),"subtotal": float(subtotal), "shipping_fee": float(shipping_fee), "total_price": float(total_price)})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment_success(request):
    order_id = request.data.get("order_id")
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        if order.status == "PAID":
            return Response({"message": "Order already paid"})
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)
    # Mark as paid
    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    params_dict = {
        'razorpay_order_id': request.data.get("razorpay_order_id"),
        'razorpay_payment_id': request.data.get("razorpay_payment_id"),
        'razorpay_signature': request.data.get("razorpay_signature")
    }

    try:
        client.utility.verify_payment_signature(params_dict)

        order.status = "PAID"
        order.razorpay_payment_id = params_dict['razorpay_payment_id']
        order.razorpay_signature = params_dict['razorpay_signature']
        order.save()

    except Exception as e:
        print("Razorpay Verification Error:", e)
        return Response({"error": "Payment verification failed"}, status=400)
    # SHIPROCKET INTEGRATION HERE
    try:
        ship_data = ShiprocketClient.create_order(order)
        if ship_data and ship_data.get("shipment_id"):
            order.shiprocket_order_id = ship_data.get("order_id")
            order.awb_code = ship_data.get("awb_code")
            order.courier_name = ship_data.get("courier_name")
            order.save()
    except Exception as e:
        print("Shiprocket Error:", e)
    # Clear cart after success
    CartItem.objects.filter(user=request.user).delete()
    return Response({
        "message": "Payment successful & order shipped",
        "awb_code": order.awb_code
    })

# ORDERS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    data = []
    for order in orders:
        items = OrderItem.objects.filter(order=order)
        data.append({
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status,
            "total_price": float(order.total_price),
            "created_at": order.created_at,
            "items": [
                {
                    "product_name": item.product.name,
                    "quantity": item.quantity,
                    "price": float(item.price),
                    "image": item.product.image.url
                }
                for item in items
            ]
        })
    return Response(data)