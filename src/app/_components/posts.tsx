"use client";
import api from "@/lib/api";
import { PostData, postDataSchema } from "@/schema/post-data";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { z } from "zod";
import IndividualPost from "./_components/individual-post";
import NewPost from "./_components/new-post";
import Post from "./_components/post";

export default function Posts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const postId = (function () {
    try {
      const p = searchParams.get("p");
      if (!p) return null;
      return z.number().parse(Number.parseInt(p));
    } catch {
      return null;
    }
  })();

  const createAddSearchParams = useCallback(
    (paramValues: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.keys(paramValues).forEach((key) => {
        if (params.has(key)) params.delete(key, paramValues[key]);
        params.set(key, paramValues[key]);
      });
      return params.toString();
    },
    [searchParams]
  );
  const createDeleteSearchParam = useCallback(
    (paramKey: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(paramKey);
      return params.toString();
    },
    [searchParams]
  );

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    data,
    ...result
  } = useInfiniteQuery<
    { data: PostData[]; nextCursor: string | null },
    Error,
    InfiniteData<
      { data: PostData[]; nextCursor: string | null },
      string | null
    >,
    string[],
    string | null
  >({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      return await api
        .get("/post", {
          params: {
            cursor: pageParam,
          },
        })
        .then(({ data, headers }) => {
          const cursor = z
            .string()
            .nullable()
            .parse(headers["X-Cursor"] || null);
          return {
            data: postDataSchema.array().parse(data),
            nextCursor: cursor,
          };
        });
    },
    initialPageParam: null,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.nextCursor,
    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams
    ) => null,
  });

  const allRows = data ? data.pages.flatMap((d) => d.data) : [];
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: allRows.length + 1 + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 600,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  const ready = !result.isPending;

  if (typeof postId === "number") {
    return <IndividualPost postId={postId} />;
  }

  return (
    <main
      ref={parentRef}
      className="text-font-1 h-landing flex flex-col overflow-y-auto hide-scroll flex-1 py-4"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <div className="flex flex-col flex-1">
          {!ready && (
            <div className="rounded-sm flex justify-center items-center w-full bg-inherit">
              <div
                className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-solid border-current border-e-red-500 align-[-0.125em] text-gray-300 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          )}
          {ready &&
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isNewPostRow = virtualRow.index === 0;
              const isLoaderRow = virtualRow.index > allRows.length;
              const post = allRows[virtualRow.index - 1];

              return (
                <div
                  // className={!isLoaderRow ? "pb-4" : ""}
                  className={virtualRow.index !== 0 ? "pb-4" : ""}
                  data-index={virtualRow.index} //needed for dynamic
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isNewPostRow && <NewPost />}
                  {!isNewPostRow &&
                    (isLoaderRow ? (
                      hasNextPage ? (
                        <div className="rounded-sm flex justify-center items-center w-full bg-inherit">
                          <div
                            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-solid border-current border-e-red-500 align-[-0.125em] text-gray-300 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                          >
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                              Loading...
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-center block">
                          {
                            "You’re all caught up! That's the end of your feed for now."
                          }
                        </span>
                      )
                    ) : (
                      <Post data={post} />
                    ))}
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
