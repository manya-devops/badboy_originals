from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from ecommerce.models import Order
import json
from ecommerce.models import Product, ProductImage
from django.db.models import Q
from .forms import ProductForm
# heck admin (ONLY staff/superuser allowed)
def is_admin(user):
    return user.is_authenticated and user.is_staff

# LOGIN VIEW (ONLY ADMIN CAN LOGIN)
def admin_login(request):
    if request.user.is_authenticated and request.user.is_staff:
        return redirect("custom_admin:dashboard")
    error = None
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        # 1. Empty field validation
        if not username or not password:
            error = "All fields are required"
        else:
            # 2. Check if user exists
            if not User.objects.filter(username=username).exists():
                error = "User does not exist"
            else:
                user = authenticate(request, username=username, password=password)
                # 3. Wrong password
                if user is None:
                    error = "Incorrect password"
                # 4. Not admin
                elif not user.is_staff:
                    error = "You do not have access to the admin panel"
                # 5. Success
                else:
                    login(request, user)
                    return redirect("custom_admin:dashboard")
    return render(request, "custom_admin/login.html", {"error": error})

# DASHBOARD VIEW (PROTECTED)
@user_passes_test(is_admin)
def dashboard(request):
    # Stats
    total_sales = (
        Order.objects.filter(status__in=["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]).aggregate(total=Sum("total_price"))["total"] or 0)
    total_orders = Order.objects.count()
    total_products = Product.objects.count()
    total_customers = User.objects.filter(is_staff=False).count()
    # returned_orders = Order.objects.filter(status="RETURNED").count()

    # # Monthly Sales Chart
    # monthly_sales = (
    #     Order.objects
    #     .annotate(month=TruncMonth("created_at"))
    #     .values("month")
    #     .annotate(total=Sum("total_price"))
    #     .order_by("month")
    # )

    # sales_labels = [item["month"].strftime("%b %Y") for item in monthly_sales]
    # sales_data = [float(item["total"] or 0) for item in monthly_sales]

    context = {
            "total_sales": total_sales,
            "total_orders": total_orders,
            "total_products": total_products,
            "total_customers": total_customers,
    #     "returned_orders": returned_orders,
    #     "sales_labels": json.dumps(sales_labels),
    #     "sales_data": json.dumps(sales_data),
    }

    return render(request, "custom_admin/dashboard.html", context)


# LOGOUT
def logout_view(request):
    logout(request)
    next_url = request.GET.get("next")
    if next_url:
        return redirect(next_url)
    return redirect("custom_admin:login")

@login_required
@user_passes_test(is_admin)
def product_create(request):
    form = ProductForm(request.POST or None, request.FILES or None)

    if request.method == "POST":
        if form.is_valid():
            product =form.save()
            images = request.FILES.getlist("gallery_images")
            for img in images:
                ProductImage.objects.create(product=product, image=img)
            return redirect("custom_admin:product_list")

    return render(request, "custom_admin/product_form.html", {
        "form": form,
        "title": "Add Product"
    })

@login_required
@user_passes_test(is_admin)
def product_update(request, pk):
    product = get_object_or_404(Product, pk=pk)
    form = ProductForm(request.POST or None, request.FILES or None, instance=product)

    if request.method == "POST":
        if form.is_valid():
            product =form.save()
            images = request.FILES.getlist("gallery_images")
            for img in images:
                ProductImage.objects.create(product=product, image=img)

            return redirect("custom_admin:product_list")

    return render(request, "custom_admin/product_form.html", {
        "form": form,
        "title": "Edit Product"
    })
    
@login_required
@user_passes_test(is_admin)
def product_list(request):
    query = request.GET.get("q")
    products = Product.objects.all().order_by("-created_at")
    # Search functionality
    if query:
        products = products.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query)
        )
    context = {
        "products": products,
        "query": query,
    }
    return render(request, "custom_admin/product_list.html", context)

@login_required
@user_passes_test(is_admin)
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if request.method == "POST":
        product.delete()
        return redirect("custom_admin:product_list")

    return render(request, "custom_admin/product_confirm_delete.html", {
        "product": product
    })
    
@login_required
@user_passes_test(is_admin)
def order_list(request):
    status_filter = request.GET.get("status")
    query = request.GET.get("q")
    orders = Order.objects.select_related("user", "user__profile").all().order_by("-created_at")
    # Filter by status
    if status_filter:
        orders = orders.filter(status=status_filter)
    # Search (by user or order id)
    if query:
        orders = orders.filter(
            Q(id__icontains=query) |
            Q(user__username__icontains=query)
        )
    context = {
        "orders": orders,
        "status_choices": Order.STATUS_CHOICES,
        "status_filter": status_filter,
        "query": query,
    }
    return render(request, "custom_admin/order_list.html", context)

@login_required
@user_passes_test(is_admin)
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    # Update status
    if request.method == "POST":
        new_status = request.POST.get("status")
        if new_status:
            order.status = new_status
            order.save()
            return redirect("custom_admin:order_detail", order_id=order.id)
    context = {
        "order": order,
        "status_choices": Order.STATUS_CHOICES,
    }
    return render(request, "custom_admin/order_detail.html", context)