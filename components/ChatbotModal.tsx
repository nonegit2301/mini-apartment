
import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, SendIcon } from '../constants.tsx';
import { getChatbotResponse, ChatbotResponse } from '../services/geminiService.ts';
import Spinner from './Spinner.tsx';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { address?: string; minPrice?: number; maxPrice?: number; }) => void;
}

type Message = {
    role: 'user' | 'model';
    text: string;
    filters?: ChatbotResponse['filters'];
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setIsLoading(true);
            // Initial greeting
            setTimeout(() => {
                setMessages([{ role: 'model', text: 'Xin chào! Tôi có thể giúp bạn tìm căn hộ như thế nào? (Vd: tìm nhà ở Quận 1 dưới 10 triệu)' }]);
                setIsLoading(false);
            }, 500);
        }
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    if (!isOpen) return null;

    const handleSend = async () => {
        if (inputText.trim() === '' || isLoading) return;
        
        const newUserMessage: Message = { role: 'user', text: inputText };
        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');
        setIsLoading(true);

        const historyForApi = messages.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
        
        const chatbotResponse = await getChatbotResponse(historyForApi, inputText);

        const newModelMessage: Message = { role: 'model', text: chatbotResponse.response, filters: chatbotResponse.filters };
        setMessages(prev => [...prev, newModelMessage]);
        setIsLoading(false);
    };
    
    const handleApply = (filters: ChatbotResponse['filters']) => {
        if (!filters) return;
        onApplyFilters(filters);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="w-full max-w-lg h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trợ lý tìm nhà</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-lg'}`}>
                                    {msg.text}
                                </div>
                            </div>
                            {msg.role === 'model' && msg.filters && (
                                <div className="flex justify-start mt-2">
                                    <button
                                      onClick={() => handleApply(msg.filters)}
                                      className="px-4 py-2 bg-secondary dark:bg-teal-900/50 text-primary-dark dark:text-teal-300 font-semibold rounded-lg hover:opacity-80 transition-opacity"
                                    >
                                      Áp dụng bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && <div className="flex justify-start"><div className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700"><Spinner /></div></div>}
                    <div ref={chatEndRef} />
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Nhập yêu cầu của bạn..."
                            className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-dark text-gray-900 dark:text-white"
                        />
                        <button onClick={handleSend} className="p-3 bg-primary rounded-full text-white hover:bg-primary-dark transition-colors disabled:opacity-50" disabled={isLoading}>
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotModal;