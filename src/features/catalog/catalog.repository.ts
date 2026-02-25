import { products } from "@/data/catalog";

export async function listFeaturedProducts() {
  return products.slice(0, 3);
}

export async function listLinenProducts() {
  return products.filter((product) => product.category === "Linen");
}

export async function getArtisanLinenShirt() {
  return {
    name: "Artisan Linen Shirt",
    price: 145,
    description:
      "Crafted from ethically sourced, 100% organic linen. This piece is designed for fluid movement and breathless comfort, embodying a quiet luxury that transitions effortlessly through seasons.",
  };
}
