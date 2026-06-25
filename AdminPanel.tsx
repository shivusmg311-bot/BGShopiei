import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CornerDownRight,
  Plus,
  Edit2,
  Trash2,
  Settings,
  AlertTriangle,
  Send,
  Upload,
  User,
  Smartphone,
  Landmark,
  PlusCircle,
  Briefcase,
  Check,
  RefreshCcw,
  BarChart4
} from 'lucide-react';
import { Product, Order, PaymentRequestDetails, OrderStatus } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  adminSettings: {
    upiId: string;
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    qrCodeUrl: string;
    paymentGuideNote: string;
  };
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateOrders: (newOrders: Order[]) => void;
  onUpdateSettings: (newSettings: any) => void;
}

export default function AdminPanel({
  products,
  orders,
  adminSettings,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateSettings
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'catalog' | 'settings'>('dashboard');
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'All'>('All');

  // Product Create/Edit States
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pOrigPrice, setPOrigPrice] = useState(0);
  const [pCat, setPCat] = useState('Aura Tech');
  const [pImage, setPImage] = useState('');
  const [pStock, setPStock] = useState(1);
  const [pFeatures, setPFeatures] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);

  // Send Payment Request Form inline States (key of order ID)
  const [requestNotes, setRequestNotes] = useState<{ [orderId: string]: string }>({});
  const [customRequestAmount, setCustomRequestAmount] = useState<{ [orderId: string]: number }>({});
  const [showRequestForm, setShowRequestForm] = useState<{ [orderId: string]: boolean }>({});

  // Shipping details Form State (key of order ID)
  const [shipCarrier, setShipCarrier] = useState<{ [orderId: string]: string }>({});
  const [shipTrackingCode, setShipTrackingCode] = useState<{ [orderId: string]: string }>({});
  const [showShipForm, setShowShipForm] = useState<{ [orderId: string]: boolean }>({});

  // Settings Temp Form
  const [setUpi, setSetUpi] = useState(adminSettings.upiId);
  const [setBank, setSetBank] = useState(adminSettings.bankName);
  const [setHolder, setSetHolder] = useState(adminSettings.accountHolderName);
  const [setAcNo, setSetAcNo] = useState(adminSettings.accountNumber);
  const [setIfsc, setSetIfsc] = useState(adminSettings.ifscCode);
  const [setQr, setSetQr] = useState(adminSettings.qrCodeUrl);
  const [setNote, setSetNote] = useState(adminSettings.paymentGuideNote);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // --- STATS ENGINE ---
  const paidOrders = orders.filter((o) =>
    ['Paid & Processing', 'Shipped', 'Delivered'].includes(o.status)
  );
  const totalSalesVolume = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingRequestsCount = orders.filter((o) => o.status === 'Pending Approval').length;
  const pendingProofsCount = orders.filter((o) => o.status === 'Payment Proof Submitted').length;
  const activeDeliveriesCount = orders.filter((o) => ['Paid & Processing', 'Shipped'].includes(o.status)).length;

  const totalOutstandingVolume = orders
    .filter((o) => o.status === 'Payment Requested')
    .reduce((acc, o) => acc + (o.paymentRequestDetails?.amountRequested || o.totalAmount), 0);

  // --- CHART HELPERS ---
  const categorySales = products.reduce((acc: { [key: string]: number }, prod) => {
    // Find amount paid under this product's category
    const categoryName = prod.category;
    if (!acc[categoryName]) acc[categoryName] = 0;

    orders.forEach((ord) => {
      if (['Paid & Processing', 'Shipped', 'Delivered'].includes(ord.status)) {
        ord.items.forEach((item) => {
          if (item.productId === prod.id) {
            acc[categoryName] += item.price * item.quantity;
          }
        });
      }
    });

    return acc;
  }, {});

  const statusMetrics = orders.reduce((acc: { [key: string]: number }, ord) => {
    acc[ord.status] = (acc[ord.status] || 0) + 1;
    return acc;
  }, {});

  // --- WORKFLOW METRIC DRIVER TRAGS ---

  // 1. Dispatch Payment request to User Tracker
  const handleInitiatePaymentRequest = (orderId: string, totalAmount: number) => {
    const note = requestNotes[orderId]?.trim() || adminSettings.paymentGuideNote;
    const amount = customRequestAmount[orderId] || totalAmount;

    const details: PaymentRequestDetails = {
      upiId: adminSettings.upiId,
      bankName: adminSettings.bankName,
      accountNumber: adminSettings.accountNumber,
      ifscCode: adminSettings.ifscCode,
      qrCodeUrl: adminSettings.qrCodeUrl,
      amountRequested: amount,
      note,
      requestedAt: new Date().toISOString()
    };

    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Payment Requested' as OrderStatus,
          paymentRequestDetails: details,
          statusHistory: [
            ...o.statusHistory,
            {
              status: 'Payment Requested' as OrderStatus,
              date: new Date().toISOString(),
              note: `Merchant requested payment secure. Fulfill sum: ${formatPrice(amount)}. Note: ${note.substring(0, 50)}...`
            }
          ]
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    // clean
    setShowRequestForm((prev) => ({ ...prev, [orderId]: false }));
  };

  // 2. Reject / Cancel order completely
  const handleCancelOrder = (orderId: string, reason: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Cancelled' as OrderStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: 'Cancelled' as OrderStatus,
              date: new Date().toISOString(),
              note: `Order cancelled by Merchant. Reason: ${reason}`
            }
          ]
        };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // 3. Approve payment proof (Move to Paid)
  const handleApprovePayment = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const reference = o.paymentProof?.transactionId || 'Pre-verified Direct Ledger';
        return {
          ...o,
          status: 'Paid & Processing' as OrderStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: 'Paid & Processing' as OrderStatus,
              date: new Date().toISOString(),
              note: `Transaction Approved by Admin Panel. Reference ID verified: ${reference}. Stock scheduled for parcel packaging.`
            }
          ]
        };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // 4. Reject uploaded proof (returns to Payment Requested)
  const handleRejectPaymentProof = (orderId: string, reason: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Payment Requested' as OrderStatus,
          paymentProof: undefined, // remove invalid proof reference
          statusHistory: [
            ...o.statusHistory,
            {
              status: 'Payment Requested' as OrderStatus,
              date: new Date().toISOString(),
              note: `Uploaded payment proof was rejected. Reason: ${reason}. Please update transaction details with a correct reference.`
            }
          ]
        };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // 5. dispatch Courier tracking
  const handleShipOrder = (orderId: string) => {
    const carrier = shipCarrier[orderId]?.trim() || 'DTDC priority';
    const tracker = shipTrackingCode[orderId]?.trim() || 'BGS-SHIP-' + Math.floor(1000 + Math.random() * 9000);

    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Shipped' as OrderStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: 'Shipped' as OrderStatus,
              date: new Date().toISOString(),
              note: `Consignment packaged and dispatched via ${carrier}. Consignment tracking number: ${tracker}.`
            }
          ]
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    setShowShipForm((prev) => ({ ...prev, [orderId]: false }));
  };

  // 6. Complete delivery
  const handleDeliverOrder = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Delivered' as OrderStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: 'Delivered' as OrderStatus,
              date: new Date().toISOString(),
              note: 'Parcel delivered successfully to door destination verified.'
            }
          ]
        };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // --- SETTINGS DISPATCH ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      upiId: setUpi.trim(),
      bankName: setBank.trim(),
      accountHolderName: setHolder.trim(),
      accountNumber: setAcNo.trim(),
      ifscCode: setIfsc.trim(),
      qrCodeUrl: setQr.trim(),
      paymentGuideNote: setNote.trim()
    });
    setSettingsSavedMsg(true);
    setTimeout(() => {
      setSettingsSavedMsg(false);
    }, 3000);
  };

  // --- CATALOG DISPATCH ---
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pDesc || pPrice <= 0 || !pImage) {
      alert('Please fill out essential Product parameters.');
      return;
    }

    const featureArr = pFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (editingProductId) {
      // Edit
      const updated = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            name: pName.trim(),
            description: pDesc.trim(),
            price: Number(pPrice),
            originalPrice: pOrigPrice > 0 ? Number(pOrigPrice) : undefined,
            category: pCat,
            image: pImage.trim(),
            stock: Number(pStock),
            features: featureArr
          };
        }
        return p;
      });
      onUpdateProducts(updated);
    } else {
      // Create new
      const nProd: Product = {
        id: 'prod-' + (products.length + 1) + '-' + Math.floor(Math.random() * 100),
        name: pName.trim(),
        description: pDesc.trim(),
        price: Number(pPrice),
        originalPrice: pOrigPrice > 0 ? Number(pOrigPrice) : undefined,
        category: pCat,
        image: pImage.trim(),
        rating: 5.0,
        reviewCount: 0,
        stock: Number(pStock),
        features: featureArr.length > 0 ? featureArr : ['Hand-picked Premium Piece', 'Aesthetic Quality Certified']
      };
      onUpdateProducts([nProd, ...products]);
    }

    // clean form states
    setPName('');
    setPDesc('');
    setPPrice(0);
    setPOrigPrice(0);
    setPImage('');
    setPStock(1);
    setPFeatures('');
    setEditingProductId(null);
    setShowProductForm(false);
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setPName(p.name);
    setPDesc(p.description);
    setPPrice(p.price);
    setPOrigPrice(p.originalPrice || 0);
    setPCat(p.category);
    setPImage(p.image);
    setPStock(p.stock);
    setPFeatures(p.features.join('\n'));
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you completely sure you want to delete this catalogue product?')) {
      const filtered = products.filter((p) => p.id !== productId);
      onUpdateProducts(filtered);
    }
  };

  const filteredOrdersList = orders.filter((o) => {
    if (orderFilter === 'All') return true;
    return o.status === orderFilter;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      
      {/* Visual Hub Title Panel */}
      <div className="bg-[#131921] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white" />
        
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            <span className="font-mono text-white text-xs uppercase font-extrabold tracking-widest">Live Merchant Base</span>
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
            BG SHPOI EI Merchant Control Panel
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl font-light">
            Coordinate manual payment requests, check uploaded transaction references, adjust catalogue stocks, and analyze revenue indexes.
          </p>
        </div>

        {/* Header Action pill selector */}
        <div className="bg-[#0F1111] p-1.5 rounded-xl flex border border-gray-800 font-mono text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-yellow-500 text-black shadow font-extrabold font-mono' : 'text-gray-300 hover:text-white'}`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer relative ${activeTab === 'orders' ? 'bg-yellow-500 text-black shadow font-extrabold font-mono' : 'text-gray-300 hover:text-white'}`}
          >
            Orders
            {(pendingRequestsCount > 0 || pendingProofsCount > 0) && (
              <span className="absolute -top-1 -right-1 bg-red-650 text-white text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center font-bold font-mono">
                {pendingRequestsCount + pendingProofsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'catalog' ? 'bg-yellow-500 text-black shadow font-extrabold font-mono' : 'text-gray-300 hover:text-white'}`}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-yellow-500 text-black shadow font-extrabold font-mono' : 'text-gray-300 hover:text-white'}`}
          >
            Ledger Setup
          </button>
        </div>
      </div>

      {/* TABS INTERIOR VIEWPORTS */}

      {/* TAB 1: TELEMETRY DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Quick metric grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Total Sales (Approved)</span>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <p id="total-revenue" className="text-2xl font-mono font-extrabold text-[#eab308]">
                {formatPrice(totalSalesVolume)}
              </p>
              <p className="text-[10px] text-emerald-450 font-bold uppercase tracking-wide">✓ Stock paid & cleared logistics</p>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Outstanding Demands</span>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-mono font-extrabold text-white">
                {formatPrice(totalOutstandingVolume)}
              </p>
              <p className="text-[10px] text-yellow-500 font-semibold uppercase tracking-wide">⌛ Customer payment pending</p>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Pending Desk action</span>
                <AlertTriangle className="h-5 w-5 text-indigo-400" />
              </div>
              <p className="text-2xl font-mono font-extrabold text-[#eab308]">
                {pendingRequestsCount + pendingProofsCount}
              </p>
              <p className="text-[10px] text-gray-450 font-semibold uppercase tracking-wide">
                <span className="font-extrabold text-indigo-400">{pendingRequestsCount}</span> review • <span className="font-extrabold text-yellow-500">{pendingProofsCount}</span> verify proof
              </p>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono">In-Transit Parcels</span>
                <Package className="h-5 w-5 text-blue-450" />
              </div>
              <p className="text-2xl font-mono font-extrabold text-white">
                {activeDeliveriesCount}
              </p>
              <p className="text-[10px] text-[#eab308] font-bold uppercase tracking-wide">✈️ DTDC / Priority packed</p>
            </div>

          </div>

          {/* Graphical Analytics charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Category sales bar charts */}
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-gray-800 space-y-4">
              <div className="flex items-center gap-2">
                <BarChart4 className="h-4.5 w-4.5 text-gray-400" />
                <h3 className="font-mono font-bold text-sm text-white">Sales Capture by Category (INR ₹)</h3>
              </div>
              <div className="space-y-4 pt-2">
                {Object.keys(categorySales).length === 0 ? (
                  <p className="text-xs text-gray-500 italic text-center py-6 font-light">No approved sales data points recorded yet.</p>
                ) : (
                  Object.entries(categorySales).map(([cat, val]) => {
                    const pct = totalSalesVolume > 0 ? (val / totalSalesVolume) * 100 : 0;
                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-300 font-mono">{cat}</span>
                          <span className="text-[#eab308] font-mono">{formatPrice(val)} ({Math.round(pct)}%)</span>
                        </div>
                        <div className="w-full bg-[#0F1111] h-2.5 rounded-full overflow-hidden">
                          <div
                              className="bg-yellow-500 h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Status counts distribution */}
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-gray-800 space-y-4">
              <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <Package className="h-4.5 w-4.5 text-gray-400" />
                Delivery Pipeline Status Ratio
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {Object.entries(statusMetrics).map(([status, cnt]) => (
                  <div key={status} className="bg-[#131921] p-2.5 rounded-xl border border-gray-800 text-center space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block font-mono">{status}</span>
                    <span className="text-xl font-mono font-extrabold text-white">{cnt}</span>
                    <span className="text-[9px] text-gray-500 block">Active ledger</span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="col-span-full text-xs text-gray-500 italic text-center py-6">No pipeline logs.</p>
                )}
              </div>
            </div>

          </div>

          {/* Quick Ledger configuration advice summary */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-gray-200 max-w-3xl">
            <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">BG SHPOI EI Direct Settlement System is Online</p>
              <p className="mt-1 font-light text-gray-300 leading-relaxed">
                This pipeline does not hold merchant revenue inside third-party custody or charge commissions. Invoices are requested directly by the desk when they click "Approve and Request payment" in the Orders list. The payments land directly inside the bank account or UPI setup configured under your **Ledger Setup** tab!
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ACTIVE ORDERS WORKFLOW MATRIX */}
      {activeTab === 'orders' && (
        <div className="space-y-6 text-gray-200">
          
          {/* Internal filter bar tabs */}
          <div className="flex border-b border-gray-800 overflow-x-auto pb-1 gap-2 font-mono text-[11px] font-bold text-gray-400">
            {([
              'All',
              'Pending Approval',
              'Payment Requested',
              'Payment Proof Submitted',
              'Paid & Processing',
              'Shipped',
              'Delivered',
              'Cancelled'
            ] as const).map((filter) => {
              const count = filter === 'All' ? orders.length : orders.filter((o) => o.status === filter).length;
              return (
                <button
                  key={filter}
                  onClick={() => setOrderFilter(filter)}
                  className={`px-3 py-2 border-b-2 whitespace-nowrap tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                    orderFilter === filter
                      ? 'border-yellow-500 text-yellow-500 font-extrabold'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{filter}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    orderFilter === filter ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* List display */}
          <div className="space-y-6">
            {filteredOrdersList.length === 0 ? (
              <div className="bg-[#1A1A1A] rounded-2xl p-16 border border-gray-850 text-center text-gray-500 text-xs italic font-light">
                No orders identified matching this progress pipeline status filter choice.
              </div>
            ) : (
              filteredOrdersList.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#1A1A1A] rounded-3xl border border-gray-850 hover:border-yellow-500/30 overflow-hidden shadow-md transition-all animate-fade-in"
                >
                  
                  {/* Card header */}
                  <div className="bg-[#131921] px-6 py-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-medium">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-white">{order.id}</span>
                        <span className="bg-yellow-500/10 px-2.5 py-0.5 rounded-md text-[10px] text-yellow-500 border border-yellow-500/20 font-bold font-mono">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">
                        Placed at: {new Date(order.date).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-gray-500 font-mono uppercase">Associate Account</p>
                      <p className="font-semibold text-yellow-500">{order.customerEmail}</p>
                    </div>
                  </div>

                  {/* Customer details in card body */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-gray-800 bg-[#1A1A1A]">
                    
                    {/* Left 4: Delivery targets */}
                    <div className="md:col-span-4 space-y-2 text-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Delivery Destination</span>
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="font-mono font-medium text-gray-300">{order.shippingAddress.phone}</p>
                      <p className="text-gray-400 font-light max-w-xs">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>

                    {/* Middle 5: Items listing */}
                    <div className="md:col-span-5 space-y-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Order Items List</span>
                      <div className="space-y-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="bg-[#0F1111] border border-gray-800 h-5 w-5 rounded flex items-center justify-center font-mono text-[10px] font-bold text-[#eab308] flex-shrink-0">
                                {it.quantity}x
                              </span>
                              <p className="font-semibold text-gray-250 truncate max-w-[220px]">{it.productName}</p>
                            </div>
                            <span className="font-bold text-white font-mono">{formatPrice(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-dashed border-gray-800 pt-2 flex justify-between font-mono text-sm font-bold text-yellow-500">
                        <span>Invoice Net Sum</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Right 3: Historical tracking states log */}
                    <div className="md:col-span-3 bg-[#0F1111] p-4 rounded-xl border border-gray-800 text-[10px] space-y-2 font-light">
                      <span className="font-bold font-mono uppercase text-[9px] text-gray-550 block mb-1">State Log History</span>
                      <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                        {order.statusHistory.map((h, idx) => (
                          <div key={idx} className="relative pl-3.5 border-l border-yellow-500/30">
                            <span className="absolute left-0 top-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                            <span className="font-bold block text-white font-mono">{h.status}</span>
                            <span className="text-gray-400 truncate block mt-0.5">{h.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* METRIC WORKFLOW FORM ACTUATION PORTS */}
                  
                  {/* Flow A: Pending review -> Needs payment request generation */}
                  {order.status === 'Pending Approval' && (
                    <div className="p-6 bg-[#0F1111]/45 border-b border-gray-800">
                      {!showRequestForm[order.id] ? (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => setShowRequestForm((prev) => ({ ...prev, [order.id]: true }))}
                            className="bg-yellow-500 hover:bg-yellow-450 text-black font-extrabold px-5 py-2.5 rounded-lg text-xs tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                          >
                            <PlusCircle className="h-4.5 w-4.5" />
                            Approve Stock & Send Payment Request
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id, 'Discontinued stock / No allocation')}
                            className="border border-rose-800 hover:bg-rose-950/30 text-rose-450 font-bold px-4 py-2.5 rounded-lg text-xs"
                          >
                            Reject (Out of Stock)
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#131921] p-5 rounded-2xl border border-gray-850 space-y-4 max-w-xl">
                          <h4 className="font-mono text-sm font-bold text-white">Define Payment Request Specs</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1">
                                Request invoice total (₹)
                              </label>
                              <input
                                type="number"
                                defaultValue={order.totalAmount}
                                onChange={(e) => setCustomRequestAmount((prev) => ({ ...prev, [order.id]: Number(e.target.value) }))}
                                className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2 text-xs font-bold font-mono outline-none focus:border-yellow-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1">
                                Merchant UPI target
                              </label>
                              <input
                                type="text"
                                disabled
                                value={adminSettings.upiId}
                                className="w-full bg-[#0F1111] border border-gray-800 rounded p-2 text-xs font-mono text-gray-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1">
                              Custom Invoice guidelines / Notes for receiver
                            </label>
                            <textarea
                              rows={2}
                              defaultValue={adminSettings.paymentGuideNote}
                              onChange={(e) => setRequestNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
                              className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2 text-xs outline-none focus:border-yellow-500"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleInitiatePaymentRequest(order.id, order.totalAmount)}
                              className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold px-4 py-2.5 rounded-lg text-xs shadow-md cursor-pointer"
                            >
                              Dispatch payment Request to Customer
                            </button>
                            <button
                              onClick={() => setShowRequestForm((prev) => ({ ...prev, [order.id]: false }))}
                              className="border border-gray-700 hover:bg-gray-800 font-bold px-3 py-2.5 rounded-lg text-xs text-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flow B: payment proof submitted -> Needs verification */}
                  {order.status === 'Payment Proof Submitted' && order.paymentProof && (
                    <div className="p-6 bg-[#0F1111]/45 border-b border-gray-800 space-y-4">
                      
                      <div className="p-4 bg-[#131921] rounded-2xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider">Submitted Proof Particulars</span>
                          <p className="text-sm font-mono font-extrabold text-white">
                            Reference Ref/UTR: <span className="text-indigo-400 underline bg-indigo-950/40 border border-indigo-550/30 px-2 py-0.5 rounded font-mono font-bold">{order.paymentProof.transactionId}</span>
                          </p>
                          <p className="text-xs text-gray-450 font-light">
                            Method: {order.paymentProof.paymentMethod} • Submitted: {new Date(order.paymentProof.submittedAt).toLocaleString()}
                          </p>
                          {order.paymentProof.note && (
                            <p className="text-xs italic text-gray-400 font-light">
                              Customer remarks: "{order.paymentProof.note}"
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprovePayment(order.id)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold px-4.5 py-2.5 rounded-lg text-xs shadow-md flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="h-4 w-4 text-black" />
                            Approve & Release Stock
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Specify rejection feedback / reason (e.g., UTR is invalid):', 'The Reference/UTR number is invalid. Re-verify in banking app and submit real reference ID.');
                              if (reason) handleRejectPaymentProof(order.id, reason);
                            }}
                            className="border border-rose-800 hover:bg-[#2e1d1d] text-rose-450 font-bold px-3 py-2.5 rounded-lg text-xs"
                          >
                            Reject Proof
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Flow C: paid & processing -> Ready to dispatch package */}
                  {order.status === 'Paid & Processing' && (
                    <div className="p-6 bg-[#0F1111]/45 border-b border-gray-800">
                      {!showShipForm[order.id] ? (
                        <button
                          onClick={() => setShowShipForm((prev) => ({ ...prev, [order.id]: true }))}
                          className="bg-yellow-500 hover:bg-yellow-450 text-black font-extrabold px-5 py-2.5 rounded-lg text-xs cursor-pointer"
                        >
                          Package Ready — Initiate Shipment Dispatch
                        </button>
                      ) : (
                        <div className="bg-[#131921] p-5 rounded-2xl border border-gray-800 space-y-4 max-w-lg">
                          <h4 className="font-mono text-sm font-bold text-white">Define Parcel Courier Tracker</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase">Carrier Provider</label>
                              <input
                                type="text"
                                placeholder="e.g. DTDC Express"
                                onChange={(e) => setShipCarrier((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2 text-xs outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase">Tracking Airway Bill (AWB)</label>
                              <input
                                type="text"
                                placeholder="e.g. BGS-DTDC-90218"
                                onChange={(e) => setShipTrackingCode((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                className="w-full bg-[#0F1111] border border-gray-750 text-white font-mono font-bold rounded p-2 text-xs outline-none"
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleShipOrder(order.id)}
                              className="bg-yellow-500 hover:bg-yellow-450 text-black font-extrabold px-4 py-2 rounded-lg text-xs cursor-pointer"
                            >
                              Dispatch Airway Bill
                            </button>
                            <button
                              onClick={() => setShowShipForm((prev) => ({ ...prev, [order.id]: false }))}
                              className="border border-gray-700 p-2 rounded-lg text-xs font-semibold text-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flow D: Shipped -> can deliver */}
                  {order.status === 'Shipped' && (
                    <div className="p-6 bg-[#0F1111]/45">
                      <button
                        onClick={() => handleDeliverOrder(order.id)}
                        className="bg-yellow-500 hover:bg-yellow-450 text-black font-extrabold px-5 py-2.5 rounded-lg text-xs cursor-pointer"
                      >
                        ✓ Mark Consignment as Delivered
                      </button>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 3: CATALOG INVENTORY BUILDER */}
      {activeTab === 'catalog' && (
        <div className="space-y-6 text-white">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#131921] p-5 rounded-2xl border border-gray-800 gap-4">
            <div>
              <p className="font-serif text-sm font-bold text-white">Configure Stock & Collection Items</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Real-time catalog synchronization enables immediate buyer client-side reflection</p>
            </div>
            <button
              onClick={() => {
                setEditingProductId(null);
                setPName('');
                setPDesc('');
                setPPrice(0);
                setPOrigPrice(0);
                setPImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800');
                setPStock(10);
                setPFeatures('');
                setShowProductForm(!showProductForm);
              }}
              className="bg-yellow-500 hover:bg-yellow-450 text-black font-extrabold px-4 py-2.5 rounded-full text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 text-black" />
              Add Brand New Piece
            </button>
          </div>

          {/* Collapsible form for create / edit */}
          {showProductForm && (
            <div className="bg-[#131921] p-6 rounded-3xl border border-gray-800 shadow-xl max-w-2xl animate-fade-in text-white">
              <h3 className="font-mono text-base font-bold text-[#eab308] mb-4">
                {editingProductId ? 'Edit catalog specs' : 'Introduce Brand New Piece'}
              </h3>
              
              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="e.g. Minimal Sandalwood Scent"
                      className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2.5 outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">Category *</label>
                    <select
                      value={pCat}
                      onChange={(e) => setPCat(e.target.value)}
                      className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2.5 outline-none focus:border-yellow-500"
                    >
                      <option value="Aura Tech" className="bg-[#131921] text-white">Aura Tech</option>
                      <option value="Luxe Apparel" className="bg-[#131921] text-white">Luxe Apparel</option>
                      <option value="Nurture Beauty" className="bg-[#131921] text-white">Nurture Beauty</option>
                      <option value="Living Space" className="bg-[#131921] text-white">Living Space</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">Rich Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Enter complete design specifications, materials used, and luxury highlights."
                    className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2.5 outline-none focus:border-yellow-500 font-light"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">Sell Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={pPrice || ''}
                      onChange={(e) => setPPrice(Number(e.target.value))}
                      placeholder="e.g. 2490"
                      className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2 text-xs font-bold font-mono focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">MRP / Old Price</label>
                    <input
                      type="number"
                      value={pOrigPrice || ''}
                      onChange={(e) => setPOrigPrice(Number(e.target.value))}
                      placeholder="e.g. 3990"
                      className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2 text-xs font-mono focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">Stock Level *</label>
                    <input
                      type="number"
                      required
                      value={pStock}
                      onChange={(e) => setPStock(Number(e.target.value))}
                      className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2 text-xs font-bold font-mono focus:border-yellow-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <span className="text-[10px] text-gray-400 font-bold block pt-5 font-mono">Units available</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">Unsplash Luxury Image Link *</label>
                  <input
                    type="url"
                    required
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    placeholder="Paste stable unsplash/web link"
                    className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2.5 font-mono text-[10px] outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">
                    Features Bullet Specifications (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={pFeatures}
                    onChange={(e) => setPFeatures(e.target.value)}
                    placeholder="Premium Italian Threading&#10;Water resistant coating&#10;Solid Walnut Housing"
                    className="w-full bg-[#0F1111] border border-gray-750 text-white rounded p-2.5 outline-none font-mono text-[11px] focus:border-yellow-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-yellow-500 text-black font-extrabold px-6 py-2.5 rounded-lg flex items-center gap-1 hover:bg-yellow-400 transition-all cursor-pointer font-mono"
                  >
                    Save Catalog Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="border border-gray-700 p-2.5 rounded-lg text-gray-400 font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Simple Products Catalogue Grid Table */}
          <div className="bg-[#1A1A1A] rounded-3xl border border-gray-850 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-200">
                <thead className="bg-[#131921] text-white text-[10px] font-mono tracking-widest uppercase font-bold border-b border-gray-800">
                  <tr>
                    <th className="p-4">Item Spec</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Retail Price</th>
                    <th className="p-4">Discount Ratio</th>
                    <th className="p-4">Stock Ledger</th>
                    <th className="p-4 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-850 font-light bg-[#1A1A1A]">
                  {products.map((p) => {
                    const discount = p.originalPrice
                      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                      : 0;

                    return (
                      <tr key={p.id} className="hover:bg-gray-850/20 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="h-10 w-10 rounded overflow-hidden bg-gray-900 border border-gray-850 flex-shrink-0">
                            <picture>
                              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                            </picture>
                          </div>
                          <div>
                            <p className="font-bold text-white">{p.name}</p>
                            <p className="text-[10px] text-gray-550 font-mono">UID: {p.id}</p>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-yellow-500">{p.category}</td>
                        <td className="p-4 font-bold text-white font-mono">{formatPrice(p.price)}</td>
                        <td className="p-4">
                          {discount > 0 ? (
                            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] py-1 px-2 rounded-lg font-bold">
                              {discount}% OFF (M.R.P. {p.originalPrice})
                            </span>
                          ) : (
                            <span className="text-gray-500 font-mono">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`font-bold font-mono py-1 px-2.5 rounded text-[10px] ${
                            p.stock === 0
                              ? 'bg-rose-955/40 text-rose-400 border border-rose-900/30'
                              : p.stock <= 5
                              ? 'bg-amber-955/40 text-amber-400 border border-amber-900/30 font-extrabold animate-pulse'
                              : 'bg-emerald-955/40 text-emerald-400 border border-emerald-900/30'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="p-1 px-2 bg-[#131921] border border-gray-850 hover:bg-[#252525] hover:text-white rounded-md text-gray-300 transition-all flex items-center gap-1 cursor-pointer"
                              title="Edit item specifications"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1 px-2 hover:bg-[#2d1b1b] text-gray-400 hover:text-rose-400 border border-transparent hover:border-rose-900/40 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                              title="Delete catalog item"
                            >
                              <Trash2 className="h-3 w-3" />
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: MERCHANT LEDGER INVOICE SETUP */}
      {activeTab === 'settings' && (
        <div className="bg-[#1A1A1A] rounded-3xl border border-gray-850 p-6 sm:p-10 shadow-lg max-w-3xl text-white">
          <div className="border-b border-gray-800 pb-5 mb-6">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-500 animate-spin-slow" />
              Configure settlement coordinates (Admin Ledger)
            </h3>
            <p className="text-xs text-gray-400 font-light mt-1">
              Set standard banking fields and general UPI addresses that will render in client invoice dashboards.
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="mb-4 bg-emerald-955/40 text-emerald-400 p-3 rounded-lg border border-emerald-900/30 font-bold text-xs font-mono">
              ✓ Merchant set elements successfully saved! Client checkouts will reflect update in real-time.
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs text-gray-300 font-semibold">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">
                  Active UPI Handle ID *
                </label>
                <input
                  type="text"
                  required
                  value={setUpi}
                  onChange={(e) => setSetUpi(e.target.value)}
                  placeholder="e.g. bgshpiei@hdfcbank"
                  className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-lg p-2.5 outline-none font-mono focus:border-yellow-500 transition-colors"
                />
                <p className="text-[10px] text-gray-500 font-light mt-1 font-mono">Clients use this for Instant QR Scanning.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">
                  Illustrative QR image scan link
                </label>
                <input
                  type="url"
                  value={setQr}
                  onChange={(e) => setSetQr(e.target.value)}
                  className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-lg p-2.5 outline-none font-mono text-[10px] focus:border-yellow-500"
                />
              </div>

            </div>

            <div className="border-t border-gray-800 pt-5 space-y-4">
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider block font-mono">Indirect bank ledger coordinates</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 pl-1 mb-1 uppercase font-mono">Bene/Account Holder Name</label>
                  <input
                    type="text"
                    value={setHolder}
                    onChange={(e) => setSetHolder(e.target.value)}
                    className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-lg p-2.5 outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 pl-1 mb-1 uppercase font-mono">Direct Bank Name</label>
                  <input
                    type="text"
                    value={setBank}
                    onChange={(e) => setSetBank(e.target.value)}
                    className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-lg p-2.5 outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 pl-1 mb-1 uppercase font-mono">Account Number</label>
                  <input
                    type="text"
                    value={setAcNo}
                    onChange={(e) => setSetAcNo(e.target.value)}
                    className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-lg p-2.5 outline-none font-mono focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 pl-1 mb-1 uppercase font-mono">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={setIfsc}
                    onChange={(e) => setSetIfsc(e.target.value)}
                    className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-lg p-2.5 outline-none font-mono focus:border-yellow-500"
                  />
                </div>

              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1 font-mono">
                Standard customer invoice instructions template
              </label>
              <textarea
                rows={3}
                value={setNote}
                onChange={(e) => setSetNote(e.target.value)}
                className="w-full bg-[#0F1111] border border-gray-750 text-white rounded-lg p-2.5 font-light outline-none focus:border-yellow-500"
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-450 text-black font-extrabold px-6 py-3 rounded-full text-xs transition-all shadow-md active:scale-95 cursor-pointer uppercase font-mono"
            >
              Update Ledger Details
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
