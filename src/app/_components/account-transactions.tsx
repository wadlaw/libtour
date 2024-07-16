"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/components/ui/use-toast";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type TransactionPopoverProps = {
  entrantId: number;
  entrantName: string;
  type: "CR" | "DR";
};

export function TransactionPopover({
  entrantId,
  entrantName,
  type,
}: TransactionPopoverProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<number>(5);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [cashOrTransfer, setCashOrTransfer] = useState<"cash" | "transfer">(
    "transfer",
  );
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const transaction = api.account.addTransaction.useMutation({
    onSuccess: async () => {
      toast({
        title: `£${amount} ${type === "CR" ? "Deposited" : "Withdrawn"}`,
        description: `${entrantName}'s account updated`,
      });
      await queryClient.invalidateQueries();
      router.refresh();
      setIsPopoverOpen(false);
      setDate(new Date());
      setCashOrTransfer("transfer");
      setAmount(5);
    },
  });

  return (
    <Popover modal={true} open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant={type === "DR" ? "destructive" : "default"}>
          {type === "CR" ? "Credit" : "Debit"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{entrantName}</h4>
            <p className="text-sm text-muted-foreground">
              Add a {type === "CR" ? "Credit" : "Debit"}
            </p>
          </div>
          <Tabs className="" defaultValue={cashOrTransfer}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                onClick={() => setCashOrTransfer("transfer")}
                value="transfer"
              >
                Transfer
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setCashOrTransfer("cash")}
                value="cash"
              >
                Cash
              </TabsTrigger>
            </TabsList>
            {/* <TabsContent value="transfer">
                
              </TabsContent>
              <TabsContent value="cash"></TabsContent> */}
          </Tabs>
          <div className="grid gap-2">
            <div className="flex ">
              <Button
                className="min-w-0 flex-1 px-0"
                variant="outline"
                onClick={() => setAmount((prev) => (prev += 1))}
              >
                +£1
              </Button>
              <Button
                className="min-w-0 flex-1 px-0"
                variant="outline"
                onClick={() => setAmount((prev) => (prev += 5))}
              >
                +£5
              </Button>
              <Button
                className="min-w-0 flex-1 px-0"
                variant="outline"
                onClick={() => setAmount((prev) => (prev += 10))}
              >
                +£10
              </Button>
              <Button
                className="min-w-0 flex-1 px-0 text-red-500"
                variant="outline"
                onClick={() =>
                  setAmount((prev) => {
                    if (prev >= 10) {
                      return (prev -= 10);
                    } else {
                      return prev;
                    }
                  })
                }
              >
                -£10
              </Button>
              <Button
                className="min-w-0 flex-1 px-0 text-red-500"
                variant="outline"
                onClick={() =>
                  setAmount((prev) => {
                    if (prev >= 1) {
                      return (prev -= 1);
                    } else {
                      return prev;
                    }
                  })
                }
              >
                -£1
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label className="w-16" htmlFor="amount">
                Amount
              </Label>
              <Input
                id="amount"
                type="text"
                value={`£ ${amount.toString()}.00`}
                min="0"
                className="text-center"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="w-16">Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full  text-center font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(value: Date | undefined) => {
                      if (typeof value !== "undefined") {
                        setDate(new Date(value));
                      }
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date: Date) =>
                      date > new Date() || date < new Date("2024-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex w-full justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsPopoverOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={type === "CR" ? "default" : "destructive"}
              disabled={amount === 0}
              onClick={() => {
                transaction.mutate({
                  entrantId: entrantId,
                  amountInPence: amount * 100,
                  description: `${type === "CR" ? "Deposit" : "Withdrawal"} ${cashOrTransfer === "cash" ? "in Cash" : "by Bank Transfer"}`,
                  type: type,
                  netAmountInPence:
                    type === "DR" ? 0 - amount * 100 : amount * 100,
                  transactionDate: date,
                });
              }}
            >
              {type === "CR" ? "Credit" : "Debit"} {entrantName}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
