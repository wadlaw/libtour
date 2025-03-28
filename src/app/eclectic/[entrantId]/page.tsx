import { api } from "~/trpc/server";
import { NextResponse } from "next/server";
import LibMain, { LibH1 } from "~/app/_components/lib-elements";
import Eclectic from "~/app/_components/eclectic";

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
    <LibMain>
      <div className="flex flex-col items-center ">
        <LibH1>{entrant.displayName}</LibH1>
      </div>
      <Eclectic scores={[entrant]} />
    </LibMain>
  );
}
