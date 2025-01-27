import { api } from "~/trpc/server";
import LibMain, {
  EntrantDisplay,
  LibCardContainer,
  LibCardNarrow,
  LibH1,
  TeamDisplay,
} from "../_components/lib-elements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EditEntrantDialog, EditEntrantPopover } from "../_components/entrants";

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
                <TableHead>Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrants.map((entrant) => {
                return (
                  <TableRow key={entrant.id}>
                    <TableCell>
                      <EntrantDisplay entrant={entrant} />
                    </TableCell>
                    <TableCell>
                      <TeamDisplay
                        team={entrant.team}
                        alwaysDisplayLogo={true}
                        iconOnlyWhenSmall={true}
                      />
                    </TableCell>
                    {/* <TableCell>
                      <EditEntrantPopover
                        key={entrant.id}
                        entrantId={entrant.id}
                        name={entrant.name}
                        teamId={entrant.teamId}
                      />
                    </TableCell> */}
                    <TableCell>
                      <EditEntrantDialog
                        key={entrant.id}
                        entrantId={entrant.id}
                        name={entrant.name}
                        teamId={entrant.teamId}
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
