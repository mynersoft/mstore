import "./globals.css";
import ReduxProvider from "@/app/providers/ReduxProvider";

export const metadata = { title: "Inventory Dashboard" };

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ReduxProvider>{children}</ReduxProvider>
			</body>
		</html>
	);
}
