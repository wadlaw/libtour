import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function LibMain(props: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-41px)] max-w-screen-xl flex-col items-center items-stretch justify-evenly pb-1 pt-4 sm:pb-2 xl:pb-4">
      {props.children}
    </main>
  );
}

export function LibH1(props: { children: React.ReactNode }) {
  return (
    // <h1 className="text-[3rem] font-extrabold tracking-tight text-[hsl(280,100%,70%)]">
    <h1 className="bg-gradient-to-r from-blue-800  to-red-800 bg-clip-text text-center text-[3rem] font-extrabold leading-tight tracking-tight text-transparent">
      {props.children}
    </h1>
  );
}

type TeamDisplayProps = {
  team: { id: string; linkName: string; teamName: string };
  alwaysDisplayLogo?: boolean;
};

export function TeamDisplay({
  team,
  alwaysDisplayLogo = false,
}: TeamDisplayProps) {
  if (!team) return null;
  return (
    <Link href={`/teams/${team.linkName}`}>
      <div className="flex items-center justify-start">
        <div
          className={`mr-2 ${!alwaysDisplayLogo && "hidden"} overflow-hidden rounded-full sm:block`}
        >
          <Image
            src={`/${team.linkName}.png`}
            width={30}
            height={30}
            alt="Team Logo"
          ></Image>
        </div>
        <div>{team.teamName}</div>
      </div>
    </Link>
  );
}
type LibCardProps = {
  title?: string;
  children: React.ReactNode;
};

export function LibCard({ title, children }: LibCardProps) {
  return (
    <Card>
      <CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function LibCardNarrow({ title, children }: LibCardProps) {
  return (
    <Card>
      <CardHeader className="px-2 sm:px-6">
        {title && <CardTitle>{title}</CardTitle>}
      </CardHeader>
      <CardContent className="px-2 sm:px-6">{children}</CardContent>
    </Card>
  );
}
type LibCardContainerProps = {
  splitAtLargeSizes?: boolean;
  children: React.ReactNode;
};

export function LibCardContainer({
  splitAtLargeSizes,
  children,
}: LibCardContainerProps) {
  return (
    <div
      className={`mx-1 mt-4 grid grid-cols-1 gap-1 sm:mx-2 sm:gap-2 ${splitAtLargeSizes && "lg:grid-cols-2"} xl:mx-0  xl:gap-4`}
    >
      {children}
    </div>
  );
}
