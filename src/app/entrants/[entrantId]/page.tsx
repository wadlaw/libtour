import { api } from "~/trpc/server";
import LibMain, {
  LibCard,
  LibCardNarrow,
  LibH1,
  TeamDisplay,
} from "~/app/_components/lib-elements";
import Link from "next/link";

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
import LibMoney from "~/app/_components/lib-money";
import IdentityIcon from "~/app/_components/identicons";

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
        <LibCardNarrow title="Results">
          <SkeletonTable
            rows={8}
            columnHeaders={[
              { title: "Comp", width: "w-32" },
              { title: "Date", width: "w-12" },
              { title: "Result", width: "w-12" },
              { title: "Winnings", width: "w-12" },
            ]}
          />
        </LibCardNarrow>
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
          <div className="overflow-hidden rounded-full ring-2 ring-slate-200">
            <Link href={`/entrants/${entrant.id}`}>
              <IdentityIcon username={entrant.name} width={100} />
              {/* <Image
                src={`/${entrant.team.linkName + ".png"}`}
                height={100}
                width={100}
                alt={`${entrant.team.teamName} logo`}
              ></Image> */}
            </Link>
          </div>
          <LibH1>{entrant?.name}</LibH1>
          <p className="mt-1 sm:mt-2">
            {entrant?.captain ? (
              <Link href={`/teams/${entrant?.team.linkName}`}>
                <div className="flex items-center gap-2">
                  Captain of{" "}
                  <TeamDisplay team={entrant.team} alwaysDisplayLogo={true} />
                </div>
                {/* {`${entrant?.team.teamName}`} */}
              </Link>
            ) : (
              <Link href={`/teams/${entrant?.team.linkName}`}>
                <TeamDisplay team={entrant.team} alwaysDisplayLogo={true} />
                {/* {`${entrant?.team.teamName}`} */}
              </Link>
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <LibH1>Entrant not found</LibH1>
        </div>
      )}
      <div className="mx-1 mb-1 mt-4 grid grid-cols-1 gap-4 sm:mx-2 sm:mb-2 xl:mx-0 xl:mb-4">
        <LibCardNarrow title={`Results for ${entrant?.name}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-1 sm:px-2">Comp</TableHead>
                <TableHead className="hidden px-1 sm:table-cell sm:px-2">
                  Date
                </TableHead>
                <TableHead className="px-1 sm:px-2">Results</TableHead>
                <TableHead className="px-1 text-right sm:px-2">
                  Winnings
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrant?.comps.map((comp) => {
                return (
                  <TableRow key={comp.compId}>
                    <TableCell className="px-1 sm:px-2">
                      <Link href={`/events/${comp.comp.shortName}`}>
                        <span className="mr-1 sm:mr-2">{comp.comp.name}</span>
                        {comp.wildcard ? <Badge>WC</Badge> : null}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden px-1 sm:table-cell sm:px-2">
                      {new Date(comp.comp.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="px-1 sm:px-2">
                      {comp.position
                        ? `${comp.position}${ordinal(comp.position)} (${comp.score ? comp.score : "NR"}${comp.comp.stableford ? !comp.noResult && "pts" : ""})`
                        : "Entered"}
                    </TableCell>
                    <TableCell className="px-1 text-right sm:px-2">
                      <LibMoney
                        hideZeros={true}
                        amountInPence={comp.transactions.reduce(
                          (acc, cur) => acc + cur.netAmount,
                          0,
                        )}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </LibCardNarrow>
      </div>
    </LibMain>
  );
}
