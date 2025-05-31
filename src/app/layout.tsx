import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer/footer";
import { dmSans } from "@/components/fonts/dmSans";
import { Navbar } from "@/components/navbar/navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DaurTani",
  description: "Platform untuk petani Indonesia",
  verification: {
    google: "BdfghLWZfCIxNl4X6PcZi-S5sNLuhijwfQgY_Ui8agA",
  },
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["apple-touch-icon.png"],
  },
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${dmSans.className} bg-neutral01 overflow-x-hidden`}>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              className: "bg-neutral01 border-[1.2px] border-brand01/60 shadow-lg shadow-black text-brand03",
            }}
          />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
