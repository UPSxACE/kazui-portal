import Dexscreener from "@/components/icons/dexscreener";
import Link from "next/link";
import { ReactNode } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function FollowUs() {
  return (
    <div className="w-full bg-background rounded-md overflow-hidden shrink-0">
      <h2 className="text-font-1 font-semibold text-lg px-3 py-2 bg-background-lighter">
        Follow Us
      </h2>
      <div className="flex gap-3 px-3 py-3 justify-evenly">
        <IconLink href="https://twitter.com/Kazui_Club">
          <FaXTwitter />
        </IconLink>
        <IconLink href="https://dexscreener.com/solana/cqlhcuudf5gncuhp3mnpnhzfwugpemuwhztnsmcdf4t">
          <Dexscreener />
        </IconLink>
        <IconLink href="https://t.me/Kazui_club">
          <FaTelegramPlane className="pr-[0.15rem]" />
        </IconLink>
        <IconLink href="https://www.instagram.com/kazui.club">
          <FaInstagram />
        </IconLink>
      </div>
    </div>
  );
}

function IconLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link
      target="_blank"
      href={href}
      className="text-font-1 hover:text-white border-2 border-font-1 hover:border-white border-solid rounded-full h-9 w-9 text-xl flex justify-center items-center"
    >
      {children}
    </Link>
  );
}
