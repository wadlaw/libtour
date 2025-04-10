import { api } from "~/trpc/server";
import LibMain, {
  LibCardContainer,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import { BalanceDisplay } from "~/app/_components/balance";
import { Link } from "next-view-transitions";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import LibMoney from "~/app/_components/lib-money";

export async function generateMetadata() {
  return {
    title: `Libtour Master Account`,
    description: "Transactions in and out of the Libtour account",
  };
}

export default async function MasterAccount() {
  const bal = await api.account.masterBalance();

  if (!bal) return;

  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Master Account</LibH1>

        <div className={`flex gap-2`}>
          <Link href="/accounts">
            <span>Balance: </span>

            <BalanceDisplay
              balance={bal._sum.netAmount ?? 0}
              negativeRed={true}
            />
          </Link>
        </div>
      </div>
      <LibCardContainer>
        <LibCardNarrow title="Account Transactions">
          <MasterTransactions />
        </LibCardNarrow>
      </LibCardContainer>
    </LibMain>
  );
}

async function MasterTransactions() {
  const trans = await api.account.masterTransactions();

  if (!trans) return;
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
            <TableHead className="px-1 sm:px-2">Entrant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trans.map((trn) => (
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
                {trn.entrant?.name ? (
                  <Link href={`/accounts/${trn.entrantId}`}>
                    {trn.entrant.name}
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
