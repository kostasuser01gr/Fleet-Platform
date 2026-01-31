export interface Partner {
  id: string;
  name: string;
  type: 'supplier' | 'service' | 'parts' | 'maintenance';
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state?: string;
    zipCode?: string;
  };
  rating: number;
  reviewCount: number;
  priceRating: 'low' | 'medium' | 'high';
  distance?: number; // in km
  specialties: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: {
    open: string;
    close: string;
    days: string[];
  };
  isPremium: boolean;
  isOpen: boolean;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface PartnerSearch {
  query: string;
  type?: Partner['type'];
  maxDistance?: number;
  minRating?: number;
  priceRange?: 'low' | 'medium' | 'high';
  location?: { lat: number; lng: number };
  specialties?: string[];
}
