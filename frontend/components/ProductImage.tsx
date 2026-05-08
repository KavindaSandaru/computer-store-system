import Image from "next/image";

const fallbackImage = "/window.svg";

export default function ProductImage({
  src,
  alt,
  sizes,
  className = "object-cover",
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <Image
      src={src || fallbackImage}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      unoptimized
    />
  );
}
