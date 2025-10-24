"use client";

import { useState } from "react";
import { Menu, X, Home, Package, BarChart3 } from "lucide-react";
import Link from "next/link";

const navItems = [
	{ name: "Dashboard", href: "/", icon: Home },
	{ name: "Products", href: "/products", icon: Package },
	{ name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Mobile Header */}
			<div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow">
				<h1 className="font-bold text-lg">My Dashboard</h1>
				<button
					onClick={() => setOpen(!open)}
					className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
					{open ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* Sidebar */}
			<aside
				className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
				<div className="flex items-center justify-center py-6 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-2xl font-bold text-blue-600">
						Md Mahir
					</h2>
				</div>

				<nav className="p-4 space-y-2">
					{navItems.map(({ name, href, icon: Icon }) => (
						<Link
							key={name}
							href={href}
							onClick={() => setOpen(false)}
							className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700">
							<Icon size={20} />
							<span>{name}</span>
						</Link>
					))}
				</nav>
			</aside>

			{/* Overlay for mobile */}
			{open && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
					onClick={() => setOpen(false)}
				/>
			)}
		</>
	);
}
