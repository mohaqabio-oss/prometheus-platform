import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prometheus Platform",
    short_name: "Prometheus",
    description: "Prometheus Voluntary Team Institutional and Academic Platform",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1A2B4A",
    theme_color: "#1A2B4A",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
