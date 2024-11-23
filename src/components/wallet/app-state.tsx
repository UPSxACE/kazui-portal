"use client";
import { createContext, ReactNode, useContext } from "react";
import { Dialog } from "../_sui/dialog";
import CreateAccountModal from "./_components/create-account-modal";
import useCredentialsState from "./_components/use-credentials-state";
import useWalletState from "./_components/use-wallet-state";

export type AppState = {
  credentials: ReturnType<typeof useCredentialsState>;
  wallet: ReturnType<typeof useWalletState>;
  loggedIn: boolean;
};

export const AppStateContext = createContext<AppState | null>(null);

export function useAppState() {
  const appState = useContext(AppStateContext);
  if (!appState)
    throw new Error("Add the AppStateProvider component to the tree");

  return appState;
}

export function AppStateProvider({
  children,
  initialAddress,
}: {
  children: ReactNode;
  initialAddress?: string;
}) {
  // automatically fetches profile when address is set (use credentials.setAddress to set it)
  const credentials = useCredentialsState(initialAddress);
  // use this to connect and disconnect the wallets
  // (automatically disconnects the wallet if it doesn't match the credentials address)
  const wallet = useWalletState(credentials);
  const loggedIn = credentials.address !== null;

  const value = {
    credentials,
    wallet,
    loggedIn,
  };

  const createAccountModal = credentials.status === "creating-account";

  return (
    <AppStateContext.Provider value={value}>
      {children}
      <Dialog open={createAccountModal}>
        <CreateAccountModal />
      </Dialog>
    </AppStateContext.Provider>
  );
}
