"use client";

import React from "react";
import { CartProvider } from "../context/CartContext";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return <CartProvider>{children}</CartProvider>;
}
