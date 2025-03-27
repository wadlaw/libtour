import { api } from "~/trpc/server";
import LibMain, { LibH1 } from "~/app/_components/lib-elements";
import LibEclectic from "../_components/libeclectic";

export const metadata = {
  title: "Libtour - Eclectic",
  description: "The best scores on each hole over all Libtour events",
};

export type LibEclecticData = Awaited<
  ReturnType<typeof api.scorecard.LibEclecticScores>
>;

export default async function LibEclecticPage() {
  const scoreData = await api.scorecard.LibEclecticScores();
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Lib Eclectic</LibH1>
      </div>

      <LibEclectic scores={scoreData} />
    </LibMain>
  );
}
