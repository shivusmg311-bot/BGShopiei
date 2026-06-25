export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface PaymentRequestDetails {
  upiId: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  qrCodeUrl?: string;
  amountRequested: number;
  note?: string;
  requestedAt: string;
}

export interface PaymentProof {
  transactionId: string;
  paymentMethod: string;
  submittedAt: string;
  note?: string;
  proofImage?: string; // Custom uploaded image (e.g., base64 or placeholder check)
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  date: string;
  note?: string;
}

export type OrderStatus =
  | 'Pending Approval'
  | 'Payment Requested'
  | 'Payment Proof Submitted'
  | 'Paid & Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }[];
  totalAmount: number;
  status: OrderStatus;
  paymentRequestDetails?: PaymentRequestDetails;
  paymentProof?: PaymentProof;
  statusHistory: StatusHistoryEntry[];
}

export interface ShopStats {
  totalSales: number;
  activeOrders: number;
  pendingRequests: number;
  completedPayments: number;
}
