'use client';

import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const products = [
  {
    id: 'gods-world',
    name: "God's World Tee",
    price: 38.0,
description: `The God’s World Tee is a statement of faith, purpose, and identity. Rooted in the idea that everything moves under a greater design, this piece reflects a mindset of trust, discipline, and direction.

Crafted from premium cotton, the tee offers a structured yet comfortable fit that holds its shape over time. The weight, feel, and finish are built to elevate everyday wear without sacrificing durability`,    

    imageFront: '/products/gods-world-front.jpeg',
    imageBack: '/products/gods-world-back.png',
    flatLayFront: '/products/flatlay-front.png',
    flatLayBack: '/products/flatlay-back.png',
    modelFront: '/products/model-front.png',
    modelBack: '/products/model-back.png',
  },
];

// Only this product is available
const availableProductIds = ['gods-world'];

export default function ProductPage() {
  const params = useParams();
  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : '';

  const product = availableProductIds.includes(id)
    ? products.find((p) => p.id === id)
    : undefined;

  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<
    'front' | 'back' | 'flatFront' | 'flatBack' | 'modelFront' | 'modelBack'
  >('front');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizeCharts: Record<string, { size: string; width: string; length: string }[]> = {
    'gods-world': [
      { size: 'S', width: '18 1/2', length: '27 1/2' },
      { size: 'M', width: '20 1/2', length: '29' },
      { size: 'L', width: '22 1/4', length: '30 1/4' },
      { size: 'XL', width: '24', length: '32' },
      { size: '2XL', width: '25 1/4', length: '33 3/4' },
    ],
  };

  const [showSizeChart, setShowSizeChart] = useState(false);

  if (!product) {
    return <div className="p-10 text-center text-red-500">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
     image: product.imageBack,
      quantity: 1,
      size: selectedSize,
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Product Images */}
        <div className="w-full">
          <Image
            src={
              selectedImage === 'front'
                ? product.imageFront
                : selectedImage === 'back'
                ? product.imageBack
                : selectedImage === 'modelFront'
                ? product.modelFront
                : selectedImage === 'modelBack'
                ? product.modelBack
                : selectedImage === 'flatFront'
                ? product.flatLayFront
                : product.flatLayBack
            }
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto rounded-lg object-contain"
          />

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <button
              className={`px-4 py-2 rounded border transition ${
                selectedImage === 'front' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedImage('front')}
            >
              Front
            </button>

            <button
              className={`px-4 py-2 rounded border transition ${
                selectedImage === 'back' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedImage('back')}
            >
              Back
            </button>

            <button
              className={`px-4 py-2 rounded border transition ${
                selectedImage === 'modelFront' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedImage('modelFront')}
            >
              Model Front
            </button>

            <button
              className={`px-4 py-2 rounded border transition ${
                selectedImage === 'modelBack' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedImage('modelBack')}
            >
              Model Back
            </button>

            <button
              className={`px-4 py-2 rounded border transition ${
                selectedImage === 'flatFront' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedImage('flatFront')}
            >
              Flat Lay Front
            </button>

            <button
              className={`px-4 py-2 rounded border transition ${
                selectedImage === 'flatBack' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedImage('flatBack')}
            >
              Flat Lay Back
            </button>
          </div>
        </div>
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-4">${product.price}</p>
         <p className="text-gray-600 mb-6 whitespace-pre-line leading-relaxed">
  {product.description}

  <p className="text-xs text-gray-500 mt-6 mb-6 tracking-wide">
  LIMITED FIRST DROP — NO RESTOCKS ONCE SOLD OUT
</p>
</p>

          {/* Size Selector */}
          <div className="mb-4">
            <p className="mb-2 font-semibold">Select Size:</p>
            <div className="flex gap-2 flex-wrap">
              {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* View Size Chart */}
          <button
            onClick={() => setShowSizeChart(true)}
            className="text-sm underline text-gray-600 mb-6 block hover:text-black"
          >
            View Size Chart
          </button>

          {showSizeChart && sizeCharts[product.id] && (
            <div className="fixed inset-0 bg-[rgba(255,255,255,0.6)] backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white/90 border border-[#D4AF37]/30 rounded-2xl p-6 w-[90%] max-w-lg shadow-xl relative animate-fadeIn">
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
                >
                  ×
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-center text-[#D4AF37]">
                  Size Chart
                </h2>

                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 text-left">Size</th>
                      <th className="p-2 text-left">Body Width (in)</th>
                      <th className="p-2 text-left">Body Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCharts[product.id].map((row, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="p-2 font-medium">{row.size}</td>
                        <td className="p-2">{row.width}</td>
                        <td className="p-2">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Measurements can vary within 2.5cm (within tolerance)
                </p>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-3 rounded hover:opacity-90 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Back to Shop */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-block px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
        >
          View More Products
        </Link>
      </div>
    </main>
  );
}