import type { Product } from "@/features/catalog/product.types";

export type { Product } from "@/features/catalog/product.types";

const catalogTimestamp = "2026-06-12T00:00:00.000Z";

function product(input: {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  material: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  badge?: string;
  category: string;
  image: string;
  colors?: string[];
  images?: Product["images"];
  sizes?: string[];
}): Product {
  return {
    ...input,
    colors: input.colors ?? [input.color],
    sizes: input.sizes ?? ["XS", "S", "M", "L", "XL"],
    images: input.images ?? [{ url: input.image, alt: input.displayName, position: 0 }],
    status: "active",
    createdAt: catalogTimestamp,
    updatedAt: catalogTimestamp,
  };
}

export const products: Product[] = [
  product({ id: "oatmeal-knit", slug: "oatmeal-knit-sweater", name: "Oatmeal Knit Sweater", displayName: "Sweater tejido avena", description: "Sweater de algodón orgánico con textura suave para uso diario.", material: "100% algodón orgánico", color: "Oat", price: 185, compareAtPrice: 220, stock: 18, badge: "Nuevo", category: "Abrigos", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiOyZM2J1ULAHxuxU-UMOdUlTghJyvuHwOrIwmTg4z1bhbD08cQIqn9h98xB7-L42AUZyuj_ls6HV8GIMYGAVHlz7VESXHaB5MQlf19gYUgEHwnnhM5ZjEudGvlnEjlTWhJN7HdtHp4ChNFQa_oBmNhjjGqA8ap4EcUtvCF1TMXzIUCFJRdk9vWM_j8gSQfKiT-iKitS7zIr15fOGWiytXoJ9YCh070SQvekkNIn2Eral0cngHSFJpBeFdJe2oIwly3QOEf3GMK4h4" }),
  product({ id: "classic-linen", slug: "artisan-linen-shirt", name: "Classic Linen Shirt", displayName: "Camisa de lino artesanal", description: "Camisa de lino europeo, liviana y respirable para temporadas cálidas.", material: "Lino europeo", color: "Sand", colors: ["Sand", "Off-White"], price: 140, stock: 24, category: "Camisas", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2S6qUq16B1qGPx74voz18Wulmyqqybvl-fZ58Qos6mIJgTAhkiAVlE9NR6tmdL6XxmppYz4znZaVRMnzo9RLwE77bts6RwNzzcQ-tzbRUpELW9sGlcb0gI9fgPeyAMoi1pacYChLKeD-mgli2swVUlQvQNUH4J3-IXGBdo9izcVSQEi3xCZ_GpJlp38TFVnDOwNC5UEXGa2dBU2GdKsuFHg0b8T3po4R7B1msR3qdDFbZTfLIeXWCzJCbAT_b15dyQJsAq4B0z7pv", images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2S6qUq16B1qGPx74voz18Wulmyqqybvl-fZ58Qos6mIJgTAhkiAVlE9NR6tmdL6XxmppYz4znZaVRMnzo9RLwE77bts6RwNzzcQ-tzbRUpELW9sGlcb0gI9fgPeyAMoi1pacYChLKeD-mgli2swVUlQvQNUH4J3-IXGBdo9izcVSQEi3xCZ_GpJlp38TFVnDOwNC5UEXGa2dBU2GdKsuFHg0b8T3po4R7B1msR3qdDFbZTfLIeXWCzJCbAT_b15dyQJsAq4B0z7pv", alt: "Camisa de lino artesanal en arena", position: 0, color: "Sand" }, { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYosaipP_PqAiLeinmIl0q97k8Z1MK5w69JCLeL2NhjIrsTmxe0QT_IB_Mc-wHmGiuqh6jQYls9liqPgx0VwUhJyGxJAgnT89HI1rxMzKStGRRWhtimQFPbonJqeI5j6UatinLfkTB4vguupsup0xm3b5NKlA-FSCuqJLKDcuLz_9kA8lJR5IzfMdPw56YYun23_wm-tjDKLnTb8XlbReqrSvV94GzkbjjHIZoczlFGQiBd2Gu8IrhzQ75JhDSbjS2SCrTsW9Cu72w", alt: "Camisa de lino artesanal en blanco roto", position: 1, color: "Off-White" }, { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb2EOSJmHuPoZ6GKEQIDvgyyjS7xfuLGlrsaiwbmGbvBUZjEWQ05EJgbgWevVGViPkcLREfq6DWG0Mua86mrkXyoMwPhIuh6YowJ2aVTFwHOH7eN4aFexP34qZ0BBpg1BejrgT_9OQOiovhU4fbsY8D_BqqJ_BUnMbfFrdqoWAT_jvNEm6Q_ObNdf94GKXftROB5FAk_ZhLiIjl6PUVOVTGb2TAzD8BgJam1N4FkkBjrOEUL7pYPkpHnrtvdh-J0z-qDKpurgVfw9v", alt: "Detalle general de camisa de lino artesanal", position: 2 }] }),
  product({ id: "fluid-trouser", slug: "fluid-drape-trouser", name: "Fluid Drape Trouser", displayName: "Pantalón fluido", description: "Pantalón de caída amplia en mezcla de lyocell para movimiento natural.", material: "Mezcla de lyocell Tencel", color: "Sage", price: 165, compareAtPrice: 198, stock: 16, category: "Pantalones", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYZxs1RKzAIhWLrIGRMp4fBXdh_OCWzwF_zhne2uXe-u0YPoXcfdYTrX9Ixl5KwhJQ1rSMo8tDQGSCE3qNZyiBj8WI1XhH7vrjGLt3-_8npnYfDXdSOMC2zAZea5PDheh_XJp30u18wlSK7fN5GeIPl4OPlkpsc3tEgRs2EyphyCmYySj6UiWXl-oQjPKQTgorIq62e2C39nax17DOUHINRHQ-LGGFBFsRUAM58KG_yPCUluMIrinkjBS8WGwy7qTbZPc7WWt9K59Y" }),
  product({ id: "essential-linen", slug: "essential-linen-shirt", name: "The Essential Linen Shirt", displayName: "Camisa esencial de lino", description: "Camisa esencial de lino en tono arena, pensada para combinar todos los días.", material: "Lino", color: "Sand", price: 125, stock: 20, category: "Camisas", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVrzGhhOAswDUCUB4oPAn2CxodcEXTyO6n6O_Fvx11W59bbz5_P0k9HnrhIGC9AWloSC4fSlhRkr-kru3HoUVPoT44Q0oHsrq_C9gjWlnfUgf5rgLBvd5yMeTEeLXjzQYXrCW3pVTlaXpyHuH3xxO3V6_uV6EPDTCeMr_F2UjZYMiH_cOwQVS5qBVNWmsFG5Ix5rehoZhu4pGkxI-Pr22h3-zLj8yvLGgyrne5matkTx3RUzr6ly8e_dT7NzYbNtdpW6yO938BxVmu" }),
  product({ id: "wide-leg-trouser", slug: "relaxed-wide-leg-trouser", name: "Relaxed Wide-Leg Trouser", displayName: "Pantalón amplio relajado", description: "Pantalón de lino con pierna amplia y calce relajado.", material: "Lino", color: "Sage", price: 145, stock: 14, category: "Pantalones", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeDDK6NSVi-yl_-hndlbV46hAK47PLqJzmlZjnI55jkuOh1P2INFTMqHpVlsH7meLkyu3sGam9trHaOu-7q4RQwH1U1LC8HiC3I83Cp9dOPfIlwjCs_eIrTXwVyqDG3dZ2rgO3H5osYNQUADOcKMfm-jtsXKdpIIihABXiR0ccZH0HKXyNGsBHYu1Ga02y2ZyemjoSLpgIkanUGKTO8dfdBeQ5NZnrDEHEj7K04N535oAhSYx9df-138Uj_O7nSfBa-5eH4aDSlfIN" }),
  product({ id: "midi-dress", slug: "draped-linen-midi-dress", name: "Draped Linen Midi Dress", displayName: "Vestido midi de lino drapeado", description: "Vestido midi de lino con drapeado suave y silueta atemporal.", material: "Lino", color: "Off-White", price: 195, compareAtPrice: 240, stock: 9, badge: "Más vendido", category: "Vestidos", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYosaipP_PqAiLeinmIl0q97k8Z1MK5w69JCLeL2NhjIrsTmxe0QT_IB_Mc-wHmGiuqh6jQYls9liqPgx0VwUhJyGxJAgnT89HI1rxMzKStGRRWhtimQFPbonJqeI5j6UatinLfkTB4vguupsup0xm3b5NKlA-FSCuqJLKDcuLz_9kA8lJR5IzfMdPw56YYun23_wm-tjDKLnTb8XlbReqrSvV94GzkbjjHIZoczlFGQiBd2Gu8IrhzQ75JhDSbjS2SCrTsW9Cu72w" }),
  product({ id: "linen-blazer", slug: "everyday-linen-blazer", name: "Everyday Linen Blazer", displayName: "Blazer de lino diario", description: "Blazer de lino estructurado para elevar conjuntos cotidianos.", material: "Lino", color: "Beige", price: 210, stock: 11, category: "Abrigos", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0tkNHdtiPxtI0QRweIMhE9mZCRmeBH7hg2NoFXKNrDqKwM5ENCYoeVyaWpoB6SnHSpitc-2gdGrFZJVwjx4yoAdLUq0_dBd5js69HIT9sMBmHd_ID2nSBfJ00YrSOjJVVYbbFaM1pqqR2vbAHY2NMw_ogi1dRR6N8pkXimskjT2ERLalxnbr36XA7HKSHIHpP_Gd2DssD3ycVOlnpSqqniGFGVwayXlN68HKECjU7U6y5-LVvXXS-0zItO2UP4OtfMqXsx88_Xhri" }),
];

const productSlugs = new Set(products.map((item) => item.slug));

if (productSlugs.size !== products.length) {
  throw new Error("Product slugs must be unique.");
}

export const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDuV6wCu7VT8DHWR5jYka53IA_7Mn-gwRJ221Iwtt9T_vR_TFAYQuV0BsoMIQcjsv_3It2hSHDWvBVM8erWnjLV8kVqnBo_-0uKPMPwxC-UFIM_-4SdgUKK7-I6kT4XzhJ5_EvgdRJEvTokcnsOOk1h0Q1xcv3I4yy1kOPy8geUrMwD4cJpurmYXHiH3pKrHygayOP2_y8iup7IUB4ZoUBHxbvyTv-vbVx34f3U_xbqLOeS1OitIe2HWxMhKB3Apl9pccRTD3qLFR3R";

export const valueImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBLJXX12wV3SBJNIkibwvVS9PzPsFxAz4mKdB5sTABxLuVDp4oSYjEYimqwkQDrOKJNIz9c_xkkZraOEV4CG3sddvoWdbbS8Kop0p5lfSXOprpQ4dqzg5tEQtqblDd5vqLUCdptwSXUThFeEe-3jYmGEGYRoKtNlgkHPfTeUHKysI1YemVmggCj0sy5xTgybp0KysewNrIc6QXVfoaYbuM_523WHPVymQ0x_Llf50B62ggl78G8iZEWQlquudNh5w5C-fbmZFoSYeF5";

export const productGallery = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCA861OoIJjuikhqKv0Og5hSmJM9V1H_WKxEhD96yAQ8Pxs4wl5sc82FTRpeTgNMOkGnvVL4SgKzo40zl1A3tDSN5B3N1Sd3aYSzXWUd5pTYVwsMurXoluV4g0IF8jTSAyKAQen9jIdP3BEb5Da8BbulMQn8MlfmJv1fCcwOWgeAZOaG5He9xW-Y1Rz5v-3VrNkyIc1RALDl1amCE8Tjzac9PnxEK71WbCNItX00xRuWlICxhDxWYgd7cRdkAg88YamZMpr2gtr6AXo",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAA0Z93zf9Uysl0fd6_HIPxYMr1BfZxMSVU6p2b2bBJS2mOpEmndglzh-iL8kQlAn8iMzkhYHPJ3At1CaLlUpAK_W2d-Wt8M7XCL6dGU9QZTXj3X1js2h-vMa-9zsbn8ga33bwbp6X0oYl1LyXBbP45YZJV5YDAlob72_Y8uB9w3gQT_u7ASJ9rJIlVnaWsRc0sxVb8fFU0eQj49ho541Ytt9NQ3YTLcfoQqbkDDvuEyDkW2U28ZnPNy4S81-ByBM2QdEI19UmxQy_N",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDR5_TaaNw0Dd0gdgwgCc_rVHYUGRlhUh8bMt2VAsXxZs4yAO5EigaqsKtd4cRwhXIzCn9DgX3mgcqiyd3TCDt9oBS0X01YtCWstISL8UhM4pBQ0aNaSHatlGJEguq39OmPtOOjC1fJtSnl2Jtsdh0-N8GHjF5u4ZjA65aQwypmkKMjeMX-ixY4LryVCuNPRfp4RElNibpZID-xFKJyVEamVY0i6YzghlfdiNHxBYUZxSo51Nb8YEwPsmtJzFgYEGuoBveepoB42TyR",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCb2EOSJmHuPoZ6GKEQIDvgyyjS7xfuLGlrsaiwbmGbvBUZjEWQ05EJgbgWevVGViPkcLREfq6DWG0Mua86mrkXyoMwPhIuh6YowJ2aVTFwHOH7eN4aFexP34qZ0BBpg1BejrgT_9OQOiovhU4fbsY8D_BqqJ_BUnMbfFrdqoWAT_jvNEm6Q_ObNdf94GKXftROB5FAk_ZhLiIjl6PUVOVTGb2TAzD8BgJam1N4FkkBjrOEUL7pYPkpHnrtvdh-J0z-qDKpurgVfw9v",
];
