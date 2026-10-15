"use client";

import { useState } from "react";

const navLinks = [
	{ label: "Features", href: "#features" },
	{ label: "How it works", href: "#how-it-works" },
	{ label: "About", href: "#about" },
];

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
			<nav
				aria-label="Main navigation"
				className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
			>
				<a href="/" aria-label="Learnable home" className="flex items-center gap-2.5">
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
						L
					</span>
					<span className="text-xl font-bold tracking-tight text-slate-900">Learnable</span>
				</a>

				<div className="hidden items-center gap-8 md:flex">
					{navLinks.map(({ label, href }) => (
						<a
							key={label}
							href={href}
							className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
						>
							{label}
						</a>
					))}
				</div>

				<div className="hidden items-center gap-5 md:flex">
					<a href="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
						Log in
					</a>
					<a
						href="/signup"
						className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Get started
					</a>
				</div>

				<button
					type="button"
					aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
					aria-expanded={menuOpen}
					onClick={() => setMenuOpen((open) => !open)}
					className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
				>
					<svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
						{menuOpen ? (
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
						) : (
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						)}
					</svg>
				</button>
			</nav>

			{menuOpen && (
				<div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
					<div className="mx-auto flex max-w-7xl flex-col gap-4">
						{navLinks.map(({ label, href }) => (
							<a
								key={label}
								href={href}
								onClick={() => setMenuOpen(false)}
								className="text-sm font-medium text-slate-700 hover:text-indigo-600"
							>
								{label}
							</a>
						))}
						<div className="flex items-center gap-5 border-t border-slate-100 pt-4">
							<a href="/login" className="text-sm font-semibold text-slate-700">
								Log in
							</a>
							<a
								href="/signup"
								className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
							>
								Get started
							</a>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
