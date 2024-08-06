import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";
import LibMoney from "../lib-money";
import Link from "next/link";
import { EntrantDisplay, LibCardNarrow, TeamDisplay } from "../lib-elements";
import { Suspense } from "react";

export type PrizeMoneyTableProps = {
  recordLimit?: number;
};

export default async function PrizeMoneyTable({
  recordLimit = 100,
}: PrizeMoneyTableProps) {
  const prizes = await api.entrant.entrantsByPrizeMoney({ limit: recordLimit });

  return (
    <LibCardNarrow
      title={`${recordLimit < 100 ? "Top " : ""}Prizewinners`}
      url="/prizewinners"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-1 sm:px-2">Entrant</TableHead>
            <TableHead className="px-1 sm:px-2">Team</TableHead>
            <TableHead className="hidden px-1 text-center sm:table-cell sm:px-2">
              Prizes
            </TableHead>
            <TableHead className="px-1 text-right sm:px-2">Winnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense>
            {prizes.map((entrant) => {
              return (
                <TableRow key={entrant.id}>
                  <TableCell className="px-1 sm:px-2">
                    <EntrantDisplay
                      entrant={{ id: entrant.id, name: entrant.name }}
                      alwaysDisplayLogo={true}
                    />
                    {/* <Link href={`/entrants/${entrant.id}`}>
                        {entrant.name}
                      </Link> */}
                  </TableCell>
                  <TableCell className="px-1 sm:px-2">
                    <TeamDisplay
                      team={{
                        id: entrant.teamId,
                        linkName: entrant.team.linkName,
                        teamName: entrant.team.teamName,
                      }}
                      alwaysDisplayLogo={true}
                      iconOnlyWhenSmall={true}
                    />
                  </TableCell>
                  <TableCell className="hidden px-1 text-center sm:table-cell sm:px-2">
                    {Number(entrant.transactions.length)}
                  </TableCell>
                  <TableCell className="px-1 text-right sm:px-2">
                    <Link href={`/entrants/${entrant.id}`}>
                      <LibMoney
                        amountInPence={Number(
                          entrant.transactions.reduce(
                            (acc, cur) => acc + cur.netAmount,
                            0,
                          ),
                        )}
                      />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </Suspense>
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}
