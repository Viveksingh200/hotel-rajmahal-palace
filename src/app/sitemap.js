export default function sitemap() {
  const baseUrl = "https://hotelrajmahalpalace.com";

  const staticPages = [
    "",
    "/about",
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

  return staticPages;
}
