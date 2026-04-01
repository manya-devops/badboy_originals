from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid
# Create your models here.
# Product
class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    base_discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/')
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    # Auto-generate slug
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def final_price(self):
        return self.base_discount_price if self.base_discount_price else self.price

    @property
    def discount_percentage(self):
        if self.base_discount_price and self.price:
            return round(((self.price - self.base_discount_price) / self.price) * 100)
        return 0

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/gallery/")
    def __str__(self):
        return f"{self.product.name} Image"

# Cart Item
class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.quantity})"

# Wishlist
class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wishlist")
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return f"{self.user.username} wishlist"
    
# Customer Profile (NEW)
class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        CustomerProfile.objects.create(user=instance)

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")

    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)

    address_line = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.city}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('PAYMENT_PENDING', 'Payment Pending'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='OrderItem')
    # Time
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    # Address snapshot
    full_name = models.CharField(max_length=100)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_country = models.CharField(max_length=100, default="India")
    shipping_zip_code = models.CharField(max_length=20)
    shipping_phone = models.CharField(max_length=15)
    # Payment (ONLINE ONLY)
    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    # Tracking
    tracking_number = models.CharField(max_length=50, blank=True, null=True)
    # Shiprocket fields
    shiprocket_order_id = models.CharField(max_length=100, blank=True, null=True)
    awb_code = models.CharField(max_length=100, blank=True, null=True)
    courier_name = models.CharField(max_length=100, blank=True, null=True)
    # Unique ID
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    # Order number
    order_number = models.CharField(max_length=20, unique=True, blank=True)

    def update_total_price(self):
        self.subtotal = sum(item.subtotal() for item in self.items.all())
        self.total_price = self.subtotal + self.shipping_fee
        self.save()
    def save(self, *args, **kwargs):
        if not self.pk:  # first time save
            super().save(*args, **kwargs)
            self.order_number = f"BBO{self.id:05d}"
            return super().save(update_fields=["order_number"])
        return super().save(*args, **kwargs)
    def __str__(self):
        return self.order_number or f'Order #{self.id}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.quantity * self.price
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"