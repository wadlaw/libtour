import { db } from "~/server/db";

const entrantSelect = {
  id: true,
  name: true,
  systemName: true,
  captain: true,
  team: {
    select: {
      id: true,
      teamName: true,
      linkName: true,
    },
  },
} as const;

type EntrantRow = {
  id: number;
  name: string;
  systemName: string;
  captain: boolean;
  team: {
    id: string;
    teamName: string;
    linkName: string;
  };
};

type CompRow = {
  igCompId: string;
  shortName: string;
  name: string;
  date: Date;
  stableford: boolean;
  round: string;
  open: boolean;
  current: boolean;
  completed: boolean;
  resultsPage: string;
  podcast: string;
};

type EntryRow = {
  position: number | null;
  igPosition: number | null;
  score: number | null;
  teamScore: number | null;
  noResult: boolean;
  wildcard: boolean;
  entrant: EntrantRow;
  transactions?: { netAmount: number }[];
  scorecard?: {
    handicap: number;
    stableford: boolean;
    NR: boolean;
    strokes: number | null;
    strokesCountback: bigint | null;
    points: number;
    pointsCountback: bigint;
    net: number | null;
    netCountback: bigint | null;
    holes: {
      holeNo: number;
      par: number;
      strokeIndex: number;
      strokes: number | null;
      NR: boolean;
      points: number;
      net: number | null;
      description: string | null;
    }[];
  } | null;
};

export type PublicEntrant = {
  id: number;
  name: string;
  systemName: string;
  captain: boolean;
  team: {
    id: string;
    name: string;
    linkName: string;
  };
};

export type PublicEntrantResult = {
  eventId: string;
  shortName: string;
  name: string;
  date: string;
  format: "stableford" | "medal";
  completed: boolean;
  position: number | null;
  score: number | null;
  teamScore: number | null;
  noResult: boolean;
  wildcard: boolean;
  prizePence: number;
  scorecard: PublicScorecard | null;
};

export type PublicEntrantInfo = PublicEntrant & {
  totalPrizePence: number;
  results: PublicEntrantResult[];
};

export type PublicEvent = {
  id: string;
  shortName: string;
  name: string;
  date: string;
  format: "stableford" | "medal";
  round: string;
  open: boolean;
  current: boolean;
  completed: boolean;
  entrantCount: number;
};

export type PublicEntry = {
  position: number | null;
  igPosition: number | null;
  score: number | null;
  teamScore: number | null;
  noResult: boolean;
  wildcard: boolean;
  entrant: PublicEntrant;
  prizePence?: number;
  scorecard?: PublicScorecard | null;
};

export type PublicScorecard = {
  handicap: number;
  stableford: boolean;
  nr: boolean;
  strokes: number | null;
  strokesCountback: string | null;
  points: number;
  pointsCountback: string;
  net: number | null;
  netCountback: string | null;
  holes: {
    holeNo: number;
    par: number;
    strokeIndex: number;
    strokes: number | null;
    nr: boolean;
    points: number;
    net: number | null;
    description: string | null;
  }[];
};

export type PublicEventInfo = PublicEvent & {
  resultsPage: string;
  podcast: string;
  entrants: PublicEntry[];
};

export type PublicTeamPoints = {
  team: {
    id: string;
    name: string;
    linkName: string;
  };
  points: number;
};

export type PublicEventResults = PublicEventInfo & {
  teamPoints: PublicTeamPoints[];
};

export type PublicTeam = {
  id: string;
  name: string;
  linkName: string;
  points: number;
  members: {
    id: number;
    name: string;
    captain: boolean;
  }[];
};

export type PublicTeamInfo = PublicTeam & {
  pointsByEvent: {
    eventId: string;
    shortName: string;
    name: string;
    date: string;
    points: number;
    runningTotal: number;
  }[];
};

function eventWhere(eventId: string) {
  return {
    lib: true,
    OR: [{ igCompId: eventId }, { shortName: eventId.toLowerCase() }],
  };
}

function teamWhere(teamId: string) {
  return {
    OR: [{ id: teamId.toUpperCase() }, { linkName: teamId.toLowerCase() }],
  };
}

function entrantWhere(entrantId: string) {
  const id = Number(entrantId);
  const numericId = Number.isInteger(id) && id > 0 ? id : undefined;
  return {
    OR: [
      ...(numericId === undefined ? [] : [{ id: numericId }]),
      { systemName: entrantId },
      { name: entrantId },
    ],
  };
}

function mapEntrant(entrant: EntrantRow): PublicEntrant {
  return {
    id: entrant.id,
    name: entrant.name,
    systemName: entrant.systemName,
    captain: entrant.captain,
    team: {
      id: entrant.team.id,
      name: entrant.team.teamName,
      linkName: entrant.team.linkName,
    },
  };
}

function mapEvent(comp: CompRow, entrantCount: number): PublicEvent {
  return {
    id: comp.igCompId,
    shortName: comp.shortName,
    name: comp.name,
    date: comp.date.toISOString(),
    format: comp.stableford ? "stableford" : "medal",
    round: comp.round,
    open: comp.open,
    current: comp.current,
    completed: comp.completed,
    entrantCount,
  };
}

