import { api } from "~/trpc/server";
import LibMain, { LibH1 } from "~/app/_components/lib-elements";
import Eclectic from "../_components/eclectic";

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
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Eclectic</LibH1>
        <p className="text-sm text-muted-foreground">
          To enter, contact Steve Dixon
        </p>
      </div>

      <Eclectic scores={scoreData} />
    </LibMain>
  );
}
