"use client";
import { api } from "~/trpc/react";
import { type Dispatch, type SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type TeamDropdownProps = {
  teamId: string;
  setTeamId: Dispatch<SetStateAction<string>>;
};

export function TeamDropdown({ teamId, setTeamId }: TeamDropdownProps) {
  const teams = api.team.getList.useQuery();
  if (!teams.data || teams.isLoading)
    return <Button variant="outline">Loading...</Button>;
  const currentTeam = teams.data.filter((team) => team.id === teamId)[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {currentTeam ? (
            <TeamDisplay
              teamId={currentTeam.id}
              teamName={currentTeam.teamName}
              linkName={currentTeam.linkName}
            />
          ) : (
            teamId
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Teams</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {teams.data.map((team) => {
            return (
              <DropdownMenuCheckboxItem
                key={team.id}
                checked={teamId === team.id}
                onCheckedChange={() => setTeamId(team.id)}
              >
                <TeamDisplay
                  teamId={team.id}
                  teamName={team.teamName}
                  linkName={team.linkName}
                />
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type TeamDisplayProps = {
  teamId: string;
  teamName: string;
  linkName: string;
};

function TeamDisplay({ teamId, teamName, linkName }: TeamDisplayProps) {
  return (
    <div className="flex gap-2">
      <Avatar className="h-6 w-6 overflow-hidden rounded-full">
        <AvatarImage src={`${linkName}.png`} alt={teamName} />
        <AvatarFallback className="rounded-full">{teamId}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <span className="">{teamName}</span>
      </div>
    </div>
  );
}
