"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "./types";

interface BlogCardProps {
  post: BlogPost;
  index: number;
  /** Drives the entrance animation; true by default (e.g. for related-post lists). */
  inView?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index, inView = true }) => {
  const delay = 350 + index * 180;
  return (
    <div
      className="will-change-transform"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translate3d(0, 0, 0) rotate(0deg)"
          : index % 3 === 0
          ? "translate3d(-14vw, 0, 0) rotate(-4deg)"
          : index % 3 === 1
            ? "translate3d(0, 90px, 0) rotate(0deg)"
            : "translate3d(14vw, 0, 0) rotate(4deg)",
        transition: `opacity 1000ms ease-out ${delay}ms, transform 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
    <article className="group relative flex flex-col overflow-hidden rounded-[2px] bg-[#fbf7ee] border border-[#d8cbbb]/75 shadow-[0_16px_36px_-6px_rgba(15,10,5,0.32),0_4px_12px_rgba(15,10,5,0.18)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-8px_rgba(15,10,5,0.42),0_6px_16px_rgba(15,10,5,0.22)] cursor-pointer">
      <Link
        href={post.href || "#"}
        aria-label={`Read blog post: ${post.title}`}
        className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a2d22]"
      >
        {/* Top Image Container (~52% of card height) */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] md:aspect-[4/3] overflow-hidden bg-[#241c15]">
          <div
            className="absolute inset-0"
            style={{
              transform: inView ? "scale(1)" : "scale(1.25)",
              transition: `transform 1800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              quality={100}
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 420px"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
          {/* Subtle warm vignette on image */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
        </div>

        {/* Content Area */}
        <div className="relative flex flex-1 flex-col justify-between p-6 sm:p-7 md:p-6 lg:p-7 bg-[#fbf7ee]">
          <div>
            {/* Metadata: Date | Category */}
            <div className="flex items-center gap-2 font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#7a6a59] uppercase">
              <span>{post.date}</span>
              <span className="opacity-60" aria-hidden="true">|</span>
              <span className="text-[#645546]">{post.category}</span>
            </div>

            {/* Blog Title */}
            <h3 className="mt-2.5 font-serif text-[19px] sm:text-[21px] md:text-[1.3vw] lg:text-[22px] font-normal leading-[1.24] tracking-tight text-[#1d1611] transition-colors duration-300 group-hover:text-[#5a4433]">
              {post.title}
            </h3>

            {/* Description */}
            <p className="mt-2.5 sm:mt-3 font-serif text-xs sm:text-[13px] md:text-[0.9vw] lg:text-[13.5px] font-normal leading-[1.6] text-[#554638] tracking-[0.01em] line-clamp-3">
              {post.description}
            </p>
          </div>

          {/* Bottom Row with Circular Arrow Button on Lower Right */}
          <div className="mt-6 flex items-center justify-end pt-2">
            <span
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#8a7764]/40 bg-transparent text-[#382b20] transition-all duration-300 ease-out group-hover:border-[#2b2118] group-hover:bg-[#eae0cf] group-hover:scale-105"
              aria-hidden="true"
            >
              <span className="text-sm transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                &rarr;
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
    </div>
  );
};
