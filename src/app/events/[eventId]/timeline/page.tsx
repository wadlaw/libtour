import { api } from "~/trpc/server";
import { z } from "zod";
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
import TeamResultsForComp from "~/app/_components/team-results";
import LibMoney from "~/app/_components/lib-money";
import { LeagueTable } from "~/app/_components/league-table";

type Leaderboard = {
  entrants: LeaderboardEntrant[];
  thru: number;
};

type LeaderboardEntrant = {
  name: string;
  entrantId: number;
  score: number;
  wildcard: boolean;
  teamScore: number;
  position: number;
  tied: boolean;
  NR: boolean;
  teamId: string;
  notableHoles: NotableHole[];
};
const disasterHoleStrings = [
  "Trainwreck",
  "Meltdown",
  "Debacle",
  "Blowup",
  "Total Collapse",
  "Scorecard Ruining",
  "Farcical",
  "Car Crash",
  "Dumpster Fire",
  "Nightmare",
  "Horrorshow",
  "Card Wrecker",
  "Disasterpiece",
  "Basket Case",
  "Clown Car",
  "Catastrophic",
  "Comedy of Errors",
  "Spectacular",
  "Craptacular",
  "Steaming Pile of",
  "Embarrassing",
  "Humiliating",
  "Comedy",
  "Eyebrow-raising",
  "Eye-watering",
  "Woeful",
  "Unfortunate",
  "Comical",
  "Highly amusing",
  "Laughable",
  "Implausible",
  "Disastrous",
  "Lesser-spotted",
  "Career-ending",
  "Rubbish",
  "Shameful",
  "Barely imaginable",
] as const;
type DisasterHole = (typeof disasterHoleStrings)[number];

