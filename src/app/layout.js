import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalBookingDrawer from "@/components/GlobalBookingDrawer";
import GlobalDiningModal from "@/components/GlobalDiningModal";
import GlobalSuiteModal from "@/components/GlobalSuiteModal";
import LoginModal from "@/components/LoginModal";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["Georgia", "serif"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata = {
  metadataBase: new URL("https://hotelrajmahalpalace.in"),
  title: {
    default: "Hotel Near Bhimashankar | Hotel Rajmahal Palace (Near Pune & Jyotirlinga)",
    template: "%s | Hotel Rajmahal Palace Bhimashankar",
  },
  description:
    "Looking for the best hotel near Bhimashankar? Hotel Rajmahal Palace in Shirgaon (NH 60, Pune) offers luxury rooms, hill-view suites, pure veg dining, and 24/7 hospitality near Bhimashankar Jyotirlinga Temple. Book directly for best rates.",
  keywords: [
    // Primary High-Intent Search Queries
    "hotel near bhimashankar",
    "hotels near bhimashankar",
    "hotels near bhimashankar temple",
    "hotel near bhimashankar jyotirlinga",
    "best hotel near bhimashankar",
    "best hotel in bhimashankar",
    "hotel in bhimashankar",
    "hotels in bhimashankar",
    "resort near bhimashankar",
    "resorts near bhimashankar",
    "bhimashankar stay",
    "stay near bhimashankar temple",
    "bhimashankar hotel booking",
    "hotels near me",
    "hotel near me",
    "best hotel near me",

    // Regional & Route Keywords (Pune, NH 60, Shirgaon, Khed, Manchar, Rajgurunagar)
    "hotels in pune near bhimashankar",
    "hotel in shirgaon bhimashankar",
    "hotel in shirgaon pune",
    "hotel on nh 60",
    "hotels on nh 60 pune",
    "hotel near khed pune",
    "hotels near manchar",
    "hotel near rajgurunagar",
    "pune to bhimashankar hotel",
    "mumbai to bhimashankar hotel",

    // Palace & Accommodation Types
    "hotel rajmahal palace",
    "hotel rajmahal palace bhimashankar",
    "rajmahal palace shirgaon",
    "luxury hotel bhimashankar",
    "family hotel near bhimashankar",
    "couple friendly hotel near bhimashankar",
    "hotel with restaurant in bhimashankar",
    "hotel booking bhimashankar",
  ],
  authors: [{ name: "Hotel Rajmahal Palace" }],
  creator: "Hotel Rajmahal Palace",
  publisher: "Hotel Rajmahal Palace",
  icons: {
    icon: [
      { url: "/images/logo.jpeg" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/images/logo.jpeg" },
    ],
    shortcut: "/images/logo.jpeg",
  },
  alternates: {
    canonical: "https://hotelrajmahalpalace.in",
  },
  openGraph: {
    title: "Hotel Rajmahal Palace | Best Hotel & Luxury Resort Near Bhimashankar",
    description:
      "Experience royal Indian luxury meets peaceful hill serenity at Hotel Rajmahal Palace, Shirgaon. Book luxury rooms, fine dining, and private balcony suites near Bhimashankar Jyotirlinga Temple.",
    url: "https://hotelrajmahalpalace.in",
    siteName: "Hotel Rajmahal Palace Bhimashankar",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/hero-exterior.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel Rajmahal Palace Exterior Near Bhimashankar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Rajmahal Palace | Best Hotel Near Bhimashankar",
    description:
      "Royal luxury rooms & suites near Bhimashankar Jyotirlinga Temple, Shirgaon, NH 60, Pune.",
    images: ["/images/hero-exterior.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "travel",
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Shirgaon, Bhimashankar, Pune, Maharashtra",
    "geo.position": "19.0318832;73.6249857",
    "ICBM": "19.0318832, 73.6249857",
  },
};

const hotelSchema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": "https://hotelrajmahalpalace.in/#hotel",
  name: "Hotel Rajmahal Palace",
  alternateName: [
    "Hotel Rajmahal Palace Bhimashankar",
    "Rajmahal Palace Hotel Shirgaon",
    "Hotel Rajmahal Palace Pune",
  ],
  description:
    "Best luxury heritage hotel and resort near Bhimashankar Jyotirlinga Temple in Shirgaon, NH 60, Tal Khed, Dist. Pune. Offering luxury suites, pure veg restaurant, hill views, and 24/7 guest service.",
  url: "https://hotelrajmahalpalace.in",
  telephone: "+91 70706 16464",
  email: "rajmahalpalace03@gmail.com",
  image: "https://hotelrajmahalpalace.in/images/hero-exterior.jpg",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, UPI, Net Banking, Razorpay",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hotel Rajmahal Palace, Shirgaon, Near Bhimashankar, NH 60, Tal Khed",
    addressLocality: "Shirgaon",
    addressRegion: "Maharashtra",
    postalCode: "412402",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 19.0318832,
    longitude: 73.6249857,
  },
  hasMap:
    "https://www.google.com/maps/dir/19.1880623,73.0488215/Hotel+Rajmahal+palace+(Bhimashankar+Pune),+Shirgaon,+Maharashtra+412402/@19.1099728,73.3369036,10z/data=!3m1!4b1!4m22!1m11!3m10!1s0x3bdd5b00229267e9:0x30be08e5fda4d0d4!2sHotel+Rajmahal+palace+(Bhimashankar+Pune)!5m2!4m1!1i2!8m2!3d19.0318832!4d73.6249857!15sChVob3RlbCByYWptYWhhbCBwYWxhY2VaFyIVaG90ZWwgcmFqbWFoYWwgcGFsYWNlkgEKcmVzdGF1cmFudOABAA!16s%2Fg%2F11wg8g4l_0!4m9!1m1!4e1!1m5!1m1!1s0x3bdd5b00229267e9:0x30be08e5fda4d0d4!2m2!1d73.6249857!2d19.0318832!3e3",
  checkinTime: "12:00:00",
  checkoutTime: "10:00:00",
  petsAllowed: false,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "High-Speed Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Restaurant & Multi-Cuisine Dining", value: true },
    { "@type": "LocationFeatureSpecification", name: "24-Hour Room Service", value: true },
    { "@type": "LocationFeatureSpecification", name: "Balcony Hill View", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free Secure Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Dark Marble Bathroom with Geyser", value: true },
  ],
  areaServed: [
    { "@type": "Place", name: "Bhimashankar" },
    { "@type": "Place", name: "Bhimashankar Jyotirlinga" },
    { "@type": "Place", name: "Shirgaon" },
    { "@type": "Place", name: "Khed" },
    { "@type": "Place", name: "Manchar" },
    { "@type": "Place", name: "Rajgurunagar" },
    { "@type": "Place", name: "Pune" },
    { "@type": "Place", name: "Maharashtra" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jakarta.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
      </head>
      <body className="bg-cream text-charcoal font-sans antialiased min-h-screen flex flex-col selection:bg-sandstone selection:text-white" suppressHydrationWarning>
        <AuthProvider>
          <BookingProvider>
            <SmoothScroll>
              <CustomCursor />
              <Navbar />
              <main className="flex-grow">{children}</main>
              <GlobalBookingDrawer />
              <GlobalDiningModal />
              <GlobalSuiteModal />
              <LoginModal />
              <FloatingWhatsApp />
              <Footer />
            </SmoothScroll>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
