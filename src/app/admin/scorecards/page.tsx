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
import { Link } from "next-view-transitions";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Libtour - Scorecard Admin",
  description: "Edit Libtour scorecards Admin page",
};

export default async function Events() {
  const { sessionClaims } = auth();
  if (!sessionClaims?.metadata?.adminPermission) return null;
  const comps = await api.comp.getAllCompleted();
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Scorecard Admin</LibH1>
      </div>

      <LibCardContainer splitAtLargeSizes={false}>
        <LibCardNarrow title="Completed Events">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competition</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comps.map((comp) => (
                <TableRow key={comp.igCompId}>
                  <TableCell>
                    <Link href={`/admin/scorecards/${comp.igCompId}`}>
                      {comp.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/scorecards/${comp.igCompId}`}>
                      {new Date(comp.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </LibCardNarrow>
      </LibCardContainer>
    </LibMain>
  );
}
