export interface Owner {
  _id: string;
  name: string;
  email: string;
}

export interface Apartment {
  _id: string;
  name: string;
  address: {
    street: string;
    district: string;
    city: string;
  };
  price: number;
  area: number;
  bedrooms: number;
  images: string[];
  status: 'available' | 'sold' | 'pending';
  featured?: boolean;
  description?: string;
  amenities?: string[];
  contact?: {
    name: string;
    phone: string;
  };
}

export enum Screen {
  Listings,
  Saved,
  Settings,
}

export interface UserInfo {
    name: string;
    email: string;
    phone: string;
}