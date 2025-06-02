"use client";
import { useMemo, useState } from "react";
import { LibCardNarrow } from "./lib-elements";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type Tee = {
  name: string;
  par: number;
  courseRating: number;
  slopeRating: number;
};

type Course = {
  courseName: string;
  tees: Tee[];
};
const libbets = {
  courseName: "Redlibbets",
  tees: [
    { name: "Black", courseRating: 72.8, slopeRating: 130, par: 72 },
    { name: "White", courseRating: 70.8, slopeRating: 128, par: 72 },
    { name: "Gold", courseRating: 68.2, slopeRating: 123, par: 72 },
  ],
};

export function Handicap() {
  const [handicapIndex, setHandicapIndex] = useState<number | null>(null);
  const [tee, setTee] = useState<Tee>(libbets.tees[0]!);

  return (
    <LibCardNarrow title="Handicap Calculator">
      <div className="flex flex-col gap-2">
        <Select
          defaultValue={tee.name ?? undefined}
          onValueChange={(teeName) => {
            setTee(libbets.tees.filter((tee) => tee.name === teeName)[0]!);
          }}
        >
          <SelectTrigger className="w-[180px] @2xl/libcard:w-[200px]">
            <SelectValue placeholder="Which Teebox?" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Teeboxes</SelectLabel>
              {libbets.tees.map((tee) => {
                return (
                  <SelectItem key={tee.name} value={tee.name}>
                    {`Redlibbets ${tee.name}`}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <label htmlFor="hi">Handicap Index</label>
        <input
          type="number"
          step={0.1}
          name="index"
          id="hi"
          onChange={(e) => setHandicapIndex(Number(e.target.value))}
        />
        <div>{`Handicap Index: ${handicapIndex ?? 0}`}</div>
        <HandicapTable handicapIndex={handicapIndex ?? 0} tee={tee} />
      </div>
    </LibCardNarrow>
  );
}

type HandicapTableProps = {
  handicapIndex: number;
  tee: Tee;
};

function HandicapTable({ handicapIndex, tee }: HandicapTableProps) {
  const round = (exactHcp: number) => Math.round(exactHcp);
  const courseHandicap = useMemo(() => {
    return (
      (handicapIndex ?? 0) * (tee.slopeRating / 113) +
      (tee.courseRating - tee.par)
    );
  }, [handicapIndex, tee]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead className="text-center">%age</TableHead>
          <TableHead className="text-center">Hcp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Course Handicap</TableCell>
          <TableCell>Social Play</TableCell>
          <TableCell className="text-center">100%</TableCell>
          <TableCell className="text-center">{round(courseHandicap)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Playing Handicap</TableCell>
          <TableCell>Competitive Play</TableCell>
          <TableCell className="text-center">95%</TableCell>
          <TableCell className="text-center">
            {round(courseHandicap * 0.95)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
