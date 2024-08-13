import { Fragment } from "react";
import { TableCell } from "~/components/ui/table";

type ScorecardDisplayProps = {
  scorecard: {
    id: number;
    compId: string;
    entrantId: number;
    handicap: number;
    stableford: boolean;
    holes: {
      scorecardId: number;
      strokeIndex: number;
      holeNo: number;
      strokes: number | null;
      NR: boolean;
      par: number;
      points: number;
      net: number | null;
    }[];
  } | null;
  colSpan: number;
  formatForSplitView?: boolean;
  strokesOnly?: boolean;
};

export function ScorecardDisplay({
  scorecard,
  colSpan,
  formatForSplitView,
  strokesOnly,
}: ScorecardDisplayProps) {
  if (!scorecard) return null;
  return (
    <Fragment>
      <TableCell colSpan={colSpan}>
        <div
          className={`flex w-full flex-wrap justify-between gap-4 md:flex-nowrap ${!!formatForSplitView && "lg:flex-wrap"}`}
        >
          {/* Front 9 */}
          <div className="flex w-full flex-wrap gap-1">
            <div className="grid w-full grid-cols-10 place-content-center justify-center gap-1">
              {scorecard.holes
                .filter((hole) => hole.holeNo <= 9)
                .map((hole) => (
                  <div key={hole.holeNo} className="flex justify-center">
                    <div
                      className={`flex h-8  w-8 items-center justify-center  font-bold   ${hole.NR && "bg-black  text-white"} ${hole.strokes && hole.strokes - hole.par <= -2 && "rounded-full bg-yellow-500   text-white"} ${hole.strokes && hole.strokes - hole.par === -1 && "rounded-full bg-red-500   text-white"} ${hole.strokes && hole.strokes - hole.par === 1 && "bg-blue-500   text-white"} ${hole.strokes && hole.strokes - hole.par >= 2 && "bg-black  text-white"}`}
                    >
                      {hole.NR ? "NR" : hole.strokes}
                    </div>
                  </div>
                ))}
              {!!strokesOnly && (
                <div className=" flex justify-center">
                  <div className="flex h-8  w-8 items-center justify-center font-bold ring-2 ring-slate-800">
                    {scorecard.holes
                      .filter((hole) => hole.holeNo <= 9)
                      .reduce((acc, cur) => acc + (cur.strokes ?? 0), 0)}
                  </div>
                </div>
              )}
            </div>

            {!strokesOnly && (
              <div className="grid w-full grid-cols-10 place-content-center justify-center gap-1">
                <Fragment key="front9">
                  {scorecard.holes
                    .filter((hole) => hole.holeNo <= 9)
                    .map((hole) => (
                      <div key={hole.holeNo} className="flex justify-center">
                        <div
                          className={`flex h-8  w-8 items-center justify-center`}
                        >
                          {scorecard.stableford
                            ? hole.points
                            : hole.NR
                              ? "NR"
                              : hole.net}
                        </div>
                      </div>
                    ))}
                  {/* Front 9 total */}
                  <div className="flex justify-center">
                    <div className="flex h-8  w-8 items-center justify-center font-bold ring-2 ring-slate-800">
                      {scorecard.stableford
                        ? scorecard.holes
                            .filter((hole) => hole.holeNo <= 9)
                            .reduce((acc, cur) => acc + cur.points, 0)
                        : scorecard.holes.filter(
                              (hole) => hole.holeNo <= 9 && hole.NR == true,
                            ).length > 0
                          ? "NR"
                          : scorecard.holes
                              .filter((hole) => hole.holeNo <= 9)
                              .reduce((acc, cur) => acc + (cur.net ?? 0), 0)}
                    </div>
                  </div>
                </Fragment>
              </div>
            )}
          </div>

          {/* Back 9 */}
          <div className="flex w-full flex-wrap gap-1">
            <div className="grid w-full grid-cols-10 place-content-center justify-center gap-1">
              {scorecard.holes
                .filter((hole) => hole.holeNo >= 10)
                .map((hole) => (
                  <div key={hole.holeNo} className="flex justify-center">
                    <div
                      className={`flex h-8  w-8 items-center justify-center  font-bold   ${hole.NR && "bg-black  text-white"} ${hole.strokes && hole.strokes - hole.par <= -2 && "rounded-full bg-yellow-500   text-white"} ${hole.strokes && hole.strokes - hole.par === -1 && "rounded-full bg-red-500   text-white"} ${hole.strokes && hole.strokes - hole.par === 1 && "bg-blue-500   text-white"} ${hole.strokes && hole.strokes - hole.par >= 2 && "bg-black  text-white"}`}
                    >
                      {hole.NR ? "NR" : hole.strokes}
                    </div>
                  </div>
                ))}
              {!!strokesOnly && (
                <div className=" flex justify-center">
                  <div className="flex h-8  w-8 items-center justify-center font-bold ring-2 ring-slate-800">
                    {scorecard.holes
                      .filter((hole) => hole.holeNo >= 10)
                      .reduce((acc, cur) => acc + (cur.strokes ?? 0), 0)}
                  </div>
                </div>
              )}
            </div>

            {!strokesOnly && (
              <div className="grid w-full grid-cols-10 place-content-center justify-center gap-1">
                <Fragment key="front9">
                  {scorecard.holes
                    .filter((hole) => hole.holeNo >= 10)
                    .map((hole) => (
                      <div key={hole.holeNo} className="flex justify-center">
                        <div
                          className={`flex h-8  w-8 items-center justify-center`}
                        >
                          {scorecard.stableford
                            ? hole.points
                            : hole.NR
                              ? "NR"
                              : hole.net}
                        </div>
                      </div>
                    ))}
                  {/* Front 9 total */}
                  <div className="flex justify-center">
                    <div className="flex h-8  w-8 items-center justify-center font-bold ring-2 ring-slate-800">
                      {scorecard.stableford
                        ? scorecard.holes
                            .filter((hole) => hole.holeNo >= 10)
                            .reduce((acc, cur) => acc + cur.points, 0)
                        : scorecard.holes.filter(
                              (hole) => hole.holeNo <= 9 && hole.NR == true,
                            ).length > 0
                          ? "NR"
                          : scorecard.holes
                              .filter((hole) => hole.holeNo >= 10)
                              .reduce((acc, cur) => acc + (cur.net ?? 0), 0)}
                    </div>
                  </div>
                </Fragment>
              </div>
            )}
          </div>
        </div>
      </TableCell>
    </Fragment>
  );
}
