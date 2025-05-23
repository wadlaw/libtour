import { Link } from "next-view-transitions";
import { api } from "~/trpc/server";
import { Protect } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import EnterWithdraw from "./entry-buttons";
import { ClosedEventStatus, EntrantCountDisplay } from "./event-entrants";
import { EntrantDisplay, LibCardNarrow } from "./lib-elements";
import { EditEventDialog } from "./events";

type EventListTableProps = {
  edit?: boolean;
};

export async function EventListTable({ edit = false }: EventListTableProps) {
  const comps = edit ? await api.comp.getAll() : await api.comp.getAllLib();
  // const user = await api.user.loggedInUser();

  if (!comps) return null;
  return (
    <EventListDisplay
      comps={comps}
      title={edit ? "All Events" : "Lib Events"}
      displayEditOption={edit}
    />
  );
}

export async function UpcomingEventList() {
  const comps = await api.comp.getUpcoming();
  // const user = await api.user.loggedInUser();

  if (!comps) return null;
  return (
    <EventListDisplay
      comps={comps}
      title="Upcoming Events"
      lastHeaderText="Status"
      emptyListText="No more events for this year. See you next year!"
    />
  );
}

export async function RecentEventList() {
  const comps = await api.comp.getRecent();
  // const user = await api.user.loggedInUser();

  if (!comps) return null;
  return (
    <EventListDisplay
      comps={comps}
      title="Recent Events"
      lastHeaderText="Winner"
      emptyListText="Event results will appear here"
    />
  );
}

type EventListDisplayProps = {
  comps: Array<{
    completed: boolean;
    current: boolean;
    date: Date | string;
    entrants: {
      score: number | null;
      position: number | null;
      entrant: {
        id: number;
        name: string;
      };
    }[];
    igCompId: string;
    name: string;
    open: boolean;
    shortName: string;
    stableford: boolean;
    lib: boolean;
    eclectic: boolean;
    resultsPage: string;
  }>;
  title?: string;
  lastHeaderText?: string;
  emptyListText?: string;
  displayEditOption?: boolean;
};

function EventListDisplay({
  comps,
  title,
  lastHeaderText = "",
  emptyListText = "No events to display",
  displayEditOption = false,
}: EventListDisplayProps) {
  const { sessionClaims } = auth();
  return (
    <LibCardNarrow title={title} url="/events">
      <Table>
        <TableHeader>
          <TableRow>
            <Protect
              condition={() =>
                !!sessionClaims?.metadata?.adminPermission && displayEditOption
              }
            >
              <TableHead className="px-1 @2xl/libcard:px-2"></TableHead>
            </Protect>
            <TableHead className=" px-1 @2xl/libcard:px-2">Event</TableHead>
            <TableHead className="hidden px-1 @xl/libcard:table-cell @2xl/libcard:px-2">
              Format
            </TableHead>
            <TableHead className="px-1 @2xl/libcard:px-2">Date</TableHead>
            <TableHead
              className={`${displayEditOption && "hidden"} ${displayEditOption && "@2xl/libcard:table-cell"} px-1 @2xl/libcard:px-2`}
            >
              {lastHeaderText}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comps.length === 0 ? (
            <TableRow>
              <TableCell className="text-center italic" colSpan={4}>
                {emptyListText}
              </TableCell>
            </TableRow>
          ) : null}
          {comps.map((comp) => (
            <TableRow key={comp.igCompId}>
              <Protect
                condition={() =>
                  !!sessionClaims?.metadata?.adminPermission &&
                  displayEditOption
                }
              >
                <TableCell className="px-1 @2xl/libcard:px-2">
                  {!comp.completed && (
                    <EditEventDialog
                      igCompId={comp.igCompId}
                      shortName={comp.shortName}
                      name={comp.name}
                      date={new Date(comp.date)}
                      stableford={comp.stableford}
                      lib={comp.lib}
                      eclectic={comp.eclectic}
                      resultsPage={comp.resultsPage}
                    />
                  )}
                </TableCell>
              </Protect>
              <TableCell className="px-1 font-medium @2xl/libcard:px-2">
                <Link href={`/events/${comp.shortName}`}>{comp.name}</Link>
              </TableCell>
              <TableCell className="hidden px-1 @xl/libcard:table-cell @2xl/libcard:px-2">
                <Link href={`/events/${comp.shortName}`}>
                  {comp.stableford ? "Stableford" : "Medal"}
                </Link>
              </TableCell>
              <TableCell className="px-1 @2xl/libcard:px-2">
                <Link href={`/events/${comp.shortName}`}>
                  {new Date(comp.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Link>
              </TableCell>
              <TableCell
                className={`${displayEditOption && "hidden"} ${displayEditOption && "@2xl/libcard:table-cell"}  px-1 @2xl/libcard:px-2`}
              >
                {/* <Link href={`/events/${comp.shortName}`}> */}

                {comp.completed ? (
                  <EntrantDisplay
                    entrant={{
                      id:
                        comp.entrants.filter((entrant) => {
                          return entrant.position === 1;
                        })[0]?.entrant.id ?? 0,
                      name:
                        comp.entrants.filter((entrant) => {
                          return entrant.position === 1;
                        })[0]?.entrant.name ?? "",
                      score: `${
                        comp.entrants.filter((entrant) => {
                          return entrant.position === 1;
                        })[0]?.score ?? 0
                      }${comp.stableford ? "pts" : ""}`,
                    }}
                    alwaysDisplayLogo={true}
                  />
                ) : // <Link
                //   href={`/entrants/${
                //     comp.entrants.filter((entrant) => {
                //       return entrant.position === 1;
                //     })[0]?.entrant.id
                //   }`}
                // >
                //   {`${
                //     comp.entrants.filter((entrant) => {
                //       return entrant.position === 1;
                //     })[0]?.entrant.name
                //   } (${
                //     comp.entrants.filter((entrant) => {
                //       return entrant.position === 1;
                //     })[0]?.score
                //   }${comp.stableford ? "pts" : ""})`}
                // </Link>
                comp.open ? (
                  <Protect
                    fallback={
                      <EntrantCountDisplay
                        entries={comp.entrants.length}
                        href={`/events/${comp.shortName}`}
                      />
                    }
                  >
                    <EnterWithdraw
                      compId={comp.igCompId}
                      compName={comp.name}
                    />
                  </Protect>
                ) : (
                  <Protect
                    fallback={
                      <Link href={`/events/${comp.shortName}`}>
                        <span>Not open</span>
                      </Link>
                    }
                  >
                    <ClosedEventStatus
                      compId={comp.igCompId}
                      entries={comp.entrants.length}
                    />
                  </Protect>
                )}

                {/* </Link> */}
                {/* <Switch 
                        id={`entryswitch-${comp.igCompId}`} 
                        checked={comp.entrants.filter((entrant) => entrant.entrantId === user.id).length === 1} 
                        // {!comp.open ? "disabled" : ""}
                      /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
      </Table>
    </LibCardNarrow>
  );
}
