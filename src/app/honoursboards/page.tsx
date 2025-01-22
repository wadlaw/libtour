import { HoleInOneBoard, Losers, Winners } from "../_components/honours-board";
import {
  LibCardContainer,
  LibH1,
  LibMainFixed,
} from "../_components/lib-elements";

export default function HonoursBoards() {
  return (
    <LibMainFixed>
      <div className="flex flex-col items-center">
        <LibH1>Honours Boards</LibH1>
      </div>
      <LibCardContainer splitAtLargeSizes={true}>
        <Winners />
        <Losers />
        <HoleInOneBoard />
      </LibCardContainer>
    </LibMainFixed>
  );
}
