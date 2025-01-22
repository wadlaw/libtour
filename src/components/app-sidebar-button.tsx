"use client";
import { PiggyBank } from "lucide-react";
// import Link from "next/link";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Balance from "~/app/_components/balance";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
  useSidebar,
} from "~/components/ui/sidebar";

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

export function MyAccountButton() {
  const path = usePathname();
  const { setOpenMobile } = useSidebar();
  //   console.log("Path", path, "URL", url);
  return (
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
  );
}
