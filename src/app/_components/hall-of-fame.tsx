import Link from "next/link";
import { api } from "~/trpc/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { LibCard } from "./lib-elements";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Fragment } from "react";
import { ScorecardDisplay } from "./scorecard";

type BestRoundsProps = {
  format: "Stableford" | "Medal" | "Gross";
  numberOfRounds: number;
};

export async function BestRounds({ format, numberOfRounds }: BestRoundsProps) {
  const rounds =
    format === "Stableford"
      ? await api.scorecard.bestStablefordRounds({
          numberOfRounds: numberOfRounds,
        })
      : format === "Medal"
        ? await api.scorecard.bestMedalRounds({
            numberOfRounds: numberOfRounds,
          })
        : await api.scorecard.bestGrossRounds({
            numberOfRounds: numberOfRounds,
          });

  const getSortedRounds = () => {
    const unsortedScores: {
      scorecardId: number;
      score: number;
      countbackScore: number;
    }[] = [];
    rounds.forEach((sc) => {
      const score = sc.holes.reduce(
        (acc, cur) =>
          acc +
          (format === "Stableford"
            ? cur.points
            : format === "Medal"
              ? cur.net ?? 0
              : cur.strokes ?? 0),
        0,
      );
      const back9 = sc.holes
        .filter((s) => s.holeNo >= 10)
        .reduce(
          (acc, cur) =>
            acc +
            (format === "Stableford"
              ? cur.points
              : format === "Medal"
                ? cur.net ?? 0
                : cur.strokes ?? 0),
          0,
        );
      const back6 = sc.holes
        .filter((s) => s.holeNo >= 13)
        .reduce(
          (acc, cur) =>
            acc +
            (format === "Stableford"
              ? cur.points
              : format === "Medal"
                ? cur.net ?? 0
                : cur.strokes ?? 0),
          0,
        );
      const back3 = sc.holes
        .filter((s) => s.holeNo >= 16)
        .reduce(
          (acc, cur) =>
            acc +
            (format === "Stableford"
              ? cur.points
              : format === "Medal"
                ? cur.net ?? 0
                : cur.strokes ?? 0),
          0,
        );
      const back1 = sc.holes
        .filter((s) => s.holeNo >= 18)
        .reduce(
          (acc, cur) =>
            acc +
            (format === "Stableford"
              ? cur.points
              : format === "Medal"
                ? cur.net ?? 0
                : cur.strokes ?? 0),
          0,
        );
      unsortedScores.push({
        scorecardId: sc.id,
        score: score,
        countbackScore:
          score +
          back9 / 100 +
          back6 / 10000 +
          back3 / 1000000 +
          back1 / 100000000,
      });
    });
    return unsortedScores.sort((a, b) => {
      if (format === "Stableford") {
        return b.countbackScore - a.countbackScore;
      } else {
        return a.countbackScore - b.countbackScore;
      }
    });
  };
  const roundOrder = getSortedRounds();

  return (
    <LibCard title={`${numberOfRounds} Best ${format} Rounds`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {format === "Stableford"
                ? "Points "
                : format === "Medal"
                  ? "Net"
                  : "Strokes"}
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Comp</TableHead>
            <TableHead className="hidden sm:table-cell lg:hidden">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roundOrder.map((rd) => {
            const round = rounds.filter((rnd) => rnd.id === rd.scorecardId)[0]!;
            return (
              <Collapsible key={round.id} asChild>
                <Fragment key={round.id}>
                  <TableRow key={round.id}>
                    <CollapsibleTrigger asChild>
                      <TableCell className="hover:cursor-pointer">
                        {rd.score}
                      </TableCell>
                    </CollapsibleTrigger>
                    <TableCell>
                      <Link href={`/entrants/${round.entrantId}`}>
                        {round.compEntrant.entrant.name}
                        {` (${round.handicap})`}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/events/${round.compEntrant.comp.shortName}`}
                      >
                        {round.compEntrant.comp.name}
                      </Link>
                    </TableCell>
                    <CollapsibleTrigger asChild>
                      <TableCell className="hidden hover:cursor-pointer sm:table-cell lg:hidden">
                        {new Date(
                          round.compEntrant.comp.date,
                        ).toLocaleDateString("en-GB", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                    </CollapsibleTrigger>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <tr className="bg-slate-100">
                      <ScorecardDisplay
                        colSpan={4}
                        formatForSplitView={true}
                        scorecard={round}
                        strokesOnly={format === "Gross"}
                      />
                    </tr>
                  </CollapsibleContent>
                </Fragment>
              </Collapsible>
            );
          })}
        </TableBody>
      </Table>
    </LibCard>
  );
}

export async function Eagles() {
  const eagles = await api.scorecard.eagles();

  if (eagles.length === 0) return null;

  return (
    <LibCard title="Eagles">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Golfer</TableHead>
            <TableHead className="text-center">Hole No</TableHead>
            <TableHead>Comp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eagles.map((eagle) => {
            return (
              <Collapsible key={`${eagle.scorecardId}-${eagle.holeNo}`} asChild>
                <Fragment key={`${eagle.scorecardId}-${eagle.holeNo}`}>
                  <TableRow key={`${eagle.scorecardId}-${eagle.holeNo}`}>
                    <CollapsibleTrigger asChild>
                      <TableCell className="hover:cursor-pointer">
                        {new Date(
                          eagle.scorecard.compEntrant.comp.date,
                        ).toLocaleDateString("en-GB", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                    </CollapsibleTrigger>
                    <TableCell>
                      <Link href={`/entrants/${eagle.scorecard.entrantId}`}>
                        {eagle.scorecard.compEntrant.entrant.name}
                      </Link>
                    </TableCell>
                    <CollapsibleTrigger asChild>
                      <TableCell className="text-center hover:cursor-pointer">
                        {eagle.holeNo}
                      </TableCell>
                    </CollapsibleTrigger>
                    <TableCell>
                      <Link
                        href={`/events/${eagle.scorecard.compEntrant.comp.shortName}`}
                      >
                        {eagle.scorecard.compEntrant.comp.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <tr className="bg-slate-100">
                      <ScorecardDisplay
                        colSpan={4}
                        formatForSplitView={true}
                        scorecard={eagle.scorecard}
                        strokesOnly={true}
                      />
                    </tr>
                  </CollapsibleContent>
                </Fragment>
              </Collapsible>
            );
          })}
        </TableBody>
      </Table>
    </LibCard>
  );
}
