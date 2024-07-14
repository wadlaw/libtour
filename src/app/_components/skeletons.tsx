"use client";

import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "~/components/ui/table";

type SkeletonTableProps = {
  rows: number;
  columnHeaders: {
    title: string;
    width: string;
  }[];
};

export default function SkeletonTable({
  rows,
  columnHeaders,
}: SkeletonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableHead>Comp</TableHead>
        <TableHead>Date</TableHead>
        <TableHead className="text-center"></TableHead>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, i) => i).map((__, index) => {
          return (
            <TableRow key={index}>
              {columnHeaders.map((ch) => {
                return (
                  <TableCell key={ch.title}>
                    <Skeleton className={`h-6 ${ch.width}`} />
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
