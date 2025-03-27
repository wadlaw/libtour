import LibMain, { LibH1 } from "~/app/_components/lib-elements";
import { LibEclecticSkeleton } from "../_components/libeclectic";

export default async function EclecticLoader() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Lib Eclectic</LibH1>
      </div>
      <LibEclecticSkeleton />
    </LibMain>
  );
}
