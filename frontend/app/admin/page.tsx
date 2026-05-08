"use client";

import ProductImage from "@/components/ProductImage";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";

const loadProducts = async (): Promise<Product[]> => {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error(`Products API returned ${res.status}`);
  }

  return (await res.json()) as Product[];
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] =
    useState("");
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const refreshProducts = async () => {
    const nextProducts = await loadProducts();
    setProducts(nextProducts);
  };

  useEffect(() => {
    let isMounted = true;

    loadProducts()
      .then((nextProducts) => {
        if (isMounted) {
          setProducts(nextProducts);
        }
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in as an admin first.");
      return;
    }

    const productData = {
      name,
      price: Number(price),
      image,
      description,
    };

    if (editingId) {
      await fetch(
        `/api/products/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(productData),
        }
      );

      setEditingId(null);
    } else {
      await fetch("/api/products", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(productData),
      });
    }

    setName("");
    setPrice("");
    setImage("");
    setDescription("");

    await refreshProducts();
  };

  const editProduct = (product: Product) => {
    setEditingId(product._id);

    setName(product.name);

    setPrice(String(product.price));

    setImage(product.image);

    setDescription(product.description);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white p-10 rounded-2xl shadow">
          
          <h1 className="text-4xl font-bold mb-8">
            Admin Dashboard
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border p-4 rounded-xl"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              className="w-full border p-4 rounded-xl"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border p-4 rounded-xl h-40"
              required
            />

            <button className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >
              <div className="relative h-52 w-full">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>

              <div className="p-5">
                <h2 className="text-2xl font-bold">
                  {product.name}
                </h2>

                <p className="text-blue-600 text-xl mt-2">
                  ${product.price}
                </p>

                <button
                  onClick={() => editProduct(product)}
                  className="mt-5 w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600"
                >
                  Edit Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
