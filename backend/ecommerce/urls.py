from django.urls import path
from .views import get_products, get_profile, register, login, logout,get_csrf, create_order, payment_success, add_to_cart, get_cart, remove_from_cart,get_addresses, add_address, set_default_address, get_shipping_charge, get_my_orders
urlpatterns = [
    path('auth/get-csrf/', get_csrf),
    path('products/', get_products),
    path('auth/register/', register),
    path('auth/login/', login),
    path('auth/logout/', logout),
    path('auth/profile/', get_profile),
    path('cart/add/', add_to_cart),
    path('cart/', get_cart),
    path('cart/remove/', remove_from_cart),
    path('addresses/', get_addresses),
    path('addresses/add/', add_address),
    path('addresses/set-default/', set_default_address),
    path('shipping-charge/', get_shipping_charge),
    path('create-order/', create_order),
    path('payment-success/', payment_success),
    path("my-orders/", get_my_orders),
]