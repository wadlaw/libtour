"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { Spinner } from "./lib-elements";

type SetWildcardButtonProps = {
  compId: string;
  entrantId: number;
};

export default function SetWildcardButton({
  compId,
  entrantId,
}: SetWildcardButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const setWildcard = api.entrant.setWildcard.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Wildcard not set",
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
        setWildcard.mutate({ comp: compId, entrantId: entrantId });
      }}
    >
      <Button className="w-28" type="submit" disabled={setWildcard.isPending}>
        {setWildcard.isPending ? <Spinner /> : "Set Wildcard"}
      </Button>
    </form>
  );
}
