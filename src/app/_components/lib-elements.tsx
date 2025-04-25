import Image from "next/image";
import { Link } from "next-view-transitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
// import IdentityIcon from "./identicons";
import { Badge } from "~/components/ui/badge";
import { CollapsibleTrigger } from "~/components/ui/collapsible";
import GradientText from "./gradient-text";
const libColours = ["#8360c3", "#2ebf91", "#8360c3"];
const libSadColours = ["#1e130c", "#9a8478", "#1e130c"];

export default function LibMain(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100%-41px)] w-full max-w-screen-2xl flex-col items-stretch justify-evenly pb-1 pt-4 @container/main sm:pb-2 xl:pb-4">
      {/* <main className="mx-auto flex min-h-[calc(100vh-41px)] w-full max-w-screen-xl flex-col items-stretch justify-evenly pb-1 pt-4 sm:pb-2 xl:pb-4"> */}
      {props.children}
    </div>
  );
}

export function LibMainFixed(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100%-41px)] w-full max-w-screen-2xl flex-col items-stretch justify-start gap-8 pb-1 pt-4 @container/main sm:pb-2 xl:pb-4">
      {/* <main className="mx-auto flex min-h-[calc(100vh-41px)] w-full max-w-screen-xl flex-col items-stretch justify-evenly pb-1 pt-4 sm:pb-2 xl:pb-4"> */}
      {props.children}
    </div>
  );
}

export function LibH1(props: { children: React.ReactNode }) {
  return (
    // <h1 className="text-[3rem] font-extrabold tracking-tight text-[hsl(280,100%,70%)]">
    // <h1 className="title bg-gradient-to-r from-blue-700  to-red-700 bg-clip-text text-center  text-[3rem] font-extrabold leading-tight tracking-tight text-transparent">
    //   {props.children}
    // </h1>
    <GradientText
      showBorder={false}
      colors={libColours}
      className="title text-center text-[3rem] font-extrabold leading-tight tracking-tight"
    >
      {props.children}
    </GradientText>
  );
}

export function LibSadH1(props: { children: React.ReactNode }) {
  return (
    // <h1 className="text-[3rem] font-extrabold tracking-tight text-[hsl(280,100%,70%)]">
    // <h1 className="title bg-gradient-to-r from-[#1e130c] to-[#9a8478] bg-clip-text text-center  text-[3rem] font-extrabold leading-tight tracking-tight text-transparent">
    <GradientText
      showBorder={false}
      colors={libSadColours}
      className="title text-center text-[3rem] font-extrabold leading-tight tracking-tight"
    >
      {props.children}
    </GradientText>
    // </h1>
  );
}

export function LibBanner(props: { children: React.ReactNode }) {
  return (
    // <h1 className="text-[3rem] font-extrabold tracking-tight text-[hsl(280,100%,70%)]">
    <GradientText
      showBorder={false}
      colors={libColours}
      className="text-center   font-extrabold"
    >
      {props.children}
    </GradientText>
  );
}

type TeamDisplayProps = {
  team: { id: string; linkName: string; teamName: string };
  alwaysDisplayLogo?: boolean;
  iconOnlyWhenSmall?: boolean;
  addTransitionName?: boolean;
};

type TeamDisplayCollapsibleProps = {
  team: { id: string; linkName: string; teamName: string };
  // alwaysDisplayLogo?: boolean;
  // iconOnlyWhenSmall?: boolean;
};

export function TeamDisplay({
  team,
  alwaysDisplayLogo = false,
  iconOnlyWhenSmall = false,
  addTransitionName = false,
}: TeamDisplayProps) {
  if (!team) return null;
  return (
    <Link href={`/teams/${team.linkName}`}>
      <div className="flex items-center justify-start">
        <div
          className={`${iconOnlyWhenSmall ? "@2xl/libcard:mr-2" : "mr-2"} ${!alwaysDisplayLogo && "hidden"} overflow-hidden rounded-full @2xl/libcard:block ${addTransitionName ? team.linkName : ""}`}
        >
          <Image
            src={`/${team.linkName}.png`}
            width={30}
            height={30}
            alt={`${team.teamName} Team Logo`}
          ></Image>
        </div>
        <div className={`${iconOnlyWhenSmall && "hidden"} @2xl/libcard:block`}>
          {team.teamName}
        </div>
      </div>
    </Link>
  );
}

export function TeamDisplayCollapsible({ team }: TeamDisplayCollapsibleProps) {
  if (!team) return null;
  return (
    <div className="flex items-center justify-start">
      <div className={`mr-2 overflow-hidden rounded-full`}>
        <CollapsibleTrigger asChild>
          <Image
            className="hover:cursor-pointer"
            src={`/${team.linkName}.png`}
            width={30}
            height={30}
            alt={`${team.teamName} Team Logo`}
          ></Image>
        </CollapsibleTrigger>
      </div>
      <CollapsibleTrigger asChild>
        <div className="hover:cursor-pointer">{team.teamName}</div>
      </CollapsibleTrigger>
    </div>
  );
}

