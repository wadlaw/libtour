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
import { EditEntrantDialog } from "~/app/_components/entrants";
import UserSelect from "~/app/_components/user-select";

export default async function Entrants() {
  const entrants = await api.entrant.getAll();
  const users = await api.user.getAll();
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Entrants Admin</LibH1>
      </div>
      <LibCardContainer>
        <LibCardNarrow title="Libtour Entrants">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-1 @2xl/libcard:px-2">Update</TableHead>
                <TableHead className="px-1 @2xl/libcard:px-2">Name</TableHead>
                <TableHead className="hidden px-1 @2xl/libcard:px-2 @4xl/libcard:table-cell ">
                  IG Name
                </TableHead>
                <TableHead className="hidden px-1 @xl/libcard:table-cell @2xl/libcard:px-2">
                  Team
                </TableHead>
                <TableHead className="px-1 @2xl/libcard:px-2">
                  Mapped User
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrants.map((entrant) => {
                return (
                  <TableRow key={entrant.id}>
                    <TableCell className="px-1 @2xl/libcard:px-2">
                      <EditEntrantDialog
                        key={entrant.id}
                        entrantId={entrant.id}
                        name={entrant.name}
                        systemName={entrant.systemName}
                        teamId={entrant.teamId}
                      />
                    </TableCell>
                    <TableCell className="px-1 @2xl/libcard:px-2">
                      <EntrantDisplay entrant={entrant} />
                    </TableCell>
                    <TableCell className="hidden px-1 @2xl/libcard:px-2 @4xl/libcard:table-cell">
                      {entrant.systemName}
                    </TableCell>
                    <TableCell className="hidden px-1 @xl/libcard:table-cell @2xl/libcard:px-2">
                      <TeamDisplay
                        team={entrant.team}
                        alwaysDisplayLogo={true}
                        iconOnlyWhenSmall={true}
                      />
                    </TableCell>
                    <TableCell className="px-1 @2xl/libcard:px-2">
                      <UserSelect
                        users={users.map((user) => {
                          return {
                            name: `${user.firstName} ${user.surname}`,
                            id: user.id,
                            entrantId: user.entrant?.id,
                          };
                        })}
                        currentValue={entrant.userId}
                        entrantId={entrant.id}
                        entrantName={entrant.name}
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
