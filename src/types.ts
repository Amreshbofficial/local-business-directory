export interface Review {
  id: string;
  username: string;
  rating: number;
  text: string;
  date: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  address: string;
  area: string;
  city: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  image: string;
  website?: string;
  description: string;
  tags: string[];
  features: string[];
  reviews: Review[];
  lat: number; // For clean simple mock coordinate positioning (0-100 grid coords for mock map)
  lng: number;
  verificationStatus: 'verified' | 'premium' | 'none';
  timing: string;
  isClosed?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Lucide icon identifier
  count: number;
  color: string; // Tailwind color accent
}

export interface Enquiry {
  id: string;
  businessId: string;
  businessName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}
