"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_sui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/_sui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/_sui/popover";
import { useSocketState } from "@/components/socket/socket-provider";
import { useAppState } from "@/components/wallet/app-state";
import api from "@/lib/api";
import { PopoverArrow } from "@radix-ui/react-popover";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import useAttemptLogin from "./_hooks/use-attempt-login";

export default function Account({ mobile }: { mobile?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const { credentials, wallet, loggedIn } = useAppState();
  const { disconnect } = useWallet();
  const { reconnect } = useSocketState();

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

  const walletLoading =
    wallet.status !== "connected" && wallet.status !== "disconnected";

  const handleAccountClick = () => {
    if (!loggedIn && wallet.status === "disconnected") {
      setWalletDialogOpen(true);
    }
    if (loggedIn && !walletLoading) {
      setMenuOpen((x) => !x);
    }
  };

  const reconnectWallet = () => {
    setWalletDialogOpen(true);
  };
  const disconnectWallet = () => {
    disconnect();
  };
  const logout = () => {
    api.post("/auth/logout");
    credentials.setAddress(null);
    disconnect();
    setMenuOpen(false);
    reconnect();
  };

  // force close menu on user not logged in
  useEffect(() => {
    if (menuOpen && !loggedIn) {
      setMenuOpen(false);
    }
  }, [menuOpen, walletLoading, loggedIn]);

  return (
    <>
      <Popover open={menuOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={handleAccountClick}
            className={twJoin(
              "border border-solid ml-2 h-11 w-44 py-[0.125rem] px-[0.35rem] rounded-md relative items-center justify-between gap-[0.3rem]",
              mobile
                ? "flex border-white text-white"
                : "hidden lg:flex border-gray-600/80 hover:border-gray-400"
            )}
          >
            {getContent()}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-52 flex flex-col p-0 py-2"
          side={"bottom"}
          align="end"
        >
          <PopoverArrow className="fill-background-lighter relative right-[4.28rem]" />
          {loggedIn && wallet.status === "loading" && (
            <button className="w-full py-2 px-4 hover:bg-background leading-normal">
              ...
            </button>
          )}
          {loggedIn && wallet.status === "connected" && (
            <button
              className="w-full py-2 px-4 hover:bg-background leading-normal"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          )}
          {loggedIn && wallet.status === "disconnected" && (
            <button
              className="w-full py-2 px-4 hover:bg-background leading-normal"
              onClick={reconnectWallet}
            >
              Reconnect Wallet
            </button>
          )}
          {loggedIn && (
            <button
              className="w-full py-2 px-4 hover:bg-background leading-normal"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </PopoverContent>
      </Popover>
      <WalletDialog state={[walletDialogOpen, setWalletDialogOpen]} />
    </>
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

function WalletDialog({
  state,
}: {
  state: [boolean, Dispatch<SetStateAction<boolean>>];
}) {
  const [open, setOpen] = state;

  const { wallets } = useWallet();

  const attemptLogin = useAttemptLogin();

  const connectToWallet = (walletName: WalletName<string>) => {
    return () => {
      attemptLogin(walletName);
      setOpen(false);
    };
  };

  const ua = navigator.userAgent.toLowerCase();
  const isAndroid = ua.includes("android");
  const walletsFiltered = isAndroid ? wallets.slice(0, 1) : wallets;

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-96 px-0 pb-3 pt-5"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogTitle
          className="text-center text-2xl"
          wrapperClassName={twJoin(
            "p-8 pt-11 pb-5 flex justify-center items-center",
            walletsFiltered.length === 0 && "hidden"
          )}
          closeClassName="absolute top-4 right-4 p-2 bg-background-light rounded-full"
          onClose={() => setOpen(false)}
        >
          Connect a wallet on <br />
          Solana to continue
        </DialogTitle>
        <DialogDescription className="flex flex-col gap-2">
          {walletsFiltered.length === 0 && (
            <span className="text-center w-full block pt-1 pb-3 text-xl">
              No wallet extension detected.
            </span>
          )}
          {walletsFiltered.map((wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={connectToWallet(wallet.adapter.name)}
              className="flex justify-start items-center px-4 hover:bg-background-light py-2"
            >
              <img
                className="h-7 w-7"
                src={wallet.adapter.icon}
                alt="wallet icon"
              />
              <span className="ml-3 text-lg">{wallet.adapter.name}</span>
              <span className="ml-auto text-base text-zinc-300/80">
                Detected
              </span>
            </button>
          ))}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
