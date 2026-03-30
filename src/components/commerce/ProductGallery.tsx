"use client";

import { useState } from "react";
import type { ProductImage } from "@/features/catalog/product.types";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [active, setActive] = useState(0);
  const sortedImages = [...images].sort((left, right) => left.position - right.position);
  const activeImage = sortedImages[active] ?? sortedImages[0];

  return (
    <div className="md:col-span-7 flex flex-col md:flex-row gap-stack-md">
      {sortedImages.length > 1 ? <div className="flex md:flex-col gap-stack-sm order-2 md:order-1 overflow-x-auto md:overflow-visible">
        {sortedImages.map((image, index) => (
          <button key={`${image.url}-${image.position}`} onClick={() => setActive(index)} className="shrink-0" aria-label={`Ver imagen ${index + 1} de ${productName}`} type="button">
            <img alt={image.alt} className={`w-[80px] h-[100px] object-cover rounded cursor-pointer ghost-outline transition-opacity duration-300 ${active === index ? "opacity-100 border-primary" : "opacity-50 hover:opacity-100"}`} src={image.url} />
          </button>
        ))}
      </div> : null}
      <div className="flex-grow order-1 md:order-2">
        <img alt={activeImage.alt} className="w-full h-auto aspect-[3/4] object-cover rounded-lg ambient-shadow transition-opacity" src={activeImage.url} />
      </div>
    </div>
  );
}
