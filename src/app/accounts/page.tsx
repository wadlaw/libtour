import LibMain, {
  LibCardContainer,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import Balances from "../_components/balances";

export const metadata = {
  title: "Libtour - Accounts",
  description: "A summer-long series of events at Redlibbets",
};

export default async function Accounts() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Accounts</LibH1>
      </div>
      <LibCardContainer>
        <LibCardNarrow title="Lib Accounts">
          <Balances />
        </LibCardNarrow>
      </LibCardContainer>
    </LibMain>
  );
}
