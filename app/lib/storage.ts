export interface BuyRuleItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  addedAt: number;
  waitDurationMs: number;
  expiresAt: number;
  status: 'waiting' | 'saved' | 'bought';
  decisionMadeAt?: number;
}

export interface StorageData {
  items: BuyRuleItem[];
}

const STORAGE_KEY = 'buy-rule-data';

export const WAIT_PRESETS = {
  '24h': 24 * 60 * 60 * 1000,
  '48h': 48 * 60 * 60 * 1000,
  '72h': 72 * 60 * 60 * 1000,
  '1wk': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

export function loadData(): StorageData {
  if (typeof window === 'undefined') {
    return { items: [] };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  
  return { items: [] };
}

export function saveData(data: StorageData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export function createItem(data: {
  name: string;
  price: number;
  imageUrl?: string;
  waitDurationMs: number;
}): BuyRuleItem {
  const now = Date.now();
  
  return {
    id: `item-${now}`,
    name: data.name,
    price: data.price,
    imageUrl: data.imageUrl,
    addedAt: now,
    waitDurationMs: data.waitDurationMs,
    expiresAt: now + data.waitDurationMs,
    status: 'waiting',
  };
}

export function formatTimeRemaining(expiresAt: number): string {
  const now = Date.now();
  const remaining = expiresAt - now;
  
  if (remaining <= 0) {
    return 'Time expired';
  }
  
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