function mapScorecard(
  scorecard: NonNullable<EntryRow["scorecard"]>,
): PublicScorecard {
  return {
    handicap: scorecard.handicap,
    stableford: scorecard.stableford,
    nr: scorecard.NR,
    strokes: scorecard.strokes,
    strokesCountback:
      scorecard.strokesCountback === null
        ? null
        : scorecard.strokesCountback.toString(),
    points: scorecard.points,
    pointsCountback: scorecard.pointsCountback.toString(),
    net: scorecard.net,
    netCountback:
      scorecard.netCountback === null
        ? null
        : scorecard.netCountback.toString(),
    holes: scorecard.holes.map((hole) => ({
      holeNo: hole.holeNo,
      par: hole.par,
      strokeIndex: hole.strokeIndex,
      strokes: hole.strokes,
      nr: hole.NR,
      points: hole.points,
      net: hole.net,
      description: hole.description,
    })),
  };
}

function mapEntry(entry: EntryRow, withScorecard: boolean): PublicEntry {
  const mapped: PublicEntry = {
    position: entry.position,
    igPosition: entry.igPosition,
    score: entry.score,
    teamScore: entry.teamScore,
    noResult: entry.noResult,
    wildcard: entry.wildcard,
    entrant: mapEntrant(entry.entrant),
  };

  if (entry.transactions) {
    mapped.prizePence = entry.transactions.reduce(
      (total, transaction) => total + transaction.netAmount,
      0,
    );
  }

  if (withScorecard) {
    mapped.scorecard = entry.scorecard ? mapScorecard(entry.scorecard) : null;
  }

  return mapped;
}

function mapTeam(team: {
  id: string;
  teamName: string;
  linkName: string;
}): PublicTeamPoints["team"] {
  return {
    id: team.id,
    name: team.teamName,
    linkName: team.linkName,
  };
}

export async function loadEvents(): Promise<{ events: PublicEvent[] }> {
  const comps = await db.comp.findMany({
    where: { lib: true },
    orderBy: { date: "asc" },
    include: { _count: { select: { entrants: true } } },
  });

  return {
    events: comps.map((comp) => mapEvent(comp, comp._count.entrants)),
  };
}

export async function listEventRefs() {
  return db.comp.findMany({
    where: { lib: true },
    orderBy: { date: "asc" },
    select: { shortName: true, name: true },
  });
}

export async function loadEntrants(): Promise<{ entrants: PublicEntrant[] }> {
  const entrants = await db.entrant.findMany({
    orderBy: [{ team: { teamName: "asc" } }, { name: "asc" }],
    select: entrantSelect,
  });

  return { entrants: entrants.map(mapEntrant) };
}

export async function listEntrantRefs() {
  return db.entrant.findMany({
    orderBy: [{ team: { teamName: "asc" } }, { name: "asc" }],
    select: { id: true, name: true },
  });
}

