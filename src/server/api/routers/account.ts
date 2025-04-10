import { z } from "zod";

import { createTRPCRouter, protectedProcedure, transactionProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const accountRouter = createTRPCRouter({
    masterBalance: transactionProcedure
        .query(async ({ ctx }) => {

            return  ctx.db.transaction.aggregate({
                _sum: {
                    netAmount: true
                },
                where: {
                    comp: null,
                    NOT: { description: 'Libtour Entry Fee'}
                }
            
        })
    }),
    masterTransactions: transactionProcedure
        .query(({ ctx }) => {
            return ctx.db.transaction.findMany({
                where: {
                    comp: null,
                    NOT: { description: 'Libtour Entry Fee'}
                },
                orderBy: [
                    {createdAt: "desc"},
                    {id: "desc"}
                ],
                include: {
                    entrant: true
                    } 
                
                
            })
        }),
    myBalance: protectedProcedure
        .query(async ({ ctx }) => {

       
            return  ctx.db.transaction.aggregate({
                _sum: {
                    netAmount: true
                },
                where: {
                    entrantId: ctx.entrant?.id
                }
            
        })
    }),
    myTransactions: protectedProcedure
        .query(({ ctx }) => {
            return ctx.db.transaction.findMany({
                where: {
                    entrantId: ctx.entrant.id
                },
                orderBy: [
                    {createdAt: "desc"},
                    {id: "desc"}
                ],
                include: {
                    comp: true
                }
            })
        }),

    balances: transactionProcedure
        .query(({ ctx }) => {
            return ctx.db.transaction.groupBy({
                by: ['entrantId'],
                _sum: {
                    netAmount: true
                }
            })
        }),

    entrantBalance: transactionProcedure
        .input(z.object({ entrantId: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.transaction.groupBy({
                by: ['entrantId'],
                _sum: {
                    netAmount: true
                },
                where: {
                    entrantId: input.entrantId
                }
            })
        }),

    entrantTransactions: transactionProcedure
        .input(z.object({ entrantId: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.entrant.findFirst({
                where: {
                    id: input.entrantId
                },
                
                include: {
                    transactions: {
                        orderBy: [
                            {createdAt: "desc"},
                            {id: "desc"}
                        ],
                        include: {
                            comp: true
                        }
                    } 
                },
                
            })
        }),

    singleEntrantTransactions: transactionProcedure
        .input(z.object({ entrantId: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.entrant.findFirst({
                where: {
                    id: input.entrantId
                },
                
                include: {
                    transactions: {
                        orderBy: [
                            {createdAt: "desc"},
                            {id: "desc"}
                        ],
                        include: {
                            comp: true
                        }
                    } 
                },
                
            })
        }),

    entrantsWithTransactions: transactionProcedure
        .query(({ ctx }) => {
            return ctx.db.entrant.findMany({
                orderBy: [
                    {team: {teamName: "asc"}},
                    {name: "asc"}
                ]
                ,
                include: {
                    transactions: true,
                    team: true
                }
            })
        }),

    entrantWithTransactions: transactionProcedure
        .input(z.object({ entrantId: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.entrant.findMany({
                where: {
                    id: input.entrantId
                },
                include: {
                    transactions: {
                        orderBy: {
                            createdAt: "desc"
                        },
                        include: {
                            comp: true
                        }
                    },
                    team: true
                }
            })
        }),
        
    addTransaction: transactionProcedure
        .input(z.object({ entrantId: z.number(), amountInPence: z.number(), description: z.string(), type: z.string(), netAmountInPence: z.number(), transactionDate: z.date() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.transaction.create({
                data: {
                    entrantId: input.entrantId,
                    amount: input.amountInPence,
                    description: input.description,
                    type: input.type,
                    netAmount: input.netAmountInPence,
                    winnings: false,
                    createdAt: input.transactionDate
                }
            })
        }),

    deleteTransaction: transactionProcedure
        .input(z.object({ transactionId: z.number().min(1) }))
        .mutation(async ({ ctx, input }) => {
            //check we aren't deleting any entries associated with comps
            const trans = await ctx.db.transaction.findFirst({
                where: {
                    id: input.transactionId
                }
            })

            //only delete transactions that we want to allow
            if (trans?.igCompId === null && trans?.description !== "LIB Entry Fee") {
                return await ctx.db.transaction.delete({
                    where: {
                        id: input.transactionId
                    }
                })
            } else {
                let errorMsg = "";
                (trans) 
                    ? 
                    errorMsg = "Transaction cannot be deleted as it is part of a competition!" 
                    : 
                    errorMsg = "Transaction cannot be found. Has it already been deleted?"
          
                throw new TRPCError({ code: "PRECONDITION_FAILED", message: errorMsg })
            }

            
        })


});