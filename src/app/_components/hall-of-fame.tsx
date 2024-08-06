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
import { EntrantDisplay, LibCardNarrow } from "./lib-elements";

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

  if (rounds.length === 0)
    return <NoScores numberOfRounds={numberOfRounds} format={format} />;

  return (
    <LibCardNarrow title={`${numberOfRounds} Best ${format} Rounds`}>
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
          {rounds.map((round) => {
            return (
              <Collapsible key={round.id} asChild>
                <Fragment key={round.id}>
                  <TableRow key={round.id}>
                    <CollapsibleTrigger asChild>
                      <TableCell className="hover:cursor-pointer">
                        {format === "Stableford"
                          ? round.points
                          : format === "Medal"
                            ? round.net
                            : round.strokes}
                      </TableCell>
                    </CollapsibleTrigger>
                    <TableCell>
                      <EntrantDisplay
                        entrant={{
                          id: round.entrantId,
                          name: round.compEntrant.entrant.name,
                        }}
                      />
                      {/* <Link href={`/entrants/${round.entrantId}`}>
                        {round.compEntrant.entrant.name}
                        {` (${round.handicap})`}
                      </Link> */}
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
    </LibCardNarrow>
  );
}

function NoScores({ format, numberOfRounds }: BestRoundsProps) {
  return (
    <LibCardNarrow title={`${numberOfRounds} Best ${format} Rounds`}>
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
          <TableRow>
            <TableCell colSpan={3}>
              Rounds will appear here when scores have been processed
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}

export async function Eagles() {
  return <GreatScores type="Eagles" />;
}

export async function HolesInOne() {
  return <GreatScores type="Holes In One" />;
}

type GreatScoresProps = {
  type: "Eagles" | "Holes In One";
};

async function GreatScores({ type }: GreatScoresProps) {
  const scores =
    type === "Eagles"
      ? await api.scorecard.eagles()
      : await api.scorecard.holesInOne();

  if (scores.length === 0) return null;

  return (
    <LibCardNarrow title={type}>
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
          {scores.map((score) => {
            return (
              <Collapsible key={`${score.scorecardId}-${score.holeNo}`} asChild>
                <Fragment key={`${score.scorecardId}-${score.holeNo}`}>
                  <TableRow key={`${score.scorecardId}-${score.holeNo}`}>
                    <CollapsibleTrigger asChild>
                      <TableCell className="hover:cursor-pointer">
                        {new Date(
                          score.scorecard.compEntrant.comp.date,
                        ).toLocaleDateString("en-GB", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                    </CollapsibleTrigger>
                    <TableCell>
                      <EntrantDisplay
                        entrant={{
                          id: score.scorecard.entrantId,
                          name: score.scorecard.compEntrant.entrant.name,
                        }}
                      />
                      {/* <Link href={`/entrants/${eagle.scorecard.entrantId}`}>
                          {eagle.scorecard.compEntrant.entrant.name}
                        </Link> */}
                    </TableCell>
                    <CollapsibleTrigger asChild>
                      <TableCell className="text-center hover:cursor-pointer">
                        {score.holeNo}
                      </TableCell>
                    </CollapsibleTrigger>
                    <TableCell>
                      <Link
                        href={`/events/${score.scorecard.compEntrant.comp.shortName}`}
                      >
                        {score.scorecard.compEntrant.comp.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <tr className="bg-slate-100">
                      <ScorecardDisplay
                        colSpan={4}
                        formatForSplitView={true}
                        scorecard={score.scorecard}
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
    </LibCardNarrow>
  );
}
