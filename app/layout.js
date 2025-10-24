

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ReduxProvider from "./providers/ReduxProvider";

export const metadata = {
  title: "Dashboard | My App",
  description: "Admin dashboard for managing products and sales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
         <ReduxProvider>{children}</ReduxProvider>
        </main>
      </body>
    </html>
  );
}
