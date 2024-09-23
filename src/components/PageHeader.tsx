import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { MainNav } from "./MainNav";
import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ModeToggle, ThemedLogo } from "~/app/_components/theme";
import { DropdownMenu } from "./DropdownMenu";

export async function PageHeader() {
  return (
    <div className="mx-auto flex max-w-screen-xl items-center justify-between">
      <div className="sm:hidden">
        <MobileNav />
      </div>

      <Link className="px-2 xl:px-0" href="/">
        <ThemedLogo />
      </Link>
      <nav className="hidden sm:inline-block lg:hidden">
        <DropdownMenu />
      </nav>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <MainNav />
        </div>
        <div className="hidden sm:block">
          <ModeToggle />
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
