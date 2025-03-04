import { api } from "~/trpc/server";
import LibMain, {
  LibCardNarrow,
  LibCardContainer,
  LibH1,
  TeamDisplay,
  EntrantDisplay,
} from "~/app/_components/lib-elements";
import UserSelect from "../_components/user-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export const metadata = {
  title: "Libtour - User Setup",
  description: "Assign Auth users to Comp entrants",
};

export default async function Page() {
  const users = await api.user.getAll();
  const entrants = await api.entrant.getAll();

  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Users</LibH1>
      </div>
      <LibCardContainer>
        <LibCardNarrow title="User/Entrant Mapping">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-1 @2xl/main:px-2">Entrant</TableHead>
                <TableHead className="px-1 @2xl/main:px-2">Team</TableHead>
                <TableHead className="px-1  @2xl/main:px-2">
                  Mapped User
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrants.map((entrant) => {
                return (
                  <TableRow key={entrant.id}>
                    <TableCell className="px-1 @2xl/main:px-2">
                      <EntrantDisplay
                        entrant={{ id: entrant.id, name: entrant.name }}
                      />
                    </TableCell>
                    <TableCell className="px-1 @2xl/main:px-2">
                      <TeamDisplay
                        team={entrant.team}
                        iconOnlyWhenSmall={true}
                        alwaysDisplayLogo={true}
                      />
                    </TableCell>
                    <TableCell className="px-1  @2xl/main:px-2">
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
