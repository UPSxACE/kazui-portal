import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import { CiCirclePlus } from "react-icons/ci";

export default function NewPost() {
  return (
    <div className="p-4 shrink-0 bg-background mb-4 rounded-md flex gap-2 items-center">
      <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="">?</AvatarFallback>
      </Avatar>
      <div className="w-full h-10 bg-background-lighter rounded-md p-2 px-4 pr-2 rounded-e-full rounded-s-full flex items-center">
        <input
          className="bg-transparent w-full"
          placeholder="Write something..."
        ></input>
        <div className="ml-auto text-[1.7rem] text-[#9ca3af]">
          <CiCirclePlus />
        </div>
      </div>
    </div>
  );
}
