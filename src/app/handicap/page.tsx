import { Handicap } from "../_components/handicap";
import {
  LibCardContainer,
  LibH1,
  LibMainFixed,
} from "../_components/lib-elements";

export default function HandicapPage() {
  return (
    <LibMainFixed>
      <div className="flex flex-col items-center">
        <LibH1>Handicaps</LibH1>
      </div>
      <LibCardContainer splitAtLargeSizes={false}>
        <Handicap />
      </LibCardContainer>
    </LibMainFixed>
  );
}
