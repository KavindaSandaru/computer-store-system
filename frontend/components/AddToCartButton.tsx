"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";

export default function AddToCartButton({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="mt-5 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
    >
      Add to Cart
    </button>
  );
}
