import { api } from "~/trpc/server";
import { auth } from "@clerk/nextjs/server";
import LibMain, {
  LibCardContainer,
  LibH1,
} from "~/app/_components/lib-elements";
import Results from "~/app/_components/results";
import { Protect } from "@clerk/nextjs";
import EventEntrants, {
  EventNonEntrants,
} from "~/app/_components/event-entrants";

import { ScrapeResults } from "~/app/_components/resultslookup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import EnterWithdraw from "~/app/_components/entry-buttons";
import TeamResultsForComp from "~/app/_components/team-results";

export async function generateMetadata({
  params,
}: {
  params: { eventId: string };
}) {
  const comp = await api.comp.getOne({
    comp: params.eventId,
  });

  let desc = "";
  if (comp) {
    if (
      comp?.completed &&
      comp?.entrants.length == 3 &&
      comp?.teamPoints.length == 1
    ) {
      desc = `Winners: ${comp.teamPoints[0]?.team.teamName}; 1st: ${comp.entrants[0]?.entrant.name}, 2nd: ${comp.entrants[1]?.entrant.name}, 3rd: ${comp.entrants[2]?.entrant.name}`;
    } else {
      desc = `${comp.stableford ? "Stableford" : "Medal"} - ${comp?.date.toLocaleDateString(
        "en-GB",
        {
          weekday: "short",
          month: "long",
          day: "numeric",
        },
      )}`;
    }
  } else {
    desc = "Libtour event not found";
  }

  return {
    title: `Libtour - ${comp ? comp?.name : params.eventId}`,
    description: desc,
  };
}

export default async function Event({
  params,
}: {
  params: { eventId: string };
}) {
  const { sessionClaims } = auth();
  const comp = await api.comp.get({ comp: params.eventId });

  if (!comp) return;
  return (
    <LibMain>
      <div className="flex flex-col items-center ">
        <LibH1>{comp.name}</LibH1>
        <div>Format: {comp.stableford ? "Stableford" : "Medal"}</div>
        <div>
          Date:{" "}
          {comp.date.toLocaleDateString("en-GB", {
            weekday: "short",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <Protect condition={() => !!sessionClaims?.metadata?.adminPermission}>
        <div className="flex flex-col items-center ">
          <Accordion className="px-2" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Admin</AccordionTrigger>
              <AccordionContent>
                <ScrapeResults eventId={comp.igCompId} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Protect>

      {comp.open && (
        <Protect>
          <div className="mt-4 flex flex-col items-center ">
            <EnterWithdraw
              compId={comp.igCompId}
              compName={comp.name}
              displayEntryStatus={true}
            />
          </div>
        </Protect>
      )}

      {comp.completed ? (
        <LibCardContainer>
          <Results compId={comp.igCompId} stableford={comp.stableford} />
          <TeamResultsForComp compId={comp.igCompId} />
        </LibCardContainer>
      ) : (
        <LibCardContainer>
          <EventEntrants compId={comp.igCompId} isOpen={comp.open} />
        </LibCardContainer>
      )}

      <div className="flex  flex-col items-center ">
        <Protect
          condition={() =>
            !!sessionClaims?.metadata?.captain ||
            !!sessionClaims?.metadata?.entryPermission ||
            !!sessionClaims?.metadata?.adminPermission
          }
        >
          {comp.open && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="mx-36 sm:mx-64 lg:mx-96 ">
                  Not Entered
                </AccordionTrigger>
                <AccordionContent>
                  <EventNonEntrants compId={comp.igCompId} isOpen={comp.open} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </Protect>
      </div>
    </LibMain>
  );
}
