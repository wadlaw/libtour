import { api } from "~/trpc/server";
import {
  LibCardContainer,
  LibMainFixed,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ChevronDown } from "lucide-react";

type Leaderboard = {
  entrants: LeaderboardEntrant[];
  thru: number;
};

type LeaderboardEntrant = {
  name: string;
  entrantId: number;
  score: number;
  position: number;
  tied: boolean;
  NR: boolean;
  notableHoles: NotableHole[];
};
const disasterHoleStrings = [
  "Trainwreck",
  "Meltdown",
  "Catastrophe",
  "Debacle",
  "Blowup",
  "Total Collapse",
  "Scorecard Ruiner",
  "Fiasco",
  "Car Crash",
  "Dumpster Fire",
  "Nightmare",
  "Horrorshow",
  "Card Wrecker",
] as const;
type DisasterHole = (typeof disasterHoleStrings)[number];

type NotableHole = {
  holeNo: number;
  score:
    | "Hole in One"
    | "Albatross"
    | "Eagle"
    | "Birdie"
    | "Par"
    | "Bogey"
    | "Double Bogey"
    | "Triple Bogey"
    | "Quadruple Bogey"
    | "Quintuple Bogey"
    | "Sextuple Bogey"
    | "Blob"
    | DisasterHole;
  toString: () => string;
};

export async function generateMetadata({
  params,
}: {
  params: { eventId: string };
}) {
  const comp = await api.comp.getOne({
    comp: params.eventId,
  });

  let desc = "";
  if (comp) {
    if (comp?.completed) {
      desc = `Timeline of the ${comp.name}`;
    } else {
      desc = `${comp.stableford ? "Stableford" : "Medal"} - ${comp?.date.toLocaleDateString(
        "en-GB",
        {
          weekday: "short",
          month: "long",
          day: "numeric",
        },
      )}`;
    }
  } else {
    desc = "Libtour event not found";
  }

  return {
    title: `Libtour - ${comp ? comp?.name : params.eventId} Timeline`,
    description: desc,
  };
}

// Function that returns a sorted leaderboard as at a given hole - in order to recreate a live scoring narrative as if everyone were playing at the same time
// comp: the id of the competition to produce a leaderboard for
// thru: the number of holes to mimic having been played
function leaderboardThruXHoles(
  comp: Awaited<ReturnType<typeof api.comp.getOneWithScores>>,
  thru: number,
): Leaderboard {
  if (!comp) return { thru: thru, entrants: [] };

  const scores = comp?.entrants
    .filter((entrant) => !!entrant.scorecard)
    .map((entrant) => {
      // As we've already filtered out non-null scorecard values (although typescript doesn't recognise the typeguard), we can safely coalesce nulls to zero/empty array
      const lbEntrant: LeaderboardEntrant = {
        name: entrant.entrant.name,
        entrantId: entrant.entrantId,
        position: thru === 18 ? entrant.position ?? 0 : 0,
        tied: false,
        NR: !!(
          !comp.stableford &&
          entrant.scorecard &&
          entrant.scorecard.holes.filter(
            (hole) => hole.holeNo <= thru && hole.NR,
          ).length > 0
        ),
        score: entrant.scorecard
          ? entrant.scorecard.holes
              .filter((hole) => hole.holeNo <= thru)
              .reduce(
                (acc, cur) =>
                  comp.stableford
                    ? acc + (2 - cur.points)
                    : acc + ((cur.net ?? 100) - cur.par),
                0,
              )
          : 0,
        notableHoles: !entrant.scorecard
          ? []
          : entrant.scorecard.holes
              .filter((hole) => hole.points !== 2)
              .map((hole) => {
                const note: NotableHole = {
                  toString: function (): string {
                    return `${this.score} on ${this.holeNo}`;
                  },
                  holeNo: hole.holeNo,
                  score: hole.NR
                    ? "Blob"
                    : !hole.strokes
                      ? "Blob"
                      : hole.strokes === 1
                        ? "Hole in One"
                        : hole.par - hole.strokes === 3
                          ? "Albatross"
                          : hole.par - hole.strokes === 2
                            ? "Eagle"
                            : hole.par - hole.strokes === 1
                              ? "Birdie"
                              : hole.par - hole.strokes === 0
                                ? "Par"
                                : hole.par - hole.strokes === -1
                                  ? "Bogey"
                                  : hole.par - hole.strokes === -2
                                    ? "Double Bogey"
                                    : hole.par - hole.strokes === -3
                                      ? "Triple Bogey"
                                      : hole.par - hole.strokes === -4
                                        ? "Quadruple Bogey"
                                        : hole.par - hole.strokes === -5
                                          ? "Quintuple Bogey"
                                          : hole.par - hole.strokes === -6
                                            ? "Sextuple Bogey"
                                            : disasterHoleStrings[
                                                Math.floor(
                                                  Math.random() *
                                                    disasterHoleStrings.length,
                                                )
                                              ] ?? "Nightmare",
                };
                return note;
              }),
      };
      return lbEntrant;
    });
  scores?.sort((a, b) => {
    // a or b can be undefined because the .map() above returns undefined
    // when entrant.scorecard is falsy, since there's no explicit return
    // for that case in the if statement
    return (a?.score ?? 0) - (b?.score ?? 0);
  });
  let position = 1;
  let prevScore = 0;

  //Add scoring positions and flag tied positions
  for (let i = 0; i < scores?.length; i++) {
    const score = scores[i];
    if (!score) continue;
    if (score.score !== prevScore) {
      position = i + 1;
    }
    if (thru < 18) {
      score.position = position;
      score.tied = scores.filter((sco) => sco.score === score.score).length > 1;
    }
    prevScore = score.score;
  }

  return { entrants: scores, thru: thru };
}

