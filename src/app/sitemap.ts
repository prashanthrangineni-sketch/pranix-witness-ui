import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cart2save.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/sector/grocery`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/sector/electronics`,
      lastModified: new Date()
    }
  ];
}
