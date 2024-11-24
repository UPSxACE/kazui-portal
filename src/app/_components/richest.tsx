"use client";
import ruby from "@/../public/ruby.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import { useSocketState } from "@/components/socket/socket-provider";
import api from "@/lib/api";
import clampString from "@/lib/utils/clamp-string";
import dottedNumber from "@/lib/utils/dotted-number";
import { ProfileData, profileDataSchema } from "@/schema/profile-data";
import { useQueries, UseQueryOptions } from "@tanstack/react-query";
import Image from "next/image";

export default function Richest() {
  const socketState = useSocketState();
  const richest = socketState.richest || [];

  type TQueries = UseQueryOptions<ProfileData>[];
  const accounts = useQueries<TQueries>({
    queries: richest.map((account) => {
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
        Richest
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
      <Avatar className="w-9 h-9 rounded-md">
        <AvatarImage src={data.picture || undefined} />
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
      <div className="ml-2 flex flex-col justify-evenly w-full">
        <div className="flex gap-1 items-end">
          <span className="font-bold leading-none shrink-0 text-font-1">
            {clampString(data.nickname, 15)}
          </span>
        </div>
        <span className="text-xs shrink leading-none text-zinc-400/70">
          @{data.username}
        </span>
      </div>
      <div className="flex items-center gap-1 ml-auto mt-auto mb-auto">
        <span className="text-xs text-zinc-400/70 font-medium">
          {dottedNumber(data.rubies)}
        </span>
        <div
          className="relative h-4"
          style={{ aspectRatio: ruby.width / ruby.height }}
        >
          <Image src={ruby} alt="Ruby icon" fill unoptimized />
        </div>
      </div>
    </article>
  );
}
