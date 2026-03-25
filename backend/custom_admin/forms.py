from django import forms
from ecommerce.models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "slug", "description", "price", "base_discount_price", "image", "stock", "is_active",]

        widgets = {
            "name": forms.TextInput(attrs={"class": "w-full px-3 py-2 border rounded-lg"}),
            "slug": forms.TextInput(attrs={"class": "w-full px-3 py-2 border rounded-lg"}),
            "description": forms.Textarea(attrs={"class": "w-full px-3 py-2 border rounded-lg"}),
            "price": forms.NumberInput(attrs={"class": "w-full px-3 py-2 border rounded-lg"}),
            "base_discount_price": forms.NumberInput(attrs={"class": "w-full px-3 py-2 border rounded-lg"}),
            "image": forms.ClearableFileInput(attrs={"class": "w-full px-3 py-2 border rounded-lg"}),
            "stock": forms.NumberInput(attrs={"class": "w-full px-3 py-2 border rounded-lg"}),
            "is_active": forms.CheckboxInput(attrs={"class": "h-4 w-4"}),
        }