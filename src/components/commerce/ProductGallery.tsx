"use client";

import { useState } from "react";
import { productGallery } from "@/data/catalog";

export function ProductGallery() {
  const [active, setActive] = useState(0);

  return (
    <div className="md:col-span-7 flex flex-col md:flex-row gap-stack-md">
      <div className="flex md:flex-col gap-stack-sm order-2 md:order-1 overflow-x-auto md:overflow-visible">
        {productGallery.slice(1).map((image, index) => (
          <button key={image} onClick={() => setActive(index + 1)} className="shrink-0" aria-label={`Show product image ${index + 1}`}>
            <img alt={`Thumbnail ${index + 1}`} className={`w-[80px] h-[100px] object-cover rounded cursor-pointer ghost-outline transition-opacity duration-300 ${active === index + 1 ? "opacity-100 border-primary" : "opacity-50 hover:opacity-100"}`} src={image} />
          </button>
        ))}
      </div>
      <div className="flex-grow order-1 md:order-2">
        <img alt="Artisan Linen Shirt" className="w-full h-auto aspect-[3/4] object-cover rounded-lg ambient-shadow transition-opacity" src={productGallery[active]} />
      </div>
    </div>
  );
}
