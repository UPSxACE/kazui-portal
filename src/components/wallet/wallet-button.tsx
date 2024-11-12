"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/_sui/dialog";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function WalletButton() {
  const { wallets, select, connecting, disconnecting, connected, disconnect } =
    useWallet();

  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const loading = connecting || disconnecting || !ready;

  const label = (function () {
    if (connected) return "Disconnect";
    if (connecting) return "Connecting...";
    if (disconnecting) return "Disconnecting...";
    if (loading) return "Loading...";
    return "Select wallet";
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

  return (
    <>
      <button disabled={loading} onClick={handleClick}>
        {label}
      </button>

      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogTitle>Select Wallet</DialogTitle>
          {wallets.map((wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={connectToWallet(wallet.adapter.name)}
            >
              {wallet.adapter.name}
            </button>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
