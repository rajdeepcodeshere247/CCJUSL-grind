import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { ConfirmationDialogContextProvider } from "@/hooks/useConfirmationDialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeClub JUSL",
  description: "The official website for CodeClub JUSL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
            <link rel="preconnect" href="https://challenges.cloudflare.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Navbar fromLayout={true} />
        <ConfirmationDialogContextProvider>
        {children}
        </ConfirmationDialogContextProvider>
        <Toaster position="bottom-right" toastOptions={{style: {
          backgroundColor: "#1c1c1c",
          color: "white",
          padding: "12px",
          borderRadius: "6px",
          minWidth: "300px",
          textAlign: "left",
          fontFamily: 'JetBrains Mono'
        },
      success: {
        iconTheme: {
          primary: '#48ab60',
          secondary: 'white',
        }
      }}}
        containerStyle={{
          right: 30,
          bottom: 20
        }} />
      </body>
    </html>
  );
}