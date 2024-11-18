import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import useGetKazuiBalance from "../_hooks/use-get-kazui-balance";
import useCredentialsState from "./use-credentials-state";

export default function useWalletState(
  credentials: ReturnType<typeof useCredentialsState>
) {
  // false means it doesn't have a kazui wallet
  const kazuiQuery = useGetKazuiBalance(credentials.address);

  const {
    wallet,
    wallets,
    select,
    connecting,
    disconnecting,
    connected,
    disconnect,
    signMessage,
    publicKey,
  } = useWallet();

  const error = kazuiQuery.error; // TODO: trigger error toast on error

  const walletStatus = (function () {
    if (disconnecting || connecting || error) {
      //FIXME || !firstRender
      return "loading";
    }
    if (!connected) {
      return "disconnected";
    }
    if (connected && !credentials.address) {
      // NOTE: wallet shouldn't be connected without a session unless it's currently trying to login and get the session cookie
      return "waiting-login";
    }
    if (connected && credentials.address !== publicKey?.toString()) {
      return "wrong-wallet"; // TODO: trigger modal
    }
    return "connected";
  })();

  useEffect(() => {
    if (walletStatus === "wrong-wallet") {
      disconnect();
    }
  }, [walletStatus, disconnect]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (walletStatus === "waiting-login") {
      timeout = setTimeout(() => {
        console.log("waiting for login for too long");
      }, 5000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [walletStatus]);

  return {
    kazui: kazuiQuery.data,
    status: walletStatus as typeof walletStatus,
    refetchKazui: kazuiQuery.refetch,
  };
}
