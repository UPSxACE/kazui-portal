"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/_sui/popover";
import { useAppState } from "@/components/wallet/app-state";
import { PopoverArrow } from "@radix-ui/react-popover";
import { WalletName } from "@solana/wallet-adapter-base";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import useAttemptLogin from "./_hooks/use-attempt-login";

export default function Account() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { credentials, wallet, loggedIn } = useAppState();

  function getContent() {
    if (loggedIn && credentials.profile === false) {
      return <span className="text-center w-full">Loading...</span>;
    }
    if (loggedIn && credentials.profile) {
      return <Connected />;
    }
    if (!loggedIn && wallet.status === "disconnected") {
      return <span className="text-center w-full">Connect</span>;
    }
    return <span className="text-center w-full">Loading...</span>;
  }

  // const handleAccountClick = () => {
  //   if (status === "waiting") {
  //     return handleClick();
  //   }
  //   if (status === "connected") {
  //     setMenuOpen((x) => !x);
  //   }
  // };

  // useEffect(() => {
  //   if (status !== "connected") {
  //     setMenuOpen(false);
  //   }
  // }, [menuOpen, status]);

  const attemptLogin = useAttemptLogin();
  const handleAccountClick = () => {
    if (!loggedIn && wallet.status === "disconnected") {
      attemptLogin("Solflare" as WalletName);
    }
  };
  const disconnect = () => {};
  return (
    <Popover open={menuOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={handleAccountClick}
          className="hidden lg:flex border border-solid border-gray-600/80 hover:border-gray-400 ml-2 h-11 w-44 py-[0.125rem] px-[0.35rem] rounded-md relative items-center justify-between gap-[0.3rem]"
        >
          {getContent()}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52" side={"bottom"} align="end">
        <PopoverArrow className="fill-background-lighter relative right-[4.28rem]" />
        <button className="w-full" onClick={disconnect}>
          Disconnect
        </button>
      </PopoverContent>
    </Popover>
  );
}

function Connected() {
  const {
    credentials: { profile },
  } = useAppState();

  if (!profile) return <span className="text-center w-full">Loading...</span>;

  return (
    <>
      <Avatar className="w-8 h-8">
        <AvatarImage src={profile.picture} />
        <AvatarFallback className="rounded-md">?</AvatarFallback>
      </Avatar>

      <span className="ml-[0.3rem]">{profile.nickname}</span>
      <span>
        <ChevronDown />
      </span>
    </>
  );
}
