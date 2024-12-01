"use client";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { AiFillFire, AiOutlineFire } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";

export default function Actions({
  id,
  likes,
  comments,
  liked,
}: {
  id: number;
  likes: number;
  comments: number;
  liked?: boolean;
}) {
  const client = useQueryClient();
  const [delta, setDelta] = useState(0);
  const [likedLocal, setLikedLocal] = useState(liked);
  const [locked, setLocked] = useState(false);

  const toggle = () => {
    if (typeof liked === "undefined" || locked) return;
    setLocked(true);
    if (likedLocal) {
      setLikedLocal(false);
      setDelta((x) => x - 1);
      api.post(`/post/${id}/dislike`).then(() => {
        setLocked(false);
        client.invalidateQueries({
          queryKey: ["post", id, "comments"],
          exact: true,
        });
        client.invalidateQueries({
          queryKey: ["post", id],
          exact: true,
        });
      });
      return;
    }
    setLikedLocal(true);
    setDelta((x) => x + 1);
    api.post(`/post/${id}/like`).then(() => {
      setLocked(false);
      client.invalidateQueries({
        queryKey: ["post", id, "comments"],
        exact: true,
      });
      client.invalidateQueries({
        queryKey: ["post", id],
        exact: true,
      });
    });
  };

  return (
    <div className="mt-2 flex items-center text-base gap-[0.35rem]">
      <button onClick={toggle} className="text-font-1 text-[1.3rem]">
        {likedLocal ? <FaHeart className="text-pink-500" /> : <FaRegHeart />}
      </button>
      <span className="mr-5">{likes + delta}</span>
      <Link href={`/?p=${id}`} className="text-[1.3rem]">
        <FaRegComment />
      </Link>
      <span className="">{comments}</span>
    </div>
  );
  return (
    <div className="mt-[0.35rem] flex gap-2">
      <button onClick={toggle} className="text-font-1 text-3xl">
        {liked ? (
          <AiFillFire className="text-red-600 !stroke-2 !stroke-yellow-200" />
        ) : (
          <AiOutlineFire />
        )}
      </button>
    </div>
  );
}

function Like({ liked }: { liked: boolean }) {
  return;
}
