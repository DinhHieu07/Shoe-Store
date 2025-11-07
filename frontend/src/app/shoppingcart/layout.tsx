'use client';
import { CartProvider } from '@/context/CartContext';

export default function ShoppingCartLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
