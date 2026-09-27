import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/Button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <PageContainer maxWidth="md" className="py-24 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
          <FileQuestion className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">404</h1>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Page Not Found</h2>
        <p className="max-w-sm text-sm text-zinc-600">
          The requested page could not be located. It may have been moved, renamed, or deleted.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button variant="primary" leftIcon={<Home className="h-4 w-4" />}>
              Back to Safety
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
