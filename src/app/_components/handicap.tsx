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
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { SetHandicapIndex } from "../api/handicap/handicap";

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
    { name: "Gold-Women", courseRating: 73.4, slopeRating: 128, par: 72 },
  ],
};

type HandicapProps = {
  hi?: number;
};

export function Handicap({ hi = 0 }: HandicapProps) {
  const [handicapIndex, setHandicapIndex] = useState<number>(hi);
  const [tee, setTee] = useState<Tee>(libbets.tees[0]!);

  const setHI = async (hi: number) => {
    const response = await SetHandicapIndex(hi);
    if (response.success) {
      setHandicapIndex(hi);
    }
  };
  return (
    <LibCardNarrow title="Handicap Calculator">
      <div className="flex flex-col gap-2">
        <Label htmlFor="tee">Tee</Label>
        <Select
          defaultValue={tee.name ?? undefined}
          onValueChange={(teeName) => {
            setTee(libbets.tees.filter((tee) => tee.name === teeName)[0]!);
          }}
        >
          <SelectTrigger id="tee" className="w-[180px] @2xl/libcard:w-[200px]">
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
        <Label htmlFor="hi">Handicap Index</Label>
        <Input
          type="number"
          step={0.1}
          name="index"
          id="hi"
          value={handicapIndex}
          onChange={(e) => setHI(Number(e.target.value))}
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
