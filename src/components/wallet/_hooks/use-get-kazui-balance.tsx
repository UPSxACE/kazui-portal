"use client";
import {
  Account,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
} from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const kazuiAddress = new PublicKey(
  process.env.NEXT_PUBLIC_SPL_TOKEN_ADDRESS ?? ""
);

// false means account doesn't exist
export default function useGetKazuiBalance(ownerAddress?: string | null) {
  console.log("Calling useGetKazuiBalance with:", ownerAddress);
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: [
      "kazui-balance",
      ownerAddress?.toString(),
      ownerAddress !== null,
    ],
    queryFn: async () => {
      if (!ownerAddress) return null;
      const ataAddress = getAssociatedTokenAddressSync(
        kazuiAddress,
        new PublicKey(ownerAddress)
      );

      const ata: false | Account = await getAccount(
        connection,
        ataAddress,
        undefined,
        TOKEN_PROGRAM_ID
      ).catch((err) => {
        if (err.name === TokenAccountNotFoundError.name) {
          console.log("No kazui token account");
          return false;
        }
        throw err;
      });

      return ata === false ? ata : ata.amount;
    },
    enabled: ownerAddress !== null,
  });

  console.log("DATA:", query.data);
  if (query.error) console.log(query.error);

  return query;
}
