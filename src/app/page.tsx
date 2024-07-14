import LibMain, { LibCardContainer, LibH1 } from "./_components/lib-elements";
import { LeagueTable } from "./_components/league-table";
import { RecentEventList, UpcomingEventList } from "./_components/event-list";
import PrizeMoneyTable from "./_components/prize-money/prize-money";

export const metadata = {
  title: "Libtour - Home",
  description: "A summer-long series of events at Redlibbets",
};

export default async function Home() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Libtour 2024</LibH1>
      </div>
      {/* <div className="mx-1 mb-1 mt-4 grid grid-cols-1 gap-4 sm:mx-2 sm:mb-2 md:grid-cols-2 xl:mx-0 xl:mb-4"> */}
      <LibCardContainer splitAtLargeSizes={true}>
        <UpcomingEventList />
        <RecentEventList />
        <LeagueTable />
        <PrizeMoneyTable recordLimit={8} />
      </LibCardContainer>
    </LibMain>
  );
}
