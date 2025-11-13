import "./globals.css";
import ReduxProvider from "@/app/providers/ReduxProvider";
import { GlobalInitializer } from "@/components/fetch/GlobalInitializer";
import Header from "@/components/Header";

export const metadata = {
	title: "Bismillah Telecom & Servicing",
	description: "Admin dashboard for managing products and sales",
};

export default function RootLayout({ children }) {
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
