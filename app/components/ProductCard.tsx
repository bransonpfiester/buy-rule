'use client';

import { useState, useEffect } from 'react';
import { BuyRuleItem, formatTimeRemaining } from '../lib/storage';

interface ProductCardProps {
  item: BuyRuleItem;
  onAction: (itemId: string, action: 'still-want' | 'skip' | 'bought') => void;
}

export default function ProductCard({ item, onAction }: ProductCardProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (item.status !== 'waiting') return;

    const updateTimer = () => {
      const remaining = item.expiresAt - Date.now();
      setIsExpired(remaining <= 0);
      setTimeRemaining(formatTimeRemaining(item.expiresAt));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [item.expiresAt, item.status]);

  const getTimerColor = () => {
    const remaining = item.expiresAt - Date.now();
    const hours = remaining / (60 * 60 * 1000);
    
    if (hours < 1) return 'text-red-600';
    if (hours < 24) return 'text-amber-600';
    return 'text-gray-600';
  };

  if (item.status === 'saved') {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm relative">
        {/* Image */}
        <div className="aspect-square bg-gray-100 relative">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2">
            ✓
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${item.price.toFixed(2)} saved
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Avoided {Math.floor((Date.now() - (item.decisionMadeAt || item.addedAt)) / (24 * 60 * 60 * 1000))} days ago
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {isExpired && (
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          ${item.price.toFixed(2)}
        </p>

        {isExpired ? (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => onAction(item.id, 'skip')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => onAction(item.id, 'still-want')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition-colors"
            >
              Still Want
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <div className={`flex items-center gap-1 ${getTimerColor()} font-mono text-sm`}>
              <span>⏰</span>
              <span>{timeRemaining}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">remaining</div>
          </div>
        )}
      </div>
    </div>
  );
}
