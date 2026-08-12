// src/types/index.ts

// Import required types
import { ZodSchema } from 'zod';
import { Prisma } from '@prisma/client';

// Define the User type
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'VENDOR' | 'CUSTOMER' | 'AFFILIATE';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Product type
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'GBP' | 'PKR';
  rating: number;
  totalDownloads: number;
  categories: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Order type
export interface Order {
  id: string;
  userId: string;
  productId: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  tax: number;
  geoIpMetadata: {
    ip: string;
    country: string;
    city: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Define the OrderItem type
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the License type
export interface License {
  id: string;
  userId: string;
  productId: string;
  token: string;
  hardwareFingerprint: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the PaymentReceipt type
export interface PaymentReceipt {
  id: string;
  orderId: string;
  paymentMethod: 'BANK_TRANSFER' | 'CITIBANK' | 'BARCLAYS';
  receiptFile: string;
  ocrApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

// Define the AnalyticsLog type
export interface AnalyticsLog {
  id: string;
  ip: string;
  referrer: string;
  path: string;
  duration: number;
  createdAt: Date;
}

// Define the CustomRequest type
export interface CustomRequest {
  id: string;
  userId: string;
  productId: string;
  quote: string;
  aiEvaluation: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the SiteConfig type
export interface SiteConfig {
  id: string;
  theme: 'CYBER_GLASSMORPHISM' | 'DARK_MODE';
  liveBanners: string[];
  dynamicNavigationMutators: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the AutoPipelineLog type
export interface AutoPipelineLog {
  id: string;
  pipelineId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  log: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the AIAdminCommand type
export interface AIAdminCommand {
  id: string;
  command: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the AITrendScraper type
export interface AITrendScraper {
  id: string;
  trend: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Define the AISecurity type
export interface AISecurity {
  id: string;
  encryptionKey: string;
  decryptionKey: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the AIGeoCurrency type
export interface AIGeoCurrency {
  id: string;
  ip: string;
  country: string;
  city: string;
  currency: 'USD' | 'GBP' | 'PKR';
  exchangeRate: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the PaymentPayload type
export interface PaymentPayload {
  orderId: string;
  paymentMethod: 'BANK_TRANSFER' | 'CITIBANK' | 'BARCLAYS';
  amount: number;
  currency: 'USD' | 'GBP' | 'PKR';
}

// Define the AdminCommandSchema type
export interface AdminCommandSchema {
  command: string;
  response: string;
}

// Define the AIROUTER_CONFIG type
export interface AIROUTER_CONFIG {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: {
    [key: string]: string;
  };
  body: {
    [key: string]: string;
  };
}

// Define the DB_MODELS type
export interface DB_MODELS {
  User: User;
  Product: Product;
  Order: Order;
  OrderItem: OrderItem;
  License: License;
  PaymentReceipt: PaymentReceipt;
  AnalyticsLog: AnalyticsLog;
  CustomRequest: CustomRequest;
  SiteConfig: SiteConfig;
  AutoPipelineLog: AutoPipelineLog;
}

// Define the ZodSchemas type
export interface ZodSchemas {
  User: ZodSchema<User>;
  Product: ZodSchema<Product>;
  Order: ZodSchema<Order>;
  OrderItem: ZodSchema<OrderItem>;
  License: ZodSchema<License>;
  PaymentReceipt: ZodSchema<PaymentReceipt>;
  AnalyticsLog: ZodSchema<AnalyticsLog>;
  CustomRequest: ZodSchema<CustomRequest>;
  SiteConfig: ZodSchema<SiteConfig>;
  AutoPipelineLog: ZodSchema<AutoPipelineLog>;
}

// Define the PrismaClient type
export interface PrismaClient {
  User: Prisma.Model<User>;
  Product: Prisma.Model<Product>;
  Order: Prisma.Model<Order>;
  OrderItem: Prisma.Model<OrderItem>;
  License: Prisma.Model<License>;
  PaymentReceipt: Prisma.Model<PaymentReceipt>;
  AnalyticsLog: Prisma.Model<AnalyticsLog>;
  CustomRequest: Prisma.Model<CustomRequest>;
  SiteConfig: Prisma.Model<SiteConfig>;
  AutoPipelineLog: Prisma.Model<AutoPipelineLog>;
}