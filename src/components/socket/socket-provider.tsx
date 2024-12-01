"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { useAppState } from "../wallet/app-state";
import { socket } from "./socket";

const MAX_TOP_HOLDERS = 7;

type SocketState = {
  connected: boolean;
  newestAccounts: NewestAccounts | null;
  richest: Richest | null;
  topHolders: TopHoldersData | null;
  reconnect: () => void;
};

type NewestAccounts = {
  address: string | null;
  date: number;
}[];
type Richest = {
  address: string | null;
  rubies: number;
}[];

const newestAccountsSchema = z
  .object({
    address: z.string().nullable(),
    date: z.number(),
  })
  .array();
const richestSchema = z
  .object({
    address: z.string().nullable(),
    rubies: z.number(),
  })
  .array();

type TopHoldersData = {
  address: string;
  kazui: number;
}[];

const topHoldersDataSchema = z
  .object({
    address: z.string(),
    kazui: z.number(),
  })
  .array();

const Context = createContext<SocketState | null>(null);

export function useSocketState() {
  const context = useContext(Context);
  if (!context) throw new Error("Add the SocketProvider component to the tree");
  return context;
}

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { credentials, wallet } = useAppState();
  const kazui = wallet.kazui !== false ? wallet.kazui ?? null : 0;
  const kazuiCalculated = kazui !== null ? Number(kazui) / 1e9 : null;
  const [comparedLeaderboard, setComparedLeaderboard] = useState(false);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newestAccounts, setNewestAccounts] = useState<NewestAccounts | null>(
    null
  );
  const [richest, setRichest] = useState<Richest | null>(null);
  const [topHolders, setTopHolders] = useState<TopHoldersData | null>(null);

  useEffect(() => {
    socket.connect();

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      setComparedLeaderboard(false);
    }

    function onNewestAccounts(updatedData: any) {
      const { data, success } = newestAccountsSchema.safeParse(updatedData);
      if (success) {
        setNewestAccounts(data);
      }
    }
    function onRichest(updatedData: any) {
      const { data, success } = richestSchema.safeParse(updatedData);
      if (success) {
        setRichest(data);
      }
    }
    function onTopHolders(updatedData: any) {
      const { data, success } = topHoldersDataSchema.safeParse(updatedData);
      console.log(data);
      if (success) {
        setTopHolders(data);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rts:newest-accounts", onNewestAccounts);
    socket.on("rts:richest", onRichest);
    socket.on("rts:top-holders", onTopHolders);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("rts:newest-accounts", onNewestAccounts);
      socket.off("rts:richest", onRichest);
      socket.off("rts:top-holders", onTopHolders);
    };
  }, []);

  useEffect(() => {
    const readyToCompare =
      isConnected &&
      !comparedLeaderboard &&
      topHolders &&
      kazuiCalculated !== null;

    if (readyToCompare) {
      setComparedLeaderboard(true);

      const inLeaderboard =
        topHolders.findIndex(
          (holder) => holder.address === credentials.address
        ) !== -1;
      if (topHolders.length < MAX_TOP_HOLDERS && !inLeaderboard) {
        console.log("??");
        // emit claim
        socket.emit("rts:top-holders:claim-spot");
        return;
      }

      let claim = false;
      topHolders.forEach((holder) => {
        const isUser = holder.address === credentials.address;

        const userHasMore =
          !isUser && !inLeaderboard && kazuiCalculated > holder.kazui;
        if (userHasMore) {
          claim = true;
          return;
        }

        const myBalanceChanged = isUser && holder.kazui !== kazuiCalculated;
        if (isUser && holder.kazui !== kazuiCalculated) {
          claim = true;
          return;
        }
      });

      // emit claim
      if (claim) socket.emit("rts:top-holders:claim-spot");
    }
  }, [
    isConnected,
    comparedLeaderboard,
    kazuiCalculated,
    topHolders,
    credentials,
  ]);

  const reconnect = () => {
    socket.disconnect();
    socket.connect();
  };

  return (
    <Context.Provider
      value={{
        connected: isConnected,
        newestAccounts,
        richest,
        topHolders,
        reconnect,
      }}
    >
      {children}
    </Context.Provider>
  );
}
