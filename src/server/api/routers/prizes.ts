import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const prizesRouter = createTRPCRouter({
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.compPrizes.findMany()
        }),

    get: publicProcedure
        .input(z.object({ prizePot: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.compPrizes.findFirst({
                where: {
                    prizePot: input.prizePot
                }
            })
        }),
        


});