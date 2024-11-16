import { useAppState } from "@/components/wallet/app-state";
import api from "@/lib/api";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import bs from "bs58";
import { useCallback, useEffect, useState } from "react";
import { decodeUTF8 } from "tweetnacl-util";
import { z } from "zod";

// first connect wallet
// then sign message
// then try get cookie from server
// server will answer with address, so set address // FIXME: debug react rerenders

export default function useAttemptLogin() {
  const [attempting, setAttempting] = useState<WalletName | false>(false);
  const {
    wallet,
    wallets,
    select,
    connect,
    signMessage,
    publicKey,
    connected,
    connecting,
    disconnecting,
    disconnect,
  } = useWallet();
  const {
    credentials: { setAddress },
  } = useAppState();

  const adapterName = wallet?.adapter.name;

  const login = useCallback(async () => {
    if (!attempting) return;
    if (!connected && !connecting && !disconnecting) {
      // select
      if (adapterName === attempting) {
        return connect();
      } else {
        return select(attempting);
      }
    }

    if (connected && publicKey && signMessage) {
      const address = publicKey.toString();
      // sign, request, get cookie, setaddress, setattempting to false
      const challenge = await api
        .get("/auth/get-challenge", {
          params: { address },
        })
        .then(({ data }) => {
          return z.string().parse(data);
        });

      const challengeBits = decodeUTF8(challenge);
      const signatureBits = await signMessage(challengeBits);
      let signature = bs.encode(signatureBits);
      const ok = await api
        .post("/auth/login", {
          address,
          challenge,
          signature,
        })
        .then(({ data }) => {
          return z.boolean().parse(data);
        });

      if (ok) {
        setAddress(publicKey.toString());
        setAttempting(false);
      }
    }
  }, [
    attempting,
    publicKey,
    connect,
    connected,
    connecting,
    disconnecting,
    select,
    signMessage,
    adapterName,
    setAddress,
  ]);

  useEffect(() => {
    if (attempting) {
      // login request
      login();
    }
  }, [attempting, publicKey, connected, login, adapterName]);

  function attempt(walletName: WalletName) {
    setAttempting(walletName);
  }

  return attempt;
}
