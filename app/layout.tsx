import * as React from "react";
import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "./context/auth-provider";
import Header from "./components/header";
import Footer from "./components/footer";
import ThemeProvider from "./context/theme-provider";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Dudda",
  description: "Question everything!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {/* <React.Suspense fallback={<Loading />}> */}
            <Header />
            {children}
            <Footer />
            {/* </React.Suspense> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
