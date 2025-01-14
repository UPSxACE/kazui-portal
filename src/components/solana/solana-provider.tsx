'use client'

import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import dynamic from "next/dynamic";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
  }
);

export function SolanaProvider({
  children,
  autoconnect = true,
}: {
  children: ReactNode;
  autoconnect?: boolean;
}) {
  const [disconnected, setDisconnected] = useState<boolean | null>(null);

  const endpoint =
    process.env.NEXT_PUBLIC_RPC || "https://api.devnet.solana.com"; //FIXME "https://api.mainnet-beta.solana.com";
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  const autoconnectResolved = autoconnect && disconnected !== true;
  const wallets = useMemo(() => [new SolflareWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={autoconnectResolved}
      >
        <WalletModalProvider>
          <DisconnectResolution
            disconnectState={[disconnected, setDisconnected]}
          >
            {children}
          </DisconnectResolution>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function DisconnectResolution({
  disconnectState,
  children,
}: {
  disconnectState: [boolean | null, Dispatch<SetStateAction<boolean | null>>];
  children: ReactNode;
}) {
  const [disconnected, setDisconnected] = disconnectState;
  const { connected, connecting, disconnecting } = useWallet();
  const walletLoading = connecting || disconnecting;
  const _disconnected = !walletLoading && !connected;

  useEffect(() => {
    if (disconnected !== _disconnected) {
      setDisconnected(_disconnected);
    }
  }, [_disconnected, disconnected, setDisconnected]);

  return children;
}