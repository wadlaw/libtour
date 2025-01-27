"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "~/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Protect, useUser } from "@clerk/nextjs";

const standings: { title: string; href: string; description: string }[] = [
  {
    title: "Teams",
    href: "/teams",
    description: "View the current Team league table",
  },
  {
    title: "Eclectic",
    href: "/eclectic",
    description: "Leaderboard of the best gross and net scores on each hole",
  },
  {
    title: "Hall of Fame",
    href: "/halloffame",
    description: "Highlighting some of the best golf in this year's Libtour",
  },
  {
    title: "Honours Boards",
    href: "/honoursboards",
    description: "Gallery of Libtour winners and losers",
  },
];

export function DropdownMenuNav() {
  const { user } = useUser();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/events" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Events
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Standings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {standings.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <Protect
          condition={() =>
            !!user?.publicMetadata?.financePermission &&
            !user?.publicMetadata?.adminPermission
          }
        >
          <NavigationMenuItem>
            <Link href="/accounts" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Accounts
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </Protect>
        <Protect
          condition={() =>
            !!user?.publicMetadata?.adminPermission &&
            !user?.publicMetadata?.financePermission
          }
        >
          <NavigationMenuItem>
            <Link href="/users" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                User Admin
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </Protect>
        <Protect
          condition={() =>
            !!user?.publicMetadata?.financePermission &&
            !!user?.publicMetadata?.adminPermission
          }
        >
          <NavigationMenuItem>
            <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                <ListItem key="accounts" title="Accounts" href="/accounts">
                  User account and transaction maintenance
                </ListItem>
                <ListItem key="users" title="User Admin" href="/users">
                  User account mapping
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </Protect>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

{
  /* <Protect condition={() => !!sessionClaims?.metadata?.financePermission}>
          <li
            className={`${sessionClaims?.metadata.adminPermission ? "mr-2 md:mr-4" : "mr-4"} inline`}
          >
            <Link href="/accounts">Accounts</Link>
          </li>
        </Protect>
        <Protect condition={() => !!sessionClaims?.metadata?.adminPermission}>
          <li
            className={`${sessionClaims?.metadata.adminPermission ? "mr-2 md:mr-4" : "mr-4"} inline`}
          >
            <Link href="/users">User Admin</Link>
          </li>
        </Protect> */
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
