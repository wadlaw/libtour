import { api } from "~/trpc/server";
import { LibBanner } from "./lib-elements";

export async function WinningBanner() {
  const [events, teams] = await Promise.all([
    api.comp.getUpcoming(),
    api.team.getAllWithPoints(),
  ]);

  if (events.length > 0) return null;

  const reducedTeams: typeof teams = [];
  teams.forEach((team) => {
    reducedTeams.push({
      ...team,
      points: team.teamPoints.reduce((acc, cur) => acc + cur.points, 0),
    });
  });
  const sortedTeams = reducedTeams.sort((a, b) => b.points - a.points);
  let topScore = 0;
  const winningTeams: string[] = [];
  sortedTeams.forEach((team) => {
    if (team.points >= topScore) {
      topScore = team.points;
      winningTeams.push(team.teamName);
    }
  });

  return (
    <div className="">
      <LibBanner>
        Congratulations to {winningTeams.join(" and ")} - winners of the
        Libtour!
      </LibBanner>
    </div>
  );
}
