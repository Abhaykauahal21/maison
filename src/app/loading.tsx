import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContainer maxWidth="7xl" className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <Skeleton className="mx-auto h-8 w-48 rounded-full" />
        <Skeleton className="mx-auto h-12 w-3/4" />
        <Skeleton className="mx-auto h-6 w-1/2" />
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </PageContainer>
  );
}
