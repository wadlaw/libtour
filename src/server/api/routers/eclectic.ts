import { z } from "zod";


import { createTRPCRouter, publicProcedure, eclecticProcedure } from "~/server/api/trpc";

export const eclecticRouter = createTRPCRouter({
    getEntrantList: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.eclecticEntrant.findMany({
                select: {
                    id: true,
                    displayName: true,
                    systemName: true,
                }
            })
        }),
    getEntrant: publicProcedure
        .input(z.object({ entrantId: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.eclecticEntrant.findFirst({
                where: {
                    id: input.entrantId
                },
                include: {
                    scorecards: {
                        include: {
                            comp: true,
                            holes: {
                                orderBy: {
                                    holeNo: "asc"
                                }
                            }
                        }
                    }
                }
            })
        }),
        getEntrantBySystemName: publicProcedure
        .input(z.object({ systemName: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.db.eclecticEntrant.findFirst({
                where: {
                    systemName: input.systemName
                },
                include: {
                    scorecards: {
                        include: {
                            comp: true,
                            holes: {
                                orderBy: {
                                    holeNo: "asc"
                                }
                            }
                        }
                    }
                }
            })
        }),
        entrantQuickCheck: publicProcedure
        .input(z.object({ systemName: z.string().min(1).describe("The system name of the entrant to check") }))
        .query(async({ ctx, input }) => {
            const eclecticEntrant = await ctx.db.eclecticEntrant.findFirst({
                where: {
                    systemName: input.systemName
                },
                include: {
                    scorecards: true
                }
            })
            return (eclecticEntrant && eclecticEntrant?.scorecards.length > 0) ? eclecticEntrant.id : 0;
        }),
    getEntrants: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.eclecticEntrant.findMany({
                orderBy: {
                    displayName: "asc"
                },
                include: {
                    scorecards: {
                        include: {
                            comp: true,
                            holes: {
                                orderBy: {
                                    holeNo: "asc"
                                }
                            }
                        }
                    }
                }
            })
        }),
    addEntrant: eclecticProcedure
        .input(z.object({ displayName: z.string(), systemName: z.string(), paid: z.boolean() }))
        .mutation(({ ctx, input }) => {
            return ctx.db.eclecticEntrant.create({
                data: {
                    displayName: input.displayName,
                    systemName: input.systemName,
                    paid: input.paid
                }
            })
        }),
    updateEntrant: eclecticProcedure
        .input(z.object({ entrantId: z.number(), displayName: z.string(), systemName: z.string(), paid: z.boolean() }))
        .mutation(({ ctx, input }) => {
            return ctx.db.eclecticEntrant.update({
                where: { id: input.entrantId },
                data: { displayName: input.displayName, systemName: input.systemName, paid: input.paid }
            })
        }),
    deleteEntrant: eclecticProcedure
        .input(z.object({ entrantId: z.number() }))
        .mutation(({ ctx, input }) => {
            return ctx.db.eclecticEntrant.delete({
                where: { id: input.entrantId }
            })
        }),
    
})