export default async function EventTimeline({
  params,
}: {
  params: { eventId: string };
}) {
  const comp = await api.comp.getOneWithScores({
    comp: params.eventId,
  });

  if (!comp || !comp.completed)
    return (
      <LibMainFixed>
        <LibH1>Event Not Completed Yet!</LibH1>
      </LibMainFixed>
    );
  const thru3 = leaderboardThruXHoles(comp, 3);
  const thru6 = leaderboardThruXHoles(comp, 6);
  const thru9 = leaderboardThruXHoles(comp, 9);
  const thru12 = leaderboardThruXHoles(comp, 12);
  const thru15 = leaderboardThruXHoles(comp, 15);
  const thru18 = leaderboardThruXHoles(comp, 18);

  return (
    <LibMainFixed>
      <LibH1>{comp.name} Timeline</LibH1>
      <LibCardContainer>
        <LibCardNarrow title="Event Timeline">
          <h3>Front 9</h3>
          <p>After 3 holes...</p>
          <LeaderboardSnapshot
            thru={3}
            data={thru3}
            places={20}
            stableford={comp.stableford}
          />
          <p>After 6 holes...</p>
          <LeaderboardSnapshot
            thru={6}
            data={thru6}
            prevData={thru3}
            stableford={comp.stableford}
          />
          <p>At the turn...</p>
          <LeaderboardSnapshot
            thru={9}
            data={thru9}
            prevData={thru6}
            stableford={comp.stableford}
          />
          <h3>Back 9</h3>
          <p>After 12 holes...</p>
          <LeaderboardSnapshot
            thru={12}
            data={thru12}
            prevData={thru9}
            stableford={comp.stableford}
          />
          <p>After 15 holes...</p>
          <LeaderboardSnapshot
            thru={15}
            data={thru15}
            prevData={thru12}
            places={15}
            stableford={comp.stableford}
          />
          <p>After 18 holes...</p>
          <LeaderboardSnapshot
            thru={18}
            data={thru18}
            prevData={thru15}
            places={40}
            stableford={comp.stableford}
          />
        </LibCardNarrow>
      </LibCardContainer>
    </LibMainFixed>
  );
}

type LeaderboardSnapshotProps = {
  thru: number;
  holeCount?: number;
  places?: number;
  allowTies?: boolean;
  data: Leaderboard;
  stableford: boolean;
  prevData?: Leaderboard;
};

function LeaderboardSnapshot({
  stableford,
  thru,
  holeCount = 3,
  places = 10,
  data,
  allowTies = true,
  prevData,
}: LeaderboardSnapshotProps) {
  const changes = new Map();
  if (prevData) {
    const prevMap = new Map();
    prevData.entrants.forEach((old) =>
      prevMap.set(old.entrantId, old.position),
    );
    data.entrants.forEach((entrant) => {
      changes.set(
        entrant.entrantId,
        prevMap.get(entrant.entrantId) - entrant.position,
      );
    });
  }

  return (
    <Table className="mb-4">
      <TableHeader>
        <TableRow>
          <TableHead className="mx-1 text-center @2xl/libcard:mx-2">
            Pos
          </TableHead>
          <TableHead className="mx-1 @2xl/libcard:mx-2">Name</TableHead>
          <TableHead className="mx-1 text-center @2xl/libcard:mx-2">
            Score
          </TableHead>
          {!!prevData && (
            <TableHead className="mx-1 hidden text-center @2xl/libcard:mx-2 @2xl/libcard:table-cell">
              Pos Change
            </TableHead>
          )}
          <TableHead>Notable Scores</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.entrants
          .filter((entrant) => entrant.position <= places)
          .map((entrant, index) => {
            return (
              <TableRow key={entrant.entrantId}>
                <TableCell className="mx-1 text-center @2xl/libcard:mx-2">{`${allowTies && entrant.tied ? "T" : ""}${allowTies ? entrant.position : index + 1}`}</TableCell>
                <TableCell className="mx-1 @2xl/libcard:mx-2">
                  {entrant.name}
                </TableCell>
                <TableCell className="mx-1 text-center @2xl/libcard:mx-2">
                  {!stableford && entrant.NR
                    ? "NR"
                    : entrant.score === 0
                      ? "E"
                      : `${entrant.score > 0 ? "+" : ""}${entrant.score}`}
                </TableCell>
                {!!prevData && (
                  <TableCell
                    className={`mx-1 hidden text-center  @2xl/libcard:mx-2 @2xl/libcard:table-cell ${Number(changes.get(entrant.entrantId)) > 0 ? "text-green-500" : Number(changes.get(entrant.entrantId)) < 0 ? "text-red-500" : ""}`}
                  >
                    <div className="flex flex-grow-0 items-center justify-center">
                      <ChevronDown
                        className={`h-4 w-4 ${Number(changes.get(entrant.entrantId)) === 0 && "hidden"} ${Number(changes.get(entrant.entrantId)) > 0 && "rotate-180"}`}
                      />
                      {Math.abs(Number(changes.get(entrant.entrantId))) === 0
                        ? "-"
                        : Math.abs(Number(changes.get(entrant.entrantId)))}
                    </div>
                  </TableCell>
                )}
                <TableCell className="mx-1 @2xl/libcard:mx-2">
                  {entrant.notableHoles
                    .filter(
                      (hole) =>
                        hole.holeNo > thru - holeCount && hole.holeNo <= thru,
                    )
                    .join(", ")}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

// type PositionChangeProps = {
//     change: number;
// }

// function PositionChange({ change }: PositionChangeProps) {
//     return (
//         {change != 0 ? `<ChevronDown />${change}` :}
//     )
// }
