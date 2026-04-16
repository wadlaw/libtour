import { api } from "~/trpc/server";
import {
  LibCardContainer,
  LibH1,
  LibMainFixed,
} from "~/app/_components/lib-elements";
import Eclectic, { EclecticSkeleton } from "../_components/eclectic";
import { Suspense } from "react";

export const metadata = {
  title: "Eclectic",
  description: "The best scores on each hole over all designated events",
};

export type EclecticData = Awaited<
  ReturnType<typeof api.scorecard.EclecticScores>
>;

export default async function EclecticPage() {
  const scoreData = await api.scorecard.EclecticScores();
  return (
    <LibMainFixed>
      <div className="flex flex-col items-center">
        <LibH1>Eclectic</LibH1>
      </div>
      <LibCardContainer>
        <Suspense fallback={<EclecticSkeleton />}>
          <Eclectic scores={scoreData} />
        </Suspense>
      </LibCardContainer>
    </LibMainFixed>
  );
}
