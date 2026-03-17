'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageFront: string;
  imageBack: string;
  flatLayFront: string;
  flatLayBack: string;
  modelFront: string;
  modelBack: string;
}

interface Props {
  product: Product;
}

const sizes = ['S', 'M', 'L', 'XL'];

export default function ProductDetailsClient({ product }: Props) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<
    'front' | 'back' | 'flatFront' | 'flatBack' | 'modelFront' | 'modelBack'
  >('front');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageFront,
      quantity: 1,
      size: selectedSize,
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 items-start">
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

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-4">
            <p className="mb-2 font-semibold">Select Size:</p>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
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

          <button
            onClick={() => alert('Size chart coming soon...')}
            className="text-sm underline text-gray-600 mb-6 block hover:text-black"
          >
            View Size Chart
          </button>

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