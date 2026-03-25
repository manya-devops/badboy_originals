from django.urls import path
from . import views

app_name = "custom_admin"

urlpatterns = [
    path("login/", views.admin_login, name="login"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("logout/", views.logout_view, name="logout"),
    path("products/", views.product_list, name="product_list"),
    path("products/add/", views.product_create, name="product_add"),
    path("products/<int:pk>/edit/", views.product_update, name="product_edit"),
    path("products/<int:pk>/delete/", views.product_delete, name="product_delete"),
]