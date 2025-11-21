
import type { Apartment } from '../types.ts';

// const API_URL = 'http://localhost:5000/api/apartments';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/apartments`;

interface FilterParams {
    address?: string;
    minPrice?: number;
    maxPrice?: number;
}

export const getApartments = async (filters: FilterParams): Promise<Apartment[]> => {
    const params = new URLSearchParams();
    if (filters.address) params.append('address', filters.address);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // The backend uses _id, so we map it to id for frontend compatibility
        return data.map((apt: any) => ({ ...apt, id: apt._id }));
    } catch (error) {
        console.error("Failed to fetch apartments:", error);
        return [];
    }
};

export const getApartmentById = async (id: string): Promise<Apartment | undefined> => {
     try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return { ...data, id: data._id };
    } catch (error) {
        console.error(`Failed to fetch apartment ${id}:`, error);
        return undefined;
    }
};

export const getApartmentsByIds = async (ids: string[]): Promise<Apartment[]> => {
    if (ids.length === 0) return [];
    // This is a simple implementation. A real-world app might have a dedicated endpoint like /api/apartments/batch
    try {
        const apartments = await Promise.all(ids.map(id => getApartmentById(id)));
        return apartments.filter((apt): apt is Apartment => apt !== undefined);
    } catch (error) {
        console.error("Failed to fetch apartments by IDs:", error);
        return [];
    }
};
