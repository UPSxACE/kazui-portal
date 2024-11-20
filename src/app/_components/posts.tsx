"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import DotsContextButton from "@/components/ui/dots-context-button";
import DynamicImage from "@/components/ui/dynamic-image";
import api from "@/lib/api";
import { PostData, postDataSchema } from "@/schema/post-data";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { MdImageNotSupported } from "react-icons/md";
import { z } from "zod";
import Actions from "./_components/actions";
import NewPost from "./new-post";
import { twJoin } from "tailwind-merge";
import cuteDateSince from "@/lib/utils/cute-date-since";

export default function Posts() {
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

function Post({ data }: { data: PostData }) {
  const [ready, setReady] = useState(false);
  return (
    <article className="main-wrapper bg-background rounded-md">
      <div className="main-inner-wrapper py-4 flex flex-col">
        <header className="flex">
          <Avatar className="w-10 h-10">
            <AvatarImage src={data.owner.picture || undefined} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex flex-col justify-evenly w-full">
            <div className="flex gap-1 items-end">
              <span className="font-bold leading-none shrink-0">
                {data.owner.nickname}
              </span>
              <span className="text-xs shrink leading-none text-zinc-400/70">
                @{data.owner.username}
              </span>
            </div>
            <span className="text-xs text-zinc-400/70 font-medium">
              {cuteDateSince(new Date(data.created_at))}
            </span>
          </div>
          <PostMenu />
        </header>
        {data?.images?.[0]?.path && (
          <figure
            className={twJoin(
              "mt-2 overflow-hidden rounded-md",
              !ready && "min-h-[500px]"
            )}
          >
            <DynamicImage
              onLoad={() => setReady(true)}
              className="w-full max-h-[500px] object-contain bg-black"
              src={data.images[0].path}
              alt="meme"
              fallback={
                <div className="bg-zinc-200 aspect-square w-full flex justify-center items-center select-none text-7xl text-zinc-400/70">
                  <MdImageNotSupported />
                </div>
              }
            />
          </figure>
        )}
        <Actions />
        <div className="mt-[0.35rem]">
          <span className="font-bold text-sm leading-none">
            {data.owner.nickname}
          </span>
          <span className="text-sm leading-4 ml-1">{data.text}</span>
        </div>
        <div className="mt-[0.35rem] text-[0.75rem] text-zinc-400/70">
          <span>View all comments</span>
        </div>
      </div>
    </article>
  );
}

function PostMenu() {
  return <DotsContextButton className="ml-auto" />;
}