export async function loadEntrant(
  entrantId: string,
): Promise<PublicEntrantInfo | null> {
  const entrant = await db.entrant.findFirst({
    where: entrantWhere(entrantId),
    select: {
      ...entrantSelect,
      comps: {
        where: { comp: { lib: true } },
        orderBy: { comp: { date: "desc" } },
        include: {
          comp: true,
          transactions: {
            where: { winnings: true },
            select: { netAmount: true },
          },
          scorecard: {
            include: {
              holes: { orderBy: { holeNo: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!entrant) return null;

  const results = entrant.comps.map((entry) => ({
    eventId: entry.comp.igCompId,
    shortName: entry.comp.shortName,
    name: entry.comp.name,
    date: entry.comp.date.toISOString(),
    format: entry.comp.stableford
      ? ("stableford" as const)
      : ("medal" as const),
    completed: entry.comp.completed,
    position: entry.position,
    score: entry.score,
    teamScore: entry.teamScore,
    noResult: entry.noResult,
    wildcard: entry.wildcard,
    prizePence: entry.transactions.reduce(
      (total, transaction) => total + transaction.netAmount,
      0,
    ),
    scorecard: entry.scorecard ? mapScorecard(entry.scorecard) : null,
  }));

  return {
    ...mapEntrant(entrant),
    totalPrizePence: results.reduce(
      (total, result) => total + result.prizePence,
      0,
    ),
    results,
  };
}

export async function loadEvent(
  eventId: string,
): Promise<PublicEventInfo | null> {
  const comp = await db.comp.findFirst({
    where: eventWhere(eventId),
    include: {
      entrants: {
        orderBy: [{ position: "asc" }, { entrant: { name: "asc" } }],
        include: { entrant: { select: entrantSelect } },
      },
      _count: { select: { entrants: true } },
    },
  });

  if (!comp) return null;

  return {
    ...mapEvent(comp, comp._count.entrants),
    resultsPage: comp.resultsPage,
    podcast: comp.podcast,
    entrants: comp.entrants.map((entry) => mapEntry(entry, false)),
  };
}

export async function loadUpcomingEvents(): Promise<{
  events: PublicEventInfo[];
}> {
  const comps = await db.comp.findMany({
    where: { lib: true, completed: false },
    orderBy: { date: "asc" },
    include: {
      entrants: {
        orderBy: [
          { entrant: { team: { teamName: "asc" } } },
          { entrant: { name: "asc" } },
        ],
        include: { entrant: { select: entrantSelect } },
      },
      _count: { select: { entrants: true } },
    },
  });

  return {
    events: comps.map((comp) => ({
      ...mapEvent(comp, comp._count.entrants),
      resultsPage: comp.resultsPage,
      podcast: comp.podcast,
      entrants: comp.entrants.map((entry) => mapEntry(entry, false)),
    })),
  };
}

const resultsInclude = {
  entrants: {
    orderBy: { position: "asc" as const },
    include: {
      entrant: { select: entrantSelect },
      transactions: {
        where: { winnings: true },
        select: { netAmount: true },
      },
    },
  },
  teamPoints: {
    orderBy: { points: "desc" as const },
    include: {
      team: { select: { id: true, teamName: true, linkName: true } },
    },
  },
  _count: { select: { entrants: true } },
};

function mapResults(
  comp: CompRow & {
    resultsPage: string;
    podcast: string;
    _count: { entrants: number };
    entrants: EntryRow[];
    teamPoints: {
      points: number;
      team: { id: string; teamName: string; linkName: string };
    }[];
  },
  withScorecard: boolean,
): PublicEventResults {
  return {
    ...mapEvent(comp, comp._count.entrants),
    resultsPage: comp.resultsPage,
    podcast: comp.podcast,
    entrants: comp.entrants.map((entry) => mapEntry(entry, withScorecard)),
    teamPoints: comp.teamPoints.map((row) => ({
      team: mapTeam(row.team),
      points: row.points,
    })),
  };
}

export async function loadResults(): Promise<{ events: PublicEventResults[] }> {
  const comps = await db.comp.findMany({
    where: { lib: true, completed: true },
    orderBy: { date: "asc" },
    include: resultsInclude,
  });

  return { events: comps.map((comp) => mapResults(comp, false)) };
}

export async function listCompletedEventRefs() {
  return db.comp.findMany({
    where: { lib: true, completed: true },
    orderBy: { date: "asc" },
    select: { shortName: true, name: true },
  });
}

export async function loadEventResults(
  eventId: string,
): Promise<PublicEventResults | null> {
  const comp = await db.comp.findFirst({
    where: eventWhere(eventId),
    include: {
      ...resultsInclude,
      entrants: {
        orderBy: { position: "asc" },
        include: {
          entrant: { select: entrantSelect },
          transactions: {
            where: { winnings: true },
            select: { netAmount: true },
          },
          scorecard: {
            include: {
              holes: { orderBy: { holeNo: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!comp) return null;
  return mapResults(comp, true);
}

export async function loadTeams(): Promise<{ teams: PublicTeam[] }> {
  const teams = await db.team.findMany({
    orderBy: { teamName: "asc" },
    include: {
      entrants: {
        orderBy: { name: "asc" },
        select: { id: true, name: true, captain: true },
      },
      teamPoints: { select: { points: true } },
    },
  });

  return {
    teams: teams.map((team) => ({
      id: team.id,
      name: team.teamName,
      linkName: team.linkName,
      points: team.teamPoints.reduce((total, row) => total + row.points, 0),
      members: team.entrants.map((entrant) => ({
        id: entrant.id,
        name: entrant.name,
        captain: entrant.captain,
      })),
    })),
  };
}

export async function listTeamRefs() {
  return db.team.findMany({
    orderBy: { teamName: "asc" },
    select: { linkName: true, teamName: true },
  });
}

export async function loadTeam(teamId: string): Promise<PublicTeamInfo | null> {
  const team = await db.team.findFirst({
    where: teamWhere(teamId),
    include: {
      entrants: {
        orderBy: { name: "asc" },
        select: { id: true, name: true, captain: true },
      },
      teamPoints: {
        orderBy: { comp: { date: "asc" } },
        include: {
          comp: {
            select: { igCompId: true, shortName: true, name: true, date: true },
          },
        },
      },
    },
  });

  if (!team) return null;

  let runningTotal = 0;
  const pointsByEvent = team.teamPoints.map((row) => {
    runningTotal += row.points;
    return {
      eventId: row.comp.igCompId,
      shortName: row.comp.shortName,
      name: row.comp.name,
      date: row.comp.date.toISOString(),
      points: row.points,
      runningTotal,
    };
  });

  return {
    id: team.id,
    name: team.teamName,
    linkName: team.linkName,
    points: runningTotal,
    members: team.entrants.map((entrant) => ({
      id: entrant.id,
      name: entrant.name,
      captain: entrant.captain,
    })),
    pointsByEvent,
  };
}
