"use client";

const marketItems = [
  { id: 1, name: "Computer Vision", price: 1200, stock: 50 },
  { id: 2, name: "Automation technology", price: 2400, stock: 30 },
  { id: 3, name: "AI Systems", price: 800, stock: 120 },
  { id: 4, name: "Data Centers", price: 600, stock: 75 },
];

const inventoryItems = [
  { id: 1, name: "Computer Vision", qty: 10, currentPrice: 1200 },
  { id: 2, name: "Automation technology", qty: 5, currentPrice: 2400 },
  { id: 3, name: "AI Systems", qty: 20, currentPrice: 800 },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[rgb(10,15,24)] text-white p-6">

      {/* PAGE TITLE */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">
          BID2BUILD MARKETPLACE
        </h1>
      </div>

      {/* TIMER */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-900 border border-slate-700 rounded-xl px-12 py-6 shadow-xl">
          <h2 className="text-lg font-semibold text-center mb-2">
            TIMER
          </h2>

          <div className="text-3xl font-bold text-cyan-400 text-center">
            10:00
          </div>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ITEM LIST */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-700">

          <div className="flex justify-center mb-8">
            <div className="bg-cyan-500 px-8 py-2 rounded-lg">
              <h2 className="font-semibold">
                ITEM LIST
              </h2>
            </div>
          </div>

          <div className="space-y-5">

            {marketItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div>
                  <span className="font-medium">
                    {item.name}
                  </span>

                  <span className="text-slate-300 ml-3">
                    ₹{item.price} | Stock Left: {item.stock}
                  </span>
                </div>

                <button
                  className="
                    border border-cyan-500
                    hover:bg-cyan-500
                    px-6
                    py-2
                    rounded-lg
                    font-semibold
                    transition 
                    duration-300 ease-out
                  "
                >
                  BUY
                </button>
              </div>
            ))}

          </div>
        </div>

        {/* TEAM INVENTORY */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-700">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-cyan-400">
              TEAM 001
            </h2>

            <div className="flex justify-center mt-2">
              <div className="bg-cyan-500 px-8 py-2 rounded-lg">
                TEAM INVENTORY
              </div>
            </div>
          </div>

          <div className="space-y-5">

            {inventoryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div>
                  <span className="font-medium">
                    {item.name}
                  </span>

                  <span className="text-slate-300 ml-3">
                    Qty: {item.qty} | Current Price: ₹{item.currentPrice}
                  </span>
                </div>

                <button
                  className="
                    border border-red-500
                    hover:bg-red-500
                    px-6
                    py-2
                    rounded-lg
                    font-semibold
                    transition
                    duration-300 ease-out
                  "
                >
                  SELL
                </button>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
}