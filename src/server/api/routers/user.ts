import { z } from "zod";

import { createTRPCRouter, protectedProcedure, adminProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({

    loggedInUser: protectedProcedure
        .query(({ ctx }) => {
        return ctx.db.entrant.findUniqueOrThrow({
             where: { userId: ctx.auth.userId }
            })
    }),
    getAll: adminProcedure
        .query(({ ctx }) => {
            return ctx.db.user.findMany({
                include: {
                    entrant: true
                }
            })
        }),
    assignEntrant: adminProcedure
        .input(z.object({ entrantId: z.number(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.entrant.update({
                where: {
                    id: input.entrantId
                },
                data: {
                    userId: input.userId,
                }
            })
        }),
    isAdmin: adminProcedure
        .query(() => {
            return true
        }),
    



});