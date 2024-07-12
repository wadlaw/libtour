import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { MainNav } from "./MainNav";
import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { Suspense } from "react";

export async function PageHeader() {
  return (
    <div className="mx-auto flex max-w-screen-xl items-center justify-between">
      <div className="sm:hidden">
        <MobileNav />
      </div>
      <Suspense fallback={<h1 className="pr-1 text-4xl">Libtour</h1>}>
        <Link className="px-2 xl:px-0" href="/">
          <div className="flex">
            <Image
              src="/lib_l_black_crop.png"
              alt="Libtour badge"
              height="36"
              width="24"
            />
            <h1 className="pr-1 text-4xl">ibtour</h1>
          </div>
        </Link>
      </Suspense>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <MainNav />
        </div>
        <div className="px-2">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
