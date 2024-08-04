import { api } from "~/trpc/server";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import LibMoney from "./lib-money";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { EntrantDisplay } from "./lib-elements";

type TeamEntrantProps = {
  teamId: string;
};

export async function TeamEntrants({ teamId }: TeamEntrantProps) {
  // const team = await api.team.get({ team: teamId });
  const entrants = await api.entrant.summaryByTeam({ teamId: teamId });
  if (!entrants) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          {/* <TableCaption>Libtour Teams</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="sm:px2 px-1">Entrant</TableHead>
              <TableHead className="sm:px2 px-1 text-center">Events</TableHead>
              <TableHead className="sm:px2 px-1 text-center">
                Wildcards
              </TableHead>
              <TableHead className="sm:px2 px-1 text-right">Winnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entrants.map((entrant) => (
              <TableRow key={entrant.name}>
                <TableCell className="sm:px2 px-1 font-medium">
                  <EntrantDisplay
                    entrant={{ id: entrant.id, name: entrant.name }}
                  />
                  {/* <Link href={`/entrants/${entrant.id}`}>{entrant.name}</Link> */}
                </TableCell>
                <TableCell className="sm:px2 px-1 text-center">
                  {entrant.comps.length}
                </TableCell>
                <TableCell className="sm:px2 px-1 text-center">
                  {
                    entrant.comps.filter((comp) => comp.wildcard === true)
                      .length
                  }
                </TableCell>
                <TableCell className="sm:px2 px-1 text-right">
                  <LibMoney
                    amountInPence={entrant.transactions.reduce(
                      (acc, cur) => acc + cur.netAmount,
                      0,
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="sm:px2 px-1" colSpan={3}>
                Team Winnings
              </TableCell>
              <TableCell className="sm:px2 px-1 text-right font-medium">
                <LibMoney
                  amountInPence={entrants.reduce(
                    (acc, cur) =>
                      acc +
                      cur.transactions.reduce(
                        (acc2, cur2) => acc2 + cur2.netAmount,
                        0,
                      ),
                    0,
                  )}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
