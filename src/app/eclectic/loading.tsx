import LibMain, {
  LibCardContainer,
  LibH1,
} from "~/app/_components/lib-elements";
import { EclecticSkeleton } from "../_components/eclectic";

export default async function EclecticLoader() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Eclectic</LibH1>
      </div>
      <LibCardContainer>
        <EclecticSkeleton />
      </LibCardContainer>
    </LibMain>
  );
}
