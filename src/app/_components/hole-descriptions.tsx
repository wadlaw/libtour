"use client";
import { api } from "~/trpc/react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
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

type EditHoleDescriptiontDialogType = {
  scorecardId: number;
  holeNo: number;
  holeDesc: string | null;
};

export function EditHoleDescriptiontDialog({
  scorecardId,
  holeNo,
  holeDesc,
}: EditHoleDescriptiontDialogType) {
  const [holeDescription, setHoleDescription] = useState<string | null>(
    holeDesc,
  );

  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const description = api.scorecard.addHoleDescription.useMutation({
    onSuccess: async () => {
      toast({
        title: `Hole Description Updated`,
        description: `${holeNo} updated`,
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
          <AlertDialogTitle>Edit Description</AlertDialogTitle>
          <AlertDialogDescription>
            Update Hole {holeNo} Description
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="displayname">Description</Label>
            <Input
              type="text"
              id="description"
              placeholder="Enter a description"
              value={holeDescription ? holeDescription : ""}
              onChange={(evt) => setHoleDescription(evt.target.value)}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={holeDescription === holeDesc}
            onClick={() => {
              description.mutate({
                scorecardId: scorecardId,
                holeNo: holeNo,
                description: holeDescription ? holeDescription : undefined,
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
