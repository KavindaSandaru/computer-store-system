"use client";

import ProductImage from "@/components/ProductImage";
import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          "/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = (await res.json()) as
          | Order[]
          | { message?: string };

        if (!res.ok) {
          throw new Error(
            "message" in data && data.message
              ? data.message
              : "Failed to load orders."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid orders response.");
        }

        if (isMounted) {
          setOrders(data);
          setError(null);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load orders."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-5xl font-bold mb-10">
          My Orders
        </h1>

        {isLoading ? (
          <p className="rounded-2xl bg-white p-8 text-lg text-gray-700 shadow">
            Loading orders...
          </p>
        ) : error ? (
          <p className="rounded-2xl bg-white p-8 text-lg text-red-600 shadow">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-lg text-gray-700 shadow">
            You have not placed any orders yet.
          </p>
        ) : (
        <div className="space-y-8">
          
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-8 rounded-2xl shadow"
            >
              <div className="flex justify-between items-center mb-6">
                
                <div>
                  <h2 className="text-2xl font-bold">
                    Order ID
                  </h2>

                  <p className="text-gray-600">
                    {order._id}
                  </p>
                </div>

                <div>
                  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-semibold">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                
                {order.items.map(
                  (item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-5 border-b pb-5"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          sizes="6rem"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold">
                          {item.name}
                        </h3>

                        <p className="text-gray-600 mt-2">
                          Quantity:{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <div className="text-blue-600 text-xl font-bold">
                        $
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 flex justify-between items-center">
                
                <div className="text-gray-600">
                  Ordered on{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </div>

                <div className="text-3xl font-bold">
                  Total: $
                  {order.totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </main>
  );
}
