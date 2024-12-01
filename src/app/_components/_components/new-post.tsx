"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/_sui/dialog";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { useAppState } from "@/components/wallet/app-state";
import api from "@/lib/api";
import { AnimatePresence, motion } from "motion/react";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MdImage } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { z } from "zod";

// FIXME add character limit
export default function NewPost() {
  const {
    loggedIn,
    credentials: { profile },
  } = useAppState();

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (!loggedIn) {
      closeModal();
    }
  }, [loggedIn]);

  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageInput = useRef<HTMLInputElement | null>(null);
  const uploadImage: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (!imageInput.current?.files?.[0]) return;
    setUploading(true);
    await api
      .postForm("/upload", {
        file: imageInput.current.files[0],
      })
      .then(({ data }) => {
        return z.string().parse(data);
      })
      .then((url) => {
        setImage(url);
      })
      .catch((e) => {
        console.log(e);
      });

    setUploading(false);
    if (imageInput.current) imageInput.current.value = "";
  };
  const forceImageInputClick = () => imageInput.current?.click();
  const removeImage = () => setImage(null);

  const [posting, setPosting] = useState(false);
  const textInput = useRef<HTMLTextAreaElement | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const countCharacters: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setCharacterCount(e.target.value.length);
  };

  const createPost = async () => {
    setPosting(true);

    const post = {
      text: textInput.current?.value,
      picture: image || undefined,
    };

    await api
      .post("/post", post)
      .then(() => {
        // setModalOpen(false);
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });

    setPosting(false);
  };

  const [notFirstLoad, setNotFirstLoad] = useState(false);
  useEffect(() => {
    setNotFirstLoad(true);
  }, []);

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          key={"profile"}
          initial={{ opacity: notFirstLoad ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-4 shrink-0 bg-background mb-4 rounded-md flex gap-2 items-center"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile.picture} />
            <AvatarFallback className="">?</AvatarFallback>
          </Avatar>
          <button
            onClick={openModal}
            className="w-full h-10 bg-background-lighter rounded-md p-2 px-4 pr-2 rounded-e-full rounded-s-full flex items-center"
          >
            <input
              readOnly
              className="bg-transparent w-full cursor-pointer"
              placeholder="Write something..."
            />
            <div className="ml-auto text-[1.7rem] text-[#9ca3af]">
              <CiCirclePlus />
            </div>
          </button>
        </motion.div>
      )}
      <Dialog open={modalOpen && !!profile}>
        <DialogContent className="p-0" onInteractOutside={closeModal}>
          <DialogTitle
            onClose={closeModal}
            wrapperClassName="border-b border-solid border-background-light p-4"
          >
            Create post
          </DialogTitle>
          <DialogDescription asChild>
            <div className="rounded-sm px-0 pt-0">
              {profile && (
                <header className="flex px-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profile.picture} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col justify-evenly w-full">
                    <div className="flex gap-1 items-end">
                      <span className="font-bold leading-none shrink-0">
                        {profile.nickname}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-300/70 font-medium">
                      @{profile.username}
                    </span>
                  </div>
                </header>
              )}
              <Textarea
                ref={textInput}
                autoFocus
                onChange={countCharacters}
                placeholder="Write something..."
                className="pt-1 px-4 resize-none bg-transparent"
                rows={7}
              />
              {image && !uploading && (
                <div className="border-0 border-solid border-background-light rounded-md h-52 mx-4 my-4 relative overflow-hidden">
                  <button
                    onClick={forceImageInputClick}
                    className="flex relative w-full h-full"
                  >
                    <img
                      alt="post image"
                      className="absolute h-full w-full object-contain bg-black"
                      src={image}
                    />
                  </button>
                  <button
                    onClick={removeImage}
                    className="h-7 w-7 rounded-full hover:bg-background-lighter bg-background absolute top-3 right-3 justify-center items-center flex"
                  >
                    <RxCross2 />
                  </button>
                </div>
              )}
              {uploading && (
                <div className="border border-solid border-background-light rounded-sm h-52 mx-4 my-4 flex justify-center items-center">
                  <div
                    className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-e-blue-400 align-[-0.125em] text-gray-300 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                </div>
              )}
              <footer className="py-3 px-4 border-t border-solid border-background-light flex items-center">
                <div className="flex gap-0 text-zinc-200">
                  <input
                    disabled={uploading}
                    onChange={uploadImage}
                    ref={imageInput}
                    type="file"
                    id="post-image"
                    className="hidden"
                  />
                  <label
                    htmlFor="post-image"
                    className="font-medium text-3xl hover:cursor-pointer p-1"
                  >
                    <MdImage />
                  </label>
                  {/* <input type="file" id="post-video" className="hidden" />
                  <label
                    htmlFor="post-video"
                    className="font-medium text-3xl hover:cursor-pointer p-1"
                  >
                    <MdOutlineSlowMotionVideo />
                  </label> */}
                </div>
                <Button
                  onClick={createPost}
                  loading={posting}
                  disabled={
                    (characterCount < 1 && !image) || characterCount > 1000
                  }
                  className="ml-auto px-4 text-xs"
                  variant="success"
                >
                  POST
                </Button>
              </footer>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}
