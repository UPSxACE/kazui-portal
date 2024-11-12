"use client";
import coin from "@/../public/kazui-currency.svg";
import ruby from "@/../public/ruby.svg";
import { useWalletState } from "@/components/wallet/wallet-state";
import Image from "next/image";

export default function Balance() {
  const { kazui, profile } = useWalletState();
  const rubys = profile?.rubys;

  if (!kazui || !rubys) return <div className="ml-auto"></div>;

  return (
    <button className="text-sm hidden lg:flex border border-solid border-gray-600/80 group hover:border-gray-400 ml-auto h-11 py-2 px-3 rounded-md relative items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <span>{kazui}</span>
        <div
          className="relative h-4"
          style={{ aspectRatio: coin.width / coin.height }}
        >
          <Image src={coin} alt="Kazui logo" fill unoptimized />
        </div>
      </div>
      <div className="w-[1px] h-full bg-gray-600/80 group-hover:bg-gray-400" />
      <div className="flex items-center gap-1">
        <span>{rubys}</span>
        <div
          className="relative h-4"
          style={{ aspectRatio: ruby.width / ruby.height }}
        >
          <Image src={ruby} alt="Ruby icon" fill unoptimized />
        </div>
      </div>
    </button>
  );
}
