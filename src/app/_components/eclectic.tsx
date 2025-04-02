"use client";

import { z } from "zod";
import {
  LibCardContainer,
  LibCardNarrow,
  ScoreDisplay,
} from "~/app/_components/lib-elements";
import { Fragment, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ScorecardDisplay } from "./scorecard";
import { Skeleton } from "~/components/ui/skeleton";
import { type EclecticData } from "../eclectic/page";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

type EclecticDataScorecards = EclecticData[number]["scorecards"];

type Hole = {
  holeNo: number;
  strokes: number;
  net: number;
  strokeIndex: number;
  par: number;
  NR: boolean;
  points: number;
};

type EclecticScorecard = {
  entrantId: number;
  entrantName: string;
  cards: EclecticDataScorecards;
  holes: [
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
    Hole,
  ];
  Gross: number;
  GrossCountback: number;
  Net: number;
  NetCountback: number;
};

const HoleSchema = z.object({
  NR: z.boolean(),
  holeNo: z.number().min(1).max(18),
  strokes: z.number().min(1).default(100).nullable(),
  net: z.number().default(100).nullable(),
});

function ProcessEclecticScores(scores: EclecticData) {
  console.log("EclecticData received", scores);
  const eclecticScores: EclecticScorecard[] = [];
  scores.map((entrant) => {
    const entrantEclecticCard: EclecticScorecard = {
      entrantId: entrant.id,
      entrantName: entrant.displayName,
      cards: entrant.scorecards,
      holes: [
        {
          holeNo: 1,
          strokes: 100,
          net: 100,
          strokeIndex: 12,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 2,
          strokes: 100,
          net: 100,
          strokeIndex: 6,
          par: 5,
          NR: false,
          points: 0,
        },
        {
          holeNo: 3,
          strokes: 100,
          net: 100,
          strokeIndex: 2,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 4,
          strokes: 100,
          net: 100,
          strokeIndex: 16,
          par: 3,
          NR: false,
          points: 0,
        },
        {
          holeNo: 5,
          strokes: 100,
          net: 100,
          strokeIndex: 4,
          par: 5,
          NR: false,
          points: 0,
        },
        {
          holeNo: 6,
          strokes: 100,
          net: 100,
          strokeIndex: 14,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 7,
          strokes: 100,
          net: 100,
          strokeIndex: 8,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 8,
          strokes: 100,
          net: 100,
          strokeIndex: 18,
          par: 3,
          NR: false,
          points: 0,
        },
        {
          holeNo: 9,
          strokes: 100,
          net: 100,
          strokeIndex: 10,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 10,
          strokes: 100,
          net: 100,
          strokeIndex: 9,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 11,
          strokes: 100,
          net: 100,
          strokeIndex: 1,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 12,
          strokes: 100,
          net: 100,
          strokeIndex: 11,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 13,
          strokes: 100,
          net: 100,
          strokeIndex: 13,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 14,
          strokes: 100,
          net: 100,
          strokeIndex: 3,
          par: 4,
          NR: false,
          points: 0,
        },
        {
          holeNo: 15,
          strokes: 100,
          net: 100,
          strokeIndex: 15,
          par: 3,
          NR: false,
          points: 0,
        },
        {
          holeNo: 16,
          strokes: 100,
          net: 100,
          strokeIndex: 7,
          par: 5,
          NR: false,
          points: 0,
        },
        {
          holeNo: 17,
          strokes: 100,
          net: 100,
          strokeIndex: 17,
          par: 3,
          NR: false,
          points: 0,
        },
        {
          holeNo: 18,
          strokes: 100,
          net: 100,
          strokeIndex: 15,
          par: 5,
          NR: false,
          points: 0,
        },
      ],
      Gross: 0,
      GrossCountback: 0,
      Net: 0,
      NetCountback: 0,
    };
    entrant.scorecards.map((card) => {
      card.holes.map((hole) => {
        const safeHole = HoleSchema.parse(hole);
        const thisHole = entrantEclecticCard.holes[safeHole.holeNo - 1];
        if (thisHole != undefined && !safeHole.NR) {
          thisHole.strokes = Math.min(
            thisHole?.strokes,
            safeHole.strokes ?? 100,
          );
          thisHole.net = Math.min(thisHole?.net, safeHole.net ?? 100);
        }
      });
    });
    entrantEclecticCard.Gross = entrantEclecticCard.holes.reduce(
      (acc, cur) => acc + cur.strokes,
      0,
    );
    entrantEclecticCard.GrossCountback =
      100_000_000 * entrantEclecticCard.Gross +
      1_000_000 *
        entrantEclecticCard.holes
          .filter((h) => h.holeNo >= 10)
          .reduce((acc, cur) => acc + (cur.strokes ?? 0), 0) +
      10_000 *
        entrantEclecticCard.holes
          .filter((h) => h.holeNo >= 13)
          .reduce((acc, cur) => acc + (cur.strokes ?? 0), 0) +
      100 *
        entrantEclecticCard.holes
          .filter((h) => h.holeNo >= 16)
          .reduce((acc, cur) => acc + (cur.strokes ?? 0), 0) +
      1 *
        entrantEclecticCard.holes
          .filter((h) => h.holeNo >= 18)
          .reduce((acc, cur) => acc + (cur.strokes ?? 0), 0);

    entrantEclecticCard.Net = entrantEclecticCard.holes.reduce(
      (acc, cur) => acc + cur.net,
      0,
    );
    entrantEclecticCard.NetCountback =
      100_000_000 * entrantEclecticCard.Net +
      1_000_000 *
        entrantEclecticCard.holes
          .filter((h) => h.holeNo >= 10)
          .reduce((acc, cur) => acc + (cur.net ?? 0), 0) +
      10_000 *
        entrantEclecticCard.holes
          .filter((h) => h.holeNo >= 13)
          .reduce((acc, cur) => acc + (cur.net ?? 0), 0) +
      100 *
        entrantEclecticCard.holes
          .filter((h) => h.holeNo >= 16)
          .reduce((acc, cur) => acc + (cur.net ?? 0), 0) +
      1 *
        entrantEclecticCard.holes
          .filter((h) => h.holeNo >= 18)
          .reduce((acc, cur) => acc + (cur.net ?? 0), 0);

    //Any scores still at 100 are NR
    entrantEclecticCard.holes.forEach((hole) => {
      if (hole.strokes === 100) {
        hole.NR = true;
      }
    });

    eclecticScores.push(entrantEclecticCard);
  });

  const scratch: EclecticScorecard[] = eclecticScores;

  //Deep Copy the eclecticScores array so we can easily modify the Net to show net scores when shown on a scorecard
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // const net: EclecticScorecard[] = JSON.parse(JSON.stringify(eclecticScores));
  const net: EclecticScorecard[] = structuredClone(eclecticScores);

  scratch.sort((a, b) => {
    return a.GrossCountback - b.GrossCountback;
  });
  net.sort((a, b) => {
    return a.NetCountback - b.NetCountback;
  });
  net.forEach((ent) => {
    ent.holes.forEach((hole) => {
      hole.strokes = hole.net;
    });
  });
  console.log("Objects returned", scratch, net);
  return { scratch, net };
}

