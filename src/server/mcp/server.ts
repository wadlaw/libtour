import {
  McpServer,
  ResourceNotFoundError,
  ResourceTemplate,
  type Variables,
} from "@modelcontextprotocol/server";

import {
  listCompletedEventRefs,
  listEntrantRefs,
  listEventRefs,
  listTeamRefs,
  loadEntrant,
  loadEntrants,
  loadEvent,
  loadEventResults,
  loadEvents,
  loadResults,
  loadTeam,
  loadTeams,
  loadUpcomingEvents,
} from "~/server/mcp/resources";

const json = {
  mimeType: "application/json",
} as const;

function contents(uri: URL, value: unknown) {
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: json.mimeType,
        text: JSON.stringify(value),
      },
    ],
  };
}

function param(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function eventIdFrom(variables: Variables) {
  return param(variables.eventId);
}

function entrantIdFrom(variables: Variables) {
  return param(variables.entrantId);
}

function teamIdFrom(variables: Variables) {
  return param(variables.teamId);
}

export function createLibtourMcpServer() {
  const server = new McpServer({
    name: "libtour",
    version: "1.0.0",
  });

  server.registerResource(
    "events",
    "libtour://events",
    {
      title: "Events",
      description: "Every Libtour event, in date order.",
      ...json,
    },
    async (uri) => contents(uri, await loadEvents()),
  );

  server.registerResource(
    "entrants",
    "libtour://entrants",
    {
      title: "Entrants",
      description: "Every Libtour entrant and their team.",
      ...json,
    },
    async (uri) => contents(uri, await loadEntrants()),
  );

  server.registerResource(
    "entrant",
    new ResourceTemplate("libtour://entrant/{entrantId}", {
      list: async () => {
        const entrants = await listEntrantRefs();
        return {
          resources: entrants.map((entrant) => ({
            uri: `libtour://entrant/${entrant.id}`,
            name: entrant.name,
            mimeType: json.mimeType,
          })),
        };
      },
    }),
    {
      title: "Entrant Information",
      description:
        "One Libtour entrant by id, system name, or exact name, including their results.",
      ...json,
    },
    async (uri, variables) => {
      const entrant = await loadEntrant(entrantIdFrom(variables));
      if (!entrant) throw new ResourceNotFoundError(uri.href);
      return contents(uri, entrant);
    },
  );

  server.registerResource(
    "event",
    new ResourceTemplate("libtour://event/{eventId}", {
      list: async () => {
        const events = await listEventRefs();
        return {
          resources: events.map((event) => ({
            uri: `libtour://event/${encodeURIComponent(event.shortName)}`,
            name: event.name,
            mimeType: json.mimeType,
          })),
        };
      },
    }),
    {
      title: "Event Information",
      description:
        "One Libtour event by competition id or short name, including its entrants.",
      ...json,
    },
    async (uri, variables) => {
      const event = await loadEvent(eventIdFrom(variables));
      if (!event) throw new ResourceNotFoundError(uri.href);
      return contents(uri, event);
    },
  );

  server.registerResource(
    "upcoming-events",
    "libtour://upcoming-events",
    {
      title: "Upcoming Events",
      description:
        "Libtour events that have not been completed, soonest first.",
      ...json,
    },
    async (uri) => contents(uri, await loadUpcomingEvents()),
  );

  server.registerResource(
    "results",
    "libtour://results",
    {
      title: "Results",
      description:
        "Completed Libtour events with finishing order, scores, team points, and prize amounts.",
      ...json,
    },
    async (uri) => contents(uri, await loadResults()),
  );

  server.registerResource(
    "event-results",
    new ResourceTemplate("libtour://results/{eventId}", {
      list: async () => {
        const events = await listCompletedEventRefs();
        return {
          resources: events.map((event) => ({
            uri: `libtour://results/${encodeURIComponent(event.shortName)}`,
            name: `${event.name} results`,
            mimeType: json.mimeType,
          })),
        };
      },
    }),
    {
      title: "Event Results",
      description:
        "Full results for one Libtour event, including hole scores when a scorecard exists.",
      ...json,
    },
    async (uri, variables) => {
      const results = await loadEventResults(eventIdFrom(variables));
      if (!results) throw new ResourceNotFoundError(uri.href);
      return contents(uri, results);
    },
  );

  server.registerResource(
    "teams",
    "libtour://teams",
    {
      title: "Teams",
      description: "Every Libtour team, with total points and members.",
      ...json,
    },
    async (uri) => contents(uri, await loadTeams()),
  );

  server.registerResource(
    "team",
    new ResourceTemplate("libtour://team/{teamId}", {
      list: async () => {
        const teams = await listTeamRefs();
        return {
          resources: teams.map((team) => ({
            uri: `libtour://team/${encodeURIComponent(team.linkName)}`,
            name: team.teamName,
            mimeType: json.mimeType,
          })),
        };
      },
    }),
    {
      title: "Team Information",
      description:
        "One Libtour team by id or link name, including members and points per event.",
      ...json,
    },
    async (uri, variables) => {
      const team = await loadTeam(teamIdFrom(variables));
      if (!team) throw new ResourceNotFoundError(uri.href);
      return contents(uri, team);
    },
  );

  return server;
}
