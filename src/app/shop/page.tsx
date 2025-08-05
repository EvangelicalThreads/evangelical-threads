"use client";

import Link from "next/link";
import Image from "next/image";
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
    imageFront: "/products/70x7-back.png",
    imageBack: "/products/70x7-front.png",
  },
  {
    id: "eva-tha-shirt",
    name: "Eva Tha Shirt",
    price: 44.99,
    imageFront: "/products/eva-tha-front.png",
    imageBack: "/products/eva-tha-back.png",
  },
  {
    id: "blue-shirt",
    name: "Blue Shirt",
    price: 49.99,
    imageFront: "/products/blue-shirt-front.png",
    imageBack: "/products/blue-shirt-back.png",
  },
];

export default function ShopPage() {
  const availableProductIds = ["70x7-tee", "eva-tha-shirt", "blue-shirt"];
  const availableProducts = products.filter(product =>
    availableProductIds.includes(product.id)
  );

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center tracking-tight">Shop</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-20">
        {availableProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 group hover:shadow-lg transition-all duration-300 bg-white"
          >
            <Link href={`/shop/${product.id}`} className="block">
              <div
                className={`relative w-full h-80 rounded-lg mb-4 p-4 bg-white border border-gray-200 ${
                  product.id === "blue-shirt" ? "" : "overflow-hidden"
                }`}
              >
                <Image
                  src={product.imageFront}
                  alt={`${product.name} Front`}
                  layout="fill"
                  objectFit="cover"
                  className={`transition-opacity duration-300 group-hover:opacity-0 rounded-lg ${
                    product.id === "blue-shirt" ? "scale-80" : ""
                  }`}
                  style={{ transformOrigin: "center" }}
                />
                <Image
                  src={product.imageBack}
                  alt={`${product.name} Back`}
                  layout="fill"
                  objectFit="cover"
                  className={`opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-lg ${
                    product.id === "blue-shirt" ? "scale-80" : ""
                  }`}
                  style={{ transformOrigin: "center" }}
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
