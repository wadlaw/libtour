import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { LibCardNarrow, TeamDisplayCollapsible } from "./lib-elements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Fragment } from "react";

export const metadata = {
  title: "Libtour - Honours Boards",
  description: "Celebrating the winners (and losers) of the Libtour",
};

type Team = {
  year: number;
  teamName: string;
  teamId: string;
  linkName: string;
  entrants: Entrant[];
};

type Entrant = {
  name: string;
};

const winners: Team[] = [
  {
    year: 2023,
    teamName: "Swingers",
    teamId: "SW",
    linkName: "swingers",
    entrants: [
      { name: "Chris O'Donoghue (c)" },
      { name: "Abe Rutherford" },
      { name: "Anthony Elisak" },
      { name: "Duncan Jenner" },
      { name: "Lee Merryweather" },
      { name: "Linas Bumblys" },
      { name: "Sam Ryan" },
      { name: "Steve Dixon" },
    ],
  },
  {
    year: 2024,
    teamName: "Bogey Boys",
    teamId: "BB",
    linkName: "bogeyboys",
    entrants: [
      { name: "Kyle Deane (c)" },
      { name: "Anthony Money" },
      { name: "David Washer" },
      { name: "Paul Salvage" },
      { name: "Peter Greene" },
    ],
  },
];

const losers: Team[] = [
  {
    year: 2023,
    teamName: "Eurekas",
    teamId: "EU",
    linkName: "eurekas",
    entrants: [
      { name: "Terence Hare (c)" },
      { name: "Danny Morris" },
      { name: "David Hare" },
      { name: "Edward Money" },
      { name: "Ian Smith" },
      { name: "Peter Greene" },
      { name: "Tony Delaney" },
      { name: "Viv Fincher" },
    ],
  },
  {
    year: 2024,
    teamName: "Swingers",
    teamId: "SW",
    linkName: "swingers",
    entrants: [
      { name: "Chris O'Donoghue (c)" },
      { name: "Edward Money" },
      { name: "James Bartlett" },
      { name: "Kelvin Munroe" },
      { name: "Lokesh Patel" },
    ],
  },
];

export function Winners() {
  return <HonourBoard teams={winners} title="Winners" />;
}

export function Losers() {
  return <HonourBoard teams={losers} title="Losers" />;
}

type HonourBoardProps = {
  teams: Team[];
  title: string;
};

function HonourBoard({ teams, title }: HonourBoardProps) {
  return (
    <LibCardNarrow title={title}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Team</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <Collapsible key={team.year} asChild>
              <Fragment key={team.year}>
                <TableRow key={team.year}>
                  <CollapsibleTrigger asChild>
                    <TableCell className={"font-semibold hover:cursor-pointer"}>
                      {team.year}
                    </TableCell>
                  </CollapsibleTrigger>

                  <TableCell className={"font-semibold"}>
                    <TeamDisplayCollapsible
                      team={{
                        id: team.teamId,
                        teamName: team.teamName,
                        linkName: team.linkName,
                      }}
                    />
                  </TableCell>
                </TableRow>
                <CollapsibleContent asChild>
                  <Fragment key={team.year}>
                    {team.entrants.map((entrant) => (
                      <TableRow key={entrant.name} className="bg-slate-100">
                        <TableCell></TableCell>
                        <TableCell className="">{entrant.name}</TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                </CollapsibleContent>
              </Fragment>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}
