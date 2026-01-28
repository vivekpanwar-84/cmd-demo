import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import  DashboardLayout  from "@/app/(dashboard)/layout";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM Pro",
  description: "Modern CRM Application",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
