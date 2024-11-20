import { useAppState } from "@/components/wallet/app-state";
import api from "@/lib/api";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import bs from "bs58";
import { useCallback, useEffect, useState } from "react";
import { decodeUTF8 } from "tweetnacl-util";
import { z } from "zod";

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
    loggedIn,
    credentials: { address, setAddress },
  } = useAppState();

  const adapterName = wallet?.adapter.name;

  const login = useCallback(async () => {
    if (!attempting) {
      return;
    }
    if (!connected && !connecting && !disconnecting) {
      // select
      if (adapterName === attempting) {
        // FIXME: add warning to connection to phantom; problems in connection, specially after changing wallet = reload page
        // NOTE: I solved a problem with connecting with wrong accounts(they would auto-connect with the wrong ones) with DisconnectResolution in solana-provider.tsx
        //       The fix did work with Solflare, but not with Phantom! H
        connect();
        return;
      } else {
        return select(attempting);
      }
    }

    if (connected && publicKey && signMessage) {
      console.log(connected, publicKey.toString(), signMessage);
      // if already loggedIn, stop here
      if (loggedIn) {
        setAttempting(false);
        return;
      }
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
      // FIXME: MODAL: watch if they are trying to login with different wallet and signing with other!
      // FIXME: catch -> MODAL: make sure you sign with the correct wallet if you have many!

      if (ok) {
        setAddress(publicKey.toString());
        setAttempting(false);
      }
    }

    if (!connecting && !disconnecting) {
      setAttempting(false);
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
