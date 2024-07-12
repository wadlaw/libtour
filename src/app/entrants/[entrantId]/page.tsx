import { api } from "~/trpc/server";
import LibMain, { LibCard, LibH1 } from "~/app/_components/lib-elements";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export async function generateMetadata({
  params,
}: {
  params: { entrantId: string };
}) {
  const entrant = await api.entrant.getOne({
    entrantId: parseInt(params.entrantId),
  });

  return {
    title: `Libtour - ${entrant ? entrant?.name : "unknown"}`,
    description: "A Summer-long series of events at Redlibbets",
  };
}

export default async function Entrant({
  params,
}: {
  params: { entrantId: string };
}) {
  const entrant = await api.entrant.getOne({
    entrantId: parseInt(params.entrantId),
  });

  const ordinal = (num: number) => {
    return num > 0
      ? ["th", "st", "nd", "rd"][
          (num > 3 && num < 21) || num % 10 > 3 ? 0 : num % 10
        ]
      : "";
  };

  return (
    <LibMain>
      {entrant ? (
        <div className="flex flex-col items-center">
          <div className="overflow-hidden rounded-full">
            <Link href={`/teams/${entrant.team.linkName}`}>
              <Image
                src={`/${entrant.team.linkName + ".png"}`}
                height={100}
                width={100}
                alt={`${entrant.team.teamName} logo`}
              ></Image>
            </Link>
          </div>
          <LibH1>{entrant?.name}</LibH1>
          <p>
            {entrant?.captain ? (
              <Link href={`/teams/${entrant?.team.linkName}`}>
                Captain of {`${entrant?.team.teamName}`}
              </Link>
            ) : (
              <Link
                href={`/teams/${entrant?.team.linkName}`}
              >{`${entrant?.team.teamName}`}</Link>
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <LibH1>Entrant not found</LibH1>
        </div>
      )}
      <div className="mx-1 mb-1 mt-4 grid grid-cols-1 gap-4 sm:mx-2 sm:mb-2 xl:mx-0 xl:mb-4">
        <LibCard title={`Results for ${entrant?.name}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comp</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrant?.comps.map((comp) => {
                return (
                  <TableRow key={comp.compId}>
                    <TableCell>
                      <Link href={`/events/${comp.comp.shortName}`}>
                        {comp.comp.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(comp.comp.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {comp.position
                        ? `${comp.position}${ordinal(comp.position)} (${comp.score ? comp.score : "NR"}${comp.comp.stableford ? !comp.noResult && "pts" : ""})`
                        : "Entered"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </LibCard>
      </div>
    </LibMain>
  );
}
