import LibMain, { LibH1 } from "~/app/_components/lib-elements";
import { EclecticSkeleton } from "../_components/eclectic";

export default async function EclecticLoader() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Lib Eclectic</LibH1>
      </div>
      <EclecticSkeleton />
    </LibMain>
  );
}
