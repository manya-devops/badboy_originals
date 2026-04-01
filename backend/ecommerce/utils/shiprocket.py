import requests
from django.conf import settings
from decimal import Decimal

class ShiprocketClient:

    BASE_URL = "https://apiv2.shiprocket.in/v1/external"

    @staticmethod
    def get_token():
        url = f"{ShiprocketClient.BASE_URL}/auth/login"

        response = requests.post(url, json={
            "email": settings.SHIPROCKET_EMAIL,
            "password": settings.SHIPROCKET_PASSWORD
        })

        return response.json().get("token")

    @staticmethod
    def create_order(order):
        token = ShiprocketClient.get_token()

        if not token:
            return None

        url = f"{ShiprocketClient.BASE_URL}/orders/create/adhoc"

        items = []
        for item in order.items.all():
            items.append({
                "name": item.product.name,
                "sku": str(item.product.id),
                "units": item.quantity,
                "selling_price": float(item.price)
            })

        payload = {
            "order_id": order.order_number,
            "order_date": str(order.created_at),
            "pickup_location": "Primary",
            "billing_customer_name": order.full_name,
            "billing_address": order.shipping_address,
            "billing_city": order.shipping_city,
            "billing_state": order.shipping_state,
            "billing_country": "India",
            "billing_pincode": order.shipping_zip_code,
            "billing_phone": order.shipping_phone,
            "shipping_is_billing": True,
            "order_items": items,
            "payment_method": "Prepaid",
            "sub_total": float(order.subtotal),
            "length": 10,
            "breadth": 10,
            "height": 10,
            "weight": 0.5
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers)

        return response.json()
def get_shipping_rate(pickup_pincode, delivery_pincode, weight=0.5):
    token = ShiprocketClient.get_token()

    if not token:
        return 0

    url = f"{ShiprocketClient.BASE_URL}/courier/serviceability/"

    params = {
        "pickup_postcode": pickup_pincode,
        "delivery_postcode": delivery_pincode,
        "weight": weight,
        "cod": 0
    }

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    

    try:
        couriers = data["data"]["available_courier_companies"]

        if not couriers:
            print("No courier available")
            return Decimal("50")

        # Cheapest courier
        cheapest = sorted(couriers, key=lambda x: x["rate"])[0]

        return Decimal(str(cheapest["rate"]))

    except Exception as e:
        print("Shiprocket Rate Error:", e)
        return 0