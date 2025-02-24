"use client";

import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type UserSelectProps = {
  users: {
    name: string;
    id: string;
    entrantId: number | undefined;
  }[];
  currentValue: string | null;
  entrantId: number;
  entrantName: string;
};

export default function UserSelect({
  users,
  currentValue,
  entrantId,
  entrantName,
}: UserSelectProps) {
  const [entrant] = useState(entrantId);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const assign = api.user.assignEntrant.useMutation({
    onSuccess: async () => {
      toast({
        title: `${entrantName} Updated`,
        description: `Entrant mapped to user`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });

  return (
    <Select
      defaultValue={currentValue ?? undefined}
      onValueChange={(value) => {
        console.log(`Assigning userId ${value} to EntrantId ${entrantId}`);
        assign.mutate({ userId: value, entrantId: entrant });
      }}
    >
      <SelectTrigger className="w-[140px] @2xl/libcard:w-[180px]">
        <SelectValue placeholder="Assign a user" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Unassigned Users</SelectLabel>
          {users
            .filter((user) => !user.entrantId)
            .map((user) => {
              return (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              );
            })}
          <SelectLabel>Asssigned Users</SelectLabel>
          {users
            .filter((user) => !!user.entrantId)
            .map((user) => {
              return (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
