"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import DotsContextButton from "@/components/ui/dots-context-button";
import DynamicImage from "@/components/ui/dynamic-image";
import cuteDateSince from "@/lib/utils/cute-date-since";
import { PostData } from "@/schema/post-data";
import Link from "next/link";
import { useState } from "react";
import { MdImageNotSupported } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import Actions from "./actions";

export default function Post({ data }: { data: PostData }) {
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
        <div className="mt-[0.35rem] py-1">
          <span className="text-base leading-4">{data.text}</span>
        </div>
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
        <Actions
          id={data.id}
          likes={data.likes_count}
          comments={data.comments_count}
          liked={data.liked}
        />

        <div className="mt-[0.35rem] text-[0.75rem] text-zinc-400/70">
          <Link className="hover:underline" href={`/?p=${data.id}`}>
            View all comments
          </Link>
        </div>
      </div>
    </article>
  );
}

function PostMenu() {
  return <DotsContextButton className="ml-auto" />;
}
