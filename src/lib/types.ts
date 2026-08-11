export type UserRole = "ADMIN" | "CUSTOMER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  address: string | null;
  phone: string | null;
  status: UserStatus;
  role: UserRole;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string | null;
  isDeleted: boolean;
  products?: Product[];
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  categoryId: string;
  isDeleted: boolean;
  category?: Pick<Category, "id" | "name">;
  reviews?: Review[];
  _count?: { reviews: number };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  isDeleted: boolean;
  items: OrderItem[];
  user?: Pick<User, "id" | "name" | "email">;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  productId: string;
  userId: string;
  isDeleted: boolean;
  user?: Pick<User, "id" | "name" | "image">;
  product?: Pick<Product, "id" | "name">;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Pick<
    User,
    "id" | "name" | "email" | "status" | "role" | "image" | "address" | "phone"
  >;
}

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T | null;
};
