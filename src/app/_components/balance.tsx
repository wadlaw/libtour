"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import LibMoney from "./lib-money";

export default function Balance() {
  const balance = api.account.myBalance.useQuery();
  if (
    balance.isLoading ||
    (!balance.data?._sum.netAmount && balance.data?._sum.netAmount !== 0)
  )
    return <span>Loading...</span>;

  return (
    <li className={`mr-4 inline`}>
      <BalanceDisplay
        balance={balance.data._sum.netAmount}
        negativeRed={true}
      />
    </li>
  );
}

export function MobileBalance() {
  const balance = api.account.myBalance.useQuery();
  if (
    balance.isLoading ||
    (!balance.data?._sum.netAmount && balance.data?._sum.netAmount !== 0)
  )
    return <span>Loading...</span>;

  return (
    <BalanceDisplay balance={balance.data._sum.netAmount} negativeRed={true} />
  );
}
type BalanceDisplayProps = {
  balance: number;
  negativeRed?: boolean;
  href?: string;
};
export function BalanceDisplay({
  balance,
  negativeRed = true,
  href,
}: BalanceDisplayProps) {
  if (!href)
    return (
      <LibMoney
        amountInPence={balance}
        negativeRed={negativeRed}
        alwaysShowPence={true}
      />
    );

  return (
    <Link href={href}>
      <LibMoney amountInPence={balance} negativeRed={negativeRed} />
    </Link>
  );
}