type NotableHole = {
  holeNo: number;
  strokes?: number;
  veryNotable: boolean;
  score:
    | "Hole in One"
    | "Albatross"
    | "Eagle"
    | "Net Eagle"
    | "Birdie"
    | "Net Birdie"
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
        teamId: entrant.entrant.teamId,
        wildcard: entrant.wildcard,
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
        teamScore: entrant.wildcard
          ? entrant.scorecard
            ? entrant.scorecard.holes
                .filter((hole) => hole.holeNo <= thru)
                .reduce(
                  (acc, cur) =>
                    comp.stableford
                      ? acc + (2 - cur.points)
                      : acc + ((cur.net ?? 100) - cur.par),
                  0,
                ) - 3
            : 0
          : entrant.scorecard
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
                    return `${this.score}${this.veryNotable && this.strokes && this.strokes > 4 ? " " + this.strokes : ""} on ${this.holeNo}`;
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
                                        : disasterHoleStrings[
                                            Math.floor(
                                              Math.random() *
                                                disasterHoleStrings.length,
                                            )
                                          ] ?? "Nightmare",
                  veryNotable: !!(
                    !hole.NR &&
                    hole.strokes &&
                    (hole.par - hole.strokes > 0 ||
                      hole.par - hole.strokes <= -5)
                  ),
                  strokes: hole.strokes ? hole.strokes : undefined,
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
  searchParams,
}: {
  params: { eventId: string };
  searchParams: {
    stats?: string;
    standings?: string;
    prizes?: string;
    front1?: string;
    front2?: string;
    back1?: string;
    back2?: string;
    back3?: string;
  };
}) {
  //Load queryParam Options
  const showStats = !(searchParams.stats === "false");
  const showStandings = !(searchParams.standings === "false");
  const showPrizes = !(searchParams.prizes === "false");

  const front9First = Number(searchParams.front1 ?? 3);
  const front9Second = Number(searchParams.front2 ?? 6);
  const back9First = Number(searchParams.back1 ?? 12);
  const back9Second = Number(searchParams.back2 ?? 15);
  const back9Third = Number(searchParams.back3 ?? 0);

  const comp = await api.comp.getOneWithScores({
    comp: params.eventId,
  });

  if (!comp || !comp.completed)
    return (
      <LibMainFixed>
        <LibH1>Event Not Completed Yet!</LibH1>
      </LibMainFixed>
    );
  const front9FirstLeaderboard = leaderboardThruXHoles(comp, front9First);
  const front9SecondLeaderboard = leaderboardThruXHoles(comp, front9Second);
  const thru9 = leaderboardThruXHoles(comp, 9);
  const back9FirstLeaderboard = leaderboardThruXHoles(comp, back9First);
  const back9SecondLeaderboard = leaderboardThruXHoles(comp, back9Second);
  const back9ThirdOptionalLeaderboard = back9Third
    ? leaderboardThruXHoles(comp, back9Third)
    : null;
  const thru18 = leaderboardThruXHoles(comp, 18);

  return (
    <LibMainFixed>
      <LibH1>{comp.name} Timeline</LibH1>
      <LibCardContainer>
        <LibCardNarrow title="Event Timeline">
          <h3>Front 9</h3>
          <p>
            After {front9First} hole{front9First > 1 ? "s" : ""}...
          </p>
          <LeaderboardSnapshot
            thru={front9First}
            holeCount={front9First}
            data={front9FirstLeaderboard}
            places={20}
            stableford={comp.stableford}
          />
          <TeamLeaderboardSnapshot
            thru={front9First}
            data={front9FirstLeaderboard}
          />
          <p>After {front9Second} holes...</p>
          <LeaderboardSnapshot
            thru={front9Second}
            holeCount={front9Second - front9First}
            data={front9SecondLeaderboard}
            prevData={front9FirstLeaderboard}
            stableford={comp.stableford}
          />
          <TeamLeaderboardSnapshot
            thru={front9Second}
            data={front9SecondLeaderboard}
          />
          <p>At the turn...</p>
          <LeaderboardSnapshot
            thru={9}
            holeCount={9 - front9Second}
            data={thru9}
            prevData={front9SecondLeaderboard}
            stableford={comp.stableford}
          />
          <TeamLeaderboardSnapshot thru={9} data={thru9} />
          <h3>Back 9</h3>
          <p>After {back9First} holes...</p>
          <LeaderboardSnapshot
            thru={back9First}
            holeCount={back9First - 9}
            data={back9FirstLeaderboard}
            prevData={thru9}
            stableford={comp.stableford}
          />
          <TeamLeaderboardSnapshot
            thru={back9First}
            data={back9FirstLeaderboard}
          />
          <p>After {back9Second} holes...</p>
          <LeaderboardSnapshot
            thru={back9Second}
            holeCount={back9Second - back9First}
            data={back9SecondLeaderboard}
            prevData={back9FirstLeaderboard}
            places={15}
            stableford={comp.stableford}
          />
          <TeamLeaderboardSnapshot
            thru={back9Second}
            data={back9SecondLeaderboard}
          />
          {back9ThirdOptionalLeaderboard && <p>After {back9Third} holes...</p>}
          {back9ThirdOptionalLeaderboard && (
            <LeaderboardSnapshot
              thru={back9Third}
              holeCount={back9Third - back9Second}
              data={back9ThirdOptionalLeaderboard}
              prevData={back9SecondLeaderboard}
              places={15}
              stableford={comp.stableford}
            />
          )}
          {back9ThirdOptionalLeaderboard && (
            <TeamLeaderboardSnapshot
              thru={back9Third}
              data={back9ThirdOptionalLeaderboard}
            />
          )}
          <p>After 18 holes...</p>
          <LeaderboardSnapshot
            thru={18}
            holeCount={18 - (back9Third || back9Second)}
            data={thru18}
            prevData={back9ThirdOptionalLeaderboard ?? back9SecondLeaderboard}
            places={40}
            stableford={comp.stableford}
          />
        </LibCardNarrow>
        <TeamResultsForComp compId={comp.igCompId} />
        {showPrizes && <EventPrizes igCompId={comp.igCompId} />}
        {showStandings && (
          <LeagueTable
            uptoComp={comp.igCompId}
            subHeading={`After ${comp.name}`}
          />
        )}
        {showStats && <CompStats comp={comp} />}
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
          .filter(
            (entrant) =>
              entrant.position <= places ||
              entrant.notableHoles.some(
                (hole) =>
                  hole.holeNo <= thru &&
                  hole.holeNo >= thru - holeCount + 1 &&
                  hole.veryNotable,
              ),
          )
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
                    .filter((hole) =>
                      entrant.position > places
                        ? hole.holeNo > thru - holeCount &&
                          hole.holeNo <= thru &&
                          hole.veryNotable
                        : hole.holeNo > thru - holeCount && hole.holeNo <= thru,
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

type TeamLeaderboardSnapshotProps = {
  thru: number;
  showScores?: boolean;
  data: Leaderboard;
  prevData?: Leaderboard;
};

function TeamLeaderboardSnapshot({ thru, data }: TeamLeaderboardSnapshotProps) {
  const teamScores = getTeamScores(thru, data);

  return (
    <div>
      <p>
        Team standings after {thru} hole{thru > 1 ? "s" : ""}
      </p>
      <Table className="mb-4">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamScores.map((score) => {
            return (
              <TableRow key={score.teamId}>
                <TableCell className="text-center">
                  {score.tied ? "T" : ""}
                  {score.position}
                </TableCell>
                <TableCell>{score.teamName}</TableCell>
                <TableCell className="text-center">
                  {score.score === 0
                    ? "E"
                    : `${score.score < 1700 && score.score > 0 ? "+" : ""}${score.score < 1700 ? score.score : ""}`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const TeamSchema = z.enum(["BB", "BD", "BS", "EU", "RF", "SH", "SW", "2B"]);
type Teams = z.infer<typeof TeamSchema>;

const TeamScoreSchema = z.object({
  teamId: TeamSchema,
  teamName: z.string(),
  position: z.number(),
  tied: z.boolean(),
  positionChange: z.number(),
  score: z.number(),
  score1: z.number(),
  score2: z.number(),
  scoreCount: z.number(),
});

type TeamScore = z.infer<typeof TeamScoreSchema>;

function getTeamScores(thru: number, data: Leaderboard) {
  const allowTies = thru < 18;

  const scores = new Map<Teams, TeamScore>([
    [
      "BB",
      {
        teamId: "BB",
        teamName: "Bogey Boys",
        position: 0,
        tied: false,
        positionChange: 0,
        score: 3600,
        score1: 1800,
        score2: 1800,
        scoreCount: 0,
      },
    ],
    [
      "BD",
      {
        teamId: "BD",
        teamName: "Balls Deep",
        position: 0,
        tied: false,
        positionChange: 0,
        score: 3600,
        score1: 1800,
        score2: 1800,
        scoreCount: 0,
      },
    ],
    [
      "BS",
      {
        teamId: "BS",
        teamName: "Big Sticks",
        position: 0,
        tied: false,
        positionChange: 0,
        score: 3600,
        score1: 1800,
        score2: 1800,
        scoreCount: 0,
      },
    ],
    [
      "EU",
      {
        teamId: "EU",
        teamName: "Eurekas",
        position: 0,
        tied: false,
        positionChange: 0,
        score: 3600,
        score1: 1800,
        score2: 1800,
        scoreCount: 0,
      },
    ],
    [
      "RF",
      {
        teamId: "RF",
        teamName: "Regular Flex",
        position: 0,
        tied: false,
        positionChange: 0,
        score: 3600,
        score1: 1800,
        score2: 1800,
        scoreCount: 0,
      },
    ],
    [
      "SH",
      {
        teamId: "SH",
        teamName: "Shanks and Big Hook",
        position: 0,
        tied: false,
        positionChange: 0,
        score: 3600,
        score1: 1800,
        score2: 1800,
        scoreCount: 0,
      },
    ],
    [
      "SW",
      {
        teamId: "SW",
        teamName: "Swingers",
        position: 0,
        tied: false,
        positionChange: 0,
        score: 3600,
        score1: 1800,
        score2: 1800,
        scoreCount: 0,
      },
    ],
    [
      "2B",
      {
        teamId: "2B",
        teamName: "Two Ballers",
        position: 3600,
        tied: false,
        positionChange: 0,
        score: 0,
        score1: 1800,
        score2: 1800,
        scoreCount: 0,
      },
    ],
  ]);

  data.entrants.forEach((ent) => {
    const teamId = TeamSchema.safeParse(ent.teamId);
    if (!teamId.success) return;

    const score = scores.get(teamId.data);
    if (score) {
      if (ent.teamScore < score.score1) {
        //best score
        score.score2 = score.score1;
        score.score1 = ent.teamScore;
      } else if (ent.teamScore < score.score2) {
        //second best score
        score.score2 = ent.teamScore;
      }
      //update score
      score.score = score.score1 + score.score2;
      score.scoreCount++;
      scores.set(teamId.data, score);
    }
  });
  const sorted = [...scores.entries()].sort((a, b) => {
    return a[1].score - b[1].score;
  });

  let previousScore = -500;
  let previousPosition = 1;
  sorted.forEach((sc, index, allScores) => {
    sc[1].tied =
      allowTies &&
      allScores.filter((s) => s[1].score === sc[1].score).length > 1;
    sc[1].position =
      allowTies && sc[1].tied && sc[1].score === previousScore
        ? previousPosition
        : index + 1;
    previousScore = sc[1].score;
    previousPosition = sc[1].position;
  });

  return sorted.map((teamscore) => teamscore[1]);
}

type EventPrizesProps = {
  igCompId: string;
};

async function EventPrizes({ igCompId }: EventPrizesProps) {
  const prizes = await api.comp.getOneWithPrizes({ comp: igCompId });
  if (!prizes) return null;

  return (
    <LibCardNarrow title="Event Prizes" subHeading={`For ${prizes.name}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prizewinner</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead className="text-right">£</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prizes.transactions.map((trans) => {
            return (
              <TableRow key={trans.id}>
                <TableCell>{trans.entrant.name}</TableCell>
                <TableCell>{trans.description}</TableCell>
                <TableCell className="text-right">
                  <LibMoney amountInPence={trans.amount} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}

type IndividualScoringStat = {
  player: string;
  score: number;
};

type HoleAveStat = {
  holeNo: number;
  ave: number;
  toPar: number;
};

type HoleScore = {
  strokes: number | null;
  blob: boolean;
  par: number;
};

type CompStats = {
  bestGross: IndividualScoringStat[];
  bestFront9: IndividualScoringStat[];
  bestBack9: IndividualScoringStat[];
  mostBirdies: IndividualScoringStat[];
  par3s: IndividualScoringStat[];
  par5s: IndividualScoringStat[];
  mostImprovedBack9: IndividualScoringStat[];
  biggestBack9Collapse: IndividualScoringStat[];
  easiestHole: HoleAveStat[];
  hardestHole: HoleAveStat[];
  mostBlobbedHole: IndividualScoringStat[];
};

const lowestWins = (
  stat: IndividualScoringStat,
  current: IndividualScoringStat[],
): IndividualScoringStat[] => {
  if (current[0] === undefined || stat.score === current[0].score) {
    return [...current, stat];
  }
  if (stat.score < current[0].score) {
    return [stat];
  }
  return current;
};

const highestWins = (
  stat: IndividualScoringStat,
  current: IndividualScoringStat[],
): IndividualScoringStat[] => {
  if (current[0] === undefined || stat.score === current[0].score) {
    return [...current, stat];
  }
  if (stat.score > current[0].score) {
    return [stat];
  }
  return current;
};

const lowestAveWins = (
  stat: HoleAveStat,
  current: HoleAveStat[],
): HoleAveStat[] => {
  if (current[0] === undefined || stat.toPar === current[0].toPar)
    return [...current, stat];
  if (stat.toPar < current[0].toPar) return [stat];
  return current;
};

const highestAveWins = (
  stat: HoleAveStat,
  current: HoleAveStat[],
): HoleAveStat[] => {
  if (current[0] === undefined || stat.toPar === current[0].toPar)
    return [...current, stat];
  if (stat.toPar > current[0].toPar) return [stat];
  return current;
};

type CompStatsProps = {
  comp: Awaited<ReturnType<typeof api.comp.getOneWithScores>>;
};

function CompStats({ comp }: CompStatsProps) {
  const stats: CompStats = {
    bestGross: [],
    bestFront9: [],
    bestBack9: [],
    mostBirdies: [],
    par3s: [],
    par5s: [],
    mostImprovedBack9: [],
    biggestBack9Collapse: [],
    easiestHole: [],
    hardestHole: [],
    mostBlobbedHole: [],
  };
  const holeScores = new Map<number, HoleScore[]>([
    [1, []],
    [2, []],
    [3, []],
    [4, []],
    [5, []],
    [6, []],
    [7, []],
    [8, []],
    [9, []],
    [10, []],
    [11, []],
    [12, []],
    [13, []],
    [14, []],
    [15, []],
    [16, []],
    [17, []],
    [18, []],
  ]);

  comp?.entrants.forEach((ent) => {
    //check best gross
    if (!ent.scorecard?.NR && !ent.scorecard?.holes.some((hole) => hole.NR)) {
      stats.bestGross = lowestWins(
        { player: ent.entrant.name, score: ent.scorecard?.strokes ?? 1800 },
        stats.bestGross,
      );
    }
    //check best front 9
    comp.stableford
      ? (stats.bestFront9 = highestWins(
          {
            player: ent.entrant.name,
            score:
              ent.scorecard?.holes
                .filter((hole) => hole.holeNo < 10)
                .reduce((acc, cur) => acc + cur.points, 0) ?? 0,
          },
          stats.bestFront9,
        ))
      : (stats.bestFront9 = lowestWins(
          {
            player: ent.entrant.name,
            score:
              ent.scorecard?.holes
                .filter((hole) => hole.holeNo < 10)
                .reduce((acc, cur) => acc + (cur.net ?? 100), 0) ?? 900,
          },
          stats.bestFront9,
        ));

    //check best back 9
    comp.stableford
      ? (stats.bestBack9 = highestWins(
          {
            player: ent.entrant.name,
            score:
              ent.scorecard?.holes
                .filter((hole) => hole.holeNo > 9)
                .reduce((acc, cur) => acc + cur.points, 0) ?? 0,
          },
          stats.bestBack9,
        ))
      : (stats.bestBack9 = lowestWins(
          {
            player: ent.entrant.name,
            score:
              ent.scorecard?.holes
                .filter((hole) => hole.holeNo > 9)
                .reduce((acc, cur) => acc + (cur.net ?? 100), 0) ?? 900,
          },
          stats.bestBack9,
        ));
    //check best score on par 3's
    stats.par3s = lowestWins(
      {
        player: ent.entrant.name,
        score:
          ent.scorecard?.holes
            .filter((hole) => hole.par === 3)
            .reduce((acc, cur) => acc + (cur.strokes ?? 100), 0) ?? 400,
      },
      stats.par3s,
    );
    //check best score on par 5's
    stats.par5s = lowestWins(
      {
        player: ent.entrant.name,
        score:
          ent.scorecard?.holes
            .filter((hole) => hole.par === 5)
            .reduce((acc, cur) => acc + (cur.strokes ?? 100), 0) ?? 400,
      },
      stats.par5s,
    );
    //Check most birdies or better
    stats.mostBirdies = highestWins(
      {
        player: ent.entrant.name,
        score:
          ent.scorecard?.holes.filter(
            (hole) => (hole.strokes ?? hole.par) < hole.par,
          ).length ?? 0,
      },
      stats.mostBirdies,
    );

    //Difference between Front 9 and Back 9
    const frontToBack = comp.stableford
      ? (ent.scorecard?.holes
          .filter((hole) => hole.holeNo > 9)
          .reduce((acc, cur) => acc + cur.points, 0) ?? 0) -
        (ent.scorecard?.holes
          .filter((hole) => hole.holeNo < 10)
          .reduce((acc, cur) => acc + cur.points, 0) ?? 0)
      : ent.scorecard?.NR
        ? 0
        : (ent.scorecard?.holes
            .filter((hole) => hole.holeNo < 10)
            .reduce((acc, cur) => acc + (cur.net ?? 100), 0) ?? 0) -
          (ent.scorecard?.holes
            .filter((hole) => hole.holeNo > 9)
            .reduce((acc, cur) => acc + (cur.net ?? 100), 0) ?? 0);

    stats.mostImprovedBack9 = highestWins(
      { player: ent.entrant.name, score: frontToBack },
      stats.mostImprovedBack9,
    );
    stats.biggestBack9Collapse = lowestWins(
      { player: ent.entrant.name, score: frontToBack },
      stats.biggestBack9Collapse,
    );

    //Easiest/Hardest Hole
    ent.scorecard?.holes.forEach((hole) => {
      const h = holeScores.get(hole.holeNo);
      h?.push({
        strokes: hole.strokes,
        blob: hole.NR || (comp.stableford && hole.points === 0),
        par: hole.par,
      });
    });

    //Full team playing

    //Wildcard wasters
  });
  //Summarise the holes
  for (let i = 1; i <= 18; i++) {
    const allScores = holeScores.get(i) ?? [];
    const theScores = allScores.filter((sc) => sc.strokes) ?? [];
    const scoreAve =
      theScores?.reduce((acc, cur) => acc + (cur.strokes ?? 100), 0) /
      theScores?.length;

    const hole: HoleAveStat = {
      holeNo: i,
      ave: scoreAve,
      toPar: scoreAve - (theScores[0]?.par ?? 4),
    };
    stats.easiestHole = lowestAveWins(hole, stats.easiestHole);
    stats.hardestHole = highestAveWins(hole, stats.hardestHole);

    const blobs = allScores.filter((sc) => sc.blob) ?? [];
    if (blobs.length > 0) {
      const blobStat: IndividualScoringStat = {
        player: i.toString(),
        score: blobs.length,
      };
      stats.mostBlobbedHole = highestWins(blobStat, stats.mostBlobbedHole);
    }
  }

  return (
    <LibCardNarrow title="Competition stats">
      <p>
        {`Best Front 9: ${stats.bestFront9.map((score) => score.player).join(", ")} with ${stats.bestFront9[0]?.score} ${comp?.stableford ? "points" : "strokes"}`}
      </p>
      <p>
        {`Best Back 9: ${stats.bestBack9.map((score) => score.player).join(", ")} with ${stats.bestBack9[0]?.score} ${comp?.stableford ? "points" : "strokes"}`}
      </p>
      <p>
        {`Best Gross: ${stats.bestGross.map((score) => score.player).join(", ")} with ${stats.bestGross[0]?.score} strokes`}
      </p>
      <p>
        {`Best on Par 3's: ${stats.par3s.map((score) => score.player).join(", ")} with ${stats.par3s[0]?.score} strokes (${(stats.par3s[0]?.score ?? 0) > 12 ? "+" : ""}${stats.par3s[0]?.score === 12 ? "E" : (stats.par3s[0]?.score ?? 0) - 12})`}
      </p>
      <p>
        {`Best on Par 5's: ${stats.par5s.map((score) => score.player).join(", ")} with ${stats.par5s[0]?.score} strokes (${(stats.par5s[0]?.score ?? 0) > 20 ? "+" : ""}${stats.par5s[0]?.score === 20 ? "E" : (stats.par5s[0]?.score ?? 0) - 20})`}
      </p>
      <p>
        {`Most birdies or better: ${stats.mostBirdies.map((score) => score.player).join(", ")} with ${stats.mostBirdies[0]?.score ?? 0}`}
      </p>
      <p>
        {`Biggest Back 9 improvement: ${stats.mostImprovedBack9.map((score) => score.player).join(", ")} who ${stats.mostImprovedBack9.length === 1 ? "was" : "were"} ${Math.abs(stats.mostImprovedBack9[0]?.score ?? 0)} ${comp?.stableford ? "points" : "shots"} better on the back `}
      </p>
      <p>
        {`Biggest Back 9 collapse: ${stats.biggestBack9Collapse.map((score) => score.player).join(", ")} who ${stats.biggestBack9Collapse.length === 1 ? "was" : "were"} ${Math.abs(stats.biggestBack9Collapse[0]?.score ?? 0)} ${comp?.stableford ? "points" : "shots"} worse on the back`}
      </p>
      <p>{`Easiest Hole${stats.easiestHole.length > 1 ? "s" : ""}: Hole${stats.hardestHole.length > 1 ? "s" : ""} ${stats.easiestHole.map((h) => h.holeNo).join(", ")} with an average of ${Math.round((stats.easiestHole[0]?.ave ?? 0) * 100) / 100} strokes (+${Math.round((stats.easiestHole[0]?.toPar ?? 0) * 100) / 100})`}</p>
      <p>{`Hardest Hole${stats.hardestHole.length > 1 ? "s" : ""}: Hole${stats.hardestHole.length > 1 ? "s" : ""} ${stats.hardestHole.map((h) => h.holeNo).join(", ")} with an average of ${Math.round((stats.hardestHole[0]?.ave ?? 0) * 100) / 100} strokes (+${Math.round((stats.hardestHole[0]?.toPar ?? 0) * 100) / 100})`}</p>
      {stats.mostBlobbedHole.length > 0 && stats.mostBlobbedHole.length < 3 ? (
        <p>
          Most Blobbed Hole{stats.mostBlobbedHole.length > 1 ? "s" : ""}:
          {" Hole "}
          {stats.mostBlobbedHole.length > 1 ? "s" : ""}
          {stats.mostBlobbedHole.map((sc) => sc.player).join(", ")} with{" "}
          {stats.mostBlobbedHole[0]?.score} blob
          {(stats.mostBlobbedHole[0]?.score ?? 0) > 1 ? "s" : ""}
        </p>
      ) : null}
    </LibCardNarrow>
  );
}
