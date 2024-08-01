import Link from "next/link";
import { api } from "~/trpc/server";
import LibMoney from "./lib-money";
import { ensure } from "~/lib/utils";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TeamDisplay } from "./lib-elements";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Fragment } from "react";

type ResultsProps = {
  compId: string;
};

export default async function Results({ compId }: ResultsProps) {
  const compResults = await api.comp.getResults({ comp: compId });
  const teams = await api.team.getAll();

  if (!compResults) return <p>No results</p>;
  const lowGross = { score: 500, entrantId: [0] };

  //Check for lowest Gross score
  compResults.forEach((golfer) => {
    if (
      golfer.scorecard &&
      golfer.scorecard?.holes.filter((hole) => hole.NR === true).length === 0
    ) {
      const gross = golfer.scorecard.holes.reduce(
        (acc, cur) => acc + (cur.strokes ?? 100),
        0,
      );
      if (lowGross.entrantId.includes(0) || lowGross.score > gross) {
        lowGross.score = gross;
        lowGross.entrantId.length = 0;
        lowGross.entrantId.push(golfer.entrantId);
      } else if (lowGross.score === gross) {
        lowGross.entrantId.push(golfer.entrantId);
      }
    }
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          {lowGross.score < 500 ? (
            <TableCaption>*lowest gross score</TableCaption>
          ) : null}
          <TableHeader>
            <TableRow>
              <TableHead className="px-1 sm:px-2">Pos</TableHead>
              <TableHead className="hidden px-1 sm:px-2 lg:table-cell">
                IG Position
              </TableHead>
              <TableHead className="px-1 sm:px-2">Name</TableHead>
              <TableHead className="px-1 sm:px-2">Team</TableHead>
              <TableHead className="hidden px-1 text-center sm:px-2 md:table-cell">
                Team Score
              </TableHead>
              <TableHead className="px-1 text-center sm:px-2">Score</TableHead>
              <TableHead className="px-1 text-right sm:px-2 ">£</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compResults.map((result) => (
              <Collapsible key={result.position} asChild>
                <Fragment key={result.position}>
                  <TableRow key={result.position}>
                    <TableCell className="px-1 sm:px-2">
                      <CollapsibleTrigger asChild>
                        <span>{result.position}</span>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="hidden px-1 sm:px-2 lg:table-cell">
                      <CollapsibleTrigger asChild>
                        <span>{result.igPosition}</span>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="px-1 font-medium sm:px-2">
                      <Link href={`/entrants/${result.entrant.id}`}>
                        <span className="mr-1 sm:mr-2">
                          {result.entrant.name}
                          {result.scorecard?.id
                            ? `(${result.scorecard.handicap})`
                            : ""}
                        </span>
                        {result.wildcard ? <Badge>WC</Badge> : null}
                      </Link>
                    </TableCell>
                    <TableCell className="px-1 sm:px-2">
                      <TeamDisplay
                        team={ensure(
                          teams.filter(
                            (team) => team.id == result.entrant.teamId,
                          )[0],
                        )}
                      />
                      {/* {
                teams.filter((team) => team.id == result.entrant.teamId)[0]
                ?.teamName
                } */}
                    </TableCell>
                    <TableCell className="hidden px-1 text-center sm:px-2 md:table-cell">
                      <CollapsibleTrigger asChild>
                        <span>
                          {result.teamScore ? result.teamScore : "NR"}
                        </span>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="px-1 text-center sm:px-2">
                      <CollapsibleTrigger asChild>
                        <span>
                          {result.score ? result.score : "NR"}
                          {lowGross.entrantId.includes(result.entrantId)
                            ? "*"
                            : ""}
                        </span>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="px-1 text-right sm:px-2">
                      <LibMoney
                        hideZeros={true}
                        amountInPence={result.transactions.reduce(
                          (acc, cur) => acc + cur.netAmount,
                          0,
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <tr className="bg-slate-100">
                      <ScorecardDisplay scorecard={result.scorecard} />
                    </tr>
                  </CollapsibleContent>
                </Fragment>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

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
};

function ScorecardDisplay({ scorecard }: ScorecardDisplayProps) {
  if (!scorecard) return null;
  return (
    <Fragment>
      <TableCell colSpan={7}>
        <div className="flex w-full flex-wrap justify-between gap-4 md:flex-nowrap">
          {/* Front 9 */}
          <div className="flex w-full flex-wrap gap-1">
            <div className="grid w-full grid-cols-10 place-content-center justify-center gap-1">
              {scorecard.holes
                .filter((hole) => hole.holeNo <= 9)
                .map((hole) => (
                  <div
                    key={hole.holeNo}
                    className={`mx-auto aspect-square w-auto  py-1 text-center font-bold   ${hole.NR && "bg-black px-1 text-white"} ${hole.strokes && hole.strokes - hole.par <= -2 && "rounded-full bg-yellow-500 px-2.5  text-white"} ${hole.strokes && hole.strokes - hole.par === -1 && "rounded-full bg-red-500 px-2.5  text-white"} ${hole.strokes && hole.strokes - hole.par === 1 && "bg-blue-500 px-2.5  text-white"} ${hole.strokes && hole.strokes - hole.par >= 2 && "bg-black px-2.5 text-white"}`}
                  >
                    {hole.NR ? "NR" : hole.strokes}
                  </div>
                ))}
            </div>
            {
              <div className="grid w-full grid-cols-10 place-content-center justify-center gap-1">
                <Fragment key="front9">
                  {scorecard.holes
                    .filter((hole) => hole.holeNo <= 9)
                    .map((hole) => (
                      <div
                        key={hole.holeNo}
                        className={`mx-auto aspect-square px-2 py-1 text-center   `}
                      >
                        {scorecard.stableford
                          ? hole.points
                          : hole.NR
                            ? "NR"
                            : hole.net}
                      </div>
                    ))}
                  {/* Front 9 total */}
                  <div className="mx-auto aspect-square w-auto px-1.5 py-1 text-center ring-2 ring-slate-800">
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
                </Fragment>
              </div>
            }
          </div>

          {/* Back 9 */}
          <div className="flex w-full flex-wrap gap-1">
            <div className="grid w-full grid-cols-10 gap-1">
              {scorecard.holes
                .filter((hole) => hole.holeNo >= 10)
                .map((hole) => (
                  <div
                    key={hole.holeNo}
                    className={`mx-auto aspect-square py-1 text-center font-bold  ${hole.NR && "bg-black px-1 text-white"} ${hole.strokes && hole.strokes - hole.par <= -2 && " rounded-full bg-yellow-500 px-2.5  text-white"} ${hole.strokes && hole.strokes - hole.par === -1 && " rounded-full bg-red-500 px-2.5  text-white"} ${hole.strokes && hole.strokes - hole.par === 1 && "bg-blue-500   px-2.5  text-white"} ${hole.strokes && hole.strokes - hole.par >= 2 && "bg-black   px-2.5  text-white"}`}
                  >
                    {hole.NR ? "NR" : hole.strokes}
                  </div>
                ))}
            </div>

            <Fragment key="back9">
              <div className="grid w-full grid-cols-10 place-content-center justify-center gap-1">
                {scorecard.holes
                  .filter((hole) => hole.holeNo >= 10)
                  .map((hole) => (
                    <div
                      key={hole.holeNo}
                      className={`mx-auto aspect-square px-2 py-1 text-center   `}
                    >
                      {scorecard.stableford
                        ? hole.points
                        : hole.NR
                          ? "NR"
                          : hole.net}
                    </div>
                  ))}
                {/* Back 9 Total */}
                <div className="mx-auto aspect-square px-1.5 py-1 text-center ring-2 ring-slate-800">
                  {scorecard.stableford
                    ? scorecard.holes
                        .filter((hole) => hole.holeNo >= 10)
                        .reduce((acc, cur) => acc + cur.points, 0)
                    : scorecard.holes.filter(
                          (hole) => hole.holeNo >= 10 && hole.NR === true,
                        ).length > 0
                      ? "NR"
                      : scorecard.holes
                          .filter((hole) => hole.holeNo >= 10)
                          .reduce((acc, cur) => acc + (cur.net ?? 0), 0)}
                </div>
              </div>
            </Fragment>
          </div>
        </div>
      </TableCell>
    </Fragment>
  );
}

export async function Winners({ compId }: ResultsProps) {
  const compResults = await api.comp.getWinners({ comp: compId });
  const teams = await api.team.getAll();

  if (!compResults) return <p>No results</p>;

  return (
    <Table>
      {/* <TableCaption>Event Results</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="px-1 sm:px-2">Pos</TableHead>
          <TableHead className="hidden px-1 sm:px-2 lg:table-cell">
            IG Position
          </TableHead>
          <TableHead className="px-1 sm:px-2">Name</TableHead>
          <TableHead className="px-1 sm:px-2">Team</TableHead>
          <TableHead className="hidden px-1 text-center sm:px-2 md:table-cell">
            Team Score
          </TableHead>
          <TableHead className="px-1 text-center sm:px-2">Score</TableHead>
          <TableHead className="px-1 text-right sm:px-2">£</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compResults.map((result) => (
          <TableRow key={result.position}>
            <TableCell className="px-1 sm:px-2">{result.position}</TableCell>
            <TableCell className="hidden px-1 sm:px-2 lg:block">
              {result.igPosition}
            </TableCell>
            <TableCell className="px-1 font-medium sm:px-2">
              <span className="mr-1 sm:mr-2">{result.entrant.name}</span>
              {result.wildcard ? <Badge>WC</Badge> : null}
            </TableCell>
            <TableCell className="px-1 sm:px-2">
              <TeamDisplay
                team={ensure(
                  teams.filter((team) => team.id == result.entrant.teamId)[0],
                )}
              ></TeamDisplay>
            </TableCell>
            <TableCell className="hidden px-1 text-center sm:px-2 md:table-cell">
              {result.teamScore ? result.teamScore : "NR"}
            </TableCell>
            <TableCell className="px-1 text-center sm:px-2">
              {result.score ? result.score : "NR"}
            </TableCell>
            <TableCell className="px-1 text-right sm:px-2">
              <LibMoney
                hideZeros={true}
                amountInPence={result.transactions.reduce(
                  (acc, cur) => acc + cur.netAmount,
                  0,
                )}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter> */}
    </Table>
  );
}
