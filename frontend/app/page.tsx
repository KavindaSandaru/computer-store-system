import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImage from "@/components/ProductImage";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { products, error } = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-5xl font-bold text-center mb-10">
        Computer Store
      </h1>

      {error ? (
        <p className="mx-auto max-w-xl rounded-xl bg-white p-6 text-center text-lg text-gray-700 shadow">
          {error}
        </p>
      ) : products.length === 0 ? (
        <p className="mx-auto max-w-xl rounded-xl bg-white p-6 text-center text-lg text-gray-700 shadow">
          No products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:scale-105"
            >
              <Link
                href={`/products/${product._id}`}
                className="block"
              >
                <div className="relative h-60 w-full">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>

                <div className="p-5 pb-0">
                  <h2 className="text-2xl font-semibold">
                    {product.name}
                  </h2>

                  <p className="text-xl text-blue-600 mt-3 font-bold">
                    ${product.price}
                  </p>
                </div>
              </Link>

              <div className="p-5 pt-0">
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
