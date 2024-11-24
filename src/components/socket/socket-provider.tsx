"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { socket } from "./socket";

type SocketState = {
  connected: boolean;
  newestAccounts: NewestAccounts | null;
  richest: Richest | null;
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

const Context = createContext<SocketState | null>(null);

export function useSocketState() {
  const context = useContext(Context);
  if (!context) throw new Error("Add the SocketProvider component to the tree");
  return context;
}

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [newestAccounts, setNewestAccounts] = useState<NewestAccounts | null>(
    null
  );
  const [richest, setRichest] = useState<Richest | null>(null);

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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rts:newest-accounts", onNewestAccounts);
    socket.on("rts:richest", onRichest);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("rts:newest-accounts", onNewestAccounts);
      socket.off("rts:richest", onRichest);
    };
  }, []);

  const reconnect = () => {
    socket.disconnect();
    socket.connect();
  };

  return (
    <Context.Provider
      value={{ connected: isConnected, newestAccounts, richest, reconnect }}
    >
      {children}
    </Context.Provider>
  );
}
