"use client";

export default function ShopList({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-gray-900 text-white p-4 rounded-lg shadow hover:bg-gray-800"
        >
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-32 object-cover rounded"
          />

          <h2 className="mt-2 text-lg font-semibold">{p.name}</h2>
          <p className="text-yellow-400">৳ {p.sellPrice}</p>

          <button className="mt-3 bg-blue-600 w-full py-1 rounded">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}