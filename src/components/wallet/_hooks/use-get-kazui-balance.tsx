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
      console.log("QUERY FN", ownerAddress);
      if (!ownerAddress) return null;
      console.log("not null");
      const ataAddress = getAssociatedTokenAddressSync(
        kazuiAddress,
        new PublicKey(ownerAddress)
      );
      console.log("ATA address:", ataAddress.toString());

      const ata: false | Account = await getAccount(
        connection,
        ataAddress,
        undefined,
        TOKEN_PROGRAM_ID
      )
        .then((val) => {
          console.log("Done!");
          return val;
        })
        .catch((err) => {
          console.log("FAILED");
          if (err.name === TokenAccountNotFoundError.name) {
            console.log("No kazui token account");
            return false;
          }
          console.log("Err:", err);
          throw err;
        });

      console.log("RESULT:", ata);
      return ata === false ? ata : ata.amount;
    },
    enabled: ownerAddress !== null,
  });

  console.log("DATA:", query.data);
  if (query.error) console.log(query.error);

  return query;
}
