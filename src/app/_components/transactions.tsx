"use client";

import { api } from "~/trpc/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import LibMoney from "./lib-money";
import Link from "next/link";
import { DeleteTransactionPopover } from "./account-transactions";

export default function Transactions() {
  const trans = api.account.myTransactions.useQuery();
  if (!trans.data || trans.isLoading) return <div>Loading...</div>;
  return (
    <div>
      {/* <div>{trans.data.reduce((acc, cur) => acc + cur.netAmount),0) }</div> */}

      <Table>
        {/* <TableCaption>My Account Transactions</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className=" px-1 sm:px-2">Date</TableHead>
            <TableHead className="px-1 text-right sm:px-2">CR</TableHead>
            <TableHead className="px-1 text-right sm:px-2">DR</TableHead>
            <TableHead className="px-1 sm:px-2">Description</TableHead>
            <TableHead className="px-1 sm:px-2">Comp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trans.data.map((trn) => (
            <TableRow key={trn.id}>
              <TableCell className="px-1 sm:px-2">
                {new Date(trn.createdAt).toLocaleDateString("en-GB", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="px-1 text-right sm:px-2">
                <LibMoney
                  hideZeros={true}
                  amountInPence={trn.netAmount >= 0 ? trn.amount : 0}
                />
              </TableCell>
              <TableCell className="px-1 text-right sm:px-2">
                <LibMoney
                  hideZeros={true}
                  amountInPence={trn.netAmount < 0 ? trn.amount : 0}
                />
              </TableCell>
              <TableCell className="px-1 sm:px-2">{trn.description}</TableCell>
              <TableCell className="px-1 sm:px-2">
                {trn.comp?.name ? (
                  <Link href={`/events/${trn.comp.shortName}`}>
                    {trn.comp.name}
                  </Link>
                ) : null}
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
    </div>
  );
}

type EntrantTransactionsProps = {
  entrantId: number;
};

export function EntrantTransactions({ entrantId }: EntrantTransactionsProps) {
  const trans = api.account.entrantTransactions.useQuery({
    entrantId: entrantId,
  });
  if (!trans.data || trans.isLoading) return <div>Loading...</div>;
  return (
    <div>
      {/* <div>{trans.data.reduce((acc, cur) => acc + cur.netAmount),0) }</div> */}

      <Table>
        {/* <TableCaption>My Account Transactions</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className=" px-1 @2xl/libcard:px-2">Date</TableHead>
            <TableHead className="px-1 text-right @2xl/libcard:px-2">
              CR
            </TableHead>
            <TableHead className="px-1 text-right @2xl/libcard:px-2">
              DR
            </TableHead>
            <TableHead className="px-1 @2xl/libcard:px-2">
              Description
            </TableHead>
            <TableHead className="px-1 @2xl/libcard:px-2">Comp</TableHead>

            <TableHead className="hidden px-1 @2xl/libcard:table-cell @2xl/libcard:px-2">
              Remove
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trans.data.transactions.map((trn) => (
            <TableRow key={trn.id}>
              <TableCell className="px-1 @2xl/libcard:px-2">
                {new Date(trn.createdAt).toLocaleDateString("en-GB", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="px-1 text-right @2xl/libcard:px-2">
                <LibMoney
                  hideZeros={true}
                  amountInPence={trn.netAmount >= 0 ? trn.amount : 0}
                />
              </TableCell>
              <TableCell className="px-1 text-right @2xl/libcard:px-2">
                <LibMoney
                  hideZeros={true}
                  amountInPence={trn.netAmount < 0 ? trn.amount : 0}
                />
              </TableCell>
              <TableCell className="px-1 @2xl/libcard:px-2">
                {trn.description}
              </TableCell>
              <TableCell className="px-1 @2xl/libcard:px-2">
                <Link href={`/events/${trn.comp?.shortName}`}>
                  {trn.comp?.name}
                </Link>
              </TableCell>

              <TableCell className="hidden px-1 @2xl/libcard:table-cell @2xl/libcard:px-2">
                {trn.igCompId != null ? null : (
                  <DeleteTransactionPopover
                    transactionId={trn.id}
                    amountInPence={trn.amount}
                    entrantId={entrantId}
                    description={trn.description}
                    transactionDate={trn.createdAt.toDateString()}
                  />
                )}
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
    </div>
  );
}
