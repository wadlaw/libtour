import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { Protect } from "@clerk/nextjs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import WildcardEntry from "./wildcard-entry";
import { EnterSomeoneButton } from "./enter-button";
import { WithdrawSomeoneButton } from "./withdraw-button";
import { EntrantDisplay, LibCardNarrow, TeamDisplay } from "./lib-elements";
import { ensure } from "~/lib/utils";
import { Link } from "next-view-transitions";

type EventEntrantsProps = {
  compId: string;
  isOpen: boolean;
};

export default async function EventEntrants({
  compId,
  isOpen,
}: EventEntrantsProps) {
  const { sessionClaims } = auth();
  const entrants = await api.comp.getEntrants({ comp: compId });
  const teams = await api.team.getAll();

  if (!entrants) return <p>No results</p>;
  if (entrants.length == 0)
    return (
      <div className="flex flex-col items-center py-4 ">
        {isOpen ? (
          <Protect fallback="No entries yet!">
            No entries yet...be the first?
          </Protect>
        ) : (
          "Event not open to enter just yet"
        )}
      </div>
    );
  return (
    <LibCardNarrow title="Entrants">
      <Table>
        {/* <TableCaption>Event Entrants</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="px-1 @2xl/libcard:px-2">Name</TableHead>
            {/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */}
            <TableHead
              className={`${(sessionClaims?.metadata.captain || sessionClaims?.metadata.entryPermission) && "hidden"} px-2 @2xl/libcard:table-cell @2xl/libcard:px-4`}
            >
              Team
            </TableHead>
            {/* eslint-enable @typescript-eslint/prefer-nullish-coalescing */}
            <Protect
              condition={() =>
                !!sessionClaims?.metadata?.captain ||
                !!sessionClaims?.metadata?.entryPermission
              }
            >
              {isOpen ? (
                <TableHead className="px-1 @2xl/libcard:px-2">
                  Wildcard
                </TableHead>
              ) : null}
            </Protect>
            <Protect
              condition={() =>
                !!sessionClaims?.metadata?.captain ||
                !!sessionClaims?.metadata?.entryPermission
              }
            >
              {isOpen ? (
                <TableHead className="px-1 @2xl/libcard:px-2">
                  Withdraw?
                </TableHead>
              ) : null}
            </Protect>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entrants.map((entrant) => (
            <TableRow key={entrant.entrantId}>
              <TableCell className="px-1 font-medium @2xl/libcard:px-2">
                <EntrantDisplay
                  entrant={{
                    id: entrant.entrantId,
                    name: entrant.entrant.name,
                    wildcard: !!entrant.wildcard,
                  }}
                />
                {/* <Link href={`/entrants/${entrant.entrantId}`}>
                    <span className="mr-1 sm:mr-2">{entrant.entrant.name}</span>
                    {entrant.wildcard ? <Badge>WC</Badge> : null}
                  </Link> */}
              </TableCell>
              {/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */}
              <TableCell
                className={`${(sessionClaims?.metadata.captain || sessionClaims?.metadata.entryPermission) && "hidden"} px-1 @2xl/libcard:table-cell @2xl/libcard:px-2`}
              >
                {/* eslint-enable @typescript-eslint/prefer-nullish-coalescing */}
                <TeamDisplay
                  team={ensure(
                    teams.filter(
                      (team) => team.id == entrant.entrant.teamId,
                    )[0],
                  )}
                  alwaysDisplayLogo={true}
                />
              </TableCell>
              <Protect
                condition={() =>
                  !!sessionClaims?.metadata?.captain ||
                  !!sessionClaims?.metadata?.entryPermission
                }
              >
                {isOpen ? (
                  <TableCell className="px-1 @2xl/libcard:px-2">
                    <Protect
                      condition={() =>
                        (!!sessionClaims?.metadata?.captain &&
                          sessionClaims?.metadata?.teamId ===
                            entrant.entrant.teamId) ||
                        !!sessionClaims?.metadata?.entryPermission
                      }
                    >
                      <WildcardEntry
                        compId={compId}
                        wildcard={entrant.wildcard}
                        entrantId={entrant.entrantId}
                      />
                    </Protect>
                  </TableCell>
                ) : null}
              </Protect>
              <Protect
                condition={() =>
                  !!sessionClaims?.metadata?.captain ||
                  !!sessionClaims?.metadata?.entryPermission
                }
              >
                {isOpen ? (
                  <TableCell className="px-1 @2xl/libcard:px-2">
                    <Protect
                      condition={() =>
                        (!!sessionClaims?.metadata?.captain &&
                          sessionClaims?.metadata?.teamId ===
                            entrant.entrant.teamId) ||
                        !!sessionClaims?.metadata?.entryPermission
                      }
                    >
                      <WithdrawSomeoneButton
                        compId={compId}
                        entrantId={entrant.entrantId}
                      />
                    </Protect>
                  </TableCell>
                ) : null}
              </Protect>
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

export async function EventNonEntrants({ compId, isOpen }: EventEntrantsProps) {
  const { sessionClaims } = auth();
  const nonEntrants = await api.comp.getNonEntrants({ comp: compId });
  const teams = await api.team.getAll();

  if (!nonEntrants) return <p>No results</p>;
  if (nonEntrants.length == 0) {
    console.log("nonEntrants===================", nonEntrants);
    return (
      <div className="py-4">
        {isOpen
          ? `No entrants yet...be the first?`
          : `Event not open to enter just yet`}
      </div>
    );
  }

  return (
    // <div className="@7xl/main:mx-0 @2xl/main:mx-2 @2xl/main:mb-2 @2xl/main:w-[calc(100vw-16px)] @7xl/main:mb-4 @7xl/main:w-[min(100vw,1280px)] mx-1 mb-1 grid w-[calc(100vw-8px)] grid-cols-1">
    <LibCardNarrow title="Not Entered">
      <Table>
        <TableCaption>Event Non Entrants</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Team</TableHead>
            <Protect
              condition={() =>
                !!sessionClaims?.metadata?.captain ||
                !!sessionClaims?.metadata?.entryPermission
              }
            >
              {isOpen ? <TableHead>Enter?</TableHead> : null}
            </Protect>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nonEntrants.map((entrant) => (
            <TableRow key={entrant.id}>
              <TableCell className="font-medium">
                <EntrantDisplay
                  entrant={{ id: entrant.id, name: entrant.name }}
                />
                {/* {`${entrant.name}`} */}
              </TableCell>
              <TableCell>
                <TeamDisplay
                  team={ensure(
                    teams.filter((team) => team.id == entrant.teamId)[0],
                  )}
                />
              </TableCell>
              <Protect
                condition={() =>
                  !!sessionClaims?.metadata?.captain ||
                  !!sessionClaims?.metadata?.entryPermission
                }
              >
                {isOpen ? (
                  <TableCell>
                    <Protect
                      condition={() =>
                        (!!sessionClaims?.metadata?.captain &&
                          entrant.teamId === sessionClaims?.metadata?.teamId) ||
                        !!sessionClaims?.metadata?.entryPermission
                      }
                    >
                      <EnterSomeoneButton
                        compId={compId}
                        entrantId={entrant.id}
                      />
                    </Protect>
                  </TableCell>
                ) : null}
              </Protect>
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
    // </div>
  );
}

type EntrantCountProps = {
  compId: string;
};

export async function EntrantCount({ compId }: EntrantCountProps) {
  const entrantCount = await api.comp.entrantCount({ comp: compId });
  return (
    <EntrantCountDisplay
      entries={entrantCount?._count.entrants ?? 0}
      href={`/events/${compId}`}
    />
  );
}

type EntrantCountDisplayProps = {
  entries: number;
  href: string;
};

export function EntrantCountDisplay({
  entries,
  href,
}: EntrantCountDisplayProps) {
  return (
    <Link href={href}>
      <span>{`${entries} ${entries === 1 ? "entry" : "entries"}`}</span>
    </Link>
  );
}

type ClosedEventStatusProps = {
  compId: string;
  entries: number;
};

export async function ClosedEventStatus({
  compId,
  entries,
}: ClosedEventStatusProps) {
  const entered = await api.comp.isEntered({ comp: compId });

  if (entered) {
    return (
      <Link href={`/events/${compId}`}>
        <span>Entered!</span>
      </Link>
    );
  }

  if (entries === 0) {
    return (
      <Link href={`/events/${compId}`}>
        <span>Not open</span>
      </Link>
    );
  }

  return <EntrantCountDisplay entries={entries} href={`/events/${compId}`} />;
}
