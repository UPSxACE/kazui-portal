"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import { useSocketState } from "@/components/socket/socket-provider";
import DotsContextButton from "@/components/ui/dots-context-button";
import api from "@/lib/api";
import cuteDateSince from "@/lib/utils/cute-date-since";
import { ProfileData, profileDataSchema } from "@/schema/profile-data";
import { useQueries, UseQueryOptions } from "@tanstack/react-query";

export default function NewAccounts() {
  const socketState = useSocketState();
  const newestAccounts = socketState.newestAccounts || [];

  type TQueries = UseQueryOptions<ProfileData>[];
  const accounts = useQueries<TQueries>({
    queries: newestAccounts.map((account) => {
      return {
        queryKey: ["user", account.address ?? ""],
        queryFn: () =>
          api
            .get(`/user/profile`, {
              params: {
                address: account.address,
              },
            })
            .then(({ data }) => {
              return profileDataSchema.parse(data);
            }),
      };
    }),
  });

  const error = accounts.findIndex((result) => result.isError) !== -1;
  const isLoading = socketState.newestAccounts === null;
  const ready = !error && !isLoading;
  const data = accounts.reduce<ProfileData[]>((acc, curr) => {
    if (curr.isSuccess) {
      acc.push(curr.data);
    }
    return acc;
  }, []);

  return (
    <div className="w-full bg-background rounded-md overflow-hidden shrink-0">
      <h2 className="text-font-1 font-semibold text-lg px-3 py-2 bg-background-lighter">
        Newest Accounts
      </h2>
      {!ready && (
        <div className="py-3 rounded-sm flex justify-center items-center w-full bg-inherit">
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
      {ready && (
        <div className="flex flex-col gap-3 px-3 py-3">
          {data.map((profile) => {
            if (!profile) return null;
            return <Account key={profile.username} data={profile} />;
          })}
        </div>
      )}
    </div>
  );
}

function Account({ data }: { data: ProfileData }) {
  if (!data) return null;
  return (
    <article className="flex">
      <Avatar className="w-10 h-10">
        <AvatarImage src={data.picture || undefined} />
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
      <div className="ml-2 flex flex-col justify-evenly w-full">
        <div className="flex gap-1 items-end">
          <span className="font-bold leading-none shrink-0 text-font-1">
            {data.nickname}
          </span>
        </div>
        <span className="text-xs shrink leading-none text-zinc-400/70">
          @{data.username}
        </span>
      </div>
      <span className="ml-auto mt-auto mb-auto text-xs text-zinc-400/70 font-medium">
        {cuteDateSince(new Date(data.created_at))}
      </span>
    </article>
  );
}

function PostMenu() {
  return <DotsContextButton className="ml-auto" />;
}
