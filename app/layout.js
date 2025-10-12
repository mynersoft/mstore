import "./globals.css";
import ReduxProvider from "@/app/providers/ReduxProvider";
import Header from "@/components/Header"

export const metadata = { title: "Inventory Dashboard" };

export default function RootLayout({ children }) {
	return (
		<html lang="en">
<Header/>
			<body>
				<ReduxProvider>{children}</ReduxProvider>
			</body>
		</html>
	);
}
