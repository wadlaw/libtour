import LibMain, {
  LibCardContainer,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import Balances, { MasterBalance } from "../_components/balances";
import { Link } from "next-view-transitions";

export const metadata = {
  title: "Libtour - Accounts",
  description: "A summer-long series of events at Redlibbets",
};

export default async function Accounts() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Accounts</LibH1>
        <p>
          <Link href="/accounts/master">
            <span>Master Account Balance: </span> <MasterBalance />
          </Link>
        </p>
      </div>
      <LibCardContainer>
        <LibCardNarrow title="Lib Accounts">
          <Balances />
        </LibCardNarrow>
      </LibCardContainer>
    </LibMain>
  );
}
