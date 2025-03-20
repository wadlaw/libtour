import { api } from "~/trpc/server";
import { SignInButton, SignedOut, currentUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  Calendar,
  CalendarCheck,
  CalendarCog,
  Home,
  Medal,
  Trophy,
  UserRoundCog,
  // NotebookTabs,
  UsersRound,
  BadgePoundSterling,
  PoundSterling,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarHeader,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import {
  MenuItem,
  MenuSubItem,
  MyFooter,
  UserDropdown,
} from "./app-sidebar-button";
import { Protect } from "@clerk/nextjs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

// Menu items.
const items = [
  {
    title: "Prizewinners",
    url: "/prizewinners",
    icon: <PoundSterling />,
  },
  // {
  //   title: "Eclectic",
  //   url: "/eclectic",
  //   icon: <NotebookTabs />,
  // },
  {
    title: "Hall of Fame",
    url: "/halloffame",
    icon: <Medal />,
  },
  {
    title: "Honours Boards",
    url: "/honoursboards",
    icon: <Trophy />,
  },
];

export async function AppSidebar() {
  const user = await currentUser();
  const entrant = user ? await api.entrant.getMe() : null;
  const { sessionClaims } = auth();
  // const router = useRouter();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SignedOut>
          <SidebarMenu className="hidden md:flex">
            <SignInButton />
          </SidebarMenu>
        </SignedOut>
        <SidebarMenu className="hidden md:flex">
          <Protect>
            <UserDropdown
              entrantId={entrant?.id ?? 0}
              teamName={entrant?.team.teamName ?? ""}
              teamLinkName={entrant?.team.linkName ?? ""}
              avatar={entrant?.user?.avatarUrl ?? ""}
              firstName={entrant?.user?.firstName ?? ""}
              surname={entrant?.user?.surname ?? ""}
              email={entrant?.user?.email ?? ""}
            />
          </Protect>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItem
                key="home"
                item={{ title: "Home", url: "/", icon: <Home /> }}
              />

              <UpcomingEvents />
              <Results />
              <TeamsTable />
              {items.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Protect
          condition={() =>
            !!sessionClaims?.metadata?.adminPermission ||
            !!sessionClaims?.metadata?.financePermission
          }
        >
          <AdminMenu />
        </Protect>
      </SidebarContent>
      <SidebarSeparator className="hidden md:block" />

      <Protect>
        <MyFooter
          entrantId={entrant?.id ?? 0}
          teamName={entrant?.team.teamName ?? ""}
          teamLinkName={entrant?.team.linkName ?? ""}
        />
      </Protect>
    </Sidebar>
  );
}
function AdminMenu() {
  const { sessionClaims } = auth();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Protect
            condition={() =>
              !!sessionClaims?.metadata?.adminPermission ||
              !!sessionClaims?.metadata?.financePermission
            }
          >
            <MenuItem
              key="Accounts"
              item={{
                title: "Accounts",
                url: "/accounts",
                icon: <BadgePoundSterling />,
              }}
            />
          </Protect>
          <Protect condition={() => !!sessionClaims?.metadata.adminPermission}>
            <MenuItem
              key="Entrant Admin"
              item={{
                title: "Entrant Admin",
                url: "/admin/entrants",
                icon: <UserRoundCog />,
              }}
            />
          </Protect>
          {/* <Protect condition={() => !!sessionClaims?.metadata.adminPermission}>
            <MenuItem
              key="User Admin"
              item={{
                title: "User Admin",
                url: "/users",
                icon: <UserRoundCog />,
              }}
            />
          </Protect> */}
          <Protect condition={() => !!sessionClaims?.metadata.adminPermission}>
            <MenuItem
              key="Event Admin"
              item={{
                title: "Event Admin",
                url: "/admin/events",
                icon: <CalendarCog />,
              }}
            />
          </Protect>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
async function TeamsTable() {
  const teams = await api.team.getAllWithPoints();
  const reducedTeams: typeof teams = [];
  teams.forEach((team) => {
    reducedTeams.push({
      ...team,
      points: team.teamPoints.reduce((acc, cur) => acc + cur.points, 0),
    });
  });
  const sortedTeams = reducedTeams.sort((a, b) => b.points - a.points);
  if (!teams) return null;

  return (
    <Collapsible className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <UsersRound />
            <span>Teams</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <MenuSubItem key="standings" url="/teams" title="Standings" />

            {sortedTeams.map((team) => {
              return (
                <MenuSubItem
                  key={team.id}
                  url={`/teams/${team.linkName}`}
                  title={team.teamName}
                  secondaryTitle={team.points.toString()}
                />
                //   <Link href={`/teams/${team.linkName}`}>
                //     <div className="flex w-full justify-between">
                //       <span>{team.teamName}</span>
                //       <span>{team.points}</span>
                //     </div>
                //   </Link>
                // </MenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

type EventsProps = {
  events: {
    igCompId: string;
    shortName: string;
    name: string;
  }[];
  title: string;
  upcoming: boolean;
};

function EventsCollapsible({ events, title, upcoming }: EventsProps) {
  if (events.length === 0) return null;

  return (
    <Collapsible className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {upcoming ? <Calendar /> : <CalendarCheck />}
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {events.map((comp) => {
              return (
                <MenuSubItem
                  key={comp.igCompId}
                  url={`/events/${comp.shortName}`}
                  altUrl={`/events/${comp.igCompId}`}
                  title={comp.name}
                >
                  {/* <Link href={`/events/${comp.shortName}`}>
                    <span>{comp.name}</span>
                  </Link> */}
                </MenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

async function UpcomingEvents() {
  const upcoming = await api.comp.getAllUpcoming();

  if (upcoming.length === 0) return null;

  return (
    <EventsCollapsible
      title="Upcoming Events"
      events={upcoming}
      upcoming={true}
    />
  );
}

async function Results() {
  const results = await api.comp.getAllCompleted();

  if (results.length === 0) return null;

  return (
    <EventsCollapsible title="Results" events={results} upcoming={false} />
  );
}
