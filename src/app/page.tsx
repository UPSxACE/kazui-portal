import { IoCompassOutline } from "react-icons/io5";
import Posts from "./_components/posts";
import NewAccounts from "./_components/new-accounts";
import Events from "./_components/events";

export default function Page() {
  return (
    <div className="w-full flex justify-center gap-4">
      <aside className="basis-[15rem] py-4 pl-4 pr-2 hidden 2lg:block order-1 2xl:order-none">
        <Events />
      </aside>
      <main className="text-font-1 h-landing flex flex-col overflow-y-auto hide-scroll flex-1">
        <header className="main-wrapper border-b border-solid border-zinc-500/40 text-font-1">
          <div className="main-inner-wrapper py-3 items-center flex text-3xl leading-none">
            <IoCompassOutline />
            <h1 className="font-medium ml-1 text-lg">Explore</h1>
          </div>
        </header>
        <Posts />
      </main>
      <aside className="basis-[15rem] py-4 pl-2 pr-4 hidden 2xl:block">
        <NewAccounts />
      </aside>
    </div>
  );
}