type EntrantDisplayProps = {
  entrant: {
    id: number;
    name: string;
    handicap?: number;
    wildcard?: boolean;
    score?: string;
  };
  alwaysDisplayLogo?: boolean;
  iconOnlyWhenSmall?: boolean;
  linkUrl?: string;
};

export function EntrantDisplay({
  entrant,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alwaysDisplayLogo = false,
  iconOnlyWhenSmall = false,
  linkUrl = "/entrants/",
}: EntrantDisplayProps) {
  if (!entrant) return null;
  return (
    <Link href={`${linkUrl}${entrant.id}`}>
      <div className="flex items-center justify-start">
        {/* <div
          className={`${iconOnlyWhenSmall ? "sm:mr-2" : "mr-2"} ${!alwaysDisplayLogo && "hidden"} overflow-hidden rounded-full sm:block`}
        >
          <IdentityIcon username={entrant.name} width={30} />
        </div> */}

        <div className={`${iconOnlyWhenSmall && "hidden"} @2xl/libcard:block`}>
          <span className="mr-1 @2xl/libcard:mr-2">
            {entrant.name}
            {!!entrant.handicap ? ` (${entrant.handicap})` : ""}
            {!!entrant.score ? ` (${entrant.score})` : ""}
          </span>
          {!!entrant.wildcard ? <Badge>WC</Badge> : null}
        </div>
      </div>
    </Link>
  );
}

type LibCardProps = {
  title?: string;
  subHeading?: string;
  url?: string;
  transitionClass?: string;
  children: React.ReactNode;
};

type ScoreDisplayProps = {
  stableford?: boolean;
  score?: number;
  NR?: boolean;
  displayOption?: "ScoreOnly" | "OverUnder" | "Both" | "Smart";
  collapsibleTrigger?: boolean;
};

type OptionalTriggerProps = {
  addTrigger?: boolean;
  children: React.ReactNode;
};

function OptionalTrigger({ addTrigger, children }: OptionalTriggerProps) {
  if (!addTrigger) return <>{children}</>;
  return <CollapsibleTrigger>{children}</CollapsibleTrigger>;
}

export function ScoreDisplay({
  stableford = false,
  score = 0,
  NR = false,
  displayOption = "Smart",
  collapsibleTrigger = false,
}: ScoreDisplayProps) {
  const overUnder = stableford ? 36 - score : score - 72;
  if (NR)
    return (
      <OptionalTrigger addTrigger={collapsibleTrigger}>{"NR"}</OptionalTrigger>
    );

  return (
    <>
      {displayOption === "ScoreOnly" &&
        (collapsibleTrigger ? (
          <CollapsibleTrigger>
            <span className={`${overUnder < 0 ? "text-red-500" : ""}`}>
              {score}
            </span>
          </CollapsibleTrigger>
        ) : (
          <span className={`${overUnder < 0 ? "text-red-500" : ""}`}>
            {score}
          </span>
        ))}
      {displayOption === "OverUnder" &&
        (collapsibleTrigger ? (
          <CollapsibleTrigger>
            <span
              className={`${overUnder < 0 ? "text-red-500" : ""}`}
            >{`${overUnder > 0 ? "+" : ""}${overUnder === 0 ? "E" : overUnder}`}</span>
          </CollapsibleTrigger>
        ) : (
          <span
            className={`${overUnder < 0 ? "text-red-500" : ""}`}
          >{`${overUnder > 0 ? "+" : ""}${overUnder === 0 ? "E" : overUnder}`}</span>
        ))}
      {displayOption === "Both" && (
        <>
          {collapsibleTrigger ? (
            <>
              <CollapsibleTrigger>
                <span className={`${overUnder < 0 ? "text-red-500" : ""} mr-1`}>
                  {score}
                </span>
              </CollapsibleTrigger>
              <CollapsibleTrigger>
                <span
                  className={`${overUnder < 0 ? "text-red-500" : ""}`}
                >{`(${overUnder > 0 ? "+" : ""}${overUnder === 0 ? "E" : overUnder})`}</span>
              </CollapsibleTrigger>
            </>
          ) : (
            <>
              <span className={`${overUnder < 0 ? "text-red-500" : ""} mr-1`}>
                {score}
              </span>
              <span
                className={`${overUnder < 0 ? "text-red-500" : ""}`}
              >{`(${overUnder > 0 ? "+" : ""}${overUnder === 0 ? "E" : overUnder})`}</span>
            </>
          )}
        </>
      )}
      {displayOption === "Smart" && (
        <>
          {collapsibleTrigger ? (
            <>
              <CollapsibleTrigger>
                <span
                  className={`${overUnder < 0 ? "text-red-500" : ""} sm:mr-1`}
                >
                  {score}
                </span>
              </CollapsibleTrigger>
              <CollapsibleTrigger>
                <span
                  className={`${overUnder < 0 ? "text-red-500" : ""} hidden sm:inline`}
                >{`(${overUnder > 0 ? "+" : ""}${overUnder === 0 ? "E" : overUnder})`}</span>
              </CollapsibleTrigger>
            </>
          ) : (
            <>
              <span
                className={`${overUnder < 0 ? "text-red-500" : ""} sm:mr-1`}
              >
                {score}
              </span>
              <span
                className={`${overUnder < 0 ? "text-red-500" : ""} hidden sm:inline`}
              >{`(${overUnder > 0 ? "+" : ""}${overUnder === 0 ? "E" : overUnder})`}</span>
            </>
          )}
        </>
      )}
    </>
  );
}

