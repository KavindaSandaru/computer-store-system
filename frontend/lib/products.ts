export type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

type ProductsResult = {
  products: Product[];
  error: string | null;
};

type ProductResult =
  | {
      product: Product;
      status: "ready";
    }
  | {
      product: null;
      status: "not-found" | "unavailable";
    };

const INTERNAL_API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL || "http://nginx";

const fetchFromApi = async (path: string) => {
  return fetch(`${INTERNAL_API_BASE_URL}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
};

export async function getProducts(): Promise<ProductsResult> {
  try {
    const res = await fetchFromApi("/api/products");

    if (!res.ok) {
      throw new Error(`Products API returned ${res.status}`);
    }

    const products = (await res.json()) as Product[];

    return {
      products,
      error: null,
    };
  } catch (error) {
    console.error("Failed to load products:", error);

    return {
      products: [],
      error: "Products are unavailable right now.",
    };
  }
}

export async function getProduct(id: string): Promise<ProductResult> {
  try {
    const res = await fetchFromApi(`/api/products/${id}`);

    if (res.status === 400 || res.status === 404) {
      return {
        product: null,
        status: "not-found",
      };
    }

    if (!res.ok) {
      throw new Error(`Product API returned ${res.status}`);
    }

    const product = (await res.json()) as Product;

    return {
      product,
      status: "ready",
    };
  } catch (error) {
    console.error("Failed to load product:", error);

    return {
      product: null,
      status: "unavailable",
    };
  }
}
