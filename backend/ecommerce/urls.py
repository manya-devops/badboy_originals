from django.urls import path
from .views import get_products, get_profile, register, login, logout, get_csrf
urlpatterns = [
    path('auth/get-csrf/', get_csrf),
    path('products/', get_products),
    path('auth/register/', register),
    path('auth/login/', login),
    path('auth/logout/', logout),
    path('auth/profile/', get_profile),
]