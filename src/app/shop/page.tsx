"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import Newsletter from '../../components/Newsletter';


type Product = {
  id: string;
  name: string;
  price: number;
  imageFront: string;
  imageBack: string;
};

const products: Product[] = [
  {
    id: "70x7-tee",
    name: "Seventy Times Seven Tee",
    price: 59.99,
    imageFront: "/products/70x7-front.png",
    imageBack: "/products/70x7-back.png",
  },
  {
    id: "eva-tha-shirt",
    name: "Eva Tha Shirt",
    price: 44.99,
    imageFront: "/products/eva-tha-front.png",
    imageBack: "/products/eva-tha-back.png",
  },
  {
    id: "gold-jacket",
    name: "Gold Jacket",
    price: 109.99,
    imageFront: "/products/gold-jacket-front.png",
    imageBack: "/products/gold-jacket-back.png",
  },
  {
    id: "eva-tha-white",
    name: "Eva Tha White Shirt",
    price: 44.99,
    imageFront: "/products/eva-tha-white-front.png",
    imageBack: "/products/eva-tha-white-back.png",
  },
];

export default function ShopPage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center tracking-tight">Shop</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-20">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 group hover:shadow-lg transition-all duration-300 bg-white"
          >
            <Link href={`/shop/${product.id}`} className="block">
              <div className="relative w-full h-80 overflow-hidden rounded-lg mb-4">
                <img
                  src={product.imageFront}
                  alt={`${product.name} Front`}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                <img
                  src={product.imageBack}
                  alt={`${product.name} Back`}
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </Link>

            <div className="text-center">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-700 text-sm mb-4">${product.price}</p>

              <Link href={`/shop/${product.id}`}>
                <span className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition cursor-pointer">
                  View Item
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    
      <Newsletter />

      {/* Social Links */}
      <div className="text-center mb-12">
        <h3 className="text-lg font-semibold text-black mb-2">Join the community!!</h3>
        <div className="flex justify-center gap-6 text-black text-2xl">
          <a
            href="https://www.instagram.com/evangelicalthreads"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-gray-600 transition" />
          </a>
          <a
            href="https://www.tiktok.com/@evangelicalthreads"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok className="hover:text-gray-600 transition" />
          </a>
        </div>
      </div>
    </main>
  );
}
