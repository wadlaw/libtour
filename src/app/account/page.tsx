import { api } from "~/trpc/server";
import LibMain, {
  LibCardContainer,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import Transactions from "../_components/transactions";
import Balance from "../_components/balance";

export const metadata = {
  title: "Libtour - My Account",
  description: "A Summer-long series of events at Redlibbets",
};

export default async function Page() {
  const transactions = api.account.myTransactions;
  if (!transactions) return <p>loading</p>;
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>My Account</LibH1>
        <div className="flex gap-2">
          <span>Balance:</span>
          <Balance />
        </div>
      </div>
      <LibCardContainer>
        <LibCardNarrow title="Account Transactions">
          <Transactions />
        </LibCardNarrow>
      </LibCardContainer>
    </LibMain>
  );
}
