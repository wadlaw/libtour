"use client";

import { api } from "~/trpc/react";
import { Button, buttonVariants } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/ui/use-toast";
import { usePostHog } from "posthog-js/react";

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
import { Spinner } from "./lib-elements";
import { useUser } from "@clerk/nextjs";

type WithdrawButtonProps = {
  compId: string;
  compName: string;
};

export default function WithdrawButton({
  compId,
  compName,
}: WithdrawButtonProps) {
  const entrant = useUser();
  const posthog = usePostHog();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const alreadyEntered = api.comp.isEntered.useQuery({ comp: compId });
  const withdraw = api.comp.withdraw.useMutation({
    onSuccess: async () => {
      toast({
        title: `${compName}`,
        description: "Withdrawn from comp!",
      });
      posthog.capture("Withdraw from event", {
        event: compName,
        entrant: entrant.user?.fullName,
        environment: process.env.NEXT_PUBLIC_POSTHOG_ENVIRONMENT,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
    onError: async (err) => {
      toast({
        variant: "destructive",
        title: `${compName} - Not Withdrawn!`,
        description: `${err.message}`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });
  if (alreadyEntered.isLoading) return null;
  if (!alreadyEntered?.data) return <div>Withdrawn!</div>;
  const buttonClick = () => {
    withdraw.mutate({ comp: compId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="w-24"
          variant="destructive"
          disabled={withdraw.isPending}
        >
          Withdraw
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to withdraw?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove you from{" "}
            {`${compName.substring(0, 3).toLowerCase() === "the" ? "" : "the"} ${compName}`}{" "}
            and refund the entry fee to your account
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={buttonClick}
            type="submit"
            disabled={withdraw.isPending}
          >
            {withdraw.isPending ? <Spinner /> : "Withdraw"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type WithdrawSomeoneButtonProps = {
  compId: string;
  entrantId: number;
};

export function WithdrawSomeoneButton({
  compId,
  entrantId,
}: WithdrawSomeoneButtonProps) {
  const user = useUser();
  const posthog = usePostHog();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const alreadyEntered = api.comp.isSomeoneEntered.useQuery({
    comp: compId,
    entrantId: entrantId,
  });
  const withdraw = api.comp.withdrawSomeoneElse.useMutation({
    onSuccess: async () => {
      posthog.capture("Withdraw from event", {
        event: compId,
        entrant: entrantId,
        withdrawnBy: user.user?.fullName,
        environment: process.env.NEXT_PUBLIC_POSTHOG_ENVIRONMENT,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
    onError: async (err) => {
      toast({
        variant: "destructive",
        title: `Not Withdrawn!`,
        description: `${err.message}`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
    },
  });
  if (alreadyEntered.isLoading) return null;
  if (!alreadyEntered?.data) return <div>Withdrawn!</div>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        withdraw.mutate({ comp: compId, entrantId: entrantId });
      }}
    >
      <Button
        className="w-24"
        variant="destructive"
        type="submit"
        disabled={withdraw.isPending}
      >
        {withdraw.isPending ? <Spinner /> : "Withdraw"}
      </Button>
    </form>
  );
}
