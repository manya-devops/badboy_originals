/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  User, 
  X, 
  Plus, 
  Minus, 
  ChevronRight, 
  Search, 
  Menu,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Heart,
  Maximize2,
  ArrowLeft,
  Star
} from 'lucide-react';
import { PRODUCTS } from './constants';
import { Product, CartItem, User as UserType } from './types';

const InteractiveImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={src} 
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-150' : 'scale-100'}`}
        style={{
          transformOrigin: `${mousePos.x}% ${mousePos.y}%`
        }}
        referrerPolicy="no-referrer"
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-full flex items-center gap-2 pointer-events-none"
          >
            <Maximize2 size={12} className="text-white/70" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Interactive Zoom</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onClick: () => void;
}

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted,
  onClick 
}: ProductCardProps) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface mb-5 rounded-sm">
        <InteractiveImage 
          src={product.image} 
          alt={product.name}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-10 w-9 h-9 glass rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all duration-300"
        >
          <Heart size={16} className={isWishlisted ? 'fill-white text-white' : ''} />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-4 left-4 right-4 py-3.5 bg-white text-black font-bold uppercase text-[10px] tracking-[0.2em] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white/90 z-20"
        >
          Quick Add
        </button>
      </div>
      <div className="flex justify-between items-start px-0.5">
        <div>
          <h3 className="font-display font-bold uppercase tracking-[0.1em] text-[11px] sm:text-xs mb-1 group-hover:text-white/80 transition-colors">
            {product.name}
          </h3>
          <p className="text-white/20 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium">{product.category}</p>
        </div>
        <div className="text-right">
          <span className="block font-display font-medium text-xs sm:text-sm text-white/90">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="block text-[9px] sm:text-[10px] text-white/20 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ReviewSection = ({ 
  reviews = [], 
  onAddReview 
}: { 
  reviews?: any[]; 
  onAddReview: (rating: number, comment: string) => void 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onAddReview(rating, comment);
      setComment('');
      setRating(5);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="mt-32 pt-32 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
        {/* Review Summary */}
        <div>
          <h2 className="text-4xl font-display font-bold uppercase tracking-tight mb-6">Reviews</h2>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex text-white">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={18} className={s <= 4.5 ? 'fill-white' : 'text-white/20'} />
              ))}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Based on {reviews.length} reviews</span>
          </div>
          
          {/* Add Review Form */}
          <div className="glass p-8 rounded-2xl border border-white/5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-white/40">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="text-white transition-all hover:scale-110 active:scale-95"
                    >
                      <Star size={24} className={s <= rating ? 'fill-white' : 'text-white/20'} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Your Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full bg-white/5 border border-white/10 px-6 py-5 text-sm tracking-wider focus:outline-none focus:border-white/30 min-h-[140px] resize-none rounded-xl transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-5"
              >
                {isSubmitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-16">
          {reviews.length === 0 ? (
            <div className="text-center py-24 border border-white/5 glass rounded-2xl">
              <p className="text-white/30 uppercase tracking-widest text-xs">No reviews yet. Be the first to review this product.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="space-y-6 group">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= review.rating ? 'fill-white' : 'text-white/10'} />
                      ))}
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">{review.userName}</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">{review.date}</span>
                </div>
                <p className="text-white/50 text-base leading-relaxed max-w-2xl font-light">{review.comment}</p>
                <div className="h-px bg-white/5 w-full pt-4" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ProductDetail = ({ 
  product, 
  allProducts,
  onBack, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted,
  onAddReview,
  onProductClick,
  onViewAll
}: { 
  product: Product; 
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onAddReview: (rating: number, comment: string) => void;
  onProductClick: (p: Product) => void;
  onViewAll: () => void;
}) => {
  const recommendedProducts = allProducts
    .filter(p => p.id !== product.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 sm:py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Section */}
          <div className="space-y-8">
            <div className="aspect-[4/5] bg-[#111] rounded-2xl overflow-hidden border border-white/5">
              <InteractiveImage 
                src={product.image} 
                alt={product.name}
                className="w-full h-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-[#111] rounded-xl overflow-hidden border border-white/5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  <img 
                    src={`${product.image}&sig=${i}`} 
                    alt={`${product.name} view ${i}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-4 block">
                {product.category}
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-6 leading-[0.9]">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 mb-8">
                <p className="text-4xl font-display font-medium text-white/90">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                {product.originalPrice && (
                  <p className="text-2xl font-display text-white/20 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
              <div className="h-px bg-white/10 w-full mb-10" />
              <p className="text-white/50 text-lg leading-relaxed mb-12 font-light">
                {product.description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex gap-4">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="btn-primary flex-grow py-6 text-sm"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => onToggleWishlist(product.id)}
                  className="w-20 h-20 glass rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/30 group"
                >
                  <Heart size={24} className={`${isWishlisted ? 'fill-white text-white' : ''} transition-transform group-hover:scale-110`} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4 text-white/30">
                  <ShieldCheck size={20} className="text-white/50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Authentic Product</span>
                </div>
                <div className="flex items-center gap-4 text-white/30">
                  <Zap size={20} className="text-white/50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Express Shipping</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Review Section */}
        <ReviewSection 
          reviews={product.reviews} 
          onAddReview={onAddReview} 
        />

        {/* Recommended Products */}
        <div className="mt-32 pt-32 border-t border-white/5">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/30 mb-2 block">
                You might also like
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">
                Recommended
              </h2>
            </div>
            <button 
              onClick={onViewAll}
              className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {recommendedProducts.map((p) => (
              <ProductCard 
                key={p.id}
                product={p}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={false} // Simplification for now
                onClick={() => onProductClick(p)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'wishlist' | 'cart' | 'product' | 'all-products'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setIsResettingPassword(false);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isResettingPassword) {
      handleForgotPassword();
      return;
    }
    // In a real app, this would call an API
    setUser({ name: 'Guest User', email: authEmail || 'guest@example.com' });
    setIsLoginOpen(false);
    setIsRegistering(false);
    setIsResettingPassword(false);
    setAuthEmail('');
  };

  const [resetEmailError, setResetEmailError] = useState(false);

  const handleForgotPassword = () => {
    if (!authEmail) {
      setResetEmailError(true);
      setTimeout(() => setResetEmailError(false), 3000);
      return;
    }
    // Simulate sending email
    setResetEmailSent(true);
    setTimeout(() => setResetEmailSent(false), 5000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCurrentView('cart');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddReview = (productId: string, rating: number, comment: string) => {
    const newReview = {
      id: Math.random().toString(36).substr(2, 9),
      userName: user?.name || 'Guest User',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviews: [newReview, ...(p.reviews || [])]
        };
      }
      return p;
    }));

    // Update selected product if it's the one being reviewed
    if (selectedProduct?.id === productId) {
      setSelectedProduct(prev => prev ? {
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])]
      } : null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-20 sm:pt-24">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-nav-black/80 backdrop-blur-xl border-b border-white/5 ${scrolled ? 'py-3 shadow-2xl' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex-1 flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
            <div 
              onClick={() => {
                setCurrentView('home');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <span className="text-2xl sm:text-3xl font-display font-bold tracking-tighter text-white">BBO</span>
              <div className="hidden md:flex flex-col border-l border-white/10 pl-4">
                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/70 leading-none mb-1">Bad Boy</span>
                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/20 leading-none">Originals</span>
              </div>
            </div>
          </div>

          {/* Center: Navigation */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-10 text-[9px] font-bold tracking-[0.4em] uppercase text-white/40">
            <button 
              onClick={() => {
                setCurrentView('home');
                window.scrollTo(0, 0);
              }}
              className="hover:text-white transition-all duration-300 hover:tracking-[0.5em] cursor-pointer"
            >About</button>
            <button 
              onClick={() => {
                setCurrentView('all-products');
                window.scrollTo(0, 0);
              }}
              className="hover:text-white transition-all duration-300 hover:tracking-[0.5em] cursor-pointer"
            >Collection</button>
            <button 
              onClick={() => {
                setCurrentView('all-products');
                window.scrollTo(0, 0);
              }}
              className="hover:text-white transition-all duration-300 hover:tracking-[0.5em] cursor-pointer"
            >Shop</button>
          </div>

          {/* Right: Icons */}
          <div className="flex-1 flex justify-end items-center gap-4 sm:gap-7">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchVisible && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: window.innerWidth < 640 ? 120 : 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="SEARCH..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (currentView !== 'home') setCurrentView('home');
                    }}
                    className="bg-white/5 border-b border-white/20 px-2 sm:px-4 py-1 text-[10px] sm:text-xs tracking-widest focus:outline-none focus:border-white/50 mr-2"
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <Search size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <button 
              onClick={() => {
                setCurrentView('wishlist');
                setSearchQuery('');
                setIsSearchVisible(false);
              }}
              className="relative text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <Heart size={18} className={`sm:w-5 sm:h-5 ${wishlist.length > 0 ? 'fill-white text-white' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white text-black text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => {
                setCurrentView('cart');
                setSearchQuery('');
                setIsSearchVisible(false);
              }}
              className="relative text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white text-black text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <User size={18} className="sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider hidden sm:block">
                {user ? user.name : 'Login'}
              </span>
            </button>
          </div>
        </div>
      </nav>

       {currentView === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="relative min-h-[110vh] flex flex-col justify-center pt-24 pb-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://picsum.photos/seed/badboyhero/1920/1080?grayscale" 
                className="w-full h-full object-cover opacity-30 scale-110"
                alt="Hero Background"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/0 via-[#050505]/50 to-[#050505]" />
            </div>

            <div className="relative z-10 text-center px-6 mb-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-xs font-bold tracking-[0.5em] uppercase text-white/40 mb-4 block">
                  Established 2026
                </span>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter mb-8 text-gradient leading-[1.05]">
                  UNAPOLOGETIC<br />STYLE.
                </h2>
                <p className="max-w-xl mx-auto text-white/50 text-lg md:text-xl mb-12 font-light leading-relaxed">
                  Premium 3D-sculpted streetwear designed for those who define their own rules. 
                  Limited drops. Infinite attitude.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all group flex items-center gap-2">
                    Shop New Drop
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-10 py-4 border border-white/20 hover:border-white/40 font-bold uppercase tracking-widest text-sm transition-all">
                    Lookbook
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to explore</span>
              <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
          </section>

          {/* Product Grid */}
          <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/30 mb-2 block">
                    {searchQuery ? `Results for "${searchQuery}"` : 'The Collection'}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">
                    {searchQuery ? 'Search Results' : 'New Arrivals'}
                  </h2>
                </div>
                {!searchQuery && (
                  <button 
                    onClick={() => {
                      setCurrentView('all-products');
                      window.scrollTo(0, 0);
                    }}
                    className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                  >
                    View All <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-32 border border-white/5 glass rounded-2xl">
                  <Search size={48} className="mx-auto text-white/10 mb-8" />
                  <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-10 font-bold">No products found matching your search</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="btn-secondary px-10 py-4"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onToggleWishlist={toggleWishlist}
                      isWishlisted={wishlist.includes(product.id)}
                      onClick={() => {
                        setSelectedProduct(product);
                        setCurrentView('product');
                        window.scrollTo(0, 0);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Home Recommended Section */}
          <section className="py-32 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/30 mb-2 block">Curated for you</span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Recommended</h2>
                </div>
                <button 
                  onClick={() => {
                    setCurrentView('all-products');
                    window.scrollTo(0, 0);
                  }}
                  className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                >
                  View All <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {products
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onToggleWishlist={toggleWishlist}
                      isWishlisted={wishlist.includes(product.id)}
                      onClick={() => {
                        setSelectedProduct(product);
                        setCurrentView('product');
                        window.scrollTo(0, 0);
                      }}
                    />
                  ))}
              </div>
            </div>
          </section>
        </>
      ) : currentView === 'all-products' ? (
        /* All Products View */
        <section className="py-32 px-6 min-h-[70vh]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-20">
              <button 
                onClick={() => setCurrentView('home')}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/50 hover:text-white transition-all border border-white/10 hover:border-white/30"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/30 mb-2 block">The Complete Archive</span>
                <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">All Products</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(product.id)}
                  onClick={() => {
                    setSelectedProduct(product);
                    setCurrentView('product');
                    window.scrollTo(0, 0);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : currentView === 'wishlist' ? (
        /* Wishlist View */
        <section className="py-32 px-6 min-h-[70vh]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/30 mb-2 block">Saved for later</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">Your Wishlist</h2>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="text-center py-32 border border-white/5 glass rounded-2xl">
                <Heart size={48} className="mx-auto text-white/10 mb-8" />
                <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-10 font-bold">Your wishlist is currently empty</p>
                <button 
                  onClick={() => setCurrentView('home')}
                  className="btn-secondary px-10 py-4"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
                {wishlistProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={true}
                    onClick={() => {
                      setSelectedProduct(product);
                      setCurrentView('product');
                      window.scrollTo(0, 0);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : currentView === 'product' && selectedProduct ? (
        <ProductDetail 
          product={selectedProduct}
          allProducts={products}
          onBack={() => setCurrentView('home')}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onAddReview={(rating, comment) => handleAddReview(selectedProduct.id, rating, comment)}
          onProductClick={(p) => {
            setSelectedProduct(p);
            window.scrollTo(0, 0);
          }}
          onViewAll={() => {
            setCurrentView('all-products');
            window.scrollTo(0, 0);
          }}
        />
      ) : (
        /* Cart View (Page Style) */
        <section className="py-32 px-6 min-h-[70vh]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/30 mb-2 block">Your Selection</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Your Bag</h2>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-20 border border-white/5 glass rounded-2xl">
                <ShoppingBag size={48} className="mx-auto text-white/10 mb-6" />
                <p className="text-white/40 uppercase tracking-widest text-sm mb-8">Your bag is currently empty</p>
                <button 
                  onClick={() => setCurrentView('home')}
                  className="px-8 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-white/90 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-8">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.div 
                        key={item.id} 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col sm:flex-row gap-8 p-8 glass rounded-2xl border border-white/5 group hover:border-white/10 transition-all"
                      >
                        <div className="w-full sm:w-40 h-56 sm:h-48 bg-[#111] overflow-hidden flex-shrink-0 rounded-xl border border-white/5">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-bold uppercase tracking-wider text-white/90">{item.name}</h3>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-white/20 hover:text-white transition-colors p-2 -mr-2"
                              >
                                <X size={20} />
                              </button>
                            </div>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-4 font-bold">{item.category}</p>
                            <p className="text-sm text-white/50 line-clamp-2 max-w-md font-light leading-relaxed">{item.description}</p>
                          </div>
                          <div className="flex flex-wrap items-center justify-between mt-8 gap-4">
                            <div className="flex items-center gap-8 glass px-6 py-3 rounded-full border border-white/10">
                              <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-white transition-colors">
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="text-white/40 hover:text-white transition-colors">
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="text-xl font-display font-medium text-white/90">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="lg:col-span-1">
                  <div className="glass p-10 rounded-2xl border border-white/5 sticky top-32">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-white/40">Order Summary</h3>
                    <div className="space-y-5 mb-10">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40 uppercase tracking-widest font-medium">Subtotal</span>
                        <span className="font-medium text-white/90">₹{cartTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40 uppercase tracking-widest font-medium">Shipping</span>
                        <span className="text-white/30 uppercase tracking-widest text-[10px] font-bold">Calculated at checkout</span>
                      </div>
                      <div className="h-px bg-white/5 my-6" />
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/40">Total</span>
                        <motion.span 
                          key={cartTotal}
                          initial={{ scale: 1.1, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-4xl font-display font-bold text-white"
                        >
                          ₹{cartTotal.toLocaleString('en-IN')}
                        </motion.span>
                      </div>
                    </div>
                    <button className="btn-primary w-full py-6 text-sm">
                      Proceed to Checkout
                    </button>
                    <div className="mt-10 flex items-center justify-center gap-4 text-white/20">
                      <ShieldCheck size={18} />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-32 pt-32 border-t border-white/5">
                <div className="flex items-end justify-between mb-16">
                  <div>
                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/30 mb-2 block">Complete the look</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Recommended for You</h2>
                  </div>
                  <button 
                    onClick={() => {
                      setCurrentView('all-products');
                      window.scrollTo(0, 0);
                    }}
                    className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {products
                    .filter(p => !cart.find(item => item.id === p.id))
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 4)
                    .map((product) => (
                      <ProductCard 
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        onToggleWishlist={toggleWishlist}
                        isWishlisted={wishlist.includes(product.id)}
                        onClick={() => {
                          setSelectedProduct(product);
                          setCurrentView('product');
                          window.scrollTo(0, 0);
                        }}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features */}
          <section className="py-24 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/40 mb-2">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-display font-bold uppercase tracking-[0.3em] text-[11px]">Premium Quality</h3>
                <p className="text-white/30 text-[11px] leading-relaxed max-w-[240px]">Hand-selected fabrics with 3D-embossed detailing that lasts a lifetime.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/40 mb-2">
                  <Zap size={20} />
                </div>
                <h3 className="font-display font-bold uppercase tracking-[0.3em] text-[11px]">Limited Drops</h3>
                <p className="text-white/30 text-[11px] leading-relaxed max-w-[240px]">Exclusive releases. Once they're gone, they're gone forever.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/40 mb-2">
                  <Globe size={20} />
                </div>
                <h3 className="font-display font-bold uppercase tracking-[0.3em] text-[11px]">Door-Step Shipping</h3>
                <p className="text-white/30 text-[11px] leading-relaxed max-w-[240px]">Fast, secure shipping to over your doorstep.</p>
              </div>
            </div>
          </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-display font-bold tracking-tighter text-white">BBO</span>
                <div className="flex flex-col border-l border-white/10 pl-4">
                  <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/80 leading-none mb-1">Bad Boy</span>
                  <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/20 leading-none">Originals</span>
                </div>
              </div>
              <p className="text-white/40 max-w-md leading-relaxed mb-8">
                Join the inner circle. Get early access to limited drops, exclusive events, and the latest from the studio.
              </p>
              <div className="flex gap-4">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="bg-white/5 border border-white/10 px-6 py-5 text-[10px] font-bold tracking-[0.3em] focus:outline-none focus:border-white/30 flex-grow transition-all"
                />
                <button className="px-10 py-5 bg-white text-black font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-white/90 transition-all">
                  Join
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-white/30">Navigation</h4>
              <ul className="space-y-5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                <li><button onClick={() => { setCurrentView('all-products'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Shop All</button></li>
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Archive</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-white/30">Support</h4>
              <ul className="space-y-5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:row items-center justify-between pt-16 border-t border-white/5 gap-8">
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold">
              © 2026 Bad Boy Originals. All Rights Reserved.
            </p>
            <div className="flex gap-10 text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login / Register Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsLoginOpen(false);
                setIsRegistering(false);
              }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md glass p-6 sm:p-8 z-[90] max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => {
                  setIsLoginOpen(false);
                  setIsRegistering(false);
                  setIsResettingPassword(false);
                }}
                className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold uppercase tracking-[0.2em] mb-2">
                  {isResettingPassword ? 'Reset Password' : isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-bold">
                  {isResettingPassword ? 'Enter your email to receive a reset link' : isRegistering ? 'Join the inner circle' : 'Enter your credentials to access your account'}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleAuthSubmit}>
                {isResettingPassword ? (
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-5 py-3.5 text-sm tracking-wider focus:outline-none focus:border-white/30 rounded-xl transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                ) : (
                  <>
                    {isRegistering && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Full Name</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-white/5 border border-white/10 px-5 py-3.5 text-sm tracking-wider focus:outline-none focus:border-white/30 rounded-xl transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Phone Number</label>
                          <input 
                            type="tel" 
                            required
                            className="w-full bg-white/5 border border-white/10 px-5 py-3.5 text-sm tracking-wider focus:outline-none focus:border-white/30 rounded-xl transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 px-5 py-3.5 text-sm tracking-wider focus:outline-none focus:border-white/30 rounded-xl transition-all"
                        placeholder="name@example.com"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Password</label>
                      <input 
                        type="password" 
                        required
                        className="w-full bg-white/5 border border-white/10 px-5 py-3.5 text-sm tracking-wider focus:outline-none focus:border-white/30 rounded-xl transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </>
                )}

                {!isRegistering && !isResettingPassword && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-end">
                      <button 
                        type="button" 
                        onClick={() => setIsResettingPassword(true)}
                        className="text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                )}

                {isRegistering && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Confirm Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-white/5 border border-white/10 px-5 py-3.5 text-sm tracking-wider focus:outline-none focus:border-white/30 rounded-xl transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <button className="btn-primary w-full py-4 text-sm mt-2">
                    {isResettingPassword ? 'Send Reset Link' : isRegistering ? 'Create Account' : 'Sign In'}
                  </button>
                  
                  {isResettingPassword && (
                    <button 
                      type="button"
                      onClick={() => setIsResettingPassword(false)}
                      className="text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer"
                    >
                      Back to Login
                    </button>
                  )}
                </div>

                {isResettingPassword && (
                  <div className="mt-2">
                    {resetEmailSent && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest text-center"
                      >
                        Reset link sent to your email!
                      </motion.p>
                    )}
                    {resetEmailError && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] text-red-400 font-bold uppercase tracking-widest text-center"
                      >
                        Please enter your email first
                      </motion.p>
                    )}
                  </div>
                )}
              </form>

              <div className="mt-6 flex items-center gap-4">
                <div className="h-px bg-white/5 flex-grow" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">Or continue with</span>
                <div className="h-px bg-white/5 flex-grow" />
              </div>

              <button className="w-full py-4 border border-white/10 hover:border-white/30 text-white font-bold uppercase tracking-[0.2em] text-[9px] transition-all mt-6 flex items-center justify-center gap-4 rounded-xl">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] mb-4 font-bold">
                  {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <button 
                  onClick={toggleAuthMode}
                  className="text-[9px] font-bold uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                  {isRegistering ? 'Sign In' : 'Create Account'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-nav-black z-[110] lg:hidden p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-2xl font-display font-bold tracking-tighter">BBO</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-8 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                <button 
                  onClick={() => {
                    setCurrentView('home');
                    setIsMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className={`text-left hover:text-white transition-colors cursor-pointer ${currentView === 'home' ? 'text-white' : ''}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('all-products');
                    setIsMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className={`text-left hover:text-white transition-colors cursor-pointer ${currentView === 'all-products' ? 'text-white' : ''}`}
                >
                  Shop All
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('home');
                    setIsMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >About</button>
                <button 
                  onClick={() => {
                    setCurrentView('all-products');
                    setIsMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >Collection</button>
                <a href="#" className="hover:text-white transition-colors cursor-pointer">Archive</a>
              </div>

              <div className="mt-auto pt-12 border-t border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-6">Connect</p>
                <div className="flex gap-6 text-white/40">
                  <a href="#" className="hover:text-white transition-colors">IG</a>
                  <a href="#" className="hover:text-white transition-colors">TW</a>
                  <a href="#" className="hover:text-white transition-colors">DS</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
