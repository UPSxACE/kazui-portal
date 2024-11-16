import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonProps, Button as SdnButton } from "../_sui/button";

type Props = Omit<ButtonProps, "variant"> & {
  variant: ButtonProps["variant"] | "success";
};

const Button = forwardRef<HTMLButtonElement, Props | ButtonProps>(
  function Button({ variant, ...props }, ref) {
    const _variant = variant !== "success" ? variant : null;

    const classes = (function () {
      if (variant === "success") {
        return "bg-green-700 hover:bg-green-700";
      }
      if (variant === "outline") {
        return "bg-transparent";
      }
      if (variant === "link") {
        return "text-white";
      }
    })();

    return (
      <SdnButton
        {...props}
        ref={ref}
        variant={_variant}
        className={twMerge("h-auto py-2 px-3", classes, props.className)}
      />
    );
  }
);

export default Button;
