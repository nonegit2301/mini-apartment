

import React, { useState } from 'react';
import { CloseIcon } from '../constants.tsx';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (minPrice: number, maxPrice: number) => void;
  initialMinPrice: number;
  initialMaxPrice: number;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, initialMinPrice, initialMaxPrice }) => {
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  
  if (!isOpen) return null;
  
  const handleApply = () => {
    onApply(minPrice, maxPrice);
    onClose();
  };
  
  const handleReset = () => {
      setMinPrice(0);
      setMaxPrice(0);
      onApply(0, 0);
      onClose();
  };

  const formatCurrency = (value: number) => {
      return value > 0 ? new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ' : 'Bất kỳ';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end" onClick={onClose}>
      <div 
        className="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-6 transform transition-transform duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lọc theo giá</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá từ</label>
            <input 
              type="range" 
              min="0" 
              max="20000000" 
              step="500000" 
              value={minPrice} 
              onChange={e => setMinPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center font-semibold text-primary dark:text-teal-400 mt-2">{formatCurrency(minPrice)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá đến</label>
            <input 
              type="range" 
              min="0" 
              max="20000000" 
              step="500000" 
              value={maxPrice} 
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
             <div className="text-center font-semibold text-primary dark:text-teal-400 mt-2">{formatCurrency(maxPrice)}</div>
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
            <button onClick={handleReset} className="w-full py-3 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold">
                Đặt lại
            </button>
            <button onClick={handleApply} className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold">
                Áp dụng
            </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;