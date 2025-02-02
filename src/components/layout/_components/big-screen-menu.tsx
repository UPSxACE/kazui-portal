"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/_sui/tooltip";

const menu = [
  // { label: "News", link: "#" },
  // { label: "Community", link: "#" },
  // { label: "Best Memes", link: "#" },
  // { label: "Leaderboard", link: "#" },
  { label: "Stake", link: "#" },
];

export default function BigScreenMenu() {
  return (
    <nav className="text-base lg:flex gap-6 hidden justify-end mr-2 flex-1">
      {menu.map((x, i) => (
        <TooltipProvider key={i}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger
              onClick={(event) => {
                event.preventDefault();
              }}
            >
              <span key={i} className="">
                {/**href={x.link} */}
                {x.label}
              </span>
            </TooltipTrigger>
            <TooltipContent
              onPointerDownOutside={(event) => {
                event.preventDefault();
              }}
            >
              <p>Soon...</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  );
}
