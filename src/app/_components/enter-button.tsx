"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type EnterButtonProps = {
  compId: string;
  compName: string;
};

export default function EnterButton({ compId, compName }: EnterButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const alreadyEntered = api.comp.isEntered.useQuery({ comp: compId });
  const enter = api.comp.enter.useMutation({
    onSuccess: async () => {
      toast({
        title: `${compName}`,
        description: "Comp entered!",
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
    onError: async (err) => {
      toast({
        variant: "destructive",
        title: `${compName} - Not Entered!`,
        description: `${err.message}`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });
  if (alreadyEntered.isLoading) return null;
  if (alreadyEntered.data) return <div>Entered!</div>;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        enter.mutate({ comp: compId });
      }}
    >
      <Button className="w-24" type="submit" disabled={enter.isPending}>
        Enter
      </Button>
    </form>
  );
}

type EnterSomeoneButtonProps = {
  compId: string;
  entrantId: number;
};

export function EnterSomeoneButton({
  compId,
  entrantId,
}: EnterSomeoneButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const alreadyEntered = api.comp.isSomeoneEntered.useQuery({
    comp: compId,
    entrantId: entrantId,
  });
  const enter = api.comp.enterSomeoneElse.useMutation({
    onSuccess: async () => {
      toast({
        description: "Comp entered!",
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
    onError: async (err) => {
      toast({
        variant: "destructive",
        title: `Comp Not Entered!`,
        description: `${err.message}`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });
  if (alreadyEntered.isLoading) return null;
  if (alreadyEntered.data) return <div>Entered!</div>;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        enter.mutate({ comp: compId, entrantId: entrantId });
      }}
    >
      <Button className="w-24" type="submit" disabled={enter.isPending}>
        Enter
      </Button>
    </form>
  );
}
