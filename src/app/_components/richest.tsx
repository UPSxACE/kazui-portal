import ruby from "@/../public/ruby.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import Image from "next/image";

export default function Richest() {
  return (
    <div className="w-full bg-background rounded-md overflow-hidden shrink-0">
      <h2 className="text-font-1 font-semibold text-lg px-3 py-2 bg-background-lighter">
        Richest
      </h2>
      <div className="flex flex-col gap-3 px-3 py-3">
        <Account />
        <Account />
        <Account />
        <Account />
        <Account />
        <Account />
        <Account />
      </div>
    </div>
  );
}

function Account() {
  return (
    <article className="flex">
      <Avatar className="w-9 h-9 rounded-md">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="rounded-md">?</AvatarFallback>
      </Avatar>
      <div className="ml-2 flex flex-col justify-evenly w-full">
        <div className="flex gap-1 items-end">
          <span className="font-bold leading-none shrink-0 text-font-1">
            Username
          </span>
        </div>
        <span className="text-xs shrink leading-none text-zinc-400/70">
          @User
        </span>
      </div>
      <div className="flex items-center gap-1 ml-auto mt-auto mb-auto">
        <span className="text-xs text-zinc-400/70 font-medium">100.000</span>
        <div
          className="relative h-4"
          style={{ aspectRatio: ruby.width / ruby.height }}
        >
          <Image src={ruby} alt="Ruby icon" fill unoptimized />
        </div>
      </div>
    </article>
  );
}
