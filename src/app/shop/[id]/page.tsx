'use client';

import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const products = [
  {
    id: '70x7-tee',
    name: 'Seventy Times Seven Tee',
    price: 59.99,
    description:
      'Inspired by Matthew 18:22, this tee reminds us that forgiveness is a daily decision. Soft cotton with a minimalist white design on the front and a graphic design on the back.',
    imageFront: '/products/70x7-front.png',
    imageBack: '/products/70x7-back.png',
  },
  {
    id: 'eva-tha-shirt',
    name: 'Eva Tha Shirt',
    price: 44.99,
    description:
      'Featuring the EVA crown honoring the first woman and the THA symbol, from ancient Hebrew, meaning store. This design celebrates divine identity and sacred purpose.',
    imageFront: '/products/eva-tha-front.png',
    imageBack: '/products/eva-tha-back.png',
  },
  {
    id: 'gold-jacket',
    name: 'Gold Jacket',
    price: 109.99,
    description:
      'Premium black jacket with gold-stitched Evangelical Threads logo. Warm, stylish, and deeply symbolic.',
    imageFront: '/products/gold-jacket-front.png',
    imageBack: '/products/gold-jacket-back.png',
  },
  {
    id: 'eva-tha-white',
    name: 'Eva Tha White Shirt',
    price: 44.99,
    description:
      'The white version of our signature design — clean, minimal, and powerful. Featuring The EVA crown honoring the first woman and the THA symbol, from ancient Hebrew, meaning store.',
    imageFront: '/products/eva-tha-white-front.png',
    imageBack: '/products/eva-tha-white-back.png',
  },
  {
    id: 'blue-shirt',
    name: 'Blue Shirt',
    price: 49.99,
    description:
      'Our classic blue shirt with a clean, bold design. High-quality fabric ensures comfort and style for everyday wear.',
    imageFront: '/products/blue-shirt-front.png',
    imageBack: '/products/blue-shirt-back.png',
  },
  {  
  id: 'pink-shirt',
  name: 'Pink Shirt',
  price: 49.99,
  description: 'Our classic pink cropped shirt with a clean, bold design. High-quality fabric ensures comfort and style for everyday wear.',
  imageFront: '/products/pink-shirt-front.png',
  imageBack: '/products/pink-shirt-back.png',
  },
];

// Only these 2 products are available for purchase/view
const availableProductIds = ['pink-shirt', 'blue-shirt'];

export default function ProductPage() {
  const params = useParams();
  const id =
    typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  // Only find products if available
  const product = availableProductIds.includes(id) ? products.find((p) => p.id === id) : undefined;
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizeCharts: Record<string, { size: string; width: string; length: string }[]> = {
  'pink-shirt': [
    { size: 'XSM', width: '18-3/4', length: '17-3/4' },
    { size: 'SML', width: '19-3/4', length: '18-1/2' },
    { size: 'MED', width: '20-3/4', length: '19' },
    { size: 'LRG', width: '21-3/4', length: '19-1/3' },
    { size: 'XLG', width: '22-2/3', length: '19-3/4' },
    { size: '2XL', width: '23-2/3', length: '20' },
  ],
  'blue-shirt': [
    { size: 'SML', width: '20-1/2', length: '26-1/4' },
    { size: 'MED', width: '22', length: '27-1/4' },
    { size: 'LRG', width: '23-1/2', length: '28-1/4' },
    { size: 'XLG', width: '25', length: '29-1/4' },
    { size: '2XL', width: '26-3/4', length: '30-1/4' },
    { size: '3XL', width: '28-1/4', length: '31-1/4' },
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
      image: product[selectedImage === 'front' ? 'imageFront' : 'imageBack'],
      quantity: 1,
      size: selectedSize,
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          <Image
            src={selectedImage === 'front' ? product.imageFront : product.imageBack}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto rounded-lg object-contain"
          />

          <div className="flex space-x-4 mt-4 justify-center">
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
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-4">
            <p className="mb-2 font-semibold">Select Size:</p>
            <div className="flex gap-2 flex-wrap">
              {['S', 'M', 'L', 'XL'].map((size) => (
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

         {/* View Size Chart Button */}
<button
  onClick={() => setShowSizeChart(true)}
  className="text-sm underline text-gray-600 mb-6 block hover:text-black"
>
  View Size Chart
</button>

{/* Popup Modal */}
{showSizeChart && sizeCharts[product.id] && (
  <div className="fixed inset-0 bg-[rgba(255,255,255,0.6)] backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white/90 border border-[#D4AF37]/30 rounded-2xl p-6 w-[90%] max-w-lg shadow-xl relative animate-fadeIn">
      <button
        onClick={() => setShowSizeChart(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
      >
        ×
      </button>

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


          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-3 rounded hover:opacity-90 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

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
