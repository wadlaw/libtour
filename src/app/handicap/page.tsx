import { cookies } from "next/headers";
import { Handicap } from "../_components/handicap";
import {
  LibCardContainer,
  LibH1,
  LibMainFixed,
} from "../_components/lib-elements";

export default function HandicapPage() {
  const cookieStore = cookies();
  const hi = cookieStore.get("handicapIndex")?.value;

  return (
    <LibMainFixed>
      <div className="flex flex-col items-center">
        <LibH1>Handicaps</LibH1>
      </div>
      <LibCardContainer splitAtLargeSizes={false}>
        <Handicap hi={hi ? Number(hi) : 0} />
      </LibCardContainer>
    </LibMainFixed>
  );
}
