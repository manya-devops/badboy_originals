import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Stealth 3D Hoodie',
    price: 1499,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1600&auto=format&fit=crop',
    description: 'High-density 3D embossed logo on premium heavyweight cotton. Features a structured hood and deep kangaroo pocket.',
    category: 'Hoodies',
    reviews: [
      { id: 'r1', userName: 'Alex M.', rating: 5, comment: 'The 3D logo is incredible. Best hoodie I own.', date: '2024-02-15' },
      { id: 'r2', userName: 'Sarah K.', rating: 4, comment: 'Very heavy and warm. High quality.', date: '2024-02-10' }
    ]
  },
  {
    id: '2',
    name: 'Onyx Cyber Tee',
    price: 699,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop',
    description: 'Futuristic silhouette with reflective 3D accents. Crafted from high-performance breathable fabric.',
    category: 'T-Shirts',
    reviews: [
      { id: 'r3', userName: 'Jordan P.', rating: 5, comment: 'Perfect fit. The reflective details are subtle but cool.', date: '2024-02-12' }
    ]
  },
  {
    id: '3',
    name: 'Phantom Bomber',
    price: 1999,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1600&auto=format&fit=crop',
    description: 'Matte black tech-shell with modular 3D pockets. Water-resistant finish and thermal lining.',
    category: 'Jackets',
    reviews: [
      { id: 'r4', userName: 'Chris T.', rating: 5, comment: 'Absolute beast of a jacket. Pockets are super useful.', date: '2024-02-08' }
    ]
  },
  {
    id: '4',
    name: 'Void Cargo Pants',
    price: 1299,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1600&auto=format&fit=crop',
    description: 'Sculpted 3D fit with reinforced knee panels. Features six tactical pockets and adjustable cuffs.',
    category: 'Pants',
    reviews: []
  },
  {
    id: '5',
    name: 'Chrome Tech Overshirt',
    price: 1399,
    originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1600&auto=format&fit=crop',
    description: 'Metallic finish tech-fabric with structured 3D collar and snap closures. A perfect layering piece.',
    category: 'Shirts',
    reviews: [
      { id: 'r5', userName: 'Leo G.', rating: 4, comment: 'Solid shirt. The material looks premium.', date: '2024-02-05' }
    ]
  },
  {
    id: '6',
    name: 'Midnight Tech Vest',
    price: 1799,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=1600&auto=format&fit=crop',
    description: 'Layered 3D mesh construction for ultimate breathability. Multiple utility attachment points.',
    category: 'Jackets',
    reviews: []
  },
  {
    id: '7',
    name: 'Cyberpunk Oversized Hoodie',
    price: 1599,
    originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1600&auto=format&fit=crop',
    description: 'Ultra-heavyweight cotton with a dropped shoulder fit and neon 3D accents.',
    category: 'Hoodies',
    reviews: []
  },
  {
    id: '8',
    name: 'Matrix Mesh Tee',
    price: 799,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop',
    description: 'Breathable tech-mesh with a structured 3D collar and reflective branding.',
    category: 'T-Shirts',
    reviews: []
  },
  {
    id: '9',
    name: 'Tactical Windbreaker',
    price: 1899,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1600&auto=format&fit=crop',
    description: 'Lightweight ripstop fabric with 3D articulated sleeves and hidden utility pockets.',
    category: 'Jackets',
    reviews: []
  },
  {
    id: '10',
    name: 'Stealth Joggers',
    price: 1199,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1600&auto=format&fit=crop',
    description: 'Tapered fit with 3D seam detailing and moisture-wicking technology.',
    category: 'Pants',
    reviews: []
  },
  {
    id: '11',
    name: 'Carbon Mesh Shorts',
    price: 899,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1600&auto=format&fit=crop',
    description: 'Breathable 3D mesh construction with reinforced side panels and secure zip pockets.',
    category: 'Shorts',
    reviews: []
  },
  {
    id: '12',
    name: 'BBO Utility Parka',
    price: 2499,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1600&auto=format&fit=crop',
    description: 'Heavy-duty weather-resistant shell with modular 3D pockets and adjustable storm hood.',
    category: 'Jackets',
    reviews: []
  }
];
