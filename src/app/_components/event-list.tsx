import Link from "next/link";
import { api } from "~/trpc/server";
import { Protect } from "@clerk/nextjs";

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

export async function EventListTable() {
  const comps = await api.comp.getAll();
  // const user = await api.user.loggedInUser();

  if (!comps) return null;
  return <EventListDisplay comps={comps} title="Lib Events" />;
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
  }>;
  title?: string;
  lastHeaderText?: string;
};

function EventListDisplay({
  comps,
  title,
  lastHeaderText = "",
}: EventListDisplayProps) {
  return (
    <LibCardNarrow title={title} url="/events">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=" px-1 sm:px-2">Event</TableHead>
            <TableHead className="hidden px-1 sm:table-cell sm:px-2">
              Format
            </TableHead>
            <TableHead className="px-1 sm:px-2">Date</TableHead>
            <TableHead className="px-1 sm:px-2">{lastHeaderText}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comps.map((comp) => (
            <TableRow key={comp.igCompId}>
              <TableCell className="px-1 font-medium sm:px-2">
                <Link href={`/events/${comp.shortName}`}>{comp.name}</Link>
              </TableCell>
              <TableCell className="hidden px-1 sm:table-cell sm:px-2">
                <Link href={`/events/${comp.shortName}`}>
                  {comp.stableford ? "Stableford" : "Medal"}
                </Link>
              </TableCell>
              <TableCell className="px-1 sm:px-2">
                <Link href={`/events/${comp.shortName}`}>
                  {new Date(comp.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </Link>
              </TableCell>
              <TableCell className="px-1 sm:px-2">
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
                      <EntrantCountDisplay entries={comp.entrants.length} />
                    }
                  >
                    <EnterWithdraw
                      compId={comp.igCompId}
                      compName={comp.name}
                    />
                  </Protect>
                ) : (
                  <Protect fallback={<span>Not open</span>}>
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
