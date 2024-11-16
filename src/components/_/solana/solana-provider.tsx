'use client'

import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import { ReactNode, useCallback } from "react";

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
  const endpoint = "https://api.devnet.solana.com"; //FIXME "https://api.mainnet-beta.solana.com";
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={autoconnect}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

