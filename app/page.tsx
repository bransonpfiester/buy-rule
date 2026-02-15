"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ItemStatus = "waiting" | "saved";

type Item = {
  id: string;
  name: string;
  price: number;
  createdAt: number;
  waitHours: number;
  status: ItemStatus;
};

const STORAGE_KEY = "buy-rule-items";
const WAIT_HOURS = 48;

function formatCountdown(ms: number): string {
  if (ms <= 0) {
    return "Waiting period complete";
  }

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const d = String(days).padStart(2, "0");
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  return `${d}d ${h}h ${m}m ${s}s`;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [tab, setTab] = useState<ItemStatus>("waiting");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [now, setNow] = useState(Date.now());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Item[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const savingsTotal = useMemo(() => {
    return items
      .filter((item) => item.status === "saved")
      .reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  const visibleItems = useMemo(() => {
    return items
      .filter((item) => item.status === tab)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [items, tab]);

  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const parsedPrice = Number.parseFloat(price);

    if (!trimmedName || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return;
    }

    const newItem: Item = {
      id: crypto.randomUUID(),
      name: trimmedName,
      price: parsedPrice,
      createdAt: Date.now(),
      waitHours: WAIT_HOURS,
      status: "waiting",
    };

    setItems((prev) => [newItem, ...prev]);
    setName("");
    setPrice("");
  };

  const markSaved = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "saved" } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-8">
      <section className="mx-auto w-full max-w-4xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Impulse Buy Blocker</h1>
          <p className="text-sm text-slate-600">Wait before buying. Keep what you save.</p>
        </header>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total Saved</p>
          <p className="mt-1 text-2xl font-semibold text-[#10B981]">${savingsTotal.toFixed(2)}</p>
        </div>

        <form onSubmit={addItem} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto]">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Item name"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            <button
              type="submit"
              className="rounded-md bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"
            >
              Add
            </button>
          </div>
        </form>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("waiting")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              tab === "waiting" ? "bg-[#3B82F6] text-white" : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            Waiting
          </button>
          <button
            type="button"
            onClick={() => setTab("saved")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              tab === "saved" ? "bg-[#3B82F6] text-white" : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            Saved
          </button>
        </div>

        {visibleItems.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No items in this tab.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleItems.map((item) => {
              const endsAt = item.createdAt + item.waitHours * 60 * 60 * 1000;
              const remaining = endsAt - now;

              return (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-900">{item.name}</h2>
                    <p className="text-sm text-slate-600">${item.price.toFixed(2)}</p>

                    {item.status === "waiting" ? (
                      <p className="text-sm text-slate-600">Time left: {formatCountdown(remaining)}</p>
                    ) : (
                      <p className="text-sm text-[#10B981]">Saved</p>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {item.status === "waiting" && (
                      <button
                        type="button"
                        onClick={() => markSaved(item.id)}
                        className="rounded-md bg-[#3B82F6] px-3 py-2 text-sm font-medium text-white"
                      >
                        Mark Saved
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
