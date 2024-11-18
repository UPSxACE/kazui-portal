"use client";
import { Button } from "@/components/_sui/button";
import { Input } from "@/components/_sui/input";
import api from "@/lib/api";
import { FormEventHandler, useRef, useState } from "react";

export default function Page() {
  const [src, setSrc] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // const formdata = new FormData();
    // formdata.append("file", input.current?.files?.[0]);
    if (!input.current?.files?.[0]) return;
    api
      .postForm("/upload", {
        file: input.current.files?.[0],
      })
      .then(({ data }) => setSrc(data));
  };
  return (
    <form onSubmit={onSubmit} className="overflow-y-auto">
      <Input ref={input} className="text-white file:text-white" type="file" />
      <Button>Submit</Button>
      {src && (
        <img className="w-full h-auto" alt="uploaded picture" src={src} />
      )}
    </form>
  );
}
