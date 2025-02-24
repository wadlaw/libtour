import { api } from "~/trpc/server";
import { auth } from "@clerk/nextjs/server";
import {
  LibMainFixed,
  LibCardContainer,
  LibCardNarrow,
  LibH1,
} from "~/app/_components/lib-elements";
import Results from "~/app/_components/results";
import { Protect } from "@clerk/nextjs";
import EventEntrants, {
  EventNonEntrants,
} from "~/app/_components/event-entrants";

import { ScrapeResults } from "~/app/_components/resultslookup";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "~/components/ui/accordion";
import EnterWithdraw from "~/app/_components/entry-buttons";
import TeamResultsForComp from "~/app/_components/team-results";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

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

  const tabColumns = () => {
    const cols = [];
    if (!sessionClaims) return 1;
    if (comp?.completed) cols.push("results");
    if (!comp?.completed) {
      cols.push("entries");
      if (
        comp?.open &&
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (!!sessionClaims?.metadata?.captain ||
          !!sessionClaims?.metadata?.entryPermission ||
          !!sessionClaims?.metadata?.adminPermission)
      ) {
        cols.push("nonentries");
      }
    }
    if (!!sessionClaims?.metadata?.adminPermission) cols.push("admin");
    return cols.length;
  };

  if (!comp) return;
  return (
    <LibMainFixed>
      <div className="flex flex-col items-center ">
        <LibH1>{comp.name}</LibH1>
        <div>Format: {comp.stableford ? "Stableford" : "Medal"}</div>
        <div>
          Date:{" "}
          {comp.date.toLocaleDateString("en-GB", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

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

      {tabColumns() == 1 ? (
        <LibCardContainer>
          {comp.completed ? (
            <>
              <Results compId={comp.igCompId} stableford={comp.stableford} />
              <TeamResultsForComp compId={comp.igCompId} />
            </>
          ) : (
            <EventEntrants compId={comp.igCompId} isOpen={comp.open} />
          )}
        </LibCardContainer>
      ) : (
        <LibCardContainer>
          <Tabs defaultValue={comp.completed ? "results" : "entries"}>
            <TabsList
              className={`mb-2 grid w-full ${["", "grid-cols-1", "grid-cols-2", "grid-cols-3"][tabColumns()]}`}
            >
              <TabsTrigger
                value="entries"
                className={`${comp.completed && "hidden"}`}
              >
                Entries
              </TabsTrigger>
              <TabsTrigger
                value="nonentries"
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                className={`${comp.completed && "hidden"} ${!comp.open && "hidden"} ${sessionClaims?.metadata.adminPermission || sessionClaims?.metadata.captain || sessionClaims?.metadata.entryPermission ? "" : "hidden"}`}
              >
                Not Entered
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className={`${!comp.completed && "hidden"}`}
              >
                Results
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className={`${!sessionClaims?.metadata.adminPermission && "hidden"}`}
              >
                Admin
              </TabsTrigger>
            </TabsList>
            <TabsContent value="entries">
              <EventEntrants compId={comp.igCompId} isOpen={comp.open} />
            </TabsContent>
            <TabsContent value="nonentries">
              <EventNonEntrants compId={comp.igCompId} isOpen={comp.open} />
            </TabsContent>
            <TabsContent value="results">
              <div className="flex flex-col gap-2">
                <Results compId={comp.igCompId} stableford={comp.stableford} />
                <TeamResultsForComp compId={comp.igCompId} />
              </div>
            </TabsContent>
            <TabsContent value="admin">
              <LibCardNarrow title="Admin Panel">
                <ScrapeResults eventId={comp.igCompId} />
              </LibCardNarrow>
            </TabsContent>
          </Tabs>
        </LibCardContainer>
      )}

      {/* <Protect condition={() => !!sessionClaims?.metadata?.adminPermission}>
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
      </Protect> */}

      {/* {comp.completed ? (
        <LibCardContainer>
          <Results compId={comp.igCompId} stableford={comp.stableford} />
          <TeamResultsForComp compId={comp.igCompId} />
        </LibCardContainer>
      ) : (
        <LibCardContainer>
          <EventEntrants compId={comp.igCompId} isOpen={comp.open} />
        </LibCardContainer>
      )} */}

      {/* <div className="flex  flex-col items-center ">
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
      </div> */}
    </LibMainFixed>
  );
}
