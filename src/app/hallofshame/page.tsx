import { BestRounds, DoubleFigures } from "../_components/hall-of-fame";
import LibMain, { LibCardContainer, LibH1 } from "../_components/lib-elements";

export const metadata = {
  title: "Libtour - Hall of Fame",
  description: "The best golf from the Libtour",
};

export default function HallOfFame() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Hall of Shame</LibH1>
      </div>
      <LibCardContainer splitAtLargeSizes={true}>
        <BestRounds format="Medal" worst={true} numberOfRounds={10} />
        <BestRounds format="Stableford" worst={true} numberOfRounds={10} />
        <BestRounds format="Gross" worst={true} numberOfRounds={10} />
        <DoubleFigures />
      </LibCardContainer>
    </LibMain>
  );
}
