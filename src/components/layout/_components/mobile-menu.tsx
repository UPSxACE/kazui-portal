"use client";
import logo from "@/../public/kazui-coin.svg";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/_sui/sheet";
import HamburgerMenu from "@/components/layout/_components/hamburger-button";
import Image from "next/image";
import Account from "./account";

export default function MobileMenu() {
  return (
    <div className="ml-auto basis-1/3 sm:basis-full flex justify-end lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <HamburgerMenu className="h-12 p-1" />
        </SheetTrigger>
        <SheetContent side={"top"} className="bg-background-lighter">
          <SheetHeader>
            {/* <div
              className="relative h-10"
              style={{ aspectRatio: logo.width / logo.height }}
            >
              <Image src={logo} alt="Kazui logo" fill />
            </div> */}
            <SheetDescription>
              <Account mobile />
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
