"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PageContainer } from "@/components/layout/page-container";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <PageContainer maxWidth="7xl">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-zinc-900 transition-opacity hover:opacity-90"
          >
            {siteConfig.name}
          </Link>
        </div>
      </PageContainer>
    </header>
  );
};
