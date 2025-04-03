import { api } from "~/trpc/server";
import { NextResponse } from "next/server";
import { LibH1, LibMainFixed } from "~/app/_components/lib-elements";
import {
  EclecticScorecardView,
  EclecticSkeleton,
} from "~/app/_components/eclectic";
import { Suspense } from "react";

export default async function EclecticEntrant({
  params,
}: {
  params: { entrantId: string };
}) {
  const entrant = await api.eclectic.getEntrant({
    entrantId: parseInt(params.entrantId),
  });

  if (!entrant) {
    return NextResponse.redirect("/eclectic");
  }
  return (
    <LibMainFixed>
      <div className="flex flex-col items-center ">
        <Suspense fallback={<LibH1>Loading Eclectic Scorecard</LibH1>}>
          <LibH1>{entrant.displayName} Eclectic</LibH1>
        </Suspense>
      </div>
      <Suspense
        fallback={
          <EclecticSkeleton
            title={`Eclectic Scorecard`}
            rowCount={1}
            scorecardCount={2}
          />
        }
      >
        <EclecticScorecardView scores={[entrant]} defaultOpen={true} />
      </Suspense>
    </LibMainFixed>
  );
}
