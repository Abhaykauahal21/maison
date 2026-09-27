"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log client error report
    console.error("Next.js App Router caught an error:", error);
  }, [error]);

  return (
    <PageContainer maxWidth="md" className="py-24 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          An Unexpected Error Occurred
        </h2>
        <p className="max-w-sm text-sm text-zinc-600">
          {error.message || "We encountered an error rendering this route. Please try refreshing."}
        </p>
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            onClick={() => reset()}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try again
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Return Home
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
