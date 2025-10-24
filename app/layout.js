import "./globals.css";
import ReduxProvider from "@/app/providers/ReduxProvider";
import Header from "@/components/Header"

export const metadata = {
  title: "Dashboard | My App",
  description: "Admin dashboard for managing products and sales",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">

			<body><Header/>
				<ReduxProvider>{children}</ReduxProvider>
			</body>
		</html>
	);
}
