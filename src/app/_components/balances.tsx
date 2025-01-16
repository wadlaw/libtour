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

import Link from "next/link";
import { TransactionPopover } from "./account-transactions";
import { EntrantDisplay, TeamDisplay } from "./lib-elements";

export default function Balances() {
  const entrants = api.account.entrantsWithTransactions.useQuery();
  if (!entrants.data || entrants.isLoading)
    return <div className="flex justify-center">Loading...</div>;

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
            <TableCell className=" px-1 @2xl/libcard:px-2">
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
