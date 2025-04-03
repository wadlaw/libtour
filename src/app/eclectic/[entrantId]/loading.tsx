import { LibH1, LibMainFixed } from "~/app/_components/lib-elements";

import { EclecticSkeleton } from "~/app/_components/eclectic";

export default async function EclecticLoader() {
  return (
    <LibMainFixed>
      <div className="flex flex-col items-center">
        <LibH1>Loading Eclectic</LibH1>
      </div>

      <EclecticSkeleton
        title={`Eclectic Scorecard`}
        rowCount={1}
        scorecardCount={2}
      />
    </LibMainFixed>
  );
}
