import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { MobileBalance } from "~/app/_components/balance";
import { Protect } from "@clerk/nextjs";

export function MobileNav() {
  const { sessionClaims } = auth();

  return (
    <Sheet>
      <SheetTrigger className="px-3 py-1">
        <svg
          className="block h-4 w-4 fill-current"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Mobile menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="mb-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mb-4 text-2xl">
          <SheetClose asChild>
            <Link href="/">Home</Link>
          </SheetClose>
        </div>
        <div className="mb-4 text-2xl">
          <SheetClose asChild>
            <Link href="/events">Events</Link>
          </SheetClose>
        </div>

        <div className="mb-4 text-2xl">
          <SheetClose asChild>
            <Link href="/teams">Teams</Link>
          </SheetClose>
        </div>
        <Protect condition={() => !!sessionClaims?.metadata?.financePermission}>
          <div className="mb-4 text-2xl">
            <SheetClose asChild>
              <Link href="/accounts">Accounts</Link>
            </SheetClose>
          </div>
        </Protect>

        <Protect condition={() => !!sessionClaims?.metadata?.adminPermission}>
          <div className="mb-4 text-2xl">
            <SheetClose asChild>
              <Link href="/users">User Admin</Link>
            </SheetClose>
          </div>
        </Protect>

        <Protect>
          <div className="mb-4 text-2xl">
            <SheetClose asChild>
              <Link href="/account">
                <MobileBalance />
              </Link>
            </SheetClose>
          </div>
        </Protect>
      </SheetContent>
    </Sheet>
  );
}
