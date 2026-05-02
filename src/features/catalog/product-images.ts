import type { ProductImage } from "@/features/catalog/product.types";

export function sortProductImages(images: ProductImage[]) {
  return [...images].sort((left, right) => left.position - right.position);
}

export function getImagesForColor(images: ProductImage[], color?: string) {
  const sortedImages = sortProductImages(images);

  if (!color) return sortedImages;

  const colorSpecificImages = sortedImages.filter((image) => image.color?.toLowerCase() === color.toLowerCase());
  if (colorSpecificImages.length > 0) return colorSpecificImages;

  const genericImages = sortedImages.filter((image) => !image.color);
  return genericImages.length > 0 ? genericImages : sortedImages;
}

export function getPrimaryImageForColor(images: ProductImage[], color?: string) {
  return getImagesForColor(images, color)[0] ?? images[0] ?? null;
}
