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

import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";

type EditEventType = {
  igCompId: string;
  shortName: string;
  name: string;
  date: Date;
  stableford: boolean;
  lib: boolean;
  eclectic: boolean;
};
export function EditEventDialog({
  igCompId,
  shortName,
  name,
  date,
  stableford,
  lib,
  eclectic,
}: EditEventType) {
  const [linkName, setLinkName] = useState<string>(shortName);
  const [fullName, setFullName] = useState<string>(name);
  const [compDate, setCompDate] = useState<Date>(date ?? new Date());
  const [isStableford, setIsStableford] = useState<boolean>(stableford);
  const [isLib, setIsLib] = useState<boolean>(lib);
  const [isEclectic, setIsEclectic] = useState<boolean>(eclectic);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const resetState = () => {
    setLinkName(shortName);
    setFullName(name);
    setCompDate(date);
    setIsStableford(stableford);
    setIsLib(lib);
    setIsEclectic(eclectic);
  };

  const event = api.comp.update.useMutation({
    onSuccess: async () => {
      toast({
        title: `Event updated`,
        description: `${linkName} (${fullName}) updated`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });

  const del = api.comp.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: "Event deleted",
        description: `${linkName} (${fullName}) deleted`,
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
          <AlertDialogTitle>Update {shortName}</AlertDialogTitle>
          <AlertDialogDescription>
            Edit and update the data for the {name} competition
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="calendar">Event Date</Label>
            <div className="flex">
              <Calendar
                id="calendar"
                mode="single"
                selected={compDate}
                defaultMonth={compDate}
                onSelect={(value: Date | undefined) => {
                  if (typeof value !== "undefined") {
                    setCompDate(new Date(value));
                  }
                }}
                initialFocus
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linkname">Short Name (for links)</Label>
            <Input
              id="linkname"
              type="text"
              placeholder="Cannot be blank"
              value={linkName}
              onChange={(evt) => setLinkName(evt.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullname">Full name for the event</Label>
            <Input
              id="fullname"
              type="text"
              placeholder="Cannot be blank"
              value={fullName}
              onChange={(evt) => setFullName(evt.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="stableford"
              checked={isStableford}
              onCheckedChange={(checked) => setIsStableford(checked as boolean)}
            />
            <Label htmlFor="stableford">Stableford Scoring</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lib"
              checked={isLib}
              onCheckedChange={(checked) => setIsLib(checked as boolean)}
            />
            <Label htmlFor="lib">Lib event?</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="eclectic"
              checked={isEclectic}
              onCheckedChange={(checked) => setIsEclectic(checked as boolean)}
            />
            <Label htmlFor="eclectic">Eclectic event?</Label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => resetState()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => {
              del.mutate({
                igCompId: igCompId,
              });
            }}
          >
            Delete
          </AlertDialogAction>
          <AlertDialogAction
            disabled={
              linkName === shortName &&
              fullName === name &&
              compDate.valueOf() == date.valueOf() &&
              isStableford === stableford &&
              isLib === lib &&
              isEclectic === eclectic
            }
            onClick={() => {
              event.mutate({
                igCompId: igCompId,
                shortName: linkName,
                name: fullName,
                date: compDate,
                stableford: isStableford,
                lib: isLib,
                eclectic: isEclectic,
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
