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
import { EntrantDisplay, LibCardNarrow, ScoreDisplay } from "./lib-elements";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Fragment } from "react";
import { ScorecardDisplay } from "./scorecard";

type BestRoundsProps = {
  format: "Stableford" | "Medal" | "Gross";
  worst?: boolean;
  numberOfRounds: number;
};

export async function BestRounds({
  format,
  worst = false,
  numberOfRounds,
}: BestRoundsProps) {
  const rounds =
    format === "Stableford"
      ? worst
        ? await api.scorecard.worstStablefordRounds({
            numberOfRounds: numberOfRounds,
          })
        : await api.scorecard.bestStablefordRounds({
            numberOfRounds: numberOfRounds,
          })
      : format === "Medal"
        ? worst
          ? await api.scorecard.worstMedalRounds({
              numberOfRounds: numberOfRounds,
            })
          : await api.scorecard.bestMedalRounds({
              numberOfRounds: numberOfRounds,
            })
        : worst
          ? await api.scorecard.worstGrossRounds({
              numberOfRounds: numberOfRounds,
            })
          : await api.scorecard.bestGrossRounds({
              numberOfRounds: numberOfRounds,
            });

  if (rounds.length === 0)
    return <NoScores numberOfRounds={numberOfRounds} format={format} />;

  return (
    <LibCardNarrow
      title={`${numberOfRounds} ${worst ? "Worst" : "Best"} ${format} Rounds`}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell"></TableHead>
            <TableHead className="text-left sm:text-center">
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
                      <TableCell className="hidden text-left hover:cursor-pointer sm:table-cell">
                        {format === "Stableford" ? (
                          <ScoreDisplay
                            score={round.points}
                            stableford={true}
                            displayOption="OverUnder"
                          />
                        ) : format === "Medal" ? (
                          <ScoreDisplay
                            score={round.net ?? 0}
                            displayOption="OverUnder"
                          />
                        ) : (
                          <ScoreDisplay
                            score={round.strokes ?? 0}
                            displayOption="OverUnder"
                          />
                        )}
                      </TableCell>
                    </CollapsibleTrigger>
                    <CollapsibleTrigger asChild>
                      <TableCell className="text-left hover:cursor-pointer sm:text-center">
                        {format === "Stableford" ? (
                          <ScoreDisplay
                            score={round.points}
                            stableford={true}
                            displayOption="ScoreOnly"
                          />
                        ) : format === "Medal" ? (
                          <ScoreDisplay
                            score={round.net ?? 0}
                            displayOption="ScoreOnly"
                          />
                        ) : (
                          <ScoreDisplay
                            score={round.strokes ?? 0}
                            displayOption="ScoreOnly"
                          />
                        )}
                      </TableCell>
                    </CollapsibleTrigger>

                    <TableCell>
                      <EntrantDisplay
                        entrant={{
                          id: round.entrantId,
                          name: round.compEntrant.entrant.name,
                          handicap: round.handicap,
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
                        colSpan={5}
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

export async function DoubleFigures() {
  return <GreatScores type="Double Figures" />;
}

type GreatScoresProps = {
  type: "Eagles" | "Holes In One" | "Double Figures";
};

async function GreatScores({ type }: GreatScoresProps) {
  const scores =
    type === "Eagles"
      ? await api.scorecard.eagles()
      : type === "Holes In One"
        ? await api.scorecard.holesInOne()
        : await api.scorecard.doubleFigures();

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
                        {type === "Double Figures"
                          ? `${score.strokes} on ${score.holeNo}`
                          : score.holeNo}
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
