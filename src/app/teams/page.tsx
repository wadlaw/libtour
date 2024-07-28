import { LeagueTable } from "../_components/league-table";
import LibMain, {
  LibCardContainer,
  LibH1,
} from "~/app/_components/lib-elements";

export const metadata = {
  title: "Libtour - Events",
  description: "A Summer-long series of events at Redlibbets",
};

export default async function Home() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Teams</LibH1>
      </div>
      <LibCardContainer>
        <LeagueTable />
      </LibCardContainer>
    </LibMain>
  );
}
