import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";
import LibMoney from "./lib-money";
import Link from "next/link";
import { TeamDisplay } from "./lib-elements";

type PrizeMoneyTableProps = {
  recordLimit?: number;
};

export default async function PrizeMoneyTable({
  recordLimit = 100,
}: PrizeMoneyTableProps) {
  const prizes = await api.entrant.entrantsByPrizeMoney({ limit: recordLimit });

  return (
    <Card>
      <CardHeader>
        <Link href="/prizewinners">
          <CardTitle>{recordLimit < 100 ? "Top " : ""}Prizewinners</CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-1 sm:px-2">Entrant</TableHead>
              <TableHead className="px-1 sm:px-2">Team</TableHead>
              <TableHead className="hidden px-1 text-center sm:table-cell sm:px-2">
                Prizes
              </TableHead>
              <TableHead className="px-1 text-right sm:px-2">
                Winnings
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.map((entrant) => {
              return (
                <TableRow key={entrant.id}>
                  <TableCell className="px-1 sm:px-2">
                    <Link href={`/entrants/${entrant.id}`}>{entrant.name}</Link>
                  </TableCell>
                  <TableCell className="px-1 sm:px-2">
                    <TeamDisplay
                      team={{
                        id: entrant.teamId,
                        linkName: entrant.linkName,
                        teamName: entrant.teamName,
                      }}
                      alwaysDisplayLogo={true}
                    />
                  </TableCell>
                  <TableCell className="hidden px-1 text-center sm:table-cell sm:px-2">
                    {Number(entrant.prizeCount)}
                  </TableCell>
                  <TableCell className="px-1 text-right sm:px-2">
                    <LibMoney amountInPence={Number(entrant.totalWinnings)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
