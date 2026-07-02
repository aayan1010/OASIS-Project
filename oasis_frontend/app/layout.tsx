import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/feature/Sidebar";
import Header from "./components/feature/Header";

export const metadata: Metadata = {
  title: "OASIS by Titan Systems",
  description: "Dashboard Layout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-background-50 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto dashboard-scroll">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
