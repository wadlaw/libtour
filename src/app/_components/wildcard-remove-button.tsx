"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { Spinner } from "./lib-elements";
import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";

type RemoveWildcardButtonProps = {
  compId: string;
  entrantId: number;
};

export default function RemoveWildcardButton({
  compId,
  entrantId,
}: RemoveWildcardButtonProps) {
  const { user } = useUser();
  const posthog = usePostHog();
  const { toast } = useToast();
  const router = useRouter();
  const removeWildcard = api.entrant.removeWildcard.useMutation({
    onSuccess: () => {
      posthog.capture("Wildcard removed", {
        entrantId: entrantId,
        eventId: compId,
        removedBy: user?.fullName,
      });
      router.refresh();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: `Wildcard not Removed`,
        description: `${err.message}`,
      });
      router.refresh();
    },
  });
  // if (alreadyEntered.isLoading) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        removeWildcard.mutate({ comp: compId, entrantId: entrantId });
      }}
    >
      <Button
        className="w-28"
        variant="destructive"
        type="submit"
        disabled={removeWildcard.isPending}
      >
        {removeWildcard.isPending ? <Spinner /> : "Remove WC"}
      </Button>
    </form>
  );
}
