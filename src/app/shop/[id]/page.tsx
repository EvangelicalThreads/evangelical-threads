"use client";

import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import Image from "next/image";

const products = [
  {
    id: "70x7-tee",
    name: "Seventy Times Seven Tee",
    price: 59.99,
    description:
      "Inspired by Matthew 18:22, this tee reminds us that forgiveness is a daily decision. Soft cotton with a minimalist white design on the front and a graphic design on the back.",
    imageFront: "/products/70x7-front.png",
    imageBack: "/products/70x7-back.png",
  },
  {
    id: "eva-tha-shirt",
    name: "Eva-Tha Shirt",
    price: 44.99,
    description:
      "Featuring the EVA crown honoring the first woman and the THA symbol, from ancient Hebrew, meaning store. This design celebrates divine identity and sacred purpose.",
    imageFront: "/products/eva-tha-front.png",
    imageBack: "/products/eva-tha-back.png",
  },
  {
    id: "gold-jacket",
    name: "Gold Jacket",
    price: 109.99,
    description:
      "Premium black jacket with gold-stitched Evangelical Threads logo. Warm, stylish, and deeply symbolic.",
    imageFront: "/products/gold-jacket-front.png",
    imageBack: "/products/gold-jacket-back.png",
  },
  {
    id: "eva-tha-white",
    name: "Eva-Tha White Shirt",
    price: 44.99,
    description:
      "The white version of our signature design — clean, minimal, and powerful. Featuring The EVA crown honoring the first woman and the THA symbol, from ancient Hebrew, meaning store.",
    imageFront: "/products/eva-tha-white-front.png",
    imageBack: "/products/eva-tha-white-back.png",
  },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<"front" | "back">("front");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) {
    return <div className="text-center p-10 text-red-500">Product not found</div>;
  }

  const sizes = ["S", "M", "L", "XL"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    addToCart({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} - ${selectedSize}`,
      price: product.price,
      image: product.imageFront,
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          <Image
            src={selectedImage === "front" ? product.imageFront : product.imageBack}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto rounded-lg object-contain"
          />

          <div className="flex space-x-4 mt-4 justify-center">
            <button
              className={`px-4 py-2 rounded border transition ${
                selectedImage === "front" ? "bg-black text-white" : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setSelectedImage("front")}
            >
              Front
            </button>
            <button
              className={`px-4 py-2 rounded border transition ${
                selectedImage === "back" ? "bg-black text-white" : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setSelectedImage("back")}
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
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert("Size chart coming soon...")}
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
  <a
    href="/shop"
    className="inline-block px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
  >
    View More Products
  </a>
</div>

    </main>
  );
}
