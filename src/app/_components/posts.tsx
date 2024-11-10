import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import DotsContextButton from "@/components/ui/dots-context-button";
import DynamicImage from "@/components/ui/dynamic-image";
import { MdImageNotSupported } from "react-icons/md";
import Actions from "./_components/actions";

export default function Posts() {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <Post />
      <Post />
    </div>
  );
}

function Post() {
  return (
    <article className="main-wrapper bg-background rounded-md">
      <div className="main-inner-wrapper py-4 flex flex-col">
        <header className="flex">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex flex-col justify-evenly w-full">
            <div className="flex gap-1 items-end">
              <span className="font-bold leading-none shrink-0">Username</span>
              <span className="text-xs shrink leading-none text-zinc-400/70">
                @User
              </span>
            </div>
            <span className="text-xs text-zinc-400/70 font-medium">17d</span>
          </div>
          <PostMenu />
        </header>
        <figure className="mt-2 overflow-hidden rounded-md">
          <DynamicImage
            className="w-full max-h-[500px] object-contain bg-black"
            src="/samples/meme1.jpg"
            alt="meme"
            fallback={
              <div className="bg-zinc-200 aspect-square w-full flex justify-center items-center select-none text-7xl text-zinc-400/70">
                <MdImageNotSupported />
              </div>
            }
          />
        </figure>
        <Actions />
        <div className="mt-[0.35rem]">
          <span className="font-bold text-sm leading-none">Username</span>
          <span className="text-sm leading-4 ml-1">
            Yo, that was a good run! To the moon we go!!!!
          </span>
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
