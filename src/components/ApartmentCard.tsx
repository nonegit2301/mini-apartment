
import React from 'react';
import type { Apartment } from '../types.ts';
import { BedIcon, AreaIcon, HeartIcon } from '../constants.tsx';

interface ApartmentCardProps {
  apartment: Apartment;
  onSelect: (id: string) => void;
  isSaved: boolean;
  onToggleSave: (id:string) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onSelect, isSaved, onToggleSave }) => {
  const formatPrice = (price: number) => {
    return `${(price / 1000000).toFixed(1).replace('.0', '')}M/month`;
  };
  
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event when saving
    onToggleSave(apartment.id);
  }

  const isRented = apartment.status === 'rented';

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ${isRented ? 'opacity-60' : 'cursor-pointer'}`}
      onClick={() => !isRented && onSelect(apartment.id)}
    >
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={apartment.images[0]}
          alt={apartment.name}
        />
        <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white rounded-full ${isRented ? 'bg-gray-500' : 'bg-green-500'}`}>
          {isRented ? 'Rented' : 'Available'}
        </div>
        <button 
          onClick={handleSaveClick}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-white transition-colors"
          aria-label={isSaved ? 'Unsave' : 'Save'}
        >
          <HeartIcon filled={isSaved} className="w-6 h-6" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{apartment.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{`${apartment.address.district}, ${apartment.address.city}`}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-extrabold text-primary-light dark:text-teal-400">
            {formatPrice(apartment.price)}
          </p>
          <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <BedIcon className="w-5 h-5" />
              <span>{apartment.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-1">
              <AreaIcon className="w-5 h-5" />
              <span>{apartment.area}m²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;