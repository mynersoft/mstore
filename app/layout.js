"use client";

import "./globals.css";
import InternetStatus from "@/components/InternetStatus";
import ReduxProvider from "@/app/providers/ReduxProvider";
import { GlobalInitializer } from "@/components/fetch/GlobalInitializer";
import Header from "@/components/header/Header";
import { Toaster } from "react-hot-toast";

import { useEffect, useState } from "react";

import ErudaLoader from "@/components/ErudaLoader";
import Loader from "@/components/Loader";

export default function RootLayout({ children }) {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1200);

		return () => clearTimeout(timer);
	}, []);


	return (
		<html lang="en">
			<head>
				{/* ✅ Google Site Verification */}
				<meta
					name="google-site-verification"
					content="OlqGBlfLEkJDmZZ3SppeQU1MDwI_CL6SEFXYSLv_DmA"
				/>

				{/* You can add other SEO metas here */}
				<meta charSet="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<title>Tomart | Everything to Your Doorstrp</title>
				<meta
					name="description"
					content="Electrical - Hardware - Accessories - Telecom"
				/>
			</head>

			<body className="dark bg-gray-900 text-gray-100">
				{loading && <Loader />}

				{!loading && (
					<>
						
						<Toaster position="top-right" reverseOrder={false} />
						<Header />
						<ReduxProvider>
							<GlobalInitializer />
							{children}
						</ReduxProvider>
					</>
				)}
			</body>
		</html>
	);
}
