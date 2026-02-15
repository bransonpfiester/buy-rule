'use client';

import { useState, useEffect } from 'react';
import SavingsCard from './components/SavingsCard';
import ProductGrid from './components/ProductGrid';
import AddItemModal from './components/AddItemModal';
import { BuyRuleItem, loadData, saveData } from './lib/storage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'waiting' | 'saved'>('waiting');
  const [items, setItems] = useState<BuyRuleItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const data = loadData();
    setItems(data.items);
  }, []);

  const waitingItems = items.filter(item => item.status === 'waiting');
  const savedItems = items.filter(item => item.status === 'saved');
  
  const totalSaved = savedItems.reduce((sum, item) => sum + item.price, 0);
  const totalAvoided = savedItems.length;

  const handleAddItem = (item: BuyRuleItem) => {
    const updatedItems = [...items, item];
    setItems(updatedItems);
    saveData({ items: updatedItems });
    setShowModal(false);
  };

  const handleItemAction = (itemId: string, action: 'still-want' | 'skip' | 'bought') => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        if (action === 'still-want') {
          // Reset timer
          const newExpiresAt = Date.now() + item.waitDurationMs;
          return { ...item, expiresAt: newExpiresAt };
        } else if (action === 'skip') {
          return { ...item, status: 'saved' as const, decisionMadeAt: Date.now() };
        } else if (action === 'bought') {
          return { ...item, status: 'bought' as const, decisionMadeAt: Date.now() };
        }
      }
      return item;
    });
    
    setItems(updatedItems);
    saveData({ items: updatedItems });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">48-Hour Buy Rule</h1>
          <p className="text-gray-600 mt-1">Beat impulse purchases, save money 💰</p>
        </header>

        {/* Savings Card */}
        <SavingsCard 
          totalSaved={totalSaved}
          itemsAvoided={totalAvoided}
          totalItems={items.length}
        />

        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-gray-200 mb-6 mt-8">
          <button
            onClick={() => setActiveTab('waiting')}
            className={`flex-1 py-3 font-medium text-lg transition-colors relative ${
              activeTab === 'waiting'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Waiting ({waitingItems.length})
            {activeTab === 'waiting' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 font-medium text-lg transition-colors relative ${
              activeTab === 'saved'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Saved ({savedItems.length})
            {activeTab === 'saved' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
        </div>

        {/* Product Grid */}
        <ProductGrid
          items={activeTab === 'waiting' ? waitingItems : savedItems}
          onItemAction={handleItemAction}
        />

        {/* Floating Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center text-3xl z-50"
          aria-label="Add new item"
        >
          +
        </button>

        {/* Add Item Modal */}
        {showModal && (
          <AddItemModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddItem}
          />
        )}
      </div>
    </div>
  );
}
