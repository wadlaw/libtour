"use client";

import { api } from "~/trpc/react";
import EnterButton from "./enter-button";
import WithdrawButton from "./withdraw-button";

type EnterWithdrawProps = {
  compId: string;
  compName: string;
  displayEntryStatus?: boolean;
};

export default function EnterWithdraw({
  displayEntryStatus,
  compId,
  compName,
}: EnterWithdrawProps) {
  const alreadyEntered = api.comp.isEntered.useQuery({ comp: compId });

  if (alreadyEntered.isLoading) return <p>Loading...</p>;
  //   if (alreadyEntered.data) return <div>Entered!</div>;
  if (alreadyEntered.data) {
    return (
      <DisplayWithdrawButton
        compId={compId}
        compName={compName}
        displayEntryStatus={displayEntryStatus}
      />
    );
  } else {
    return (
      <DisplayEnterButton
        compId={compId}
        compName={compName}
        displayEntryStatus={displayEntryStatus}
      />
    );
  }
}

function DisplayEnterButton({
  displayEntryStatus = false,
  compId,
  compName,
}: EnterWithdrawProps) {
  if (!displayEntryStatus)
    return <EnterButton compId={compId} compName={compName} />;

  return (
    <div className="flex flex-col items-center">
      <span className="mb-1">You are not entered in this competition yet</span>
      <EnterButton compId={compId} compName={compName} />
    </div>
  );
}

function DisplayWithdrawButton({
  displayEntryStatus = false,
  compId,
  compName,
}: EnterWithdrawProps) {
  if (!displayEntryStatus)
    return <WithdrawButton compId={compId} compName={compName} />;

  return (
    <div className="flex flex-col items-center">
      <span className="mb-1">You are entered in this competition</span>
      <WithdrawButton compId={compId} compName={compName} />
    </div>
  );
}
