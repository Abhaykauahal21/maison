import React from "react";
import { siteConfig } from "@/config/site";
import { PageContainer } from "@/components/layout/page-container";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white py-6">
      <PageContainer
        maxWidth="7xl"
        className="flex items-center justify-between text-xs text-zinc-500"
      >
        <p>
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </p>
      </PageContainer>
    </footer>
  );
};