type TeamScoreDisplayProps = {
  stableford?: boolean;
  score?: number;
  NR?: boolean;
  displayOption?: "ScoreOnly" | "OverUnder" | "Both" | "Smart";
};

export function TeamScoreDisplay({
  stableford = false,
  score = 0,
  NR = false,
  displayOption = "Smart",
}: TeamScoreDisplayProps) {
  const overUnder = stableford ? 36 - score : score - 72;
  return (
    <>
      {NR && "NR"}
      {displayOption === "ScoreOnly" && (
        <span className={`${overUnder < 0 ? "text-red-500" : ""}`}>
          {score}
        </span>
      )}
      {displayOption === "OverUnder" && (
        <span
          className={`${overUnder < 0 ? "text-red-500" : ""}`}
        >{`${overUnder > 0 ? "+" : ""}${overUnder === 0 ? "E" : overUnder}`}</span>
      )}
      {displayOption === "Both" && (
        <>
          <span className={`${overUnder < 0 ? "text-red-500" : ""} mr-1`}>
            {score}
          </span>
          <span
            className={`${overUnder < 0 ? "text-red-500" : ""}`}
          >{`(${overUnder > 0 && "+"}${overUnder === 0 ? "E" : overUnder})`}</span>
        </>
      )}
      {displayOption === "Smart" && (
        <>
          <span className={`${overUnder < 0 ? "text-red-500" : ""} sm:mr-1`}>
            {score}
          </span>
          <span
            className={`${overUnder < 0 ? "text-red-500" : ""} hidden sm:inline`}
          >{`(${overUnder > 0 ? "+" : ""}${overUnder === 0 ? "E" : overUnder})`}</span>
        </>
      )}
    </>
  );
}

export function LibCard({
  title,
  subHeading,
  url,
  transitionClass = "",
  children,
}: LibCardProps) {
  return (
    <Card className={`@container/libcard ${transitionClass}`}>
      <CardHeader>
        {url ? (
          <Link href={url}>
            <CardTitle>{title}</CardTitle>
          </Link>
        ) : (
          title && <CardTitle>{title}</CardTitle>
        )}
        {subHeading && <CardDescription>{subHeading}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function LibCardNarrow({
  title,
  subHeading,
  url,
  transitionClass = "",
  children,
}: LibCardProps) {
  return (
    <Card className={`@container/libcard ${transitionClass}`}>
      <CardHeader className="px-2 @2xl/libcard:px-6">
        {url ? (
          <Link href={url}>
            <CardTitle>{title}</CardTitle>
          </Link>
        ) : (
          title && <CardTitle>{title}</CardTitle>
        )}
        {subHeading && <CardDescription>{subHeading}</CardDescription>}
      </CardHeader>
      <CardContent className="px-2 @2xl/libcard:px-6">{children}</CardContent>
    </Card>
  );
}
type LibCardContainerProps = {
  splitAtLargeSizes?: boolean;
  forceWidth?: boolean;
  children: React.ReactNode;
};

export function LibCardContainer({
  splitAtLargeSizes,
  forceWidth = false,
  children,
}: LibCardContainerProps) {
  return (
    <div
      className={`${forceWidth && "w-[calc(100%-theme(spacing.2))] @2xl/main:w-[calc(100%-theme(spacing.4))] @8xl/main:w-full"} mx-1 mt-4 grid grid-cols-1 gap-1 @2xl/main:mx-2 @2xl/main:gap-2 ${splitAtLargeSizes && "@4xl/main:grid-cols-2"}  @8xl/main:mx-0 @8xl/main:gap-4`}
    >
      {children}
    </div>
  );
}

type SpinnerProps = {
  sidebar?: boolean;
};

export function Spinner({ sidebar = false }: SpinnerProps) {
  return (
    <svg
      className={`h-5 w-5 animate-spin ${sidebar ? "text-sidebar-primary-foreground" : "text-primary-foreground"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
