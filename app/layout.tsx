import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Header from "@/components/shared/Header";
import "./globals.css";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        {children}
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
