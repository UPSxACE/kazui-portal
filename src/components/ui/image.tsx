"use client";
import NextImage, { ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  fallback?: boolean;
};

export default function Image({ fallback, ...props }: Props) {
  const [error, setError] = useState(false);
  // FIXME
  return (
    <NextImage
      {...props}
      src={
        error && fallback
          ? "/no-image-400.png"
          : props.src ?? "/no-image-400.png"
      }
      onError={() => setError(true)}
    />
  );
}
