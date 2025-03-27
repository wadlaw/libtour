import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ensure } from "~/lib/utils";

import { createTRPCRouter, publicProcedure, protectedProcedure,  wildcardProcedure, adminProcedure, eclecticProcedure } from "~/server/api/trpc";

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
                            holes: true
                        }
                    }
                }
            })
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
                            holes: true
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