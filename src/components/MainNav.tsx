"use server";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import Balance from "~/app/_components/balance";
import { Protect } from "@clerk/nextjs";

export async function MainNav() {
  // const path = usePathname();
  const { sessionClaims } = auth();

  return (
    <nav>
      <ul
        className={`inline-block ${sessionClaims?.metadata.adminPermission ? "text-sm md:text-base" : ""}`}
      >
        <li
          className={`${sessionClaims?.metadata.adminPermission ? "mr-2 md:mr-4" : "mr-4"} inline`}
        >
          <Link href="/">Home</Link>
        </li>
        <li
          className={`${sessionClaims?.metadata.adminPermission ? "mr-2 md:mr-4" : "mr-4"} inline`}
        >
          <Link href="/events">Events</Link>
        </li>
        <li
          className={`${sessionClaims?.metadata.adminPermission ? "mr-2 md:mr-4" : "mr-4"} inline`}
        >
          <Link href="/teams">Teams</Link>
        </li>
        <li
          className={`${sessionClaims?.metadata.adminPermission ? "mr-2 md:mr-4" : "mr-4"} inline`}
        >
          <Link href="/halloffame">Hall of Fame</Link>
        </li>
        <Protect condition={() => !!sessionClaims?.metadata?.financePermission}>
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
        </Protect>
        <Protect>
          <Link href="/account">
            <Balance />
          </Link>
        </Protect>
      </ul>
    </nav>
  );
}
