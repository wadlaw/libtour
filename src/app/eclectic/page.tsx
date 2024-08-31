import { api } from "~/trpc/server";
import LibMain, { LibH1 } from "~/app/_components/lib-elements";
import Eclectic from "../_components/eclectic";

export const metadata = {
  title: "Libtour - Eclectic",
  description: "The best scores on each hole over all Libtour events",
};

export type EclecticData = Awaited<
  ReturnType<typeof api.scorecard.EclecticScores>
>;

export default async function EclecticPage() {
  const scoreData = await api.scorecard.EclecticScores();
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Lib Eclectic</LibH1>
      </div>

      <Eclectic scores={scoreData} />
    </LibMain>
  );
}
