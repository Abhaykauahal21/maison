import type { Metadata } from "next";
import { StoryPageLayout } from "@/components/story/StoryPageLayout";
import { defaultOriginContent, type OriginContent } from "@/data/origin-content";

const content: OriginContent = defaultOriginContent;

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
};

export default function StoryRoute() {
  return <StoryPageLayout content={content} />;
}
