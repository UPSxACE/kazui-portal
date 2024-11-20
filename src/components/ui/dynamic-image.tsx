"use client";
import { ImgHTMLAttributes, ReactNode, useState } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  fallback: ReactNode;
};

export default function DynamicImage({ fallback, ...props }: Props) {
  const [error, setError] = useState(false);

  if (error) return fallback;

  // FIXME
  return <img {...props} alt={props.alt} onError={() => setError(true)} />;
}
