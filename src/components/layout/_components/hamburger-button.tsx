import { Button, ButtonProps } from "@/components/_sui/button";
import { forwardRef } from "react";
import { IoMenuSharp } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

const HamburgerMenu = forwardRef<HTMLButtonElement, ButtonProps>(
  function HamburgerMenu(props, ref) {
    return (
      <Button
        variant={"link"}
        ref={ref}
        {...props}
        className={twMerge(
          "text-[2.75rem] p-0 h-auto text-font-1",
          props.className
        )}
      >
        <IoMenuSharp className="!h-auto !w-auto" />
      </Button>
    );
  }
);

export default HamburgerMenu;
