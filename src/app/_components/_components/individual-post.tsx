import api from "@/lib/api";
import { postWithCommentsDataSchema } from "@/schema/post-data";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import PostFull from "./post-full";

export default function IndividualPost({ postId }: { postId: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createAddSearchParams = useCallback(
    (paramValues: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.keys(paramValues).forEach((key) => {
        if (params.has(key)) params.delete(key, paramValues[key]);
        params.set(key, paramValues[key]);
      });
      return params.toString();
    },
    [searchParams]
  );
  const createDeleteSearchParam = useCallback(
    (paramKey: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(paramKey);
      return params.toString();
    },
    [searchParams]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", postId, "with-comments"],
    queryFn: () =>
      api
        .get(`/post/${postId}`, {
          params: { comments: true },
        })
        .then(({ data }) => {
          return postWithCommentsDataSchema.parse(data);
        }),
  });

  const ready = !isLoading && !error;
  console.log(data);

  return (
    <main className="text-font-1 h-landing flex flex-col overflow-y-auto hide-scroll flex-1 py-4">
      <div className="flex-1 relative">
        {!ready && (
          <div className="rounded-sm flex justify-center items-center w-full bg-inherit">
            <div
              className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-solid border-current border-e-red-500 align-[-0.125em] text-gray-300 motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        )}
        {ready && data && <PostFull data={data} />}
      </div>
    </main>
  );
}
