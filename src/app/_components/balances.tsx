"use client";

import { api } from "~/trpc/react";
import LibMoney from "./lib-money";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

import { Link } from "next-view-transitions";
import { TransactionPopover } from "./account-transactions";
import { EntrantDisplay, TeamDisplay } from "./lib-elements";

export function MasterBalance() {
  const bal = api.account.masterBalance.useQuery();

  if (!bal.data || bal.isLoading) return <span>Loading...</span>;

  return (
    <LibMoney amountInPence={bal.data._sum.netAmount ?? 0} negativeRed={true} />
  );
}

export default function Balances() {
  const entrants = api.account.entrantsWithTransactions.useQuery();
  // if (true) return <BalancesSkeleton />;
  if (!entrants.data || entrants.isLoading) return <BalancesSkeleton />;

  return (
    <Table>
      <TableCaption>Account Balances</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="px-1 @2xl/libcard:px-2">Name</TableHead>
          <TableHead className="hidden px-1 @2xl/libcard:table-cell @2xl/libcard:px-2">
            Team
          </TableHead>
          <TableHead className=" px-1 @2xl/libcard:px-2">Credit</TableHead>
          <TableHead className=" px-1 @2xl/libcard:px-2">Debit</TableHead>
          <TableHead className="px-1 text-right @2xl/libcard:px-2">
            Balance
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entrants.data.map((entrant) => (
          <TableRow key={entrant.id}>
            <TableCell
              className={`px-1 @2xl/libcard:px-2 entrant${entrant.id}`}
            >
              <EntrantDisplay
                entrant={{ id: entrant.id, name: entrant.name }}
                linkUrl="/accounts/"
              />
              {/* <Link href={`/accounts/${entrant.id}`}>{entrant.name}</Link> */}
            </TableCell>
            <TableCell className="hidden px-1 @2xl/libcard:table-cell @2xl/libcard:px-2">
              <TeamDisplay team={entrant.team} />
            </TableCell>
            <TableCell className=" px-1 @2xl/libcard:px-2">
              <TransactionPopover
                entrantId={entrant.id}
                entrantName={entrant.name}
                type="CR"
              />
            </TableCell>
            <TableCell className=" px-1 @2xl/libcard:px-2">
              <TransactionPopover
                entrantId={entrant.id}
                entrantName={entrant.name}
                type="DR"
              />
            </TableCell>
            <TableCell className="px-1 text-right font-medium @2xl/libcard:px-2">
              <Link href={`/accounts/${entrant.id}`}>
                <LibMoney
                  amountInPence={entrant.transactions.reduce(
                    (acc, cur) => acc + cur.netAmount,
                    0,
                  )}
                  negativeRed={true}
                />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function BalancesSkeleton() {
  return (
    <Table>
      <TableCaption>Account Balances</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="px-1 @2xl/libcard:px-2">Name</TableHead>
          <TableHead className="hidden px-1 @2xl/libcard:table-cell @2xl/libcard:px-2">
            Team
          </TableHead>
          <TableHead className=" px-1 @2xl/libcard:px-2">Credit</TableHead>
          <TableHead className=" px-1 @2xl/libcard:px-2">Debit</TableHead>
          <TableHead className="px-1 text-right @2xl/libcard:px-2">
            Balance
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from(Array(40).keys()).map((entrant) => (
          <TableRow key={entrant}>
            <TableCell className=" px-1 @2xl/libcard:px-2">
              <Skeleton className="h-4 w-36 " />
              {/* <Link href={`/accounts/${entrant.id}`}>{entrant.name}</Link> */}
            </TableCell>
            <TableCell className="hidden px-1 @2xl/libcard:table-cell @2xl/libcard:px-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="hidden h-4 w-32 sm:block" />
              </div>
            </TableCell>
            <TableCell className=" px-1 @2xl/libcard:px-2">
              <Button>Credit</Button>
            </TableCell>
            <TableCell className=" px-1 @2xl/libcard:px-2">
              <Button variant="destructive">Debit</Button>
            </TableCell>
            <TableCell className="px-1 text-right font-medium @2xl/libcard:px-2 ">
              <div className="flex w-full justify-end">
                <Skeleton className="h-4 w-14 " />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
