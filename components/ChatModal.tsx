

import React, { useState, useEffect, useRef } from 'react';
import type { Apartment } from '../types.ts';
import { CloseIcon, SendIcon } from '../constants.tsx';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: Apartment;
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'agent';
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, apartment }) => {
    const contactName = apartment.contact?.name || 'Manager';
    const initialMessage = `Hi ${contactName}, I'm interested in the ${apartment.name} apartment. Could you provide more information about the rent, deposit, and viewing times?`;
    
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: initialMessage, sender: 'user' }
    ]);
    const [inputText, setInputText] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);
    
    if (!isOpen) return null;

    const handleSend = () => {
        if (inputText.trim() === '') return;
        const newUserMessage: Message = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');

        // Simulate agent response
        setTimeout(() => {
            const agentResponse: Message = { id: Date.now() + 1, text: "Thank you for your interest. We will get back to you as soon as possible.", sender: 'agent' };
            setMessages(prev => [...prev, agentResponse]);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="w-full max-w-lg h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chat with {contactName}</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-lg'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        />
                        <button onClick={handleSend} className="p-3 bg-primary rounded-full text-white hover:bg-primary-dark transition-colors">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;