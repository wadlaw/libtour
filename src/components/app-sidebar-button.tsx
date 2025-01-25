"use client";
import { useClerk } from "@clerk/nextjs";
import {
  PiggyBank,
  FileUser,
  UsersRound,
  ChevronsUpDown,
  LogOut,
  UserRoundPen,
} from "lucide-react";
// import Link from "next/link";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Balance from "~/app/_components/balance";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
  useSidebar,
  SidebarFooter,
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type MenuItemProps = {
  key: string;
  item: {
    title: string;
    url: string;
    icon: JSX.Element;
  };
};

export function MenuItem({ key, item }: MenuItemProps) {
  const path = usePathname();
  const { setOpenMobile } = useSidebar();
  //   console.log("Path", path, "URL", url);
  return (
    <SidebarMenuItem key={key}>
      <SidebarMenuButton asChild isActive={item.url === path}>
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

type MenuSubItemProps = {
  key: string;
  title: string;
  secondaryTitle?: string;
  url: string;
  altUrl?: string;
};

export function MenuSubItem({
  key,
  title,
  secondaryTitle,
  url,
  altUrl = "",
}: MenuSubItemProps) {
  const path = usePathname();
  const { setOpenMobile } = useSidebar();

  // console.log("Path", path, "URL", url);
  return (
    <SidebarMenuSubItem key={key}>
      <SidebarMenuSubButton asChild isActive={url === path || altUrl === path}>
        <Link href={url} onClick={() => setOpenMobile(false)}>
          {secondaryTitle ? (
            <div className="flex w-full justify-between">
              <span>{title}</span>
              <span>{secondaryTitle}</span>
            </div>
          ) : (
            <span>{title}</span>
          )}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

type MyMenuProps = {
  entrantId: number;
  teamName: string;
  teamLinkName: string;
};

export function MyMenu({ entrantId, teamName, teamLinkName }: MyMenuProps) {
  const path = usePathname();
  const { setOpenMobile } = useSidebar();

  //   console.log("Path", path, "URL", url);
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={path === `/entrants/${entrantId}`}
          >
            <Link
              href={`/entrants/${entrantId}`}
              onClick={() => setOpenMobile(false)}
            >
              <FileUser />
              My Results
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={path === `/teams/${teamLinkName}`}
          >
            <Link
              href={`/teams/${teamLinkName}`}
              onClick={() => setOpenMobile(false)}
            >
              <UsersRound />
              {teamName} Results
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={path === "/account"}>
            <Link href="/account" onClick={() => setOpenMobile(false)}>
              <PiggyBank />
              My Account
            </Link>
          </SidebarMenuButton>
          <SidebarMenuBadge className="text-sm">
            <Balance />
          </SidebarMenuBadge>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

export function MyFooter({ entrantId, teamName, teamLinkName }: MyMenuProps) {
  const path = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={path === `/entrants/${entrantId}`}
          >
            <Link
              href={`/entrants/${entrantId}`}
              onClick={() => setOpenMobile(false)}
            >
              <FileUser />
              My Results
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={path === `/teams/${teamLinkName}`}
          >
            <Link
              href={`/teams/${teamLinkName}`}
              onClick={() => setOpenMobile(false)}
            >
              <UsersRound />
              {teamName} Results
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={path === "/account"}>
            <Link href="/account" onClick={() => setOpenMobile(false)}>
              <PiggyBank />
              My Account
            </Link>
          </SidebarMenuButton>
          <SidebarMenuBadge className="text-sm">
            <Balance />
          </SidebarMenuBadge>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

type UserDropdownProps = {
  entrantId: number;
  teamName: string;
  email: string;
  teamLinkName: string;
  avatar: string;
  firstName: string;
  surname: string;
};

export function UserDropdown({
  entrantId,
  teamName,
  email,
  teamLinkName,
  avatar,
  firstName,
  surname,
}: UserDropdownProps) {
  const { setOpenMobile } = useSidebar();
  const clerk = useClerk();

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={avatar} alt={`${firstName} ${surname}`} />
              <AvatarFallback className="rounded-full">
                {firstName?.substring(0, 1)}
                {surname?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{`${firstName} ${surname}`}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="right"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={avatar} alt={`${firstName} ${surname}`} />
                <AvatarFallback className="rounded-full">
                  {firstName?.substring(0, 1)}
                  {surname?.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{`${firstName} ${surname}`}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/account" onClick={() => setOpenMobile(false)}>
              <DropdownMenuItem>
                <PiggyBank size={16} />
                My Account
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link
              href={`/entrants/${entrantId}`}
              onClick={() => setOpenMobile(false)}
            >
              <DropdownMenuItem>
                <FileUser size={16} />
                My Results
              </DropdownMenuItem>
            </Link>

            <Link
              href={`/teams/${teamLinkName}`}
              onClick={() => setOpenMobile(false)}
            >
              <DropdownMenuItem>
                <UsersRound size={16} />
                {`${teamName} Results`}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => clerk.openUserProfile()}>
              <UserRoundPen size={16} />
              Manage Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => clerk.signOut()}>
              <LogOut size={16} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
