"use client";
import flameWhite from "@/../public/icons/flame-white.svg";
import flame from "@/../public/icons/flame.svg";
import Image from "next/image";
import { useState } from "react";
import { AiFillFire, AiOutlineFire } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";

export default function Actions() {
  const [liked, setLiked] = useState(false);

  const toggle = () => setLiked((x) => !x);

  const likes = 16;
  const comments = 8;

  return (
    <div className="mt-2 flex items-end text-base gap-[0.35rem]">
      <button onClick={toggle} className="text-font-1 text-3xl">
        {liked ? (
          <Image
            decoding="sync"
            priority
            unoptimized
            src={flame}
            style={{
              height: "1.5rem",
              width: "auto",
            }}
            alt="flame"
            className="text-red-600 !stroke-2 !stroke-yellow-200"
          />
        ) : (
          <Image
            decoding="sync"
            priority
            unoptimized
            src={flameWhite}
            style={{
              height: "1.5rem",
              width: "auto",
            }}
            alt="flame"
            className="text-red-600 !stroke-2 !stroke-yellow-200"
          />
        )}
      </button>
      <span className="">{likes}</span>
      <button className="text-[1.5rem]">
        <FaRegComment />
      </button>
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
