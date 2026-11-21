export type UserRole = "STUDENT" | "ADMIN";

export interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  // Student verification fields
  studentId?: string;
  isStudentVerified?: boolean;
  hallOrHostel?: string;
  program?: string;
  level?: string;
  avatarUrl?: string;
}

export type VendorApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Vendor {
  id: string;
  userId: string;
  shopName: string;
  description: string;
  approvalStatus: VendorApprovalStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    emailVerified: boolean;
  };
}

export type ProductCondition = "NEW" | "USED";
export type ProductStatus = "ACTIVE" | "REMOVED" | "SOLD";

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  publicId?: string | null;
  createdAt?: string;
}

export interface Product {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  price: number; // in pesewas (1 GHS = 100 pesewas)
  category: string;
  condition: ProductCondition;
  status: ProductStatus;
  createdAt: string;
  updatedAt?: string;
  vendor?: {
    id: string;
    shopName: string;
    description: string;
    user?: {
      id: string;
      fullName: string;
      email?: string;
      isStudentVerified?: boolean;
    };
  };
  images?: ProductImage[];
  // Enhanced campus marketplace fields
  location?: string;
  sellerRating?: number;
  sellerReviewCount?: number;
  sellerVerified?: boolean;
  isStudentSeller?: boolean;
  viewsCount?: number;
  badge?: string;
  targetAudience?: "STUDENTS" | "LECTURERS" | "CAMPUS_BUSINESS" | "ALL";
}

export type OrderStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "MEETUP_CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface Order {
  id: string;
  buyerId: string;
  vendorId: string;
  productId: string;
  pickupPoint: string;
  meetupAt: string;
  buyerConfirmedMeetup: boolean;
  vendorConfirmedMeetup: boolean;
  status: OrderStatus;
  paymentMethod: "IN_PERSON";
  createdAt: string;
  updatedAt: string;
  buyer?: {
    id: string;
    fullName: string;
    email?: string;
    isStudentVerified?: boolean;
  };
  vendor?: {
    id: string;
    userId?: string;
    shopName: string;
    description?: string;
    user?: {
      id: string;
      fullName: string;
      isStudentVerified?: boolean;
    };
  };
  product?: {
    id: string;
    title: string;
    price: number;
    category?: string;
    status: ProductStatus;
    images?: ProductImage[];
    location?: string;
  };
  review?: Review;
}

export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  reviewer?: {
    id: string;
    fullName: string;
    isStudentVerified?: boolean;
  };
}

export interface RatingSummary {
  averageRating: number;
  reviewCount: number;
  distribution: Record<number, number>;
}

export type ReportReason =
  | "SCAM"
  | "INAPPROPRIATE_CONTENT"
  | "HARASSMENT"
  | "SUSPICIOUS_ACTIVITY"
  | "OTHER";

export type ReportStatus = "OPEN" | "REVIEWED" | "RESOLVED" | "DISMISSED";

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string | null;
  productId?: string | null;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
  reporter?: {
    id: string;
    fullName: string;
    email: string;
  };
  reportedUser?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  product?: {
    id: string;
    title: string;
    status: string;
  } | null;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedUserId: string;
  createdAt: string;
  blockedUser?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  approvedVendors: number;
  pendingVendors: number;
  totalProducts: number;
  activeProducts: number;
  removedProducts: number;
  soldProducts: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  openReports: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// In-App Chat Types
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  isMe: boolean;
  text: string;
  timestamp: string;
  read: boolean;
  suggestedMeetup?: {
    location: string;
    time: string;
  };
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: "Student" | "Lecturer" | "Campus Business";
  participantAvatar?: string;
  isVerified: boolean;
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}
