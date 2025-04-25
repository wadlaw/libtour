import { Link } from "next-view-transitions";
import { api } from "~/trpc/server";
import { z } from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EntrantDisplay, LibCardNarrow, TeamDisplay } from "./lib-elements";

const ScoresSchema = z
  .object({
    teamScore: z.number().nullable(),
    wildcard: z.boolean(),
    entrant: z.object({ id: z.number(), name: z.string(), teamId: z.string() }),
  })
  .array();

type TeamResultsProps = {
  compId: string;
};

// Don't believe this component is currently used
// export async function TeamResults2({ compId }: TeamResultsProps) {
//   const compResults = await api.comp.getResults({ comp: compId });
//   if (!compResults) return <p>No results</p>;

//   return (
//     <Table>
//       {/* <TableCaption>Event Results</TableCaption> */}
//       <TableHeader>
//         <TableRow>
//           <TableHead>Position</TableHead>
//           <TableHead className="hidden md:block">IG Position</TableHead>
//           <TableHead>Name</TableHead>

//           <TableHead>Score</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {compResults.map((result) => (
//           <TableRow key={result.position}>
//             <TableCell>{result.position}</TableCell>
//             <TableCell className="hidden md:block">
//               {result.igPosition}
//             </TableCell>
//             <TableCell className="font-medium">{`${result.entrant.name}${result.wildcard ? " (wildcard)" : ""}`}</TableCell>

//             <TableCell>{result.score}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//       {/* <TableFooter>
//               <TableRow>
//                 <TableCell colSpan={3}>Total</TableCell>
//                 <TableCell className="text-right">$2,500.00</TableCell>
//               </TableRow>
//             </TableFooter> */}
//     </Table>
//   );
// }

export default async function TeamResultsForComp({ compId }: TeamResultsProps) {
  const compResults = await api.comp.getTeamResultsForComp({ compId: compId });
  if (!compResults) return <p>No results</p>;

  return (
    <LibCardNarrow
      title="Team Results"
      subHeading={`For ${compResults[0]?.comp.name}`}
    >
      <Table>
        {/* <TableCaption>Event Results</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead className="hidden @5xl/libcard:table-cell">
              First Score
            </TableHead>
            <TableHead className="hidden @5xl/libcard:table-cell">
              Second Score
            </TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compResults.map((result) => (
            <TableRow key={result.teamId}>
              <TableCell>
                <TeamDisplay team={result.team} alwaysDisplayLogo={true} />
              </TableCell>
              <TopTwoTeamScores
                teamId={result.teamId}
                scores={ScoresSchema.parse(result.comp.entrants)}
                stableford={result.comp.stableford}
              />
              <TableCell className="text-center">{result.points}</TableCell>
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
    </LibCardNarrow>
  );
}

type TopTwoTeamScoresProps = {
  teamId: string;
  scores: z.infer<typeof ScoresSchema>;
  stableford: boolean;
};

function TopTwoTeamScores({
  teamId,
  scores,
  stableford,
}: TopTwoTeamScoresProps) {
  const fScores = scores.filter((score) => score.entrant.teamId == teamId);

  return (
    <>
      <TableCell className="hidden @5xl/libcard:table-cell">
        {fScores[0] && (
          <EntrantDisplay
            entrant={{
              id: fScores[0]?.entrant.id ?? 0,
              name: fScores[0]?.entrant.name ?? "",
              score: fScores[0]?.teamScore
                ? `${fScores[0]?.teamScore.toString()}${stableford ? "pts" : ""}`
                : "",
              wildcard: fScores[0]?.wildcard,
            }}
          />
        )}
      </TableCell>
      <TableCell className="hidden @5xl/libcard:table-cell">
        {fScores[1] && (
          <EntrantDisplay
            entrant={{
              id: fScores[1]?.entrant.id ?? 0,
              name: fScores[1]?.entrant.name ?? "",
              score: fScores[1]?.teamScore
                ? `${fScores[1]?.teamScore.toString()}${stableford ? "pts" : ""}`
                : "",
              wildcard: fScores[1]?.wildcard,
            }}
          />
        )}
      </TableCell>
      <TableCell className="text-center">
        {(fScores[0]?.teamScore ?? 0) + (fScores[1]?.teamScore ?? 0)}
      </TableCell>
    </>
  );
}

type TeamResultsByTeamProps = {
  team: string;
};

export async function TeamResultsByTeam({ team }: TeamResultsByTeamProps) {
  const compResults = await api.comp.getTeamResultsForTeam({ team: team });
  if (!compResults) return <p>No results</p>;

  return (
    <LibCardNarrow title="Team Results">
      <Table>
        {/* <TableCaption>Event Results</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="@2xl/libcard:px2 px-1">Comp</TableHead>
            <TableHead className="@2xl/libcard:px2 px-1">Date</TableHead>
            <TableHead className="@2xl/libcard:px2 px-1">Format</TableHead>
            <TableHead className="px-1 text-center @2xl/libcard:px-2">
              Points
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compResults.map((result) => (
            <TableRow key={result.teamId}>
              <TableCell className="@2xl/libcard:px2 px-1">
                <Link href={`/events/${result.comp.igCompId}`}>
                  {result.comp.name}
                </Link>
              </TableCell>
              <TableCell className="@2xl/libcard:px2 px-1">
                {new Date(result.comp.date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="@2xl/libcard:px2 px-1">
                {result.comp.stableford ? "Stableford" : "Medal"}
              </TableCell>
              <TableCell className="px-1 text-center @2xl/libcard:px-2">
                {result.points}
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
    </LibCardNarrow>
  );
}
