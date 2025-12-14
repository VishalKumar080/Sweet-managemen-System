export interface User {
  id: string;
  name: string;
  email: string;
  role: "User" | "Admin";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  sweets: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
