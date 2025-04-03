import { api } from "~/trpc/server";
import LibMain, {
  LibCardContainer,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  AddEclecticEntrantDialog,
  EditEclecticEntrantDialog,
} from "~/app/_components/eclectic-entrants";
import { Link } from "next-view-transitions";

export default async function Entrants() {
  const entrants = await api.eclectic.getEntrants();

  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Eclectic Entrants</LibH1>
      </div>
      <div className="flex flex-row justify-center">
        <AddEclecticEntrantDialog />
      </div>
      <LibCardContainer>
        <LibCardNarrow title="Eclectic Entrants">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-1 @2xl/libcard:px-2">Update</TableHead>
                <TableHead className="px-1 @2xl/libcard:px-2">
                  Display Name
                </TableHead>
                <TableHead className="hidden px-1 @2xl/libcard:px-2 @4xl/libcard:table-cell ">
                  System Name
                </TableHead>
                <TableHead className="px-1 @2xl/libcard:px-2 @4xl/libcard:table-cell ">
                  Paid
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrants.map((entrant) => {
                return (
                  <TableRow key={entrant.id}>
                    <TableCell className="px-1 @2xl/libcard:px-2">
                      <EditEclecticEntrantDialog
                        key={entrant.id}
                        entrantId={entrant.id}
                        displayName={entrant.displayName}
                        systemName={entrant.systemName}
                        paid={entrant.paid}
                      />
                    </TableCell>
                    <TableCell
                      className={`px-1 @2xl/libcard:px-2 ${!entrant.paid && "text-red-500"}`}
                    >
                      <Link href={`/eclecticentrants/${entrant.id}`}>
                        {entrant.displayName}
                      </Link>
                    </TableCell>
                    <TableCell
                      className={`hidden px-1 @2xl/libcard:px-2 @4xl/libcard:table-cell ${!entrant.paid && "text-red-500"}`}
                    >
                      <Link href={`/eclecticentrants/${entrant.id}`}>
                        {entrant.systemName}
                      </Link>
                    </TableCell>
                    <TableCell
                      className={`px-1 @2xl/libcard:px-2 @4xl/libcard:table-cell ${!entrant.paid && "text-red-500"}`}
                    >
                      <Link href={`/eclecticentrants/${entrant.id}`}>
                        {entrant.paid ? "Yes" : "No"}
                      </Link>
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
