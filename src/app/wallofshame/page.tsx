import { BestRounds, DoubleFigures } from "../_components/hall-of-fame";
import LibMain, {
  LibCardContainer,
  LibSadH1,
} from "../_components/lib-elements";

export const metadata = {
  title: "Libtour - Wall of Shame",
  description: "The worst golf from the Libtour",
};

export default function WallOfShame() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibSadH1>Wall of Shame</LibSadH1>
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
