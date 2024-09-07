import { Losers, Winners } from "../_components/honours-board";
import LibMain, { LibCardContainer, LibH1 } from "../_components/lib-elements";

export default function HonoursBoards() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Honours Boards</LibH1>
      </div>
      <LibCardContainer splitAtLargeSizes={true}>
        <Winners />
        <Losers />
      </LibCardContainer>
    </LibMain>
  );
}
