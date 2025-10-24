"use client";

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
	return (
		<div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
			{/* Sidebar */}
			<Sidebar />

			{/* Main content area */}
			<main className="flex-1 p-4 md:p-6 overflow-y-auto">
				{children}
			</main>
		</div>
	);
}
