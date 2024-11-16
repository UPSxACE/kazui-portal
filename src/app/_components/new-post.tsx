"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import { useAppState } from "@/components/wallet/app-state";
import { AnimatePresence, motion } from "motion/react";
import { CiCirclePlus } from "react-icons/ci";

export default function NewPost() {
  const {
    credentials: { profile },
  } = useAppState();
  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-4 shrink-0 bg-background mb-4 rounded-md flex gap-2 items-center"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
