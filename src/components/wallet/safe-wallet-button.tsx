"use client";

import dynamic from "next/dynamic";

require("@solana/wallet-adapter-react-ui/styles.css");

const SafeWalletButton = dynamic(() => import("./wallet-button"), {
  ssr: false,
});

export default SafeWalletButton;
