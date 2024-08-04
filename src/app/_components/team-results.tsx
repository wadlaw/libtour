import Link from "next/link";
import { api } from "~/trpc/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { LibCardNarrow, TeamDisplay } from "./lib-elements";

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
    <LibCardNarrow title="Team Results">
      <Table>
        {/* <TableCaption>Event Results</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compResults.map((result) => (
            <TableRow key={result.teamId}>
              <TableCell>
                <TeamDisplay team={result.team} alwaysDisplayLogo={true} />
              </TableCell>
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
            <TableHead className="sm:px2 px-1">Comp</TableHead>
            <TableHead className="sm:px2 px-1">Date</TableHead>
            <TableHead className="sm:px2 px-1">Format</TableHead>
            <TableHead className="px-1 text-center sm:px-2">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compResults.map((result) => (
            <TableRow key={result.teamId}>
              <TableCell className="sm:px2 px-1">
                <Link href={`/events/${result.comp.igCompId}`}>
                  {result.comp.name}
                </Link>
              </TableCell>
              <TableCell className="sm:px2 px-1">
                {new Date(result.comp.date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="sm:px2 px-1">
                {result.comp.stableford ? "Stableford" : "Medal"}
              </TableCell>
              <TableCell className="px-1 text-center sm:px-2">
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
