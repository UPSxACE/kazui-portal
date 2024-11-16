import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Input as InputSdn } from "../_sui/input";

type Props = {};

const Input = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & Props
>(function Input({ ...props }, ref) {
  return (
    <InputSdn
      {...props}
      ref={ref}
      className={twMerge(
        "bg-background-light border-none rounded-sm text-font-1 placeholder:text-font-disabled",
        props.className
      )}
    />
  );
});

export default Input;
