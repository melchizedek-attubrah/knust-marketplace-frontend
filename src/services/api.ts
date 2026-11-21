import type {
  AdminStats,
  Block,
  Order,
  Pagination,
  Product,
  ProductCondition,
  RatingSummary,
  Report,
  Review,
  User,
  Vendor,
} from "../types";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:3000";

let authToken: string | null = localStorage.getItem("knust_token");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("knust_token", token);
  } else {
    localStorage.removeItem("knust_token");
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (authToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  // Set Content-Type only if body is JSON string and not FormData
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Parse JSON response
  let data: any;
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = "Request failed";
    let errorCode: string | undefined;

    if (data && typeof data === "object") {
      if (data.error) errorMessage = data.error;
      else if (data.message) errorMessage = data.message;
      if (data.code) errorCode = data.code;
    } else if (typeof data === "string" && data.length > 0) {
      errorMessage = data;
    }

    throw new ApiError(errorMessage, response.status, errorCode);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    register: (body: { fullName: string; email: string; password: string }) =>
      request<{ message: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    verifyEmail: (token: string) =>
      request<{ message: string }>("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),

    login: (body: { email: string; password: string }) =>
      request<{
        accessToken: string;
        tokenType: string;
        expiresIn: number;
        user: User;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    getMe: () => request<{ user: User }>("/api/auth/me"),
  },

  // Vendors
  vendors: {
    apply: (body: { shopName: string; description: string }) =>
      request<{ message: string; vendor: Vendor }>("/api/vendors", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    getMe: () => request<{ vendor: Vendor }>("/api/vendors/me"),

    updateMe: (body: { shopName?: string; description?: string }) =>
      request<{ message: string; vendor: Vendor }>("/api/vendors/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
  },

  // Products
  products: {
    list: (params: {
      search?: string;
      category?: string;
      condition?: ProductCondition;
      page?: number;
      limit?: number;
      sort?: "newest" | "price_asc" | "price_desc";
    } = {}) => {
      const q = new URLSearchParams();
      if (params.search) q.set("search", params.search);
      if (params.category && params.category !== "All")
        q.set("category", params.category);
      if (params.condition) q.set("condition", params.condition);
      if (params.page) q.set("page", params.page.toString());
      if (params.limit) q.set("limit", params.limit.toString());
      if (params.sort) q.set("sort", params.sort);
      const queryStr = q.toString() ? `?${q.toString()}` : "";
      return request<{
        success: boolean;
        data: { products: Product[]; pagination: Pagination };
      }>(`/api/products${queryStr}`);
    },

    get: (productId: string) =>
      request<{ success: boolean; data: { product: Product } }>(
        `/api/products/${productId}`,
      ),

    create: (body: {
      title: string;
      description: string;
      price: number; // pesewas
      category: string;
      condition: ProductCondition;
    }) =>
      request<{ message: string; product: Product }>("/api/products", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    uploadImages: (productId: string, files: File[]) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }
      return request<{ message: string; images: any[] }>(
        `/api/products/${productId}/images`,
        {
          method: "POST",
          body: formData,
        },
      );
    },

    update: (
      productId: string,
      body: Partial<{
        title: string;
        description: string;
        price: number;
        category: string;
        condition: ProductCondition;
      }>,
    ) =>
      request<{ message: string; product: Product }>(
        `/api/products/${productId}`,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
      ),

    delete: (productId: string) =>
      request<{ message: string }>(`/api/products/${productId}`, {
        method: "DELETE",
      }),
  },

  // Orders
  orders: {
    create: (body: {
      productId: string;
      pickupPoint: string;
      meetupAt: string; // ISO string
    }) =>
      request<{ success: boolean; data: { order: Order } }>("/api/orders", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    list: (params: { page?: number; limit?: number } = {}) => {
      const q = new URLSearchParams();
      if (params.page) q.set("page", params.page.toString());
      if (params.limit) q.set("limit", params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : "";
      return request<{
        success: boolean;
        data: { orders: Order[]; pagination: Pagination };
      }>(`/api/orders${queryStr}`);
    },

    get: (orderId: string) =>
      request<{ success: boolean; data: { order: Order } }>(
        `/api/orders/${orderId}`,
      ),

    accept: (orderId: string) =>
      request<{ success: boolean; data: { order: Order } }>(
        `/api/orders/${orderId}/accept`,
        { method: "POST" },
      ),

    confirmMeetup: (orderId: string) =>
      request<{ success: boolean; data: { order: Order } }>(
        `/api/orders/${orderId}/meetup/confirm`,
        { method: "POST" },
      ),

    complete: (orderId: string) =>
      request<{ success: boolean; data: { order: Order } }>(
        `/api/orders/${orderId}/complete`,
        { method: "POST" },
      ),

    cancel: (orderId: string) =>
      request<{ success: boolean; data: { order: Order } }>(
        `/api/orders/${orderId}/cancel`,
        { method: "POST" },
      ),
  },

  // Reviews
  reviews: {
    create: (body: { orderId: string; rating: number; comment: string }) =>
      request<{ success: boolean; data: { review: Review } }>("/api/reviews", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    getVendorSummary: (vendorId: string) =>
      request<{ success: boolean; data: { summary: RatingSummary } }>(
        `/api/reviews/vendors/${vendorId}/summary`,
      ),

    getProductSummary: (productId: string) =>
      request<{ success: boolean; data: { summary: RatingSummary } }>(
        `/api/reviews/products/${productId}/summary`,
      ),

    listVendorReviews: (vendorId: string) =>
      request<{ success: boolean; data: { reviews: Review[] } }>(
        `/api/reviews/vendors/${vendorId}`,
      ),
  },

  // Reports
  reports: {
    create: (body: {
      productId?: string;
      reportedUserId?: string;
      reason: string;
      description: string;
    }) =>
      request<{ success: boolean; data: { report: Report } }>("/api/reports", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    listMy: () =>
      request<{ success: boolean; data: { reports: Report[] } }>(
        "/api/reports/me",
      ),
  },

  // Blocks
  blocks: {
    list: () =>
      request<{ success: boolean; data: { blocks: Block[] } }>("/api/blocks"),

    block: (blockedUserId: string) =>
      request<{ success: boolean; data: { block: Block } }>("/api/blocks", {
        method: "POST",
        body: JSON.stringify({ blockedUserId }),
      }),

    unblock: (userId: string) =>
      request<{ success: boolean; data: { unblocked: boolean } }>(
        `/api/blocks/${userId}`,
        {
          method: "DELETE",
        },
      ),
  },

  // Admin
  admin: {
    getStats: () =>
      request<{ success: boolean; data: AdminStats }>("/api/admin/stats"),

    listUsers: (params: {
      search?: string;
      role?: string;
      emailVerified?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const q = new URLSearchParams();
      if (params.search) q.set("search", params.search);
      if (params.role) q.set("role", params.role);
      if (params.emailVerified) q.set("emailVerified", params.emailVerified);
      if (params.page) q.set("page", params.page.toString());
      if (params.limit) q.set("limit", params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : "";
      return request<{
        success: boolean;
        data: { users: User[]; pagination: Pagination };
      }>(`/api/admin/users${queryStr}`);
    },

    listVendors: (params: {
      status?: "PENDING" | "APPROVED" | "REJECTED";
      page?: number;
      limit?: number;
    } = {}) => {
      const q = new URLSearchParams();
      if (params.status) q.set("status", params.status);
      if (params.page) q.set("page", params.page.toString());
      if (params.limit) q.set("limit", params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : "";
      return request<{
        vendors: Vendor[];
        pagination: Pagination;
      }>(`/api/admin/vendors${queryStr}`);
    },

    approveVendor: (vendorId: string) =>
      request<{ message: string; vendor: Vendor }>(
        `/api/admin/vendors/${vendorId}/approve`,
        { method: "PATCH" },
      ),

    rejectVendor: (vendorId: string) =>
      request<{ message: string; vendor: Vendor }>(
        `/api/admin/vendors/${vendorId}/reject`,
        { method: "PATCH" },
      ),

    listProducts: (params: {
      status?: string;
      category?: string;
      search?: string;
      reportedOnly?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const q = new URLSearchParams();
      if (params.status) q.set("status", params.status);
      if (params.category) q.set("category", params.category);
      if (params.search) q.set("search", params.search);
      if (params.reportedOnly) q.set("reportedOnly", params.reportedOnly);
      if (params.page) q.set("page", params.page.toString());
      if (params.limit) q.set("limit", params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : "";
      return request<{
        success: boolean;
        data: { products: Product[]; pagination: Pagination };
      }>(`/api/admin/products${queryStr}`);
    },

    moderateRemoveProduct: (productId: string) =>
      request<{ success: boolean; data: { product: Product } }>(
        `/api/admin/products/${productId}`,
        { method: "DELETE" },
      ),

    listOrders: (params: { status?: string; page?: number; limit?: number } = {}) => {
      const q = new URLSearchParams();
      if (params.status) q.set("status", params.status);
      if (params.page) q.set("page", params.page.toString());
      if (params.limit) q.set("limit", params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : "";
      return request<{
        success: boolean;
        data: { orders: Order[]; pagination: Pagination };
      }>(`/api/admin/orders${queryStr}`);
    },

    listReports: (params: {
      status?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const q = new URLSearchParams();
      if (params.status) q.set("status", params.status);
      if (params.page) q.set("page", params.page.toString());
      if (params.limit) q.set("limit", params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : "";
      return request<{
        success: boolean;
        data: { reports: Report[]; pagination: Pagination };
      }>(`/api/admin/reports${queryStr}`);
    },

    updateReportStatus: (
      reportId: string,
      status: "REVIEWED" | "RESOLVED" | "DISMISSED",
    ) =>
      request<{ success: boolean; data: { report: Report } }>(
        `/api/admin/reports/${reportId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      ),
  },
};
