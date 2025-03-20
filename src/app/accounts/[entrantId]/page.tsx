import { api } from "~/trpc/server";
import LibMain, {
  LibCardContainer,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import { EntrantTransactions } from "~/app/_components/transactions";
import { BalanceDisplay } from "~/app/_components/balance";
import { Link } from "next-view-transitions";
import { TransactionPopover } from "~/app/_components/account-transactions";

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
          <Link
            href={`/entrants/${params.entrantId}`}
            className={`entrant${entrant.id}`}
          >
            {entrant.name}
          </Link>
        </div>
        <div className={`flex gap-2 balance${entrant.id}`}>
          <span>Balance:</span>

          <BalanceDisplay
            balance={entrant.transactions.reduce(
              (acc, cur) => acc + cur.netAmount,
              0,
            )}
            negativeRed={true}
          />
        </div>
        <div className="mt-2 flex gap-4">
          <TransactionPopover
            entrantId={entrant.id}
            entrantName={entrant.name}
            type="CR"
          />
          <TransactionPopover
            entrantId={entrant.id}
            entrantName={entrant.name}
            type="DR"
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