type EclecticProps = {
  scores: EclecticData;
  title?: string;
  defaultOpen?: boolean;
};

export default function Eclectic({
  scores,
  title = "Eclectic Leaderboard",
  defaultOpen = false,
}: EclecticProps) {
  const { scratch, net } = ProcessEclecticScores(scores);

  return (
    <LibCardContainer>
      <LibCardNarrow title={title}>
        <Tabs className="" defaultValue={"Gross"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Gross">Gross</TabsTrigger>
            <TabsTrigger value="Net">Net</TabsTrigger>
          </TabsList>
          <TabsContent value="Gross">
            <EclecticTable
              type="Gross"
              scores={scratch}
              defaultOpen={defaultOpen}
            />
          </TabsContent>
          <TabsContent value="Net">
            <EclecticTable type="Net" scores={net} defaultOpen={defaultOpen} />
          </TabsContent>
        </Tabs>
      </LibCardNarrow>
    </LibCardContainer>
  );
}

export function EclecticSkeleton() {
  const [grossOrNet, setGrossOrNet] = useState<"Gross" | "Net">("Gross");
  const fakeArray = [...Array<string>(40)];
  return (
    <LibCardContainer>
      <LibCardNarrow title="Eclectic Leaderboard">
        <Tabs className="" defaultValue={grossOrNet}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger onClick={() => setGrossOrNet("Gross")} value="Gross">
              Gross
            </TabsTrigger>
            <TabsTrigger onClick={() => setGrossOrNet("Net")} value="Net">
              Net
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fakeArray.map((fakeScore, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 " />
                  </TableCell>

                  <TableCell>
                    <div className="flex w-full justify-end">
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </LibCardNarrow>
    </LibCardContainer>
  );
}

type EclecticTableProps = {
  type: "Gross" | "Net";
  scores: EclecticScorecard[];
  includePosition?: boolean;
  defaultOpen?: boolean;
};

function EclecticTable({
  type,
  scores,
  includePosition = true,
  defaultOpen = false,
}: EclecticTableProps) {
  const pathname = usePathname();
  let lastCountbackScore = 0;
  let lastPosition = 0;

  const getPosition = (score: number, ordinal: number) => {
    if (score === lastCountbackScore) return lastPosition;
    lastCountbackScore = score;
    lastPosition = ordinal;
    return ordinal;
  };

  const ordinalPosition = (num: number) => {
    return `${num}${
      num > 0
        ? ["th", "st", "nd", "rd"][
            (num > 3 && num < 21) || num % 10 > 3 ? 0 : num % 10
          ]
        : ""
    }`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {includePosition && (
            <TableHead className="px-1 sm:px-2">Pos</TableHead>
          )}
          <TableHead className="px-1 sm:px-2">Name</TableHead>

          <TableHead className="px-1 text-right sm:px-2">{`${type} Score`}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores.map((score, index) => (
          <Collapsible
            key={`${type}-${score.entrantId}`}
            defaultOpen={defaultOpen}
            asChild
          >
            <Fragment key={score.entrantId}>
              <TableRow
                key={score.entrantId}
                className={`entrant${score.entrantId}`}
              >
                {includePosition && (
                  <TableCell className="px-1 hover:cursor-pointer sm:px-2">
                    <CollapsibleTrigger asChild>
                      <span>
                        {ordinalPosition(
                          getPosition(
                            type === "Gross"
                              ? score.GrossCountback
                              : score.NetCountback,
                            index + 1,
                          ),
                        )}
                      </span>
                    </CollapsibleTrigger>
                  </TableCell>
                )}
                <TableCell className="px-1 hover:cursor-pointer sm:px-2">
                  {/* Display a collapsibletrigger if link would be to page we are already on, otherwise show a link */}
                  {pathname === `/eclectic/${score.entrantId}` ? (
                    <CollapsibleTrigger asChild>
                      <span>{score.entrantName}</span>
                    </CollapsibleTrigger>
                  ) : (
                    <Link href={`/eclectic/${score.entrantId}`}>
                      {score.entrantName}
                    </Link>
                  )}
                </TableCell>

                <TableCell className="px-1 text-right hover:cursor-pointer sm:px-2">
                  <ScoreDisplay
                    score={type === "Gross" ? score.Gross : score.Net}
                    displayOption="Both"
                    NR={score.holes.some((hole) => hole.strokes === 100)}
                    collapsibleTrigger={true}
                  />
                </TableCell>
              </TableRow>
              <CollapsibleContent asChild>
                <tr className="bg-muted">
                  <ScorecardDisplay
                    colSpan={4}
                    scorecard={{
                      id: score.entrantId,
                      handicap: 0,
                      stableford: false,
                      holes: score.holes,
                    }}
                    strokesOnly={true}
                  />
                </tr>
              </CollapsibleContent>
            </Fragment>
          </Collapsible>
        ))}
      </TableBody>
    </Table>
  );
}

type EclecticScorecardProps = {
  scores: EclecticData;
  defaultOpen?: boolean;
  displayAllCards?: boolean;
};

export function EclecticScorecardView({
  scores,
  defaultOpen = false,
  displayAllCards = true,
}: EclecticScorecardProps) {
  const pathName = usePathname();
  const { scratch, net } = ProcessEclecticScores(scores);

  return (
    <LibCardContainer>
      <LibCardNarrow
        title="Eclectic Scorecard"
        url={pathName !== "/eclectic" ? "/eclectic" : undefined}
      >
        <Tabs className="" defaultValue={"Gross"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Gross">Gross</TabsTrigger>
            <TabsTrigger value="Net">Net</TabsTrigger>
          </TabsList>
          <TabsContent value="Gross">
            <EclecticTable
              type="Gross"
              scores={scratch}
              includePosition={false}
              defaultOpen={defaultOpen}
            />
            {displayAllCards && (
              <EclecticScorecardTable
                type="Gross"
                scores={scratch}
                defaultOpen={false}
              />
            )}
          </TabsContent>
          <TabsContent value="Net">
            <EclecticTable
              type="Net"
              scores={net}
              includePosition={false}
              defaultOpen={defaultOpen}
            />
            {displayAllCards && (
              <EclecticScorecardTable
                type="Net"
                scores={net}
                defaultOpen={false}
              />
            )}
          </TabsContent>
        </Tabs>
      </LibCardNarrow>
    </LibCardContainer>
  );
}

type EclecticScoresTableProps = {
  type: "Gross" | "Net";
  scores: EclecticScorecard[];
  defaultOpen?: boolean;
};

function EclecticScorecardTable({
  type,
  scores,
  defaultOpen = false,
}: EclecticScoresTableProps) {
  if (scores[0]?.cards.length === 0) return null;
  console.log("scores", scores[0]);
  return (
    <Table className="mt-8">
      <TableHeader>
        <TableRow>
          <TableHead className="px-1 sm:px-2">Comp</TableHead>
          <TableHead className="px-1 sm:px-2">Format</TableHead>
          <TableHead className="px-1 text-right sm:px-2">Hcp</TableHead>
          <TableHead className="px-1 text-right sm:px-2">{`${type} Score`}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores[0]?.cards.map((card) => (
          <Collapsible key={card.id} asChild defaultOpen={defaultOpen}>
            <Fragment key={card.id}>
              <TableRow key={card.id}>
                <TableCell className="px-1 sm:px-2">
                  <Link href={`/events/${card.compId}`}>{card.comp.name}</Link>
                </TableCell>
                <TableCell className="px-1 hover:cursor-pointer sm:px-2">
                  <CollapsibleTrigger asChild>
                    <span>{card.comp.stableford ? "Stableford" : "Medal"}</span>
                  </CollapsibleTrigger>
                </TableCell>
                <TableCell className="px-1 text-right hover:cursor-pointer sm:px-2">
                  <CollapsibleTrigger asChild>
                    <span>{card.handicap}</span>
                  </CollapsibleTrigger>
                </TableCell>
                <TableCell className="px-1 text-right hover:cursor-pointer sm:px-2">
                  <ScoreDisplay
                    score={
                      type === "Gross"
                        ? card.strokes ?? undefined
                        : card.net ?? undefined
                    }
                    NR={card.NR}
                    displayOption="Both"
                    collapsibleTrigger={true}
                  />
                </TableCell>
              </TableRow>
              <CollapsibleContent asChild>
                <TableRow className="bg-muted">
                  <ScorecardDisplay
                    scorecard={{
                      id: card.id,
                      handicap: card.handicap,
                      stableford: false,
                      holes: card.holes,
                    }}
                    strokesOnly={type === "Gross"}
                    colSpan={4}
                  />
                </TableRow>
              </CollapsibleContent>
            </Fragment>
          </Collapsible>
        ))}
      </TableBody>
    </Table>
  );
}
