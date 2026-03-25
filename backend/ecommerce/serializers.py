from rest_framework import serializers
from .models import Product, CartItem, ProductImage, Wishlist
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
import re

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ProductImage
        fields = ['image']
    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return ""

class ProductSerializer(serializers.ModelSerializer):
    final_price = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    image_url = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)  
    originalPrice = serializers.DecimalField(source="price", max_digits=10, decimal_places=2) 
    class Meta:
        model = Product
        fields = '__all__'
    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return ""

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'
        
# AUTH SERIALIZERS
class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'full_name', 'phone']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        email = data.get('email').lower()
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        phone = data.get('phone')
        full_name = data.get('full_name')
        # User already exists
        if User.objects.filter(username=email).exists():
            raise serializers.ValidationError({"email": "User already exists"})
        # Password match
        if password != confirm_password:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        # Password validation (Django)
        validate_password(password)
        # Phone validation
        if not re.match(r'^\d{10}$', phone):
            raise serializers.ValidationError({"phone": "Enter valid 10-digit phone number"})
        # Name validation
        if len(full_name.strip()) < 3:
            raise serializers.ValidationError({"full_name": "Name must be at least 3 characters"})
        return data

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        phone = validated_data.pop('phone')
        validated_data.pop('confirm_password')
        email = validated_data.get('email').lower()
        user = User.objects.create_user(username=email, email=email, password=validated_data['password'])
        profile = user.profile
        profile.full_name = full_name
        profile.phone_number = phone
        profile.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username').lower()
        password = data.get('password')
        # User not found
        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError({
                "username": "User with this email does not exist"
            })
        user = authenticate(username=username, password=password)
        # Wrong password
        if not user:
            raise serializers.ValidationError({
                "password": "Incorrect password"
            })
        data['user'] = user
        return data