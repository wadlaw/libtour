import Link from "next/link";
import { api } from "~/trpc/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { LibCardNarrow, TeamDisplay } from "~/app/_components/lib-elements";

export async function LeagueTable() {
  const teams = await api.team.getAllWithPoints();
  const reducedTeams: typeof teams = [];
  teams.forEach((team) => {
    reducedTeams.push({
      ...team,
      points: team.teamPoints.reduce((acc, cur) => acc + cur.points, 0),
    });
  });
  const sortedTeams = reducedTeams.sort((a, b) => b.points - a.points);
  if (!teams) return null;
  return (
    <LibCardNarrow title="Lib Standings" url="/teams">
      <Table>
        {/* <TableCaption>Libtour Teams</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="px-1 sm:px-2">Team</TableHead>

            <TableHead className="px-1 text-center sm:px-2">Events</TableHead>
            <TableHead className="px-1 text-center sm:px-2">Wins</TableHead>
            <TableHead className="px-1 text-center  sm:px-2">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTeams.map((team) => (
            <TableRow key={team.teamName}>
              <TableCell className="px-1 font-medium sm:px-2">
                <TeamDisplay team={team} alwaysDisplayLogo={true} />
              </TableCell>
              <TableCell className="px-1 text-center sm:px-2">
                {team.teamPoints.length}
              </TableCell>
              <TableCell className="px-1 text-center sm:px-2">
                {team.teamPoints.filter((res) => res.points === 8).length}
              </TableCell>
              <TableCell className="px-1 text-center sm:px-2">
                <Link href={`/teams/${team.linkName}`}>
                  {team.teamPoints.reduce((acc, cur) => acc + cur.points, 0)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
      </Table>
    </LibCardNarrow>
  );
}
