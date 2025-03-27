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
import { Button, buttonVariants } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "~/components/ui/checkbox";

type EditEclecticEntrantType = {
  entrantId: number;
  displayName: string;
  systemName: string;
  paid: boolean;
};

export function EditEclecticEntrantDialog({
  entrantId,
  displayName,
  systemName,
  paid,
}: EditEclecticEntrantType) {
  const [entrantDisplayName, setEntrantDisplayName] =
    useState<string>(displayName);
  const [entrantSystemName, setEntrantSystemName] =
    useState<string>(systemName);
  const [entrantPaid, setEntrantPaid] = useState<boolean>(paid);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const entrant = api.eclectic.updateEntrant.useMutation({
    onSuccess: async () => {
      toast({
        title: `Eclectic Entrant updated`,
        description: `${entrantDisplayName} updated`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });
  const del = api.eclectic.deleteEntrant.useMutation({
    onSuccess: async () => {
      toast({
        title: `Eclectic Entrant deleted`,
        description: `${entrantDisplayName} deleted`,
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
          <AlertDialogTitle>Edit {displayName}</AlertDialogTitle>
          <AlertDialogDescription>
            Update Eclectic Entrant details
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="displayname">Display Name</Label>
            <Input
              type="text"
              id="displayname"
              placeholder="Name cannot be blank"
              value={entrantDisplayName}
              onChange={(evt) => setEntrantDisplayName(evt.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="systemname">System Name</Label>
            <Input
              type="text"
              id="systemname"
              placeholder="Name cannot be blank"
              value={entrantSystemName}
              onChange={(evt) => setEntrantSystemName(evt.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Checkbox
              id="paid"
              checked={entrantPaid}
              onCheckedChange={(checked) => setEntrantPaid(checked as boolean)}
            />
            <Label htmlFor="paid">Paid?</Label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => {
              del.mutate({ entrantId: entrantId });
            }}
          >
            Delete
          </AlertDialogAction>

          <AlertDialogAction
            disabled={
              (entrantDisplayName === displayName &&
                entrantSystemName === systemName &&
                entrantPaid === paid) ||
              entrantDisplayName.length === 0 ||
              entrantSystemName.length === 0
            }
            onClick={() => {
              entrant.mutate({
                entrantId: entrantId,
                displayName: entrantDisplayName,
                systemName: entrantSystemName,
                paid: entrantPaid,
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

export function AddEclecticEntrantDialog() {
  const [entrantDisplayName, setEntrantDisplayName] = useState<string>("");
  const [entrantSystemName, setEntrantSystemName] = useState<string>("");
  const [entrantPaid, setEntrantPaid] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const resetState = () => {
    setEntrantDisplayName("");
    setEntrantSystemName("");
    setEntrantPaid(false);
  };
  const entrant = api.eclectic.addEntrant.useMutation({
    onSuccess: async () => {
      toast({
        title: `Eclectic Entrant added`,
        description: `${entrantDisplayName} updated`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
      resetState();
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Add Eclectic Entrant</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Add {entrantDisplayName ? entrantDisplayName : "New Entrant"}
          </AlertDialogTitle>
          <AlertDialogDescription>Add Eclectic Entrant</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="displayname">Display Name</Label>
            <Input
              type="text"
              id="displayname"
              placeholder="Enter name to show on website"
              value={entrantDisplayName}
              onChange={(evt) => setEntrantDisplayName(evt.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="systemname">System Name</Label>
            <Input
              type="text"
              id="systemname"
              placeholder="Enter name as it appears on IG"
              value={entrantSystemName}
              onChange={(evt) => setEntrantSystemName(evt.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Checkbox
              id="paid"
              checked={entrantPaid}
              onCheckedChange={(checked) => setEntrantPaid(checked as boolean)}
            />
            <Label htmlFor="paid">Paid?</Label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => resetState()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!entrantDisplayName || !entrantSystemName}
            onClick={() => {
              entrant.mutate({
                displayName: entrantDisplayName,
                systemName: entrantSystemName,
                paid: entrantPaid,
              });
            }}
          >
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
