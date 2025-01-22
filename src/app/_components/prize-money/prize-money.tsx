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
import { Link } from "next-view-transitions";
import { EntrantDisplay, LibCardNarrow, TeamDisplay } from "../lib-elements";
import { Skeleton } from "~/components/ui/skeleton";

export type PrizeMoneyTableProps = {
  recordLimit?: number;
};

export default async function PrizeMoneyTable({
  recordLimit = 40,
}: PrizeMoneyTableProps) {
  const prizes = await api.entrant.entrantsByPrizeMoney({ limit: recordLimit });

  return (
    <LibCardNarrow
      title={`${recordLimit < 40 ? "Top " : ""}Prizewinners`}
      url="/prizewinners"
      transitionClass="prizewinners"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-1 @2xl/libcard:px-2">Entrant</TableHead>
            <TableHead className="px-1 @2xl/libcard:px-2">Team</TableHead>
            <TableHead className="hidden px-1 text-center @2xl/libcard:table-cell @2xl/libcard:px-2">
              Prizes
            </TableHead>
            <TableHead className="px-1 text-right @2xl/libcard:px-2">
              Winnings
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {prizes.map((entrant) => {
            return (
              <TableRow key={entrant.id}>
                <TableCell className="px-1 @2xl/libcard:px-2">
                  <EntrantDisplay
                    entrant={{ id: entrant.id, name: entrant.name }}
                    alwaysDisplayLogo={true}
                  />
                  {/* <Link href={`/entrants/${entrant.id}`}>
                        {entrant.name}
                      </Link> */}
                </TableCell>
                <TableCell className="px-1 @2xl/libcard:px-2">
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
                <TableCell className="hidden px-1 text-center @2xl/libcard:table-cell @2xl/libcard:px-2">
                  <Link href={`/entrants/${entrant.id}`}>
                    {Number(entrant.transactions.length)}
                  </Link>
                </TableCell>
                <TableCell className="px-1 text-right @2xl/libcard:px-2">
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
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}

export async function PrizeMoneySkeleton({
  recordLimit = 40,
}: PrizeMoneyTableProps) {
  return (
    <LibCardNarrow
      title={`${recordLimit < 40 ? "Top " : ""}Prizewinners`}
      url="/prizewinners"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-1 @2xl/libcard:px-2">Entrant</TableHead>
            <TableHead className="px-1 @2xl/libcard:px-2">Team</TableHead>
            <TableHead className="hidden px-1 text-center @2xl/libcard:table-cell @2xl/libcard:px-2">
              Prizes
            </TableHead>
            <TableHead className="px-1 text-right @2xl/libcard:px-2">
              Winnings
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(Array(recordLimit).keys()).map((entrant) => {
            return (
              <TableRow key={entrant}>
                <TableCell className="px-1 @2xl/libcard:px-2">
                  <Skeleton className="h-4 w-36 " />
                  {/* <Link href={`/entrants/${entrant.id}`}>
                        {entrant.name}
                      </Link> */}
                </TableCell>
                <TableCell className="px-1 @2xl/libcard:px-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="hidden h-4 w-32 @2xl/libcard:block" />
                  </div>
                </TableCell>
                <TableCell className="hidden px-1 text-center @2xl/libcard:table-cell @2xl/libcard:px-2">
                  <Skeleton className="h-4 w-4 " />
                </TableCell>
                <TableCell className="px-1 text-right @2xl/libcard:px-2">
                  <div className="flex w-full justify-end">
                    <Skeleton className="h-4 w-14 " />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}
