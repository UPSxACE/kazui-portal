import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import DotsContextButton from "@/components/ui/dots-context-button";

export default function NewAccounts() {
  return (
    <div className="border-transparent w-full h-20 border border-solid rounded-md">
      <h2 className="text-font-1 font-semibold text-xl">Newest Accounts</h2>
      <div className="mt-2 flex flex-col gap-3">
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
      <span className="ml-auto mt-auto mb-auto text-xs text-zinc-400/70 font-medium">
        17d
      </span>
    </article>
  );
}

function PostMenu() {
  return <DotsContextButton className="ml-auto" />;
}
