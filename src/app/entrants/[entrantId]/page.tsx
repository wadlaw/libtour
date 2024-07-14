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
import { Badge } from "~/components/ui/badge";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import SkeletonTable from "~/app/_components/skeletons";

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
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <Content entrantId={params.entrantId} />
    </Suspense>
  );
}

function ContentSkeleton() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <div className="overflow-hidden rounded-full">
          <Skeleton className="m-4 h-[100px] w-[100px] overflow-hidden rounded-full" />
        </div>

        <Skeleton className="h-18 m-4 w-48" />

        <Skeleton className="m-4 h-6 w-40" />
      </div>
      <div className="mx-1 mb-1 mt-4 grid w-full grid-cols-1 gap-4 sm:mx-2 sm:mb-2 xl:mx-0 xl:mb-4">
        <LibCard title="Results">
          <SkeletonTable
            rows={8}
            columnHeaders={[
              { title: "Comp", width: "w-32" },
              { title: "Date", width: "w-12" },
              { title: " ", width: "w-12" },
            ]}
          />
        </LibCard>
      </div>
    </LibMain>
  );
}

type ContentProps = {
  entrantId: string;
};

async function Content({ entrantId }: ContentProps) {
  const entrant = await api.entrant.getOne({
    entrantId: parseInt(entrantId),
  });
  // await new Promise((resolve) => setTimeout(resolve, 10000));
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
                        <span className="mr-1 sm:mr-2">{comp.comp.name}</span>
                        {comp.wildcard ? <Badge>WC</Badge> : null}
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
