"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./lib-elements";
import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";

type EnterButtonProps = {
  compId: string;
  compName: string;
};

export default function EnterButton({ compId, compName }: EnterButtonProps) {
  const user = useUser();
  const posthog = usePostHog();
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
      posthog.capture("Enter event", {
        eventName: compName,
        eventId: compId,
        entrant: user.user?.fullName,
        environment: process.env.NEXT_PUBLIC_POSTHOG_ENVIRONMENT,
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
        {enter.isPending ? <Spinner /> : "Enter"}
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
  const user = useUser();
  const posthog = usePostHog();
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
      posthog.capture("Enter event", {
        eventId: compId,
        entrantId: user.user?.fullName,
        environment: process.env.NEXT_PUBLIC_POSTHOG_ENVIRONMENT,
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
        {enter.isPending ? <Spinner /> : "Enter"}
      </Button>
    </form>
  );
}
