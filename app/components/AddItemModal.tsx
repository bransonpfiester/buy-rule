'use client';

import { useState } from 'react';
import { BuyRuleItem, createItem, WAIT_PRESETS } from '../lib/storage';

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (item: BuyRuleItem) => void;
}

type WaitPreset = keyof typeof WAIT_PRESETS;

export default function AddItemModal({ onClose, onAdd }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [waitTime, setWaitTime] = useState<WaitPreset>('48h');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price) return;

    const item = createItem({
      name,
      price: parseFloat(price),
      imageUrl: imageUrl || undefined,
      waitDurationMs: WAIT_PRESETS[waitTime],
    });

    onAdd(item);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Wireless Headphones"
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-gray-900"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299.99"
                required
                className="w-full pl-8 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image URL (optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-gray-900"
            />
          </div>

          {/* Wait Time Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wait Time
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(WAIT_PRESETS) as WaitPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWaitTime(preset)}
                  className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                    waitTime === preset
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
