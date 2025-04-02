import { api } from "~/trpc/server";
import { NextResponse } from "next/server";
import { LibH1, LibMainFixed } from "~/app/_components/lib-elements";
import { EclecticScorecardView } from "~/app/_components/eclectic";

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
        <LibH1>{entrant.displayName} Eclectic</LibH1>
      </div>
      <EclecticScorecardView scores={[entrant]} defaultOpen={true} />
    </LibMainFixed>
  );
}
