import React, { useState } from 'react';
import { Search, Copy, Check, Upload, Calendar, Landmark, AlertCircle, ShoppingCart, HelpCircle, Truck, Package, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Order, PaymentProof } from '../types';

interface OrdersTrackerProps {
  orders: Order[];
  onSubmitPaymentProof: (orderId: string, proof: PaymentProof) => void;
  defaultEmail?: string;
}

export default function OrdersTracker({ orders, onSubmitPaymentProof, defaultEmail = '' }: OrdersTrackerProps) {
  const [lookupEmail, setLookupEmail] = useState(defaultEmail || 'anshuman.roy@gmail.com');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // States for Submit Payment Proof form (indexed by order ID)
  const [txnId, setTxnId] = useState<{ [orderId: string]: string }>({});
  const [payMethod, setPayMethod] = useState<{ [orderId: string]: string }>({});
  const [userNote, setUserNote] = useState<{ [orderId: string]: string }>({});
  const [simulatedFile, setSimulatedFile] = useState<{ [orderId: string]: string }>({});

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // Filter orders matched by lowercase email
  const filteredOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase().trim() === lookupEmail.toLowerCase().trim()
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSendProof = (orderId: string) => {
    const tId = txnId[orderId]?.trim();
    if (!tId) {
      alert('Please fill out the unique transaction Reference/UTR ID!');
      return;
    }
    const method = payMethod[orderId] || 'UPI Paytm';
    const note = userNote[orderId] || '';

    onSubmitPaymentProof(orderId, {
      transactionId: tId,
      paymentMethod: method,
      submittedAt: new Date().toISOString(),
      note: note.trim() || undefined,
      proofImage: 'receipt_uploaded.png'
    });

    // Reset local inputs
    setTxnId((prev) => ({ ...prev, [orderId]: '' }));
    setUserNote((prev) => ({ ...prev, [orderId]: '' }));
  };

  const statusColors: { [key: string]: { border: string; bg: string; text: string; icon: any } } = {
    'Pending Approval': {
      border: 'border-yellow-500/20',
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500',
      icon: Clock
    },
    'Payment Requested': {
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/10',
      text: 'text-[#eab308]',
      icon: HelpCircle
    },
    'Payment Proof Submitted': {
      border: 'border-indigo-500/20',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      icon: Upload
    },
    'Paid & Processing': {
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      icon: ShieldCheck
    },
    'Shipped': {
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      icon: Truck
    },
    'Delivered': {
      border: 'border-gray-700',
      bg: 'bg-[#252525]',
      text: 'text-gray-300',
      icon: Package
    },
    'Cancelled': {
      border: 'border-rose-500/20',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      icon: AlertCircle
    }
  };

  const getStepActiveIndex = (status: string) => {
    switch (status) {
      case 'Pending Approval': return 1;
      case 'Payment Requested': return 2;
      case 'Payment Proof Submitted': return 3;
      case 'Paid & Processing': return 4;
      case 'Shipped': return 5;
      case 'Delivered': return 6;
      default: return 1;
    }
  };

  // Pre-seed search suggestions
  const uniqueEmails = Array.from(new Set(orders.map((o) => o.customerEmail.toLowerCase().trim())));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-gray-250">
      
      {/* Title Header */}
      <div className="text-center max-w-xl mx-auto">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-white">
          Track Your Delivery
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-light leading-relaxed">
          Verify stock allocations, approve pending transaction metrics, or upload UPI receipt proofs for immediate warehouse processing.
        </p>
      </div>

      {/* Locator Box */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-gray-800 p-6 shadow-md">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2">
          Enter Registered Email Address
        </label>
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <input
              type="email"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              placeholder="e.g. anshuman.roy@gmail.com"
              className="w-full bg-[#0F1111] border border-gray-750 focus:border-yellow-500 rounded-lg py-3 pl-10 pr-4 text-xs font-medium outline-none text-white transition-all"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Smart Quick click emails suggestions bar */}
        {uniqueEmails.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
            <span className="text-gray-500 font-mono uppercase tracking-wide font-bold">Quick Lookup Profiles:</span>
            {uniqueEmails.map((email) => (
              <button
                key={email}
                onClick={() => setLookupEmail(email)}
                className={`px-2.5 py-1 rounded-full border transition-all ${
                  lookupEmail.toLowerCase() === email
                    ? 'bg-yellow-500 border-yellow-500 text-black font-extrabold shadow-sm'
                    : 'bg-[#131921] hover:bg-[#252525] text-gray-300 border-gray-700'
                }`}
              >
                {email}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Orders results list */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-2xl border border-gray-800 py-16 text-center text-gray-400 space-y-4">
            <div className="h-12 w-12 bg-black/40 rounded-full flex items-center justify-center text-gray-500 mx-auto border border-gray-850">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-white">
                No active orders matched email.
              </p>
              <p className="text-xs text-gray-500 font-light max-w-sm mx-auto leading-relaxed mt-1">
                Ensure you typed the email exactly as completed in checkout, or use one of the quick suggestions above to inspect demo flows!
              </p>
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const currentStatusColor = statusColors[order.status] || statusColors['Pending Approval'];
            const StatusIcon = currentStatusColor.icon;
            const activeStepIndex = getStepActiveIndex(order.status);

            return (
              <div
                key={order.id}
                className="bg-[#1A1A1A] rounded-3xl border border-gray-800 hover:border-gray-750 shadow-xl overflow-hidden"
              >
                {/* Order Meta Header info */}
                <div className="px-6 py-5 bg-[#131921] text-white flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-800">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Order Identifier</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-yellow-500">{order.id}</span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">
                        {new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Invoice Sum</p>
                    <p className="text-base font-extrabold text-[#eab308]">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>

                {/* Status Timeline step graphics */}
                <div className="p-6 border-b border-gray-804 bg-black/20">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl flex items-center justify-center ${currentStatusColor.bg} ${currentStatusColor.text} border ${currentStatusColor.border}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Current Tracking Status</span>
                        <h4 className="font-bold text-sm text-white mt-0.5">{order.status}</h4>
                      </div>
                    </div>

                    <div className="flex items-center font-light text-xs text-gray-300 italic max-w-md bg-[#131921] p-3 rounded-xl border border-gray-800 shadow-sm leading-relaxed">
                      💬 "{order.statusHistory[order.statusHistory.length - 1]?.note || 'Order registered in logistics pipeline.'}"
                    </div>
                  </div>

                  {/* Horizontal visual pipeline for non-cancelled */}
                  {order.status !== 'Cancelled' && (
                    <div className="mt-8 relative">
                      {/* Grey connecting pipe bar */}
                      <div className="absolute top-2.5 left-2 right-2 h-0.5 bg-gray-800 -z-0" />
                      
                      {/* Active progress fill */}
                      <div
                        className="absolute top-2.5 left-2 h-0.5 bg-emerald-500 -z-0 transition-all duration-500"
                        style={{ width: `${((activeStepIndex - 1) / 5) * 100}%` }}
                      />

                      <div className="grid grid-cols-6 text-center text-[9px] font-bold font-mono text-gray-500 relative z-10">
                        
                        <div className="space-y-2">
                          <div className={`h-5 w-5 rounded-full mx-auto flex items-center justify-center border-2 ${activeStepIndex >= 1 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-700 bg-black text-gray-500'}`} />
                          <span className={activeStepIndex >= 1 ? 'text-white font-extrabold' : ''}>Placed</span>
                        </div>

                        <div className="space-y-2">
                          <div className={`h-5 w-5 rounded-full mx-auto flex items-center justify-center border-2 ${activeStepIndex >= 2 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-700 bg-black text-gray-500'}`} />
                          <span className={activeStepIndex >= 2 ? 'text-white font-extrabold' : ''}>Request</span>
                        </div>

                        <div className="space-y-2">
                          <div className={`h-5 w-5 rounded-full mx-auto flex items-center justify-center border-2 ${activeStepIndex >= 3 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-700 bg-black text-gray-500'}`} />
                          <span className={activeStepIndex >= 3 ? 'text-white font-extrabold' : ''}>Proof</span>
                        </div>

                        <div className="space-y-2">
                          <div className={`h-5 w-5 rounded-full mx-auto flex items-center justify-center border-2 ${activeStepIndex >= 4 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-700 bg-black text-gray-500'}`} />
                          <span className={activeStepIndex >= 4 ? 'text-white font-extrabold' : ''}>Verified</span>
                        </div>

                        <div className="space-y-2">
                          <div className={`h-5 w-5 rounded-full mx-auto flex items-center justify-center border-2 ${activeStepIndex >= 5 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-700 bg-black text-gray-500'}`} />
                          <span className={activeStepIndex >= 5 ? 'text-white font-extrabold' : ''}>Shipped</span>
                        </div>

                        <div className="space-y-2">
                          <div className={`h-5 w-5 rounded-full mx-auto flex items-center justify-center border-2 ${activeStepIndex >= 6 ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-700 bg-black text-gray-500'}`} />
                          <span className={activeStepIndex >= 6 ? 'text-white font-extrabold' : ''}>Delivered</span>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                {/* Items Bought listing inside order */}
                <div className="p-6 border-b border-gray-800">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Invoice Ledger</span>
                  <div className="divide-y divide-gray-800 mt-2">
                    {order.items.map((it, i) => (
                      <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded overflow-hidden bg-neutral-900/50 border border-gray-800 flex-shrink-0">
                            <picture>
                              <img src={it.productImage} alt={it.productName} className="h-full w-full object-cover" />
                            </picture>
                          </div>
                          <div>
                            <p className="font-bold text-white">{it.productName}</p>
                            <p className="text-[10px] text-gray-550 font-mono uppercase font-semibold mt-0.5">
                              {it.selectedSize || 'Regular Fit'} • {it.selectedColor || 'Default Accent'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-500">{formatPrice(it.price)}</p>
                          <p className="text-[10px] text-gray-500 font-mono">Qty: {it.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery profile address */}
                  <div className="mt-4 pt-4 border-t border-gray-801 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-gray-400">
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500 mb-1 block">Shipping Recipient</span>
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-gray-300">{order.shippingAddress.phone}</p>
                      <p className="text-gray-400">{order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                    </div>
                    {order.paymentProof && (
                      <div className="p-3.5 bg-[#131921] rounded-xl border border-gray-800 relative">
                        <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-400 mb-1 block">Submitted Payment Proof</span>
                        <p className="text-white font-mono font-bold text-xs">Ref: {order.paymentProof.transactionId}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Method: {order.paymentProof.paymentMethod} • {new Date(order.paymentProof.submittedAt).toLocaleString()}</p>
                        {order.paymentProof.note && <p className="text-[10px] italic text-gray-400 mt-1.5 font-light">"{order.paymentProof.note}"</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* PAYMENT REQUEST DETAILS - CORE SPECIFIC INTERACTION */}
                {order.status === 'Payment Requested' && order.paymentRequestDetails && (
                  <div className="p-6 bg-yellow-500/5 border-t border-yellow-500/10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left Side Instruction & copy details */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex gap-2 items-center text-yellow-500">
                          <Landmark className="h-4.5 w-4.5 text-yellow-500" />
                          <h4 className="font-bold text-sm tracking-tight">Merchant Banking Credentials</h4>
                        </div>
                        
                        <p className="text-xs text-gray-300 leading-relaxed font-light">
                          {order.paymentRequestDetails.note || 'Kindly fulfill the total invoice request via UPI or instant IMPS wire transfer, then key in your verification details below.'}
                        </p>

                        <div className="space-y-2.5 pt-1.5 text-xs text-gray-200">
                          
                          {/* Amount demanded */}
                          <div className="flex items-center justify-between p-3.5 bg-[#131921] rounded-xl border border-gray-800 shadow-md">
                            <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-gray-500">Total Fulfill Amount</span>
                            <span className="font-extrabold text-yellow-500 text-lg font-mono">
                              {formatPrice(order.paymentRequestDetails.amountRequested)}
                            </span>
                          </div>

                          {/* UPI Code */}
                          {order.paymentRequestDetails.upiId && (
                            <div className="flex items-center justify-between p-2.5 bg-[#131921] rounded-xl border border-gray-800">
                              <div>
                                <p className="text-[10px] text-gray-500 font-mono uppercase font-bold">UPI ID</p>
                                <p className="font-mono font-bold mt-0.5 text-white">{order.paymentRequestDetails.upiId}</p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(order.paymentRequestDetails!.upiId, `upi-${order.id}`)}
                                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                                title="Copy UPI Code"
                              >
                                {copiedText === `upi-${order.id}` ? (
                                  <span className="text-[10px] font-bold text-emerald-400">Copied!</span>
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          )}

                          {/* Bank ledger info */}
                          {order.paymentRequestDetails.accountNumber && (
                            <div className="bg-[#131921] p-3.5 rounded-xl border border-gray-800 space-y-2">
                              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider block">Indirect Ledger Details</span>
                              
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <p className="text-[10px] text-gray-500 font-mono uppercase font-semibold">Bank Name</p>
                                  <p className="font-bold text-gray-300 mt-0.5">{order.paymentRequestDetails.bankName}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500 font-mono uppercase font-semibold">IFSC Code</p>
                                  <p className="font-mono font-bold text-gray-300 mt-0.5">{order.paymentRequestDetails.ifscCode}</p>
                                </div>
                                <div className="col-span-2 border-t border-gray-800 pt-2 flex items-center justify-between">
                                  <div>
                                    <p className="text-[10px] text-gray-500 font-mono uppercase font-semibold">Account Number</p>
                                    <p className="font-mono font-extrabold text-white mt-0.5">{order.paymentRequestDetails.accountNumber}</p>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(order.paymentRequestDetails!.accountNumber || '', `ac-${order.id}`)}
                                    className="p-1.5 hover:bg-gray-800 rounded text-gray-400 transition-colors"
                                  >
                                    {copiedText === `ac-${order.id}` ? (
                                      <span className="text-[10px] font-bold text-emerald-400">Copied!</span>
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Right side QR Image & Receipt Input Proof form */}
                      <div className="lg:col-span-5 bg-[#1F2937]/10 p-5 rounded-2xl border border-gray-800 space-y-4">
                        
                        {/* Interactive illustrative payment QR */}
                        {order.paymentRequestDetails.qrCodeUrl && (
                          <div className="text-center space-y-1.5 pb-3.5 border-b border-dashed border-gray-800">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Scan custom pay QR</span>
                            <div className="h-32 w-32 mx-auto rounded-lg overflow-hidden border border-gray-700 p-2 bg-white">
                              <picture>
                                <img
                                  src={order.paymentRequestDetails.qrCodeUrl}
                                  alt="Merchant UPI payment QR code"
                                  className="h-full w-full object-cover"
                                />
                              </picture>
                            </div>
                            <p className="text-[9px] text-gray-500 font-mono">GPay • PhonePe • BHIM UPI • Paytm</p>
                          </div>
                        )}

                        {/* Fulfill proof form fields */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider block font-mono">Lodge Fulfill Ticket</span>

                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                              Fulfill Gateway/App used
                            </label>
                            <select
                              value={payMethod[order.id] || 'UPI PhonePe'}
                              onChange={(e) => setPayMethod((prev) => ({ ...prev, [order.id]: e.target.value }))}
                              className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-md p-2 text-xs font-semibold outline-none focus:border-yellow-500"
                            >
                              <option value="UPI PhonePe">UPI BHIM PhonePe</option>
                              <option value="UPI GPay">UPI Google Pay</option>
                              <option value="UPI Paytm">UPI Paytm Wallet</option>
                              <option value="IMPS Direct Bank Wire">IMPS Direct Bank Wire</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                              UPI Transaction ID / Bank UTR Number *
                            </label>
                            <input
                              type="text"
                              required
                              value={txnId[order.id] || ''}
                              onChange={(e) => setTxnId((prev) => ({ ...prev, [order.id]: e.target.value }))}
                              placeholder="12-digit UPI reference ID"
                              className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-md p-2 text-xs outline-none focus:border-yellow-500 font-mono font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                              Remarks / Sender Note (Optional)
                            </label>
                            <textarea
                              rows={1}
                              value={userNote[order.id] || ''}
                              onChange={(e) => setUserNote((prev) => ({ ...prev, [order.id]: e.target.value }))}
                              placeholder="e.g. Paid from Rohit's account"
                              className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-md p-2 text-xs outline-none focus:border-yellow-500"
                            />
                          </div>

                          <button
                            onClick={() => handleSendProof(order.id)}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-2.5 rounded-lg text-xs tracking-wider transition-all shadow-md mt-2 uppercase"
                          >
                            Submit Payment Proof
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
