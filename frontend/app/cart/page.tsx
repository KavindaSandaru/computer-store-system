"use client";

import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
  } = useCart();

  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] =
    useState(false);
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,

    0
  );

  const checkout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first");

      router.push("/login");

      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items: cartItems.map((item) => ({
              productId: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            })),
            totalPrice,
          }),
        }
      );

      const data = (await res
        .json()
        .catch(() => ({}))) as {
        message?: string;
      };

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to place order."
        );
      }

      clearCart();
      alert("Order placed successfully!");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to place order."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-5xl font-bold mb-10">
          Shopping Cart
        </h1>

        <div className="space-y-6">
          
          {cartItems.length === 0 ? (
            <p className="rounded-2xl bg-white p-8 text-lg text-gray-700 shadow">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-2xl shadow flex items-center gap-5"
              >
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    sizes="8rem"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {item.name}
                  </h2>

                  <p className="text-lg text-gray-600 mt-2">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-xl text-blue-600 mt-2 font-bold">
                    $
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                  className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 bg-white p-8 rounded-2xl shadow">
          
          <h2 className="text-3xl font-bold">
            Total: ${totalPrice.toFixed(2)}
          </h2>

          <button
            type="button"
            onClick={checkout}
            disabled={
              cartItems.length === 0 || isCheckingOut
            }
            className="mt-5 w-full rounded-2xl bg-black py-4 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isCheckingOut
              ? "Placing Order..."
              : "Place Order"}
          </button>
        </div>
      </div>
    </main>
  );
}
