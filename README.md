# 48-Hour Buy Rule 💰

Beat impulse purchases and save money with the 48-hour waiting rule. Add items you want to buy, wait, and see if you still want them later!

## Features

⏰ **Live Countdown Timers**
- Real-time countdowns for each item
- Visual indicators (red < 1h, amber < 24h)
- Configurable wait times (24h, 48h, 72h, 1 week, 30 days)

💵 **Savings Tracking**
- Circular progress indicator showing avoided purchases
- Total money saved displayed prominently
- Count of items successfully avoided
- Green gradient savings card

🛍️ **Product Management**
- Add items with name, price, and optional image URL
- "Waiting" tab for active timers
- "Saved" tab for successfully avoided purchases
- Action buttons when timer expires (Still Want / Skip)

🎨 **Beautiful UI**
- Clean white/light gray background
- 2-column mobile, 3-column desktop grid
- Floating + button for quick adds
- Smooth animations and transitions
- Product cards with square images

💾 **Local Storage**
- All data persists in browser localStorage
- No backend required
- Completely private

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **localStorage** for data persistence

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## How It Works

1. **Add Item**: Click the + button and enter product details
2. **Choose Wait Time**: Select from preset durations (default 48h)
3. **Wait**: Watch the countdown timer tick down
4. **Decide**: When timer expires, choose "Skip" (save money!) or "Still Want" (extends timer)
5. **Track Progress**: See your total savings and avoided purchases grow

## The Psychology

The 48-hour rule helps you:
- **Reduce impulse buying**: Forced waiting period creates space for reflection
- **Make conscious decisions**: Time reveals whether you truly need/want the item
- **Gamify savings**: Visual progress makes saving money rewarding
- **Break shopping habits**: Creates friction in the purchase process

## Design Inspiration

Inspired by:
- Shopping wishlist apps (Wish, Keep)
- Budget tracker savings cards
- Pinterest-style product grids
- Gamification principles

## Wait Time Presets

- **24h**: Quick check for smaller purchases
- **48h**: The classic rule (recommended)
- **72h**: Extended waiting for bigger decisions
- **1 week**: For significant purchases
- **30 days**: For major financial decisions

## License

MIT

---

Built with 💚 by [Branson Pfiester](https://github.com/bransonpfiester)
