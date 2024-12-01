"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/_sui/dialog";
import { Textarea } from "@/components/_sui/textarea";
import Button from "@/components/ui/button";
import DotsContextButton from "@/components/ui/dots-context-button";
import DynamicImage from "@/components/ui/dynamic-image";
import { useAppState } from "@/components/wallet/app-state";
import api from "@/lib/api";
import cuteDateSince from "@/lib/utils/cute-date-since";
import { PostData, PostWithCommentData } from "@/schema/post-data";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { MdImageNotSupported } from "react-icons/md";
import { twJoin } from "tailwind-merge";

export default function PostFull({ data }: { data: PostWithCommentData }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const {
    loggedIn,
    credentials: { profile },
  } = useAppState();

  // FIXME -> make a hook
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (!loggedIn) {
      closeModal();
    }
  }, [loggedIn]);

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
    };

    await api
      .post(`/post/${data.id}/comment`, post)
      .then(() => {
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });

    setPosting(false);
  };

  //
  const client = useQueryClient();
  const [delta, setDelta] = useState(0);
  const [likedLocal, setLikedLocal] = useState(data.liked);
  const [locked, setLocked] = useState(false);

  const toggle = () => {
    if (typeof data.liked === "undefined" || locked) return;
    setLocked(true);
    if (likedLocal) {
      setLikedLocal(false);
      setDelta((x) => x - 1);
      api.post(`/post/${data.id}/dislike`).then(() => {
        setLocked(false);
        client.invalidateQueries({
          queryKey: ["post", data.id, "with-comments"],
          exact: true,
        });
        client.invalidateQueries({
          queryKey: ["post", data.id],
          exact: true,
        });
      });
      return;
    }
    setLikedLocal(true);
    setDelta((x) => x + 1);
    api.post(`/post/${data.id}/like`).then(() => {
      setLocked(false);
      client.invalidateQueries({
        queryKey: ["post", data.id, "with-comments"],
        exact: true,
      });
      client.invalidateQueries({
        queryKey: ["post", data.id],
        exact: true,
      });
    });
  };

  return (
    <article className="main-wrapper px-0 bg-background rounded-md flex flex-col overflow-hidden">
      <header className="p-4 py-2 text-lg bg-background-lighter">
        <button
          className="font-medium flex items-center h-[1.75rem] "
          onClick={() => {
            router.push("/");
          }}
        >
          <FaArrowLeft className="mr-1" />
          <span className="mb-[0.15rem] text-xl leading-none">Back</span>
        </button>
      </header>
      <div className="main-inner-wrapper px-4 pt-4 pb-2 flex flex-col">
        <header className="flex">
          <Avatar className="w-10 h-10">
            <AvatarImage src={data.owner.picture || undefined} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex flex-col justify-evenly w-full">
            <div className="flex gap-1 items-end">
              <span className="font-bold leading-none shrink-0">
                {data.owner.nickname}
              </span>
              <span className="text-xs shrink leading-none text-zinc-400/70">
                @{data.owner.username}
              </span>
            </div>
            <span className="text-xs text-zinc-400/70 font-medium">
              {cuteDateSince(new Date(data.created_at))}
            </span>
          </div>
          <PostMenu />
        </header>
        <div className="mt-[0.35rem] py-1">
          <span className="text-base leading-4 whitespace-break-spaces">
            {data.text}
          </span>
        </div>
        {data?.images?.[0]?.path && (
          <figure
            className={twJoin(
              "mt-2 overflow-hidden rounded-md",
              !ready && "min-h-[500px]"
            )}
          >
            <DynamicImage
              onLoad={() => setReady(true)}
              className="w-full max-h-[500px] object-contain bg-black"
              src={data.images[0].path}
              alt="meme"
              fallback={
                <div className="bg-zinc-200 aspect-square w-full flex justify-center items-center select-none text-7xl text-zinc-400/70">
                  <MdImageNotSupported />
                </div>
              }
            />
          </figure>
        )}
        <div className="flex py-2 items-center">
          <button onClick={toggle} className="text-font-1 text-[1.3rem] mr-4">
            {likedLocal ? (
              <FaHeart className="text-pink-500" />
            ) : (
              <FaRegHeart />
            )}
          </button>
          <div className="flex items-center gap-[0.25rem] mr-4">
            <span className="text-lg leading-none">
              {data.likes_count + delta}
            </span>
            <span className="text-base leading-[1.127rem]">likes</span>
          </div>
          <div className="flex items-center gap-[0.25rem] mr-10">
            <span className="text-lg leading-none">{data.comments_count}</span>
            <span className="text-base leading-[1.127rem]">comments</span>
          </div>
        </div>
        {profile && (
          <>
            <div className="border-b border-solid border-[#55555566] mt-0" />
            <div
              key={"profile"}
              className={twJoin(
                "mt-3 shrink-0 bg-background mb-1 rounded-md flex gap-2 items-center",
                data.comments.length > 0 && "mb-3"
              )}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile.picture} />
                <AvatarFallback className="">?</AvatarFallback>
              </Avatar>
              <button
                onClick={openModal}
                className="border-0 w-full h-10 bg-background-lighter rounded-md p-2 px-4 pr-2 rounded-e-full rounded-s-full flex items-center"
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
            </div>{" "}
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
                      className="border-0 pt-1 px-4 resize-none bg-transparent"
                      rows={7}
                    />
                    <footer className="py-3 px-4 border-t border-solid border-background-light flex items-center">
                      <div className="flex gap-0 text-zinc-200">
                        {/** FIXME - image not supported yet */}
                        {/* <input
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
                        </label> */}
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
                        disabled={characterCount < 1}
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
          </>
        )}
        {data.comments.length > 0 && (
          <>
            <div className="border-b border-solid border-[#55555566]" />
            {data.comments.map((comment) => (
              <article
                key={comment.id}
                className="mt-1 first-of-type:!mt-3 flex mb-1"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.owner.picture || undefined} />
                  <AvatarFallback className="">?</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="ml-2 border-0 w-fit bg-background-lighter rounded-xl p-2 px-3 flex flex-col items-start">
                    <span className="text-lg leading-[1.1] font-semibold">
                      {comment.owner.nickname}
                    </span>
                    <p className="bg-transparent w-full text-sm whitespace-break-spaces">
                      {comment.text}
                    </p>
                  </div>
                  <span className="ml-3 mt-1 text-xs">
                    {cuteDateSince(new Date(comment.created_at))}
                  </span>
                </div>
              </article>
            ))}
          </>
        )}
      </div>
      {/* <div className="bg-background-lighter p-4 py-2">aaa</div> */}
      {/* <div className="mt-1 mb-1 flex items-center text-base gap-[0.35rem] px-4 py-2">
        <button onClick={toggle} className="text-font-1 text-[1.3rem] mr-5">
          {liked ? <FaHeart className="text-pink-500" /> : <FaRegHeart />}
        </button>
        <button className="text-[1.3rem]">
          <FaRegComment />
        </button>
      </div> */}
    </article>
  );
}

function PostMenu() {
  return <DotsContextButton className="ml-auto" />;
}
