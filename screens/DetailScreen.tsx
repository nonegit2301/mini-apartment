
import React, { useState, useEffect } from 'react';
import type { Apartment } from '../types.ts';
import { getApartmentById } from '../services/apartmentService.ts';
import Spinner from '../components/Spinner.tsx';
import { BackIcon, HeartIcon, ChatbotIcon } from '../constants.tsx';
import type { useSavedApartments } from '../hooks/useSavedApartments.ts';
import ChatModal from '../components/ChatModal.tsx';

interface DetailScreenProps {
  apartmentId: string;
  onBack: () => void;
  savedHook: ReturnType<typeof useSavedApartments>;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ apartmentId, onBack, savedHook }) => {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getApartmentById(apartmentId);
      setApartment(data || null);
      setLoading(false);
    };
    fetchDetails();
  }, [apartmentId]);
  
  const isSaved = apartment ? savedHook.isSaved(apartment.id) : false;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Apartment not found</h2>
        <button onClick={onBack} className="px-4 py-2 bg-primary text-white rounded-lg">Go Back</button>
      </div>
    );
  }

  const isRented = apartment.status === 'rented';
  const images = apartment.images;

  return (
    <div className="pb-24">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex justify-between items-center p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
        <button onClick={onBack} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          <BackIcon className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <button onClick={() => savedHook.toggleSavedApartment(apartment.id)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-red-500">
          <HeartIcon filled={isSaved} className="w-6 h-6" />
        </button>
      </header>

      {/* Image Carousel */}
      <div className="relative w-full h-72">
        <img src={images[currentImageIndex]} alt="Apartment view" className="w-full h-full object-cover" />
        {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
                <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Go to image ${index + 1}`}
                />
            ))}
            </div>
        )}
      </div>

      {/* Content */}
      <main className="p-5">
        <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{apartment.name}</h1>
            <span className={`flex-shrink-0 mt-1 px-3 py-1.5 text-sm font-bold text-white rounded-full ${isRented ? 'bg-gray-500' : 'bg-green-500'}`}>
              {isRented ? 'Rented' : 'Available'}
            </span>
        </div>
        <p className="text-md text-gray-600 dark:text-gray-400 mt-2">{`${apartment.address.street}, ${apartment.address.district}, ${apartment.address.city}`}</p>

        <p className="text-4xl font-extrabold text-primary-light dark:text-teal-400 my-5">
          {formatPrice(apartment.price)} / month
        </p>

        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-5 flex justify-around">
            <div className="text-center">
                <p className="font-bold text-lg text-gray-800 dark:text-white">{apartment.bedrooms}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
            </div>
             <div className="text-center">
                <p className="font-bold text-lg text-gray-800 dark:text-white">{apartment.area} m²</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
            </div>
        </div>

        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {apartment.description}
          </p>
        </section>

        {apartment.amenities && apartment.amenities.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {apartment.amenities.map((item, index) => (
                <span key={index} className="bg-secondary dark:bg-teal-900/50 text-primary-dark dark:text-teal-300 text-sm font-semibold px-3 py-1.5 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}
        
        {apartment.contact && (
            <section className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Contact Information</h2>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-white">Name: {apartment.contact.name}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">Phone: {apartment.contact.phone}</p>
                </div>
            </section>
        )}
      </main>

      {/* Floating Action Button */}
      {!isRented && (
        <div className="fixed bottom-4 right-4 z-20 md:hidden">
          <button 
              onClick={() => setIsChatOpen(true)}
              className="p-4 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700 transition-transform hover:scale-110"
              aria-label="Chat to inquire"
          >
            <ChatbotIcon className="w-8 h-8" />
          </button>
        </div>
      )}

      {!isRented && <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} apartment={apartment} />}
    </div>
  );
};

export default DetailScreen;