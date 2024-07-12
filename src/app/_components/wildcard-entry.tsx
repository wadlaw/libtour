"use client";

import SetWildcardButton from "./wildcard-set-button";
import RemoveWildcardButton from "./wildcard-remove-button";

type WildcardEntryProps = {
  compId: string;
  wildcard: boolean;
  entrantId: number;
};

export default function WildcardEntry({
  compId,
  wildcard,
  entrantId,
}: WildcardEntryProps) {
  if (wildcard) {
    return <RemoveWildcardButton compId={compId} entrantId={entrantId} />;
  } else {
    return <SetWildcardButton compId={compId} entrantId={entrantId} />;
  }
  //   return <WithdrawButton compId={compId} />;
  // } else {
  //   return <EnterButton compId={compId} />;
  // }
}
