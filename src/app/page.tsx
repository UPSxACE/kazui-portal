import Events from "./_components/events";
import NewAccounts from "./_components/new-accounts";
import NewPost from "./_components/new-post";
import Posts from "./_components/posts";
import Richest from "./_components/richest";
import TopHolders from "./_components/top-holders";

export default function Page() {
  return (
    <div className="w-full flex justify-between gap-4 h-full">
      <aside className="basis-[20rem] py-4 hidden 2md:flex 2xl:flex flex-col gap-4 order-1 2xl:order-none overflow-y-auto hide-scroll">
        <Events />
        <Richest />
      </aside>
      <main className="text-font-1 h-landing flex flex-col overflow-y-auto hide-scroll flex-1 py-4">
        <NewPost />
        <Posts />
      </main>
      <aside className="basis-[20rem] py-4 hidden 2xl:flex flex-col gap-4 overflow-y-auto hide-scroll">
        <NewAccounts />
        <TopHolders />
      </aside>
    </div>
  );
}
