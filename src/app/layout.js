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
  metadataBase: new URL("https://hotelrajmahalpalace.com"),
  title: "Hotel Rajmahal Palace | Luxury Heritage Resort in the Hills",
  description:
    "Experience royal Indian heritage meets peaceful hill serenity at Hotel Rajmahal Palace. Book luxury rooms, fine dining, and private balcony suites.",
  keywords: [
    "Hotel Rajmahal Palace",
    "Heritage Resort Bhimashankar",
    "Luxury Hill Hotel Bhimashankar",
    "Bhimashankar Jyotirlinga Stay",
    "Maharashtra Hill Resort",
    "Palace Booking",
  ],
  openGraph: {
    title: "Hotel Rajmahal Palace | Heritage Resort in the Hills",
    description:
      "Where heritage meets the serenity of the hills. Virtual tours, room bookings, and royal hospitality.",
    images: ["/images/hero-exterior.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jakarta.variable} scroll-smooth`} suppressHydrationWarning>
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
