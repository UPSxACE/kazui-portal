import { forwardRef } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "../_sui/button";
import { BsThreeDots } from "react-icons/bs";

const DotsContextButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function DotsContextButton(props, ref) {
    return (
      <Button
        variant="link"
        {...props}
        className={twMerge(
          "aspect-square h-full text-zinc-300/90 text-2xl p-1",
          props.className
        )}
      >
        <BsThreeDots className="!w-auto !h-auto" />
      </Button>
    );
  }
);

export default DotsContextButton;
