'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';

interface SizeChartRow {
  size: string;
  width: string;
  length: string;
}

interface Stock {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
  oneSize: number;
}

interface ProductImage {
  url: string;
  label: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  stock: Stock;
  category: string;
  // Apparel fixed slots
  imageFront?: string;
  imageBack?: string;
  modelFront?: string;
  modelBack?: string;
  flatLayFront?: string;
  flatLayBack?: string;
  // Non-apparel flexible array
  images?: ProductImage[];
  sizeChart: SizeChartRow[];
}

type ApparelView = 'imageFront' | 'imageBack' | 'modelFront' | 'modelBack' | 'flatLayFront' | 'flatLayBack';

const apparelViews: { key: ApparelView; label: string }[] = [
  { key: 'imageFront', label: 'Front' },
  { key: 'imageBack', label: 'Back' },
  { key: 'modelFront', label: 'Model Front' },
  { key: 'modelBack', label: 'Model Back' },
  { key: 'flatLayFront', label: 'Flat Lay Front' },
  { key: 'flatLayBack', label: 'Flat Lay Back' },
];

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedView, setSelectedView] = useState<ApparelView>('imageFront');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const isApparel = product.category === 'apparel';
  const sizeKeys: (keyof Stock)[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const isSizeAvailable = (size: keyof Stock) => product.stock?.[size] > 0;

  // For apparel use fixed slots, for others use flexible array
  const currentImage = isApparel
    ? product[selectedView] || ''
    : product.images?.[selectedIndex]?.url || '';

  // Only show buttons for slots that actually have an image
  const availableApparelViews = apparelViews.filter(({ key }) => !!product[key]);

  const handleAddToCart = () => {
    if (isApparel && !selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: isApparel ? (product.imageFront || '') : (product.images?.[0]?.url || ''),
      quantity: 1,
      size: selectedSize || undefined,
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          {currentImage && (
            <Image
              src={currentImage}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-auto rounded-lg object-contain"
            />
          )}

          {/* Apparel image buttons */}
          {isApparel && availableApparelViews.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {availableApparelViews.map(({ key, label }) => (
                <button
                  key={key}
                  className={`px-4 py-2 rounded border transition ${
                    selectedView === key ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedView(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Non-apparel image buttons */}
          {!isApparel && product.images && product.images.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded border transition ${
                    selectedIndex === i ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedIndex(i)}
                >
                  {img.label || `Image ${i + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-4">${product.price}</p>
          <p className="text-gray-600 mb-2 whitespace-pre-line leading-relaxed">{product.description}</p>
          <p className="text-xs text-gray-500 mt-4 mb-6 tracking-wide">
            LIMITED FIRST DROP — NO RESTOCKS ONCE SOLD OUT
          </p>

          {isApparel && (
            <div className="mb-4">
              <p className="mb-2 font-semibold">Select Size:</p>
              <div className="flex gap-2 flex-wrap">
                {sizeKeys.map((size) => {
                  const available = isSizeAvailable(size);
                  return (
                    <button
                      key={size}
                      disabled={!available}
                      className={`px-4 py-2 border rounded ${
                        !available
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          : selectedSize === size
                          ? 'bg-black text-white'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                      onClick={() => available && setSelectedSize(size)}
                    >
                      {size === 'XXL' ? '2XL' : size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {product.sizeChart?.length > 0 && (
            <button
              onClick={() => setShowSizeChart(true)}
              className="text-sm underline text-gray-600 mb-6 block hover:text-black"
            >
              View Size Chart
            </button>
          )}

          {showSizeChart && product.sizeChart?.length > 0 && (
            <div className="fixed inset-0 bg-[rgba(255,255,255,0.6)] backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white/90 border border-[#D4AF37]/30 rounded-2xl p-6 w-[90%] max-w-lg shadow-xl relative">
                <button onClick={() => setShowSizeChart(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold">×</button>
                <h2 className="text-2xl font-semibold mb-4 text-center text-[#D4AF37]">Size Chart</h2>
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 text-left">Size</th>
                      <th className="p-2 text-left">Body Width (in)</th>
                      <th className="p-2 text-left">Body Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.map((row, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="p-2 font-medium">{row.size}</td>
                        <td className="p-2">{row.width}</td>
                        <td className="p-2">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 mt-3 text-center">Measurements can vary within 2.5cm</p>
              </div>
            </div>
          )}

          <button
            onClick={product.soldOut ? undefined : handleAddToCart}
            disabled={product.soldOut}
            className={`px-6 py-3 rounded transition ${
              product.soldOut
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:opacity-90'
            }`}
          >
            {product.soldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop" className="inline-block px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md">
          View More Products
        </Link>
      </div>
    </main>
  );
}