import ProductCard from './ProductCard';
import { BuyRuleItem } from '../lib/storage';

interface ProductGridProps {
  items: BuyRuleItem[];
  onItemAction: (itemId: string, action: 'still-want' | 'skip' | 'bought') => void;
}

export default function ProductGrid({ items, onItemAction }: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No items yet</p>
        <p className="text-gray-400 mt-2">Click the + button to add your first item</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map(item => (
        <ProductCard
          key={item.id}
          item={item}
          onAction={onItemAction}
        />
      ))}
    </div>
  );
}
