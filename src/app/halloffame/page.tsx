import { BestRounds, Eagles } from "../_components/hall-of-fame";
import LibMain, { LibCardContainer, LibH1 } from "../_components/lib-elements";

export const metadata = {
  title: "Libtour - Hall of Fame",
  description: "The best golf from the Libtour",
};

export default function HallOfFame() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Hall of Fame</LibH1>
      </div>
      <LibCardContainer splitAtLargeSizes={true}>
        <BestRounds format="Medal" numberOfRounds={10} />
        <BestRounds format="Stableford" numberOfRounds={10} />
        <BestRounds format="Gross" numberOfRounds={10} />
        <Eagles />
      </LibCardContainer>
    </LibMain>
  );
}
