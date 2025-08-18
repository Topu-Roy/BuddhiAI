"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Pagination as Paginate,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  totalPages: number | undefined;
  page: number | null;
};

export function Pagination({ totalPages, page }: Props) {
  // Keep track of last known totalPages to prevent disappearing
  const [lastKnownTotalPages, setLastKnownTotalPages] = useState(0);

  useEffect(() => {
    if (totalPages && totalPages > 0) {
      setLastKnownTotalPages(totalPages);
    }
  }, [totalPages]);

  const currentPage = page ?? 1;

  return (
    <>
      {lastKnownTotalPages > 1 && (
        <Paginate className="py-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/quiz/explore?page=${Math.max(1, currentPage - 1)}`}
                aria-disabled={currentPage <= 1}
                className={cn({
                  "pointer-events-none opacity-50": currentPage <= 1,
                })}
              />
            </PaginationItem>

            {/* Generate page numbers around current page */}
            {(() => {
              const maxVisible = 5;
              const totalPagesToUse = totalPages ?? lastKnownTotalPages;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              const endPage = Math.min(totalPagesToUse, startPage + maxVisible - 1);

              // Adjust start if we're near the end
              if (endPage - startPage + 1 < maxVisible) {
                startPage = Math.max(1, endPage - maxVisible + 1);
              }

              return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
                <PaginationItem key={p}>
                  <PaginationLink href={`/quiz/explore?page=${p}`} isActive={p === currentPage}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ));
            })()}

            {/* Show ellipsis and last page if needed */}
            {lastKnownTotalPages > 5 && currentPage < lastKnownTotalPages - 2 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive={false} href={`/quiz/explore?page=${lastKnownTotalPages}`}>
                    {lastKnownTotalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                aria-disabled={currentPage >= lastKnownTotalPages}
                href={`/quiz/explore?page=${Math.min(lastKnownTotalPages, currentPage + 1)}`}
                className={cn({
                  "pointer-events-none opacity-50": currentPage >= lastKnownTotalPages,
                })}
              />
            </PaginationItem>
          </PaginationContent>
        </Paginate>
      )}
    </>
  );
}
