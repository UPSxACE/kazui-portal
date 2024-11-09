"use client";
import logo from "@/../public/kazui-coin.svg";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../_sui/sheet";
import HamburgerMenu from "./_components/hamburger-button";

export default function MobileMenu() {
  return (
    <div className="ml-auto basis-1/3 flex justify-end">
      <Sheet>
        <SheetTrigger asChild>
          <HamburgerMenu className="h-12 p-1" />
        </SheetTrigger>
        <SheetContent side={"top"} className="bg-background-lighter">
          <SheetHeader>
            <div
              className="relative h-10"
              style={{ aspectRatio: logo.width / logo.height }}
            >
              <Image src={logo} alt="Kazui logo" fill />
            </div>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
