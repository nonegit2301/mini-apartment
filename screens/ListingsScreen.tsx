
import React, { useState, useEffect, useCallback } from 'react';
import type { Apartment } from '../types.ts';
import { getApartments } from '../services/apartmentService.ts';
import ApartmentCard from '../components/ApartmentCard.tsx';
import FilterModal from '../components/FilterModal.tsx';
import Spinner from '../components/Spinner.tsx';
import { SearchIcon, FilterIcon, ChatbotIcon } from '../constants.tsx';
import type { useSavedApartments } from '../hooks/useSavedApartments.ts';
import ChatbotModal from '../components/ChatbotModal.tsx';

interface ListingsScreenProps {
  onSelectApartment: (id: string) => void;
  savedHook: ReturnType<typeof useSavedApartments>;
}

const ListingsScreen: React.FC<ListingsScreenProps> = ({ onSelectApartment, savedHook }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const fetchApartments = useCallback(async () => {
    setLoading(true);
    const filters = {
        address: search,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice > 0 ? maxPrice : undefined,
    };
    const data = await getApartments(filters);
    setApartments(data);
    setLoading(false);
  }, [search, minPrice, maxPrice]);

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchApartments();
    }, 500); // Debounce search input
    return () => clearTimeout(handler);
  }, [fetchApartments]);

  const handleApplyFilter = (newMin: number, newMax: number) => {
    setMinPrice(newMin);
    setMaxPrice(newMax);
  };
  
  const handleApplyChatbotFilters = (filters: { address?: string; minPrice?: number; maxPrice?: number; }) => {
      if (filters.address) setSearch(filters.address);
      if (filters.minPrice) setMinPrice(filters.minPrice);
      if (filters.maxPrice) setMaxPrice(filters.maxPrice === 0 ? 20000000 : filters.maxPrice);
  };

  return (
    <div>
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30 p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tìm Căn Hộ</h1>
        <div className="flex space-x-2">
            <div className="relative flex-grow">
                 <input
                    type="text"
                    placeholder="Tìm theo địa chỉ..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-gray-900 dark:text-white"
                 />
                 <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
            <button
                onClick={() => setIsFilterOpen(true)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                aria-label="Mở bộ lọc"
            >
                <FilterIcon className="w-6 h-6" />
            </button>
        </div>
      </header>
      
      <main className="p-4">
        {loading ? (
          <div className="mt-16">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.length > 0 ? (
                apartments.map(apt => (
                  <ApartmentCard 
                    key={apt.id} 
                    apartment={apt} 
                    onSelect={onSelectApartment}
                    isSaved={savedHook.isSaved(apt.id)}
                    onToggleSave={savedHook.toggleSavedApartment}
                  />
                ))
            ) : (
                <div className="col-span-full text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400">Không tìm thấy căn hộ nào phù hợp.</p>
                </div>
            )}
          </div>
        )}
      </main>

      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
      />
      
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
          <button
              onClick={() => setIsChatbotOpen(true)}
              className="p-4 bg-primary rounded-full text-white shadow-lg hover:bg-primary-dark transition-transform hover:scale-110"
              aria-label="Mở chatbot tư vấn"
          >
              <ChatbotIcon className="w-8 h-8" />
          </button>
      </div>
      
      <ChatbotModal 
          isOpen={isChatbotOpen} 
          onClose={() => setIsChatbotOpen(false)}
          onApplyFilters={handleApplyChatbotFilters}
      />

    </div>
  );
};

export default ListingsScreen;