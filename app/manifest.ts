import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "King Food | Açaí Delivery em Columbus, OH",
    short_name: "King Food",
    description:
      "King Food - O melhor açaí de Columbus, OH. Peça online com entrega rápida.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#3B0764",
    theme_color: "#5B21B6",
    categories: ["food", "lifestyle", "shopping"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "King Food - Home",
      },
    ],
  };
}
