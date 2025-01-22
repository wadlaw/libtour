import { api } from "~/trpc/server";
import Image from "next/image";
import { TeamEntrants } from "~/app/_components/team-entrants";
import LibMain, {
  LibH1,
  LibCardContainer,
} from "~/app/_components/lib-elements";
import { TeamResultsByTeam } from "~/app/_components/team-results";

export async function generateMetadata({
  params,
}: {
  params: { teamName: string };
}) {
  const team = await api.team.getName({ teamName: params.teamName });

  return {
    title: `Libtour - ${team ? team.teamName : "unknown"}`,
    description: "A Summer-long series of events at Redlibbets",
  };
}

export default async function Team({
  params,
}: {
  params: { teamName: string };
}) {
  const team = await api.team.getWithPoints({ team: params.teamName });

  if (!team) return <p>No team found for {params.teamName}</p>;

  const teamPoints = team.teamPoints.reduce((acc, cur) => acc + cur.points, 0);

  return (
    <LibMain>
      <div className=" flex flex-col items-center">
        <div className={`overflow-hidden rounded-full ${team.linkName}`}>
          <Image
            src={`/${team.linkName}.png`}
            height={100}
            width={100}
            alt={`${team.teamName} logo`}
          ></Image>
        </div>
        <LibH1>{team.teamName}</LibH1>
        <p>{`${teamPoints} point${teamPoints != 1 ? "s" : ""}`}</p>
      </div>

      <LibCardContainer>
        <TeamEntrants teamId={team.id} />
        <TeamResultsByTeam team={team.id} />
      </LibCardContainer>
    </LibMain>
  );
}
