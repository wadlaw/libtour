import { z } from "zod";

import { createTRPCRouter, protectedProcedure, transactionProcedure } from "~/server/api/trpc";

export const accountRouter = createTRPCRouter({
    myBalance: protectedProcedure
        .query(async ({ ctx }) => {

            // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
                orderBy: {
                    createdAt: "desc"
                },
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
                        orderBy: {
                            createdAt: "desc"
                        },
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
                        orderBy: {
                            createdAt: "desc"
                        },
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
        })


});