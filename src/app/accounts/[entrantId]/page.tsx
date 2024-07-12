import { api } from "~/trpc/server";
import LibMain, {
  LibCardContainer,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import { EntrantTransactions } from "~/app/_components/transactions";
import { BalanceDisplay } from "~/app/_components/balance";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { entrantId: string };
}) {
  const entrant = await api.entrant.getOne({
    entrantId: parseInt(params.entrantId),
  });

  return {
    title: `Libtour Account - ${entrant ? entrant?.name : "unknown"}`,
    description: "A Summer-long series of events at Redlibbets",
  };
}

export default async function EntrantAccount({
  params,
}: {
  params: { entrantId: string };
}) {
  const entrant = await api.account.entrantTransactions({
    entrantId: parseInt(params.entrantId),
  });

  if (!entrant) return;

  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Account</LibH1>
        <div>
          <Link href={`/entrants/${params.entrantId}`}>{entrant.name}</Link>
        </div>
        <div className="flex gap-2">
          <span>Balance:</span>

          <BalanceDisplay
            balance={entrant.transactions.reduce(
              (acc, cur) => acc + cur.netAmount,
              0,
            )}
            negativeRed={true}
          />
        </div>
      </div>
      <LibCardContainer>
        <LibCardNarrow title="Account Transactions">
          <EntrantTransactions entrantId={parseInt(params.entrantId)} />
        </LibCardNarrow>
      </LibCardContainer>
    </LibMain>
  );
}
