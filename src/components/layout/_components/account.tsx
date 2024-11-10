import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import { ChevronDown } from "lucide-react";

export default function Account() {
  return (
    <button className="hidden lg:flex border border-solid border-gray-600/80 hover:border-gray-400 ml-2 h-11 w-44 py-[0.125rem] px-[0.35rem] rounded-md relative items-center justify-between gap-[0.3rem]">
      <Avatar className="w-8 h-8">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="rounded-md">?</AvatarFallback>
      </Avatar>

      <span className="ml-[0.3rem]">Username</span>
      <span>
        <ChevronDown />
      </span>
    </button>
  );
}
