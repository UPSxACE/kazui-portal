import DotsContextButton from "@/components/ui/dots-context-button";
import { FiGift } from "react-icons/fi";

export default function Events() {
  return (
    <div className="w-full bg-background rounded-md overflow-hidden shrink-0">
      <h2 className="text-font-1 font-semibold text-lg px-3 py-2 bg-background-lighter">
        Events
      </h2>
      <div className="flex flex-col gap-3 px-3 py-3">
        <Event />
        <Event />
        <Event />
        <Event />
      </div>
    </div>
  );
}

function Event() {
  return (
    <article className="flex">
      {/* <Avatar className="w-9 h-9 rounded-md">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="rounded-md">?</AvatarFallback>
      </Avatar> */}
      <FiGift className="h-9 w-9 text-font-1" />
      <div className="ml-2 flex flex-col justify-evenly w-full">
        <div className="flex gap-1 items-end">
          <span className="font-bold leading-none shrink-0 text-font-1">
            Giveaway
          </span>
        </div>
        <span className="text-xs shrink leading-none text-zinc-400/70">
          Ends in 17h
        </span>
      </div>
      {/* <span className="ml-auto mt-auto mb-auto text-xs text-zinc-400/70 font-medium">
        17d
      </span> */}
    </article>
  );
}

function PostMenu() {
  return <DotsContextButton className="ml-auto" />;
}
