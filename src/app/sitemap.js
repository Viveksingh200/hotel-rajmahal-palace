import { ROOMS_DATA } from "@/data/rooms";

export default function sitemap() {
  const baseUrl = "https://hotelrajmahalpalace.com";

  const staticPages = [
    "",
    "/rooms",
    "/experience",
    "/dining",
    "/gallery",
    "/contact",
    "/booking",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const roomPages = ROOMS_DATA.map((room) => ({
    url: `${baseUrl}/rooms/${room.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...roomPages];
}
