import Link from "next/link";
import { api } from "~/trpc/server";
import LibMoney from "./lib-money";
import { ensure } from "~/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TeamDisplay } from "./lib-elements";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type ResultsProps = {
  compId: string;
};

export default async function Results({ compId }: ResultsProps) {
  const compResults = await api.comp.getResults({ comp: compId });
  const teams = await api.team.getAll();

  if (!compResults) return <p>No results</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          {/* <TableCaption>Event Results</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="px-1 sm:px-2">Pos</TableHead>
              <TableHead className="hidden px-1 sm:px-2 lg:table-cell">
                IG Position
              </TableHead>
              <TableHead className="px-1 sm:px-2">Name</TableHead>
              <TableHead className="px-1 sm:px-2">Team</TableHead>
              <TableHead className="hidden px-1 text-center sm:px-2 md:table-cell">
                Team Score
              </TableHead>
              <TableHead className="px-1 text-center sm:px-2">Score</TableHead>
              <TableHead className="px-1 text-right sm:px-2 ">£</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compResults.map((result) => (
              <TableRow key={result.position}>
                <TableCell className="px-1 sm:px-2">
                  {result.position}
                </TableCell>
                <TableCell className="hidden px-1 sm:px-2 lg:table-cell">
                  {result.igPosition}
                </TableCell>
                <TableCell className="px-1 font-medium sm:px-2">
                  <Link href={`/entrants/${result.entrant.id}`}>
                    <span className="mr-1 sm:mr-2">{result.entrant.name}</span>
                    {result.wildcard ? <Badge>WC</Badge> : null}
                  </Link>
                </TableCell>
                <TableCell className="px-1 sm:px-2">
                  <TeamDisplay
                    team={ensure(
                      teams.filter(
                        (team) => team.id == result.entrant.teamId,
                      )[0],
                    )}
                  ></TeamDisplay>
                  {/* {
                teams.filter((team) => team.id == result.entrant.teamId)[0]
                  ?.teamName
              } */}
                </TableCell>
                <TableCell className="hidden px-1 text-center sm:px-2 md:table-cell">
                  {result.teamScore ? result.teamScore : "NR"}
                </TableCell>
                <TableCell className="px-1 text-center sm:px-2">
                  {result.score ? result.score : "NR"}
                </TableCell>
                <TableCell className="px-1 text-right sm:px-2">
                  <LibMoney
                    hideZeros={true}
                    amountInPence={result.transactions.reduce(
                      (acc, cur) => acc + cur.netAmount,
                      0,
                    )}
                  />
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
      </CardContent>
    </Card>
  );
}

export async function Winners({ compId }: ResultsProps) {
  const compResults = await api.comp.getWinners({ comp: compId });
  const teams = await api.team.getAll();

  if (!compResults) return <p>No results</p>;

  return (
    <Table>
      {/* <TableCaption>Event Results</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="px-1 sm:px-2">Pos</TableHead>
          <TableHead className="hidden px-1 sm:px-2 lg:table-cell">
            IG Position
          </TableHead>
          <TableHead className="px-1 sm:px-2">Name</TableHead>
          <TableHead className="px-1 sm:px-2">Team</TableHead>
          <TableHead className="hidden px-1 text-center sm:px-2 md:table-cell">
            Team Score
          </TableHead>
          <TableHead className="px-1 text-center sm:px-2">Score</TableHead>
          <TableHead className="px-1 text-right sm:px-2">£</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compResults.map((result) => (
          <TableRow key={result.position}>
            <TableCell className="px-1 sm:px-2">{result.position}</TableCell>
            <TableCell className="hidden px-1 sm:px-2 lg:block">
              {result.igPosition}
            </TableCell>
            <TableCell className="px-1 font-medium sm:px-2">
              <span className="mr-1 sm:mr-2">{result.entrant.name}</span>
              {result.wildcard ? <Badge>WC</Badge> : null}
            </TableCell>
            <TableCell className="px-1 sm:px-2">
              <TeamDisplay
                team={ensure(
                  teams.filter((team) => team.id == result.entrant.teamId)[0],
                )}
              ></TeamDisplay>
            </TableCell>
            <TableCell className="hidden px-1 text-center sm:px-2 md:table-cell">
              {result.teamScore ? result.teamScore : "NR"}
            </TableCell>
            <TableCell className="px-1 text-center sm:px-2">
              {result.score ? result.score : "NR"}
            </TableCell>
            <TableCell className="px-1 text-right sm:px-2">
              <LibMoney
                hideZeros={true}
                amountInPence={result.transactions.reduce(
                  (acc, cur) => acc + cur.netAmount,
                  0,
                )}
              />
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
  );
}
