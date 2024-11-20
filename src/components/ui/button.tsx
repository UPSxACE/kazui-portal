import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonProps, Button as SdnButton } from "../_sui/button";

type Props = Omit<ButtonProps, "variant"> & {
  variant: ButtonProps["variant"] | "success";
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant, loading = false, ...props },
  ref
) {
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
      disabled={props.disabled || loading}
      ref={ref}
      variant={_variant}
      className={twMerge("h-auto py-2 px-3 relative", classes, props.className)}
    >
      {props.children}
      {loading && (
        <div className="absolute left-0 right-0 rounded-sm flex justify-center items-center w-full bg-inherit">
          <div
            className="inline-block h-4 w-4 animate-spin rounded-full border-[2px] border-solid border-current border-e-gray-400 align-[-0.125em] text-gray-300 motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </SdnButton>
  );
});

export default Button;
