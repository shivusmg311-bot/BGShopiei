import { Product, Order } from './types';

export const CATEGORIES = [
  'All Styles',
  'Aura Tech',
  'Luxe Apparel',
  'Nurture Beauty',
  'Living Space'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AuraWave Walnut Headphones',
    description: 'Immersive acoustic experience crafted with hand-selected FSC-certified American Walnut housing and premium vegan leather ear pads. Features custom-tuned 40mm drivers and active environmental noise cancellation.',
    price: 12499,
    originalPrice: 16999,
    category: 'Aura Tech',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewCount: 312,
    stock: 12,
    features: [
      'Genuine Walnut-wood earcups',
      'Up to 45 hours playtime/charge',
      'Biocompatible memory-foam cushions',
      'Bluetooth 5.2 & Ultra-low latency mode'
    ]
  },
  {
    id: 'prod-2',
    name: 'Slate Minimalist Mechanical Keyboard',
    description: 'Tenkeyless mechanical key deck built from solid milled bead-blasted aircraft-grade aluminum. Pre-lubed silent linear switches and dual-shot translucent PBT keycaps with responsive warm amber backlighting.',
    price: 8990,
    originalPrice: 11999,
    category: 'Aura Tech',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewCount: 184,
    stock: 8,
    features: [
      'Fully hot-swappable MX switches',
      'Elegant anodized aluminum casing',
      'Custom macro configuration profiles',
      'Premium USB-C coil cable included'
    ]
  },
  {
    id: 'prod-3',
    name: 'Atelier Herringbone Linen Blazer',
    description: 'A light-structured blazer drape constructed from 100% pre-washed Italian flax linen in a subtle herringbone weave. Features drop shoulders, organic tagua-nut single buttons, and dual deep welt pockets.',
    price: 4599,
    originalPrice: 6500,
    category: 'Luxe Apparel',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviewCount: 96,
    stock: 15,
    features: [
      '100% Premium Belgian Flax Linen',
      'Breathable half-lining interior',
      'Individually reactive-dyed colors',
      'Reinforced functional lapel buttonholes'
    ]
  },
  {
    id: 'prod-4',
    name: 'Botanical Hydration Ritual Set',
    description: 'An essential luxury skincare curation using sustainably cold-pressed botanical oils. Includes our Bamboo Balancing Toner, Marula Seed Ultra Facial Serum, and Charcoal Purifying Gel Cleanser.',
    price: 3499,
    originalPrice: 4200,
    category: 'Nurture Beauty',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewCount: 224,
    stock: 24,
    features: [
      'Formulated without synthetic silicones',
      'Rich in antioxidants & omega-6 lipids',
      'Zero waste post-consumer recycled glass',
      'Cruelty-free & 100% vegan certified'
    ]
  },
  {
    id: 'prod-5',
    name: 'Amber Sandalwood Reed Diffuser',
    description: 'Transform your space into a peaceful oasis. Natural rattan reeds draw our luxury essence blend of pure aged sandalwood, patchouli leaf, sweet warm amber, and hints of toasted cedarwood.',
    price: 2199,
    originalPrice: 2999,
    category: 'Living Space',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    reviewCount: 440,
    stock: 30,
    features: [
      'Includes 10 natural reeds',
      'Lasts beautifully up to 5-6 months',
      'Hand-poured in custom apothecary glass',
      'No parabens, phthalates or aerosolizers'
    ]
  },
  {
    id: 'prod-6',
    name: 'Ribbed Hand-Cast Clay Vase Set',
    description: 'Sculptural organic vases individually hand-cast by studio craftsmen in matte speckled terracotta clay. The distinctive fluted ribbing creates captivating shadows in soft ambient lighting.',
    price: 3199,
    originalPrice: 4800,
    category: 'Living Space',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewCount: 78,
    stock: 5,
    features: [
      'Set of 2 complementing shapes',
      'Vitreous interior glaze (completely water-tight)',
      'Felt-padded bottom to safeguard counter wood',
      'Subtle variations make each set unique'
    ]
  },
  {
    id: 'prod-7',
    name: 'Nordic Walnut Speaker & Soundbar',
    description: 'A custom sound engine layered behind woven wool blend textile and a handcraft rich walnut faceplate. Delivers room-filling acoustic power, rich bass, and a modern clean mid-century visual profile.',
    price: 18999,
    originalPrice: 24900,
    category: 'Aura Tech',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewCount: 115,
    stock: 6,
    features: [
      'Dual active 30W bass subwoofers',
      'Handcrafted solid walnut face',
      'AirPlay 2, Spotify Connect & Multiroom',
      'Optic, Coaxial & Bluetooth input systems'
    ]
  },
  {
    id: 'prod-8',
    name: 'Aesthetic Linen Wrap Dress',
    description: 'Flowy timeless wrap gown styled in double-weave breathability. Perfect wear for morning strolls or evening get-togethers, with adjustable inner ribbon wraps and side slide pockets.',
    price: 3899,
    originalPrice: 5200,
    category: 'Luxe Apparel',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    rating: 4.4,
    reviewCount: 52,
    stock: 14,
    features: [
      '100% fine French flax yarn',
      'Adjustable wrap fits many waist styles',
      'Hidden micro side seams for soft strength',
      'Beautifully structured drapes'
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'BGS-9076',
    date: '2026-06-19T14:30:00Z',
    customerName: 'Anshuman Roy',
    customerEmail: 'anshuman.roy@gmail.com',
    shippingAddress: {
      street: 'Flat 402, Shanti Vihar Appts, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      phone: '+91 98765 43210'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'AuraWave Walnut Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        price: 12499,
        quantity: 1
      },
      {
        productId: 'prod-5',
        productName: 'Amber Sandalwood Reed Diffuser',
        productImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
        price: 2199,
        quantity: 2
      }
    ],
    totalAmount: 16897,
    status: 'Pending Approval',
    statusHistory: [
      { status: 'Pending Approval', date: '2026-06-19T14:30:00Z', note: 'Order placed by system' }
    ]
  },
  {
    id: 'BGS-8742',
    date: '2026-06-18T10:15:00Z',
    customerName: 'Meera Deshmukh',
    customerEmail: 'meera.d@yahoo.com',
    shippingAddress: {
      street: 'G-12, Green Meadow Residency, Lokhandwala',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      phone: '+91 91234 56789'
    },
    items: [
      {
        productId: 'prod-4',
        productName: 'Botanical Hydration Ritual Set',
        productImage: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
        price: 3499,
        quantity: 1
      }
    ],
    totalAmount: 3499,
    status: 'Payment Requested',
    paymentRequestDetails: {
      upiId: 'bgshpoiei@paytm',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50100789065432',
      ifscCode: 'HDFC0000104',
      amountRequested: 3499,
      note: 'Please scan the UPI QR or complete bank transfer of ₹3,499. Once done, provide the UPI Transaction ID below to verify your shipment!',
      requestedAt: '2026-06-18T11:00:00Z'
    },
    statusHistory: [
      { status: 'Pending Approval', date: '2026-06-18T10:15:00Z', note: 'Customer placed order' },
      { status: 'Payment Requested', date: '2026-06-18T11:00:00Z', note: 'Admin requested bank trans/UPI' }
    ]
  },
  {
    id: 'BGS-8321',
    date: '2026-06-16T09:00:00Z',
    customerName: 'Vikram Aditya',
    customerEmail: 'vikram.aditya@outlook.com',
    shippingAddress: {
      street: 'Sector 4, H.No 120, Malviya Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      phone: '+91 99999 88888'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Slate Minimalist Mechanical Keyboard',
        productImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800',
        price: 8990,
        quantity: 1
      }
    ],
    totalAmount: 8990,
    status: 'Delivered',
    paymentRequestDetails: {
      upiId: 'bgshpoiei@paytm',
      requestedAt: '2026-06-16T09:30:00Z',
      amountRequested: 8990
    },
    paymentProof: {
      transactionId: 'TXN89123847923',
      paymentMethod: 'UPI Paytm',
      submittedAt: '2026-06-16T09:45:00Z',
      note: 'Paid instant from phone. Please ship!'
    },
    statusHistory: [
      { status: 'Pending Approval', date: '2026-06-16T09:00:00Z', note: 'Created' },
      { status: 'Payment Requested', date: '2026-06-16T09:30:00Z', note: 'Requested' },
      { status: 'Payment Proof Submitted', date: '2026-06-16T09:45:00Z', note: 'User paid TXN89123847923' },
      { status: 'Paid & Processing', date: '2026-06-16T11:00:00Z', note: 'Payment verified by Admin' },
      { status: 'Shipped', date: '2026-06-17T08:00:00Z', note: 'Shipped via DTDC tracking BGS-SHIP-1823' },
      { status: 'Delivered', date: '2026-06-18T16:20:00Z', note: 'Delivered to door with proof reception' }
    ]
  }
];

export const DEFAULT_ADMIN_CREDENTIALS = {
  upiId: 'bgshpoiei@upi',
  bankName: 'ICICI Bank',
  accountHolderName: 'BG SHPOI EI Private Limited',
  accountNumber: '000405009812',
  ifscCode: 'ICIC0000004',
  qrCodeUrl: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=400', // A nice illustrative barcode/QR graphic
  paymentGuideNote: 'Thank you for choosing BG SHPOI EI! Kindly scan the custom QR code or complete direct ledger transfer of the total invoice. After paying, please upload your Reference / Transaction UTR number to complete validation and initialize priority shipping.'
};
