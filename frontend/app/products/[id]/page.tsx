import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImage from "@/components/ProductImage";
import { getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProduct(id);

  if (result.status === "not-found") {
    notFound();
  }

  if (result.status === "unavailable") {
    return (
      <main className="min-h-screen bg-gray-100 p-10">
        <div className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow">
          <p className="text-lg text-gray-700">
            Product details are unavailable right now.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const product = result.product;

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        <div className="relative min-h-[24rem] md:min-h-full">
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="p-10">
          <h1 className="text-5xl font-bold">
            {product.name}
          </h1>

          <p className="text-3xl text-blue-600 mt-5 font-bold">
            ${product.price}
          </p>

          <p className="mt-6 text-gray-700 text-lg">
            {product.description}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
