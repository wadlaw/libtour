import LibMain, {
  LibCardContainer,
  LibH1,
} from "~/app/_components/lib-elements";

import PrizeMoneyTable from "~/app/_components/prize-money/prize-money";

export const metadata = {
  title: "Libtour Prizewinners",
  description: "A Summer-long series of events at Redlibbets",
};

export default async function Prizewinners() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Prizewinners</LibH1>
      </div>
      {/* <div className="mx-1 mb-1 mt-4 grid grid-cols-1 gap-4 sm:mx-2 sm:mb-2 md:grid-cols-2 xl:mx-0 xl:mb-4"> */}
      <LibCardContainer splitAtLargeSizes={false}>
        <PrizeMoneyTable />
      </LibCardContainer>
    </LibMain>
  );
}
