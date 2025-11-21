
import React, { useState, useEffect } from 'react';
import { BackIcon } from '../constants.tsx';
import type { UserInfo } from '../types.ts';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  userInfo: UserInfo;
  saveUserInfo: (info: UserInfo) => Promise<void>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onLogout, userInfo, saveUserInfo }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    if (userInfo) {
        setName(userInfo.name);
        setEmail(userInfo.email);
        setPhone(userInfo.phone);
    }
  }, [userInfo]);

  const handleSave = async () => {
    await saveUserInfo({ name, email, phone });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
  };
  
  return (
    <div>
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30 p-4 shadow-sm flex items-center">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden">
            <BackIcon className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông Tin Người Dùng</h1>
      </header>
      
      <main className="p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ và Tên</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Nguyễn Văn A"
            />
          </div>
           <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              disabled
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              placeholder="email@example.com"
            />
          </div>
           <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="0901234567"
            />
          </div>
          <div className="space-y-4">
            <button onClick={handleSave} className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold">
              Lưu thay đổi
            </button>
            <button onClick={onLogout} className="w-full py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">
              Đăng xuất
            </button>
          </div>
          {showSuccess && (
            <div className="text-center text-green-600 dark:text-green-400 font-medium">
              Đã lưu thông tin thành công!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;
