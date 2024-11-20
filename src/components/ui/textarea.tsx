import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Textarea as TextareaSdn } from "../_sui/textarea";

type Props = {};

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & Props
>(function Textarea({ ...props }, ref) {
  return (
    <TextareaSdn
      {...props}
      ref={ref}
      className={twMerge(
        "bg-background-light border-none rounded-sm text-font-1 placeholder:text-font-disabled",
        props.className
      )}
    />
  );
});

export default Textarea;
