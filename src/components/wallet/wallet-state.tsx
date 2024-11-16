"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/_sui/dialog";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { twJoin } from "tailwind-merge";
import { decodeUTF8 } from "tweetnacl-util";
import useGetKazuiBalance from "./_hooks/use-get-kazui-balance";

export type WalletState = {
  loggedInAddress: string | null;
  modalOpen: boolean;
  handleClick: () => void;
  loading: boolean;
  connecting: boolean;
  disconnecting: boolean;
  connected: boolean;
  label:
    | "Disconnect"
    | "Connecting..."
    | "Disconnecting..."
    | "Loading..."
    | "Select wallet";
  status:
    | "connected"
    | "profile-ready"
    | "all-ready"
    | "connecting"
    | "disconnecting"
    | "loading"
    | "waiting";
  disconnect: () => Promise<void>;
  kazui: string | null;
  profile: {
    rubies: string;
    username: string;
    nickname: string;
  } | null;
};

export const WalletStateContext = createContext<WalletState | null>(null);

export function useWalletState() {
  const walletState = useContext(WalletStateContext);
  if (!walletState)
    throw new Error("Please add the WalletStateProvider component to the tree");

  return walletState;
}

export function WalletStateProvider({
  children,
  initialAddress,
}: {
  children: ReactNode;
  initialAddress?: string;
}) {
  const [loggedInAddress, setLoggedInAddress] = useState(
    initialAddress || null
  );

  const {
    wallets,
    select,
    connecting,
    disconnecting,
    connected,
    disconnect,
    signMessage,
    publicKey,
  } = useWallet();

  const tesss = useGetKazuiBalance({ ownerAddress: publicKey });
  console.log(tesss.data);

  async function generateSignature() {
    return;
    if (!publicKey) throw new Error("Public key not ready");
    if (!signMessage) throw new Error("Sign message function not ready");
    const message = publicKey.toString() + ":" + Date.now();
    const messageBits = decodeUTF8(message);
    const signatureBits = await signMessage(messageBits);
    let signatureStr = "";
    for (let i = 0; i < signatureBits.length; i++) {
      signatureStr += String.fromCharCode(signatureBits[i]);
    }
    const signature = btoa(signatureStr);
    function base64ToUint8Bits(base64String: string) {
      const binaryString = atob(base64String); // Decode base64 to binary string
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      return uint8Array;
    }
    const reverseTest = base64ToUint8Bits(signature);
    console.log({ message, signature: btoa(signature) });
    function areUint8ArraysEqual(arr1: Uint8Array, arr2: Uint8Array) {
      // Check if they are the same length
      if (arr1.length !== arr2.length) {
        return false;
      }

      // Compare each element
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }

      // If all elements are the same, the arrays are equal
      return true;
    }
    console.log("EQUAL:", areUint8ArraysEqual(signatureBits, reverseTest));

    return { message, signature };
  }

  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const [kazui, setKazui] = useState<WalletState["kazui"]>(null);
  const [profile, setProfile] = useState<WalletState["profile"]>(null);

  const loading = connecting || disconnecting || !ready;

  const label = (function () {
    if (connected) return "Disconnect";
    if (connecting) return "Connecting...";
    if (disconnecting) return "Disconnecting...";
    if (loading) return "Loading..."; // NOTE: fallback
    return "Select wallet";
  })();

  const status = (function () {
    if (connected) {
      if (profile) return "profile-ready";
      if (kazui) return "all-ready";
      return "connected";
    }
    if (connecting) return "connecting";
    if (disconnecting) return "disconnecting";
    if (loading) return "loading"; // NOTE: fallback
    return "waiting";
  })();

  const handleClick = () => {
    if (connected) {
      disconnect();
      setOpen(false);
    }
    if (!loading && !connected) setOpen(true);
  };

  const connectToWallet = (walletName: WalletName<string>) => {
    return () => {
      select(walletName);
      setOpen(false);
    };
  };

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (status === "connected" && publicKey && signMessage) {
      generateSignature();
      // timeout = setTimeout(() => {
      //   setKazui("14.8M");
      //   setProfile({
      //     username: "username",
      //     nickname: "Username",
      //     rubies: "100.000",
      //   });
      // }, 1000);
      return;
    }

    setKazui(null);
    setProfile(null);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [status, publicKey, signMessage]);

  const value: WalletState = {
    loggedInAddress,
    modalOpen: open,
    handleClick,
    loading,
    connecting,
    disconnecting,
    connected,
    label,
    status,
    disconnect,
    kazui,
    profile,
  };

  return (
    <WalletStateContext.Provider value={value}>
      {children}
      <Dialog open={open}>
        <DialogContent
          className="max-w-96 px-0 pb-3 pt-5"
          onInteractOutside={() => setOpen(false)}
        >
          <DialogTitle
            className="text-center text-2xl"
            wrapperClassName={twJoin(
              "p-8 pt-11 pb-5 flex justify-center items-center",
              wallets.length === 0 && "hidden"
            )}
            closeClassName="absolute top-4 right-4 p-2 bg-background-light rounded-full"
            onClose={() => setOpen(false)}
          >
            Connect a wallet on <br />
            Solana to continue
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            {wallets.length === 0 && (
              <span className="text-center w-full block pt-1 pb-3 text-xl">
                No wallet extension detected.
              </span>
            )}
            {wallets.map((wallet) => (
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
    </WalletStateContext.Provider>
  );
}
