import { api } from "~/trpc/server";
import LibMoney from "./lib-money";
import { ensure } from "~/lib/utils";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EntrantDisplay, LibCardNarrow, TeamDisplay } from "./lib-elements";
import { Badge } from "~/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Fragment } from "react";
import { ScorecardDisplay } from "./scorecard";

type ResultsProps = {
  compId: string;
};

export default async function Results({ compId }: ResultsProps) {
  const compResults = await api.comp.getResults({ comp: compId });
  const teams = await api.team.getAll();

  if (!compResults) return <p>No results</p>;
  const lowGross = { score: 500, entrantId: [0] };

  //Check for lowest Gross score
  compResults.forEach((golfer) => {
    if (
      golfer.scorecard &&
      golfer.scorecard?.holes.filter((hole) => hole.NR === true).length === 0
    ) {
      const gross = golfer.scorecard.holes.reduce(
        (acc, cur) => acc + (cur.strokes ?? 100),
        0,
      );
      if (lowGross.entrantId.includes(0) || lowGross.score > gross) {
        lowGross.score = gross;
        lowGross.entrantId.length = 0;
        lowGross.entrantId.push(golfer.entrantId);
      } else if (lowGross.score === gross) {
        lowGross.entrantId.push(golfer.entrantId);
      }
    }
  });
  return (
    <LibCardNarrow title={"Results"}>
      <Table>
        {lowGross.score < 500 ? (
          <TableCaption>*lowest gross score</TableCaption>
        ) : null}
        <TableHeader>
          <TableRow>
            <TableHead className="px-1 sm:px-2">Pos</TableHead>
            <TableHead className="hidden px-1 sm:px-2 lg:table-cell">
              IG Position
            </TableHead>
            <TableHead className="px-1 sm:px-2">Name</TableHead>
            <TableHead className="px-1 sm:px-2">Team</TableHead>
            <TableHead className="hidden px-1 text-center sm:px-2 md:table-cell">
              Team Score
            </TableHead>
            <TableHead className="px-1 text-center sm:px-2">Score</TableHead>
            <TableHead className="px-1 text-right sm:px-2 ">£</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compResults.map((result) => (
            <Collapsible key={result.position} asChild>
              <Fragment key={result.position}>
                <TableRow key={result.position}>
                  <TableCell className="px-1 sm:px-2">
                    <CollapsibleTrigger asChild>
                      <span
                        className={`${result.scorecard?.entrantId ? "hover:cursor-pointer" : ""}`}
                      >
                        {result.position}
                      </span>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell className="hidden px-1 sm:px-2 lg:table-cell">
                    <CollapsibleTrigger asChild>
                      <span
                        className={`${result.scorecard?.entrantId ? "hover:cursor-pointer" : ""}`}
                      >
                        {result.igPosition}
                      </span>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell className="px-1 font-medium sm:px-2">
                    <EntrantDisplay
                      entrant={{
                        id: result.entrantId,
                        name: result.entrant.name,
                        handicap: result.scorecard?.handicap,
                        wildcard: result.wildcard,
                      }}
                      alwaysDisplayLogo={true}
                    />
                    {/* <Link href={`/entrants/${result.entrant.id}`}>
                        <span className="mr-1 sm:mr-2">
                          {result.entrant.name}
                          {result.scorecard?.id
                            ? ` (${result.scorecard.handicap})`
                            : ""}
                        </span>
                        {result.wildcard ? <Badge>WC</Badge> : null}
                      </Link> */}
                  </TableCell>
                  <TableCell className="px-1 sm:px-2">
                    <TeamDisplay
                      team={ensure(
                        teams.filter(
                          (team) => team.id == result.entrant.teamId,
                        )[0],
                      )}
                      alwaysDisplayLogo={true}
                      iconOnlyWhenSmall={true}
                    />
                    {/* {
                teams.filter((team) => team.id == result.entrant.teamId)[0]
                ?.teamName
                } */}
                  </TableCell>
                  <TableCell className="hidden px-1 text-center sm:px-2 md:table-cell">
                    <CollapsibleTrigger asChild>
                      <span
                        className={`${result.scorecard?.entrantId ? "hover:cursor-pointer" : ""}`}
                      >
                        {result.teamScore ? result.teamScore : "NR"}
                      </span>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell className="px-1 text-center sm:px-2">
                    <CollapsibleTrigger asChild>
                      <span
                        className={`${result.scorecard?.entrantId ? "hover:cursor-pointer" : ""}`}
                      >
                        {result.score ? result.score : "NR"}
                        {lowGross.entrantId.includes(result.entrantId)
                          ? "*"
                          : ""}
                      </span>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell className="px-1 text-right sm:px-2">
                    <CollapsibleTrigger asChild>
                      <LibMoney
                        hideZeros={true}
                        amountInPence={result.transactions.reduce(
                          (acc, cur) => acc + cur.netAmount,
                          0,
                        )}
                      />
                    </CollapsibleTrigger>
                  </TableCell>
                </TableRow>
                <CollapsibleContent asChild>
                  <tr className="bg-slate-100">
                    <ScorecardDisplay
                      colSpan={7}
                      scorecard={result.scorecard}
                    />
                  </tr>
                </CollapsibleContent>
              </Fragment>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </LibCardNarrow>
  );
}

export async function Winners({ compId }: ResultsProps) {
  const compResults = await api.comp.getWinners({ comp: compId });
  const teams = await api.team.getAll();

  if (!compResults) return <p>No results</p>;

  return (
    <Table>
      {/* <TableCaption>Event Results</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="px-1 sm:px-2">Pos</TableHead>
          <TableHead className="hidden px-1 sm:px-2 lg:table-cell">
            IG Position
          </TableHead>
          <TableHead className="px-1 sm:px-2">Name</TableHead>
          <TableHead className="px-1 sm:px-2">Team</TableHead>
          <TableHead className="hidden px-1 text-center sm:px-2 md:table-cell">
            Team Score
          </TableHead>
          <TableHead className="px-1 text-center sm:px-2">Score</TableHead>
          <TableHead className="px-1 text-right sm:px-2">£</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compResults.map((result) => (
          <TableRow key={result.position}>
            <TableCell className="px-1 sm:px-2">{result.position}</TableCell>
            <TableCell className="hidden px-1 sm:px-2 lg:block">
              {result.igPosition}
            </TableCell>
            <TableCell className="px-1 font-medium sm:px-2">
              {/* <span className="mr-1 sm:mr-2">{result.entrant.name}</span> */}
              <EntrantDisplay
                entrant={{ id: result.entrantId, name: result.entrant.name }}
              />
              {result.wildcard ? <Badge>WC</Badge> : null}
            </TableCell>
            <TableCell className="px-1 sm:px-2">
              <TeamDisplay
                team={ensure(
                  teams.filter((team) => team.id == result.entrant.teamId)[0],
                )}
              ></TeamDisplay>
            </TableCell>
            <TableCell className="hidden px-1 text-center sm:px-2 md:table-cell">
              {result.teamScore ? result.teamScore : "NR"}
            </TableCell>
            <TableCell className="px-1 text-center sm:px-2">
              {result.score ? result.score : "NR"}
            </TableCell>
            <TableCell className="px-1 text-right sm:px-2">
              <LibMoney
                hideZeros={true}
                amountInPence={result.transactions.reduce(
                  (acc, cur) => acc + cur.netAmount,
                  0,
                )}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter> */}
    </Table>
  );
}
