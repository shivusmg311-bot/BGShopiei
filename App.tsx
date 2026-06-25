import React, { useState, useEffect } from 'react';
import { Compass, ShoppingBag, Eye, ShieldAlert, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { Product, Order, CartItem, ShippingAddress, PaymentProof } from './types';
import { CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS, DEFAULT_ADMIN_CREDENTIALS } from './data';
import RoleSwitcher from './components/RoleSwitcher';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import OrdersTracker from './components/OrdersTracker';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // --- PERSISTENCE IN MEMORY ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminSettings, setAdminSettings] = useState(DEFAULT_ADMIN_CREDENTIALS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentRole, setCurrentRole] = useState<'user' | 'admin'>('user');

  // --- VIEWPORT CONFIGS ---
  const [currentView, setCurrentView] = useState<'shop' | 'orders' | 'admin'>('shop');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All Styles');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [associatedEmail, setAssociatedEmail] = useState('anshuman.roy@gmail.com');

  // Load state on startup
  useEffect(() => {
    try {
      const storedProds = localStorage.getItem('bg_shpiei_products');
      if (storedProds) {
        setProducts(JSON.parse(storedProds));
      } else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('bg_shpiei_products', JSON.stringify(INITIAL_PRODUCTS));
      }

      const storedOrders = localStorage.getItem('bg_shpiei_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(INITIAL_ORDERS);
        localStorage.setItem('bg_shpiei_orders', JSON.stringify(INITIAL_ORDERS));
      }

      const storedSettings = localStorage.getItem('bg_shpiei_settings');
      if (storedSettings) {
        setAdminSettings(JSON.parse(storedSettings));
      } else {
        setAdminSettings(DEFAULT_ADMIN_CREDENTIALS);
        localStorage.setItem('bg_shpiei_settings', JSON.stringify(DEFAULT_ADMIN_CREDENTIALS));
      }

      const storedCart = localStorage.getItem('bg_shpiei_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedRole = localStorage.getItem('bg_shpiei_role');
      if (storedRole) {
        setCurrentRole(JSON.parse(storedRole) as 'user' | 'admin');
      }
    } catch (e) {
      console.error('Failed to parse storage elements', e);
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
    }
  }, []);

  // Save states on mutations
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('bg_shpiei_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('bg_shpiei_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bg_shpiei_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('bg_shpiei_cart', JSON.stringify(cart));
  }, [cart]);

  // Adjust routing parameters or layout switches when role swaps
  const handleChangeRole = (role: 'user' | 'admin') => {
    setCurrentRole(role);
    localStorage.setItem('bg_shpiei_role', JSON.stringify(role));
    if (role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('shop');
    }
  };

  // --- ACTIONS ENGINE HANDLERS ---

  // Add to basket
  const handleAddToCart = (product: Product, size = 'Regular Fit', color = 'Luxe Sand', e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Avoid opening product details modal on card clicks

    setCart((prev) => {
      const idx = prev.findIndex(
        (it) => it.product.id === product.id && it.selectedSize === size && it.selectedColor === color
      );

      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      } else {
        return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
      }
    });

    setCartOpen(true);
  };

  // Update cart count
  const handleUpdateCartQuantity = (productId: string, quantity: number, size = 'Regular Fit', color = 'Luxe Sand') => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((it) => {
        if (it.product.id === productId && it.selectedSize === size && it.selectedColor === color) {
          return { ...it, quantity };
        }
        return it;
      })
    );
  };

  // Delete cart item
  const handleRemoveCartItem = (productId: string, size = 'Regular Fit', color = 'Luxe Sand') => {
    setCart((prev) =>
      prev.filter(
        (it) => !(it.product.id === productId && it.selectedSize === size && it.selectedColor === color)
      )
    );
  };

  // Quick Place Order
  const handlePlaceOrder = (customerName: string, customerEmail: string, address: ShippingAddress) => {
    const orderItems = cart.map((it) => ({
      productId: it.product.id,
      productName: it.product.name,
      productImage: it.product.image,
      price: it.product.price,
      quantity: it.quantity,
      selectedColor: it.selectedColor,
      selectedSize: it.selectedSize
    }));

    const totalAmount = cart.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
    const orderId = 'BGS-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      customerName,
      customerEmail: customerEmail.trim(),
      shippingAddress: address,
      items: orderItems,
      totalAmount,
      status: 'Pending Approval',
      statusHistory: [
        {
          status: 'Pending Approval',
          date: new Date().toISOString(),
          note: 'Express order raised with specifications. Awaiting Merchant stock review.'
        }
      ]
    };

    // Update orders list & Clear Cart
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAssociatedEmail(customerEmail.trim());
    setSelectedProductId(null);
    setCurrentView('orders');
    setCartOpen(false);
  };

  // Client Submits Payment Evidence Reference UTR
  const handleSubmitPaymentProof = (orderId: string, proof: PaymentProof) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Payment Proof Submitted' as const,
            paymentProof: proof,
            statusHistory: [
              ...o.statusHistory,
              {
                status: 'Payment Proof Submitted' as const,
                date: new Date().toISOString(),
                note: `Client lodged UTR reference: ${proof.transactionId} (${proof.paymentMethod}). Verification ticket dispatch initiated.`
              }
            ]
          };
        }
        return o;
      })
    );
  };

  const handleUpdateProducts = (updatedProds: Product[]) => {
    setProducts(updatedProds);
  };

  const handleUpdateOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
  };

  const handleUpdateSettings = (updatedSettings: any) => {
    setAdminSettings(updatedSettings);
  };

  // Fast reset back to pre-seeded states
  const handleResetDemo = () => {
    if (confirm('Initiate system wipe? This will restore pre-seeded aesthetic catalog items and customer orders.')) {
      localStorage.removeItem('bg_shpiei_products');
      localStorage.removeItem('bg_shpiei_orders');
      localStorage.removeItem('bg_shpiei_settings');
      localStorage.removeItem('bg_shpiei_cart');
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setAdminSettings(DEFAULT_ADMIN_CREDENTIALS);
      setCart([]);
      setCurrentView('shop');
      setSelectedProductId(null);
      setSearchTerm('');
      alert('System reset finalized!');
    }
  };

  // --- FILTERS ENGINE ---
  const searchedProducts = products.filter((p) => {
    const sTerm = searchTerm.toLowerCase().trim();
    const matchesSearch =
      p.name.toLowerCase().includes(sTerm) ||
      p.description.toLowerCase().includes(sTerm) ||
      p.category.toLowerCase().includes(sTerm);

    const matchesCategory =
      activeCategory === 'All Styles' || p.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans text-stone-850">
      
      {/* Top Demo sticky role toggle switch */}
      <RoleSwitcher currentRole={currentRole} onChangeRole={handleChangeRole} />

      {/* Aesthetic standard Header navigation */}
      {currentRole === 'user' && (
        <Navbar
          cartCount={cart.reduce((acc, it) => acc + it.quantity, 0)}
          onOpenCart={() => setCartOpen(true)}
          currentView={currentView}
          onChangeView={(v) => {
            setCurrentView(v);
            setSelectedProductId(null);
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onResetDemo={handleResetDemo}
        />
      )}

      {/* MAIN VIEWPORT BODY CONTAINER */}
      <main className="flex-1 w-full">
        {currentRole === 'user' ? (
          <>
            {currentView === 'shop' && (
              <>
                {!selectedProductId ? (
                  <div className="space-y-12 pb-20">
                    {/* Hero Banner Carousel */}
                    <HeroBanner onSelectCategory={(cat) => setActiveCategory(cat)} />

                    {/* Catalog Container Grid */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                      
                      {/* Section Title details */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4 border-b border-stone-200 pb-5">
                        <div>
                          <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                            Curated Fine Living Selection
                          </h2>
                          <p className="text-xs text-stone-400 mt-1 font-light">
                            Explore organic cotton layers, micro-tune sound elements, and artisan-cast room fragrances.
                          </p>
                        </div>

                        {/* Category selection selector tags */}
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                                activeCategory === cat
                                  ? 'bg-stone-900 text-amber-400 font-bold shadow-md'
                                  : 'bg-white hover:bg-stone-100/80 text-stone-500 border border-stone-200'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Products Grid */}
                      {searchedProducts.length === 0 ? (
                        <div className="p-16 text-center text-stone-400 bg-white rounded-2xl border border-stone-200 whitespace-pre-wrap">
                          No elegant pieces match active category / search query details.<br />
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setActiveCategory('All Styles');
                            }}
                            className="mt-3 bg-stone-900 text-white px-4 py-2 rounded-full font-bold text-xs"
                          >
                            Reset filters
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                          {searchedProducts.map((p) => (
                            <ProductCard
                              key={p.id}
                              product={p}
                              onAddToCart={(product, e) => handleAddToCart(product, 'Regular Fit', 'Luxe Sand', e)}
                              onSelectProduct={(id) => setSelectedProductId(id)}
                            />
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  /* Expanded Detailed product spec page */
                  <ProductDetail
                    product={products.find((p) => p.id === selectedProductId)!}
                    onAddToCart={(p, sz, col) => handleAddToCart(p, sz, col)}
                    onBack={() => setSelectedProductId(null)}
                    onBuyNow={(p, sz, col) => {
                      handleAddToCart(p, sz, col);
                      setCartOpen(true);
                    }}
                  />
                )}
              </>
            )}

            {currentView === 'orders' && (
              <OrdersTracker
                orders={orders}
                onSubmitPaymentProof={handleSubmitPaymentProof}
                defaultEmail={associatedEmail}
              />
            )}
          </>
        ) : (
          /* Merchant administrative view */
          <AdminPanel
            products={products}
            orders={orders}
            adminSettings={adminSettings}
            onUpdateProducts={handleUpdateProducts}
            onUpdateOrders={handleUpdateOrders}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      {/* Slide Out checkout Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Elegant minimalist branding footer */}
      <footer className="bg-[#0b0c0e] text-white border-t border-neutral-900 py-12 px-4 sm:px-6 lg:px-8 font-light text-xs text-center space-y-3 mt-auto">
        <h4 className="font-serif text-lg font-bold text-white tracking-widest uppercase">BG SHPOI EI</h4>
        <p className="max-w-md mx-auto text-[#8e9095] tracking-wide font-light leading-relaxed">
          Premium Direct-Courier Marketplace. No processing markups, direct ledger settlement, and dedicated human verification vectors.
        </p>
        <p className="text-[#555] text-[10px] uppercase tracking-widest font-mono">
          © 2026 BG SHPOI EI Ltd • All Rights Reserved
        </p>
      </footer>

    </div>
  );
}

