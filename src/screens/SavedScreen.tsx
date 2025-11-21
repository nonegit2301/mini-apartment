
import React, { useState, useEffect } from 'react';
import type { Apartment } from '../types.ts';
import { getApartmentsByIds } from '../services/apartmentService.ts';
import ApartmentCard from '../components/ApartmentCard.tsx';
import Spinner from '../components/Spinner.tsx';
import { HeartIcon, BackIcon } from '../constants.tsx';
import type { useSavedApartments } from '../hooks/useSavedApartments.ts';

interface SavedScreenProps {
  onSelectApartment: (id: string) => void;
  savedHook: ReturnType<typeof useSavedApartments>;
  onBack: () => void;
}

const SavedScreen: React.FC<SavedScreenProps> = ({ onSelectApartment, savedHook, onBack }) => {
  const { savedIds, isSaved, toggleSavedApartment } = savedHook;
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedApartments = async () => {
        if (savedIds.length > 0) {
            setLoading(true);
            try {
                const data = await getApartmentsByIds(savedIds);
                setApartments(data);
            } catch (error) {
                console.error("Failed to fetch saved apartments:", error);
                setApartments([]);
            } finally {
                setLoading(false);
            }
        } else {
            setApartments([]);
            setLoading(false);
        }
    };
    
    fetchSavedApartments();
  }, [savedIds]);

  return (
    <div>
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30 p-4 shadow-sm flex items-center">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden">
            <BackIcon className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Căn Hộ Đã Lưu</h1>
      </header>

      <main className="p-4">
        {loading ? (
          <div className="mt-16">
            <Spinner />
          </div>
        ) : apartments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map(apt => (
              <ApartmentCard
                key={apt.id}
                apartment={apt}
                onSelect={onSelectApartment}
                isSaved={isSaved(apt.id)}
                onToggleSave={toggleSavedApartment}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-[60vh]">
            <HeartIcon filled={false} className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Bạn chưa lưu căn hộ nào</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Hãy tìm kiếm và lưu lại nhé!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedScreen;
