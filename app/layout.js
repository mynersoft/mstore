"use-client";



import "./globals.css";
import ReduxProvider from "@/app/providers/ReduxProvider";
import { GlobalInitializer } from "@/components/fetch/GlobalInitializer";
import Header from "@/components/Header";

import { useEffect, useState } from "react";

import Loader from "@/components/Loader";

export const metadata = {
	title: "Bismillah Telecom & Servicing",
	description: "Admin dashboard for managing products and sales",
};

export default function RootLayout({ children }) {


const [loading, setLoading] = useState(true);

  useEffect(() => {
    // সব কন্টেন্ট লোড হলে loader remove হবে
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // লোডার একটু smooth দেখানোর জন্য

    return () => clearTimeout(timer);
  }, []);



	return (
		<html lang="en">
			<body className="dark bg-gray-900 text-gray-100">
				<Header />

				<ReduxProvider>
					<GlobalInitializer />
					{children}
				</ReduxProvider>
			</body>
		</html>
	);
}
