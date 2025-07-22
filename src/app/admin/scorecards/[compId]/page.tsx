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
import { auth } from "@clerk/nextjs/server";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "~/components/ui/collapsible";
import { Fragment, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/ui/use-toast";
import { EditHoleDescriptiontDialog } from "~/app/_components/hole-descriptions";

export const metadata = {
  title: "Libtour - Event Scorecard Admin",
  description: "Edit Libtour scorecards Admin page",
};

export default async function Event({
  params,
}: {
  params: { compId: string };
}) {
  const { sessionClaims } = auth();
  if (!sessionClaims?.metadata?.adminPermission) return null;
  const comp = await api.comp.getOneWithScores({ comp: params.compId });
  if (!comp) return null;
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>{comp.name} Scorecard Admin</LibH1>
      </div>

      <LibCardContainer splitAtLargeSizes={false}>
        <LibCardNarrow title="Scorecards">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pos</TableHead>
                <TableHead>Entrant</TableHead>
                <TableHead className="text-center">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comp.entrants.map((entrant, index) => (
                <Collapsible key={entrant.entrantId} asChild>
                  <Fragment key={entrant.entrantId}>
                    <TableRow key={entrant.entrantId}>
                      <CollapsibleTrigger asChild>
                        <TableCell className="cursor-pointer">
                          {index + 1}
                        </TableCell>
                      </CollapsibleTrigger>
                      <CollapsibleTrigger asChild>
                        <TableCell className="cursor-pointer">
                          {entrant.entrant.name}
                        </TableCell>
                      </CollapsibleTrigger>
                      <CollapsibleTrigger asChild>
                        <TableCell className="cursor-pointer text-center">
                          {entrant.noResult ? "NR" : entrant.score}
                        </TableCell>
                      </CollapsibleTrigger>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <Fragment>
                        <TableCell className="px-0" colSpan={3}>
                          <Table className="bg-muted">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-center">
                                  Hole
                                </TableHead>
                                <TableHead className="text-center">
                                  Par
                                </TableHead>
                                <TableHead className="text-center">
                                  Score
                                </TableHead>
                                <TableHead>Desc</TableHead>
                                <TableHead>Edit</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {entrant.scorecard?.holes.map((hole) => {
                                return (
                                  <TableRow
                                    key={`${entrant.entrantId}-${hole.holeNo}`}
                                  >
                                    <TableCell className="text-center">
                                      {hole.holeNo}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {hole.par}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {hole.NR ? "NR" : hole.strokes}
                                    </TableCell>
                                    <TableCell>
                                      {hole.description ? hole.description : ""}
                                    </TableCell>
                                    <TableCell>
                                      <EditHoleDescriptiontDialog
                                        scorecardId={hole.scorecardId}
                                        holeNo={hole.holeNo}
                                        holeDesc={hole.description}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </Fragment>
                    </CollapsibleContent>
                  </Fragment>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </LibCardNarrow>
      </LibCardContainer>
    </LibMain>
  );
}
