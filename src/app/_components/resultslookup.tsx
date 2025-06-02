"use client";

import { api } from "~/trpc/react";
import { useState, useTransition } from "react";
import {
  ProcessResults,
  type ScrapedResultsType,
  type ScrapedEclecticType,
  GetEclectic,
  type EntrantType,
  type TeamType,
  type CompEntrantType,
  type TeamPointsType,
  type TransactionType,
} from "~/app/api/ig/results";
import { Button } from "~/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LibMoney from "./lib-money";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EnterSomeoneButton } from "./enter-button";
import { WithdrawSomeoneButton } from "./withdraw-button";
import { Badge } from "~/components/ui/badge";
import { toast } from "~/components/ui/use-toast";
import { LibCardNarrow, Spinner } from "./lib-elements";
type ScrapeResultProps = {
  eventId: string;
  resultsPage: string;
  compFormat: "Medal" | "Stableford";
  compName: string;
};

type ResultsObjectType = {
  compEntrants: CompEntrantType[];
  teamPoints: TeamPointsType[];
  transactions: TransactionType[];
  compId: string;
};

export function ScrapeResults({
  eventId,
  resultsPage,
  compFormat,
  compName,
}: ScrapeResultProps) {
  const [results, setResults] = useState<ScrapedResultsType | null>(null);
  const [eclectic, setEclectic] = useState<ScrapedEclecticType | null>(null);
  const [noShows, setNoShows] = useState<EntrantType[] | null>(null);
  const [missingEntrants, setMissingEntrants] = useState<EntrantType[] | null>(
    null,
  );
  const [missingWildcards, setMissingWildcards] = useState<TeamType[] | null>(
    null,
  );
  // const [compEntrants, setCompEntrants] = useState<CompEntrantType[] | null>(
  //   null,
  // );
  const [teamPoints, setTeamPoints] = useState<TeamPointsType[] | null>(null);
  const [transactions, setTransactions] = useState<TransactionType[] | null>(
    null,
  );
  const [resultsObject, setResultsObject] = useState<ResultsObjectType | null>(
    null,
  );
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEclecticPending, startEclecticScrape] = useTransition();
  const [isScrapePending, startScrape] = useTransition();
  const [isScoreUpdatePending, startScoreUpdate] = useTransition();

  const open = api.comp.setOpen.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });

  const close = api.comp.setClosed.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });

  const processResults = () => {
    startScrape(async () => {
      const processedResults = await ProcessResults(
        eventId,
        resultsPage,
        compFormat,
        compName,
      );
      setResults(processedResults.results);
      setMissingEntrants(processedResults.checks.missingEntrants);
      setNoShows(processedResults.checks.noShows);
      setMissingWildcards(processedResults.checks.missingWildcards);
      // setCompEntrants(processedResults.resultsObject.compEntrants);
      setTeamPoints(processedResults.resultsObject.teamPoints);
      setTransactions(processedResults.resultsObject.transactions);
      setResultsObject(processedResults.resultsObject);
    });
  };
  const SendResults = api.comp.processResults.useMutation({
    onSuccess: async () => {
      toast({
        title: `Processing Complete`,
        description: "Competition results have been finalised",
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });

  const scores = api.scorecard.addMany.useMutation({
    onSuccess: async () => {
      toast({
        title: "Scorecards added",
        description: "Scraped scores have been added to entrants' records",
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
    onError: async (err) => {
      toast({
        variant: "destructive",
        title: "Scorecards not updated!",
        description: `${err.message}`,
      });
    },
  });

  const eclecticScores = api.scorecard.addManyEclectic.useMutation({
    onSuccess: async () => {
      toast({
        title: "Eclectic scorecards added",
        description: "Scraped scores have been added to entrants' records",
      });
    },
    onError: async (err) => {
      toast({
        variant: "destructive",
        title: "Eclectic scorecards not updated!",
        description: `${err.message}`,
      });
    },
  });

  type ScoreDataType = {
    compId: string;
    entrantId: number;
    handicap: number;
    stableford: boolean;
    holes: {
      holeNo: number;
      strokes: number | undefined;
      NR: boolean;
    }[];
  }[];

  type EclecticScoreDataType = {
    compId: string;
    eclecticEntrantId: number;
    handicap: number;
    stableford: boolean;
    holes: {
      holeNo: number;
      strokes: number | undefined;
      NR: boolean;
    }[];
  }[];

  const updateScores = () => {
    startScoreUpdate(async () => {
      //grab the scores that are matched to an entrant
      const rawScoreData = eclectic?.scrapedScores.filter((ent) => {
        return ent.entrantId;
      });
      const scoreData: ScoreDataType = [];
      rawScoreData?.forEach((round) => {
        const roundData = {
          compId: eventId,
          entrantId: round.entrantId ?? 0,
          handicap: Number(round.handicap),
          stableford: eclectic?.compFormat === "Stableford",
          holes: round.scores.map((score) => {
            return {
              holeNo: score.hole,
              strokes: Number(score.score) || undefined,
              NR: ["NR", "NS"].includes(score.score ?? ""),
            };
          }),
        };
        scoreData.push(roundData);
      });
      // console.log("Raw Scores=================", eclectic?.scrapedScores);
      // console.log("Filtered Scores==============", rawScoreData);
      // console.log("ScoreData================", scoreData);
      scores.mutate(scoreData);

      //grab the scores that are matched to an eclectic entrant
      const rawEclecticData = eclectic?.scrapedScores.filter((ent) => {
        return ent.eclecticEntrantId;
      });
      const eclecticScoreData: EclecticScoreDataType = [];
      rawEclecticData?.forEach((round) => {
        const roundData = {
          compId: eventId,
          eclecticEntrantId: round.eclecticEntrantId ?? 0,
          handicap: Number(round.handicap),
          stableford: eclectic?.compFormat === "Stableford",
          holes: round.scores.map((score) => {
            return {
              holeNo: score.hole,
              strokes: Number(score.score) || undefined,
              NR: ["NR", "NS"].includes(score.score ?? ""),
            };
          }),
        };
        eclecticScoreData.push(roundData);
      });
      // console.log("Raw Scores=================", eclectic?.scrapedScores);
      // console.log("Filtered Scores==============", rawScoreData);
      // console.log("ScoreData================", scoreData);
      eclecticScores.mutate(eclecticScoreData);
    });
  };

  const scrapeEclectic = () => {
    startEclecticScrape(async () => {
      const scrapedEclectic = await GetEclectic(
        eventId,
        resultsPage,
        compFormat,
        compName,
      );
      // console.log("========Scraped Scores--------", scrapedEclectic);
      setEclectic(scrapedEclectic);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1  gap-4 lg:grid-cols-2">
        <IGResults results={results} />
        <ProvisionalResults results={resultsObject} teamResults={teamPoints} />
        {/* <TeamResults teamResults={teamPoints} /> */}
        <Prizes prizes={transactions} />
        <div className="grid grid-cols-1 gap-4">
          <MissingEntrants entrants={missingEntrants} compId={eventId} />
          <NoShows entrants={noShows} compId={eventId} />
          <MissingWildcards teams={missingWildcards} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-100 flex flex-wrap justify-items-start gap-2">
          <Button onClick={() => open.mutate(eventId)}>Open</Button>
          <Button className="" onClick={() => close.mutate(eventId)}>
            Close
          </Button>
        </div>
        <div className="w-100 flex flex-wrap justify-items-start gap-2">
          <Button
            className=""
            onClick={processResults}
            disabled={isScrapePending}
          >
            <div className="flex gap-2">
              {isScrapePending ? <Spinner /> : null}
              <span>Process Results</span>
            </div>
          </Button>
          <Button
            onClick={() => {
              if (resultsObject) {
                SendResults.mutate(resultsObject);
              }
            }}
            disabled={resultsObject === null}
          >
            Finalise Results
          </Button>
        </div>
        <div className="w-100 flex flex-wrap justify-items-start gap-2">
          <Button onClick={scrapeEclectic} disabled={isEclecticPending}>
            <div className="flex gap-2">
              {isEclecticPending && <Spinner />}
              <span>Process Eclectic</span>
            </div>
          </Button>
          <Button
            onClick={updateScores}
            disabled={!eclectic || isScoreUpdatePending}
          >
            <div className="flex gap-2">
              {isScoreUpdatePending && <Spinner />}
              <span>Update Scorecards</span>
            </div>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1">
        <IGLinks results={eclectic} />
      </div>
    </div>
  );
}

interface IGResultsProps {
  results: ScrapedResultsType | null;
}

function IGResults({ results }: IGResultsProps) {
  if (!results) return null;

  return (
    <LibCardNarrow title="IG Results">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pos</TableHead>

            <TableHead>Name</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.scrapedResults.map((result) => {
            return (
              <TableRow key={result.entrantName}>
                <TableCell>{result.igPosition}</TableCell>
                <TableCell>{result.entrantName}</TableCell>
                <TableCell className="text-right">{result.score}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}

interface IGLinksProps {
  results: ScrapedEclecticType | null;
}

function IGLinks({ results }: IGLinksProps) {
  if (!results) return null;

  return (
    <div className="flex flex-col">
      {results.scrapedScores.map((result) => {
        return (
          <div className="grid grid-cols-2 gap-1" key={result.entrant}>
            <div className="flex justify-between">
              <div>{result.entrant}</div>
              <div>{result.handicap}</div>
            </div>
            <div className="grid grid-cols-18 gap-1">
              {result.scores.map((score) => {
                return (
                  <div className="text-right" key={score.hole}>
                    {score.score}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface PrizesProps {
  prizes: TransactionType[] | null;
}

function Prizes({ prizes }: PrizesProps) {
  if (!prizes) return null;

  return (
    <LibCardNarrow title="Prizes">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entrant</TableHead>
            <TableHead className="text-right">£</TableHead>
            <TableHead>Desc</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prizes.map((prize) => {
            return (
              <TableRow key={`${prize.entrantId}${prize.description}`}>
                <TableCell>{prize.entrantName}</TableCell>
                <TableCell className="text-right">
                  <LibMoney amountInPence={prize.amount} />
                </TableCell>
                <TableCell>{prize.description}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}

interface ProvisionalResultsProps {
  results: ResultsObjectType | null;
  teamResults: TeamPointsType[] | null;
}

function ProvisionalResults({ results, teamResults }: ProvisionalResultsProps) {
  if (!results && !teamResults) return null;

  return (
    <Card className="w-[350px_1fr]">
      {results && (
        <>
          <CardHeader>
            <CardTitle>Provisional Lib Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pos</TableHead>
                  <TableHead>Entrant</TableHead>
                  <TableHead className="hidden sm:table-cell">Team</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Team score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.compEntrants.map((entrant) => {
                  return (
                    <TableRow key={entrant.entrantId}>
                      <TableCell>{entrant.position}</TableCell>
                      <TableCell>
                        <span className="mr-1">{entrant.entrantName}</span>
                        {entrant.wildcard ? <Badge>WC</Badge> : ""}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {entrant.teamName}
                      </TableCell>
                      <TableCell className="text-right">
                        {entrant.noResult ? "NR" : entrant.score}
                      </TableCell>
                      <TableCell className="text-right">
                        {entrant.noResult ? "NR" : entrant.teamScore}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </>
      )}
      {teamResults && (
        <>
          <CardHeader>
            <CardTitle>Team Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>

                  <TableHead className="hidden text-center sm:table-cell">
                    Best
                  </TableHead>
                  <TableHead className="hidden text-center sm:table-cell">
                    2nd
                  </TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Best Pos</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamResults.map((teamResult) => {
                  return (
                    <TableRow key={teamResult.teamId}>
                      <TableCell>{teamResult.teamName}</TableCell>
                      <TableCell className="hidden text-center sm:table-cell">
                        {teamResult.bestScore}
                      </TableCell>
                      <TableCell className="hidden text-center sm:table-cell">
                        {teamResult.secondScore}
                      </TableCell>
                      <TableCell className="text-center">
                        {teamResult.bestScore + teamResult.secondScore}
                      </TableCell>
                      <TableCell className="text-center">
                        {teamResult.bestFinish}
                      </TableCell>
                      <TableCell className="text-center">
                        {teamResult.points}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </>
      )}
    </Card>
  );
}

interface MissingEntrantsProps {
  entrants: EntrantType[] | null;
  compId: string;
}

function MissingEntrants({ entrants, compId }: MissingEntrantsProps) {
  if (!entrants || entrants.length === 0) return null;

  return (
    <Card className="w-[350px_1fr]">
      <CardHeader>
        <CardTitle>Not Entered</CardTitle>
        <CardDescription>
          Didn&apos;t enter the Lib, but entered on IG!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {entrants.map((entrant) => {
              return (
                <TableRow key={entrant.id}>
                  <TableCell>{entrant.name}</TableCell>
                  <TableCell>
                    <EnterSomeoneButton
                      entrantId={entrant.id}
                      compId={compId}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface NoShowsProps {
  entrants: EntrantType[] | null;
  compId: string;
}

function NoShows({ entrants, compId }: NoShowsProps) {
  if (!entrants || entrants.length === 0) return null;

  return (
    <Card className="w-[350px_1fr]">
      <CardHeader>
        <CardTitle>No Shows</CardTitle>
        <CardDescription>Entered the Lib, but not on IG!</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {entrants.map((entrant) => {
              return (
                <TableRow key={entrant.id}>
                  <TableCell>{entrant.name}</TableCell>
                  <TableCell>
                    <WithdrawSomeoneButton
                      entrantId={entrant.id}
                      compId={compId}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface MissingWildcardsProps {
  teams: TeamType[] | null;
}

function MissingWildcards({ teams }: MissingWildcardsProps) {
  if (!teams || teams.length === 0) {
    return null;
  }

  return (
    <Card className="w-[350px_1fr]">
      <CardHeader>
        <CardTitle>Missing wildcards</CardTitle>
        <CardDescription>Teams that have no wildcard selected</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {teams.map((team) => {
              return (
                <TableRow key={team.teamId}>
                  <TableCell className="text-center">{team.teamName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
