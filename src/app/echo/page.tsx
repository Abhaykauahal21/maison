import type { Metadata } from "next";
import { EchoStoryReader } from "@/components/echo/EchoStoryReader";
import { defaultEchoStory } from "@/data/echo-story";

export const metadata: Metadata = {
  title: defaultEchoStory.meta.title,
  description: defaultEchoStory.meta.description,
};

export default function EchoRoute() {
  return <EchoStoryReader />;
}
