import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure,  wildcardProcedure } from "~/server/api/trpc";

export const entrantRouter = createTRPCRouter({
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.entrant.findMany({
                orderBy: [
                    {teamId: "asc"},
                    {name: "asc"},
                ],
                include: {
                    team: true,
                },
                
            })
        }),
    getOne: publicProcedure
        .input(z.object({ entrantId: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.entrant.findFirst({
                
                where: {
                    id: input.entrantId
                },
                include: {
                    team: true,
                    user: true,
                    comps: {
                        orderBy: {
                            comp: {
                                date: 'desc'
                            }
                        },
                        include: {
                            comp: true
                                
                            }
                        },
                        
                        
                        
                    },

                })          
        }),
    setWildcard: wildcardProcedure
    .input(z.object({ comp: z.string().min(4), entrantId: z.number() }))
    .mutation(async ({ ctx, input }) => {

        const comp = await ctx.db.comp.findFirst({
            where: {
                OR: [
                    { igCompId: input.comp },
                    { shortName: input.comp.toUpperCase() }
                ]
              
            }
          })
          if (comp?.open) {
        
            //Find the team of the wildcard
            const entrant = await ctx.db.entrant.findFirst({
                where: {
                    id: input.entrantId
                }
            })
            //Remove any existing wildcard for that team
            await ctx.db.compEntrant.updateMany({
                where: {
                    compId: input.comp,
                    entrant: {
                        teamId: entrant?.teamId
                    }
                },
                data: {
                    wildcard: false
                }
            })
            //Set new wildcard
            return await ctx.db.compEntrant.update({
                where:{
                    compId_entrantId: {
                        compId: input.comp,
                        entrantId: input.entrantId
                    }
                },
                data: {
                    wildcard: true
                }
            })
        }  else {throw new TRPCError({ code: "PRECONDITION_FAILED", message: "All wildcards are already locked in!" })}
    }),

    removeWildcard: wildcardProcedure
    .input(z.object({ comp: z.string().min(4), entrantId: z.number() }))
    .mutation(async ({ ctx, input }) => {
        const comp = await ctx.db.comp.findFirst({
            where: {
                OR: [
                    { igCompId: input.comp },
                    { shortName: input.comp.toUpperCase() }
                ]
            }
          })
          if (comp?.open) {
        
            return await ctx.db.compEntrant.update({
                where: {
                    compId_entrantId: {
                        compId: input.comp,
                        entrantId: input.entrantId
                    }
                },
                data: {
                    wildcard: false
                }
            })
        }  else {throw new TRPCError({ code: "PRECONDITION_FAILED", message: "All wildcards are already locked in!" })}
    }),

    summary: publicProcedure
    .query(({ ctx }) => {
        return ctx.db.entrant.findMany({
            include: {
                comps: {
                    where: {
                        comp: {
                            completed: true,
                        }
                    }
                },
                transactions: {
                    where: {
                        winnings: true,
                    }
                }

            },
            orderBy: [{name: "asc"},]
        })
    }),
        
    summaryByTeam: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .query(({ ctx, input }) => {
        return ctx.db.entrant.findMany({
            where: {
                teamId: input.teamId,
            },
            include: {
                comps: {
                    where: {
                        comp: {
                            completed: true,
                        }
                    }
                },
                transactions: {
                    where: {
                        winnings: true,
                    }
                }

            },
            orderBy: [{name: "asc"},]
            
        })
    }),

    entrantsByPrizeMoney: publicProcedure
        .input(z.object({ limit: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.$queryRaw<{id: number, name: string, teamId: string, linkName: string, teamName: string, totalWinnings: number, prizeCount: number}[]>(
                Prisma.sql`SELECT e.id, e.name, tm.id teamId, tm.linkName, tm.teamName, sum(t.amount) as totalWinnings, count(t.amount) as prizeCount FROM Entrant e LEFT JOIN Transaction t ON e.id = t.entrantId LEFT JOIN Team tm ON e.teamId = tm.id WHERE t.winnings = true group by e.id order by sum(t.amount) desc LIMIT ${input.limit}`
            )
        })

});

