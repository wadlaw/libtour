"use client";

import { z } from "zod";
import {
  EntrantDisplay,
  LibCardContainer,
  LibCardNarrow,
  ScoreDisplay,
  TeamDisplay,
} from "~/app/_components/lib-elements";
import { Fragment, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
  team: {
    id: string;
    linkName: string;
    teamName: string;
  };
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
  strokes: z.number().min(1).default(100),
  net: z.number().default(100),
});

type EclecticProps = {
  scores: EclecticData;
};

export default function Eclectic({ scores }: EclecticProps) {
  const [grossOrNet, setGrossOrNet] = useState<"Gross" | "Net">("Gross");
  const eclecticScores: EclecticScorecard[] = [];

  scores.map((entrant) => {
    const entrantEclecticCard: EclecticScorecard = {
      entrantId: entrant.id,
      entrantName: entrant.name,
      team: entrant.team,
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
    entrant.comps.map((comp) => {
      if (comp.scorecard) {
        comp.scorecard.holes.map((hole) => {
          const safeHole = HoleSchema.parse(hole);
          const thisHole = entrantEclecticCard.holes[safeHole.holeNo - 1];
          if (thisHole != undefined) {
            thisHole.strokes = Math.min(thisHole?.strokes, safeHole.strokes);
            thisHole.net = Math.min(thisHole?.net, safeHole.net);
          }
        });
      }
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

    eclecticScores.push(entrantEclecticCard);
  });

  const scratch: EclecticScorecard[] = eclecticScores;

  //Deep Copy the eclecticScores array so we can easily modify the Net to show net scores when shown on a scorecard
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const net: EclecticScorecard[] = JSON.parse(JSON.stringify(eclecticScores));

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
              <TableHead className="px-1 sm:px-2">Pos</TableHead>
              <TableHead className="px-1 sm:px-2">Name</TableHead>
              <TableHead className="px-1 sm:px-2">Team</TableHead>

              <TableHead className="px-1 text-right sm:px-2">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(grossOrNet === "Gross" ? scratch : net).map((score, index) => (
              <Collapsible key={`${grossOrNet}-${score.entrantId}`} asChild>
                <Fragment key={score.entrantId}>
                  <TableRow key={score.entrantId}>
                    <TableCell className="px-1 hover:cursor-pointer sm:px-2">
                      <CollapsibleTrigger asChild>
                        <span>{index + 1}</span>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="px-1 sm:px-2">
                      <EntrantDisplay
                        entrant={{
                          id: score.entrantId,
                          name: score.entrantName,
                        }}
                      />
                    </TableCell>
                    <TableCell className="px-1 sm:px-2">
                      <TeamDisplay
                        team={score.team}
                        alwaysDisplayLogo={true}
                        iconOnlyWhenSmall={true}
                      />
                    </TableCell>

                    <TableCell className="px-1 text-right hover:cursor-pointer sm:px-2">
                      <ScoreDisplay
                        score={grossOrNet === "Gross" ? score.Gross : score.Net}
                        displayOption="Both"
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
              <TableHead>Team</TableHead>
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
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="hidden h-4 w-16 sm:block" />
                    </div>
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
