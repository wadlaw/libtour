"use client";
import { api } from "~/trpc/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { TeamDropdown } from "./team-dropdown";

type EditEntrantType = {
  entrantId: number;
  name: string;
  teamId: string;
};

export function EditEntrantDialog({
  entrantId,
  name,
  teamId,
}: EditEntrantType) {
  const [entrantName, setEntrantName] = useState<string>(name);
  const [team, setTeam] = useState<string>(teamId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const entrant = api.entrant.update.useMutation({
    onSuccess: async () => {
      toast({
        title: `Entrant updated`,
        description: `${entrantName} (${team}) updated`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit {name}</AlertDialogTitle>
          <AlertDialogDescription>
            Update Entrant details and team
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="teamselect">Select Team</Label>
            <div className="flex">
              <TeamDropdown teamId={team} setTeamId={setTeam} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="displayname">Display Name</Label>
            <Input
              type="text"
              id="displayname"
              placeholder="Name cannot be blank"
              value={entrantName}
              onChange={(evt) => setEntrantName(evt.target.value)}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={
              (entrantName == name && team === teamId) ||
              entrantName.length == 0
            }
            onClick={() => {
              entrant.mutate({
                entrantId: entrantId,
                name: entrantName,
                teamId: team,
              });
            }}
          >
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
