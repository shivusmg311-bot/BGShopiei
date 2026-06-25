import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ArrowLeft, Send, Check, ShieldAlert } from 'lucide-react';
import { CartItem, ShippingAddress } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  onRemoveItem: (productId: string, size?: string, color?: string) => void;
  onPlaceOrder: (customerName: string, customerEmail: string, address: ShippingAddress) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}: CartDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  // Error validations
  const [formErrors, setFormErrors] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (cartItems.length === 0) {
        setFormErrors('Your card is empty!');
        return;
      }
      setFormErrors(null);
      setStep(2);
    } else if (step === 2) {
      // Validate form
      if (!customerName || !customerEmail || !street || !city || !stateName || !pincode || !phone) {
        setFormErrors('Please fill out all delivery and profile coordinates.');
        return;
      }
      if (!customerEmail.includes('@')) {
        setFormErrors('Please enter a valid email address.');
        return;
      }
      if (pincode.length < 5) {
        setFormErrors('Please provide a valid Zip/Pincode.');
        return;
      }
      setFormErrors(null);
      setStep(3);
    }
  };

  const handleBackStep = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmitOrder = () => {
    const address: ShippingAddress = {
      street,
      city,
      state: stateName,
      pincode,
      phone
    };
    onPlaceOrder(customerName, customerEmail, address);
    // Reset form and step
    setStep(1);
    setCustomerName('');
    setCustomerEmail('');
    setStreet('');
    setCity('');
    setStateName('');
    setPincode('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Dark Overlay Background */}
      <div onClick={onClose} className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity" />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F1111] border-l border-gray-800 shadow-2xl flex flex-col h-full text-gray-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-[#131921] text-white">
            <div>
              <h2 className="font-serif text-lg font-bold tracking-tight text-white">Your BG SHPOI EI Bag</h2>
              <p className="text-[10px] text-white font-mono tracking-wider uppercase mt-0.5">
                {step === 1 ? 'Step 1: Basket Review' : step === 2 ? 'Step 2: Shipping Coordinates' : 'Step 3: Gateway-free Place'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Checkout Steps Progress Visual */}
          <div className="bg-[#1A1A1A] border-b border-gray-800 py-3 px-6 flex justify-between text-[11px] font-bold text-gray-400 font-mono">
            <span className={step === 1 ? 'text-white font-extrabold underline underline-offset-4 decoration-2' : 'text-gray-650 font-normal'}>1. REVIEW</span>
            <span className="text-gray-700">/</span>
            <span className={step === 2 ? 'text-white font-extrabold underline underline-offset-4 decoration-2' : 'text-gray-650 font-normal'}>2. SHIPPING</span>
            <span className="text-gray-700">/</span>
            <span className={step === 3 ? 'text-white font-extrabold underline underline-offset-4 decoration-2' : 'text-gray-650 font-normal'}>3. CONFIRM</span>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#0F1111]">
            
            {formErrors && (
              <div className="mb-4 bg-rose-950/40 text-rose-300 p-3 rounded-xl text-xs font-semibold border border-rose-900/30 flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{formErrors}</span>
              </div>
            )}

            {/* STEP 1: CART LIST */}
            {step === 1 && (
              <>
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                    <div className="h-16 w-16 bg-[#1A1A1A] rounded-full flex items-center justify-center text-gray-500 border border-gray-800">
                      <X className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-serif text-base font-bold text-white">Your bag is active, yet empty.</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed font-light">
                        Add curated collection pieces to write payment requests and manage shipping.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="bg-white text-black font-bold text-xs tracking-wide px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Browse Styles
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div
                        key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                        className="flex items-center gap-4 bg-[#1A1A1A] p-3 rounded-xl border border-gray-800"
                      >
                        <div className="h-20 w-20 rounded-lg overflow-hidden bg-neutral-900/50 border border-gray-800 flex-shrink-0">
                          <picture>
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </picture>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-white truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">
                            {item.selectedSize} • {item.selectedColor}
                          </p>
                          <p className="text-semibold text-xs text-white mt-1 font-bold font-mono">
                            {formatPrice(item.product.price)}
                          </p>
                          
                          {/* Counter */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                              className="h-6 w-6 rounded-full border border-gray-700 flex items-center justify-center text-xs hover:bg-[#252525] text-gray-300"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-white">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                              className="h-6 w-6 rounded-full border border-gray-700 flex items-center justify-center text-xs hover:bg-[#252525] text-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)}
                          className="p-1 px-2.5 text-gray-500 hover:text-rose-500 hover:bg-[#252525] rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING FORM */}
            {step === 2 && (
              <div className="space-y-4 pt-1">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                    ✨ Provide the active email you wish to use to track this order! It tracks back order states and allows payment registration.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">
                      Active Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. ramesh.k@gmail.com"
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Flat No, Apartment, Sector, Street"
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">
                        City / Town
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="e.g. Karnataka"
                        className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">
                        Zip / Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER CONFIRMATION INSTRUCTIONS */}
            {step === 3 && (
              <div className="space-y-5 pt-1 text-gray-100">
                <div className="bg-[#131921] p-4 rounded-xl border border-gray-800 font-light text-xs space-y-3">
                  <h4 className="font-semibold text-white font-serif">Order Invoice Checklist</h4>
                  <div className="border-b border-dashed border-gray-800 pb-2.5 text-[11px] text-gray-400 font-mono">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between mt-1">
                        <span className="truncate max-w-[200px]">{item.product.name} (x{item.quantity})</span>
                        <span>{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs font-bold pt-1.5 text-white">
                    <span>Invoice Net Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] border border-gray-800 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed text-gray-300">
                  <Check className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white text-sm">UPI & direct Bank Settlement</h5>
                    <p className="mt-1 font-light leading-relaxed">
                      This order will not trigger a conventional credit card transaction. No processed payment merchant gateway applies processing margins. This direct workflow:
                    </p>
                    <ol className="list-decimal list-inside text-[11px] space-y-1.5 mt-2 font-light text-gray-400">
                      <li>The order enters a <span className="text-white font-bold">Pending Approval</span> tracker.</li>
                      <li>Our admin team reviews stock and pushes a customized UPI payment QR / bank ledger details right inside your <span className="font-semibold text-white">"My Orders"</span> track panel.</li>
                      <li>You pay, post verification reference (UTR ID), and merchant updates dispatch variables.</li>
                    </ol>
                  </div>
                </div>

                <div className="p-3 bg-[#1A1A1A] border border-gray-800 rounded-xl space-y-1.5 text-[11px] text-gray-400">
                  <span className="font-bold uppercase tracking-wide block text-white font-mono">Delivery Address</span>
                  <p className="text-white">{customerName} • {phone}</p>
                  <p className="truncate">{street}, {city}, {stateName} - {pincode}</p>
                  <p className="font-mono text-[10px] text-gray-500">Tracker Associated: {customerEmail}</p>
                </div>
              </div>
            )}

          </div>

          {/* Footer controls */}
          <div className="border-t border-gray-800 p-6 bg-[#131921]">
            {step === 1 && cartItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Invoice Net Total</span>
                  <span className="text-xl font-extrabold text-white font-mono">{formatPrice(subtotal)}</span>
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full bg-white hover:bg-gray-250 text-black font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Configure Shipping Address
                  <ArrowRight className="h-4 w-4 text-black" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleBackStep}
                  className="col-span-1 border border-gray-700 hover:bg-[#252525] text-gray-300 font-bold py-3.5 rounded-full text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="col-span-2 bg-white hover:bg-gray-150 text-black font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  Review Order Terms
                  <ArrowRight className="h-4 w-4 text-black" />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleBackStep}
                  className="col-span-1 border border-gray-700 hover:bg-[#252525] text-gray-300 font-bold py-3.5 rounded-full text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Address
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="col-span-2 bg-white hover:bg-gray-150 text-black font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Place Order (Request Invoice)
                  <Send className="h-3.5 w-3.5 text-black" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
