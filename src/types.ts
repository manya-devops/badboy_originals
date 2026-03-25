export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: { image: string }[];
  description: string;
  category: 'Hoodies' | 'T-Shirts' | 'Jackets' | 'Pants' | 'Shirts' | 'Shorts';
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  name: string;
}
