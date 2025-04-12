import { api } from "~/trpc/server";
import {
  LibH1,
  LibMainFixed,
  LibCardContainer,
} from "~/app/_components/lib-elements";
import {
  EclecticScorecardView,
  EclecticSkeleton,
} from "~/app/_components/eclectic";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function EclecticEntrant({
  params,
}: {
  params: { entrantId: string };
}) {
  const entrant = await api.eclectic.getEntrant({
    entrantId: parseInt(params.entrantId),
  });

  if (!entrant) {
    redirect("/eclectic");
  }

  return (
    <LibMainFixed>
      <div className="flex flex-col items-center ">
        <Suspense fallback={<LibH1>Loading Entrant Eclectic</LibH1>}>
          <LibH1>{entrant.displayName} Eclectic</LibH1>
        </Suspense>
      </div>
      <LibCardContainer>
        <Suspense
          fallback={
            <EclecticSkeleton
              title={`Eclectic Scorecard`}
              rowCount={1}
              scorecardCount={2}
              defaultOpen={true}
              includePosition={false}
            />
          }
        >
          <EclecticScorecardView scores={[entrant]} defaultOpen={true} />
        </Suspense>
      </LibCardContainer>
    </LibMainFixed>
  );
}
