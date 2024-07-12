"use client";

type LibMoneyProps = {
  amountInPence: number;
  hideZeros?: boolean;
  hideNegative?: boolean;
  negativeRed?: boolean;
  alwaysShowPence?: boolean;
};

export default function LibMoney({
  amountInPence,
  hideZeros,
  hideNegative,
  negativeRed,
  alwaysShowPence,
}: LibMoneyProps) {
  const amt =
    amountInPence < 0 && hideNegative ? 0 - amountInPence : amountInPence;
  //eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const decimal = alwaysShowPence || amt % 100 != 0 ? 2 : 0;
  if (amt === 0 && hideZeros) return;
  return (
    <span className={`${amt < 0 && negativeRed ? "text-red-400" : ""}`}>
      {(amt / 100).toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: decimal,
      })}
    </span>
  );
}
