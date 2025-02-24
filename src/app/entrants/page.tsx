import { api } from "~/trpc/server";
import LibMain, {
  EntrantDisplay,
  LibCardContainer,
  LibCardNarrow,
  LibH1,
  TeamDisplay,
} from "~/app/_components/lib-elements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Link } from "next-view-transitions";

export async function generateMetadata() {
  return {
    title: `Libtour - Entrants`,
    description: "A List of Entrants for this season's Libtour",
  };
}

export default async function Entrants() {
  const entrants = await api.entrant.getAll();
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Entrants</LibH1>
      </div>
      <LibCardContainer>
        <LibCardNarrow title="Libtour Entrants">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrants.map((entrant) => {
                return (
                  <TableRow key={entrant.id}>
                    <TableCell>
                      <div className="flex gap-1">
                        <EntrantDisplay entrant={entrant} />
                        {entrant.captain && (
                          <Link href={`/entrants/${entrant.id}`}>
                            <Badge>Captain</Badge>
                          </Link>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TeamDisplay
                        team={entrant.team}
                        alwaysDisplayLogo={true}
                        iconOnlyWhenSmall={true}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </LibCardNarrow>
      </LibCardContainer>
    </LibMain>
  );
}
