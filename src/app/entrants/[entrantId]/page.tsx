import { api } from "~/trpc/server";
import LibMain, {
  LibCardContainer,
  LibCardNarrow,
  LibH1,
  TeamDisplay,
} from "~/app/_components/lib-elements";
import { Link } from "next-view-transitions";
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
import { Fragment, Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import SkeletonTable from "~/app/_components/skeletons";
import LibMoney from "~/app/_components/lib-money";
import IdentityIcon from "~/app/_components/identicons";
import { Collapsible } from "@radix-ui/react-collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ScorecardDisplay } from "~/app/_components/scorecard";

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
      <LibCardContainer>
        {/* <div className="mx-1 mb-1 mt-4 grid w-full grid-cols-1 gap-4 sm:mx-2 sm:mb-2 xl:mx-0 xl:mb-4"> */}
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
        {/* </div> */}
      </LibCardContainer>
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
          <div
            className={`h-[100px] w-[100px] overflow-hidden rounded-full ring-2 ring-[hsl(var(--muted))] ${entrant.team.linkName}`}
          >
            <Link href={`/entrants/${entrant.id}`}>
              {entrant?.user?.avatarUrl ? (
                <Image
                  src={entrant.user.avatarUrl}
                  height={100}
                  width={100}
                  alt="avatar"
                />
              ) : (
                <IdentityIcon username={entrant.name} width={100} />
              )}
            </Link>
          </div>
          <LibH1>{entrant?.name}</LibH1>
          <p className="mt-1 sm:mt-2">
            {entrant?.captain ? (
              <div className="flex items-center gap-2">
                Captain of{" "}
                <TeamDisplay team={entrant.team} alwaysDisplayLogo={true} />
              </div>
            ) : (
              <TeamDisplay team={entrant.team} alwaysDisplayLogo={true} />
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <LibH1>Entrant not found</LibH1>
        </div>
      )}
      <LibCardContainer>
        {/* <div className="mx-1 mb-1 mt-4 grid grid-cols-1 gap-4 sm:mx-2 sm:mb-2 xl:mx-0 xl:mb-4"> */}
        <LibCardNarrow title={`Results for ${entrant?.name}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-1 @2xl/libcard:px-2">Comp</TableHead>
                <TableHead className="hidden px-1 @2xl/libcard:table-cell @2xl/libcard:px-2">
                  Date
                </TableHead>
                <TableHead className="px-1 @2xl/libcard:px-2">
                  Results
                </TableHead>
                <TableHead className="px-1 @2xl/libcard:px-2">Score</TableHead>
                <TableHead className="px-1 text-right @2xl/libcard:px-2">
                  Winnings
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrant?.comps.map((comp) => {
                return (
                  <Collapsible key={comp.compId} asChild>
                    <Fragment key={comp.compId}>
                      <TableRow key={comp.compId}>
                        <TableCell className="px-1 @2xl/libcard:px-2">
                          <Link href={`/events/${comp.comp.shortName}`}>
                            <span className="mr-1 @2xl/libcard:mr-2">
                              {comp.comp.name}
                            </span>
                            {comp.wildcard ? <Badge>WC</Badge> : null}
                          </Link>
                        </TableCell>
                        <CollapsibleTrigger asChild>
                          <TableCell
                            className={`hidden px-1 @2xl/libcard:table-cell @2xl/libcard:px-2 ${comp.scorecard && "cursor-pointer"}`}
                          >
                            {new Date(comp.comp.date).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </TableCell>
                        </CollapsibleTrigger>
                        <CollapsibleTrigger asChild>
                          <TableCell
                            className={`px-1 @2xl/libcard:px-2 ${comp.scorecard && "cursor-pointer"}`}
                          >
                            {comp.position
                              ? `${comp.position}${ordinal(comp.position)}`
                              : "Entered"}
                          </TableCell>
                        </CollapsibleTrigger>
                        <CollapsibleTrigger asChild>
                          <TableCell
                            className={`px-1 @2xl/libcard:px-2 ${comp.scorecard && "cursor-pointer"}`}
                          >
                            {comp.position
                              ? `${comp.score ? comp.score : "NR"}${comp.comp.stableford ? !comp.noResult && "pts" : ""}`
                              : ""}
                          </TableCell>
                        </CollapsibleTrigger>
                        <TableCell className="px-1 text-right @2xl/libcard:px-2">
                          <LibMoney
                            hideZeros={true}
                            amountInPence={comp.transactions.reduce(
                              (acc, cur) => acc + cur.netAmount,
                              0,
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <tr className="bg-muted">
                          <ScorecardDisplay
                            colSpan={5}
                            formatForSplitView={false}
                            scorecard={comp.scorecard}
                            strokesOnly={false}
                          />
                        </tr>
                      </CollapsibleContent>
                    </Fragment>
                  </Collapsible>
                );
              })}
            </TableBody>
          </Table>
        </LibCardNarrow>
        {/* </div> */}
      </LibCardContainer>
    </LibMain>
  );
}
