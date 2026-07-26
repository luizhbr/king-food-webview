"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_NAME } from "@/lib/constants";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-acaiDark/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-gold bg-white/10">
            <span className="font-display text-sm font-bold text-brand-gold">KF</span>
          </div>
          <span className="font-display text-lg font-bold text-white">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className="text-sm font-medium text-brand-cream/80 transition-colors hover:text-brand-gold"
          >
            Início
          </Link>
          <Link
            href="/menu"
            className="text-sm font-medium text-brand-cream/80 transition-colors hover:text-brand-gold"
          >
            Cardápio
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-brand-cream transition-colors hover:bg-white/10 sm:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-brand-acaiDark px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-brand-cream/80 transition-colors hover:text-brand-gold"
            >
              Início
            </Link>
            <Link
              href="/menu"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-brand-cream/80 transition-colors hover:text-brand-gold"
            >
              Cardápio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
