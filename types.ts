
export interface Photo {
  id: string;
  originalUrl: string;
  enhancedUrl: string; // If processing, might be same or placeholder
  name: string;
  date: string;
  status: 'processing' | 'completed';
  description?: string;
  rating?: number;
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  cpf?: string; // Added CPF
  phone?: string; // Added Phone
  plan: 'Avançado' | string; // Keeps string for backward compatibility with DB but logically favors Avançado
  credits: number; // Mapped to credits_used in logic, or remaining credits
  maxCredits: number;
  totalEnhanced: number;
  monthlyGrowth: number;
  joinDate: string;
}

export enum View {
  Dashboard = 'dashboard',
  Photos = 'photos',
  Plan = 'plan',
  Profile = 'profile',
  Editor = 'editor', 
  Generator = 'generator',
  PaymentMethods = 'paymentMethods',
  Admin = 'admin',
}

export enum BackgroundOption {
  Original = 'original',
  White = 'white',
  Dark = 'dark',
  Custom = 'custom',
}