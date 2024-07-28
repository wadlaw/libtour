
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
    
    getName: publicProcedure
    .input(z.object({ teamName: z.string() }))
    .query(({ ctx, input}) => {
      return ctx.db.team.findFirst({
        where: {
          OR: [
            { id: input.teamName.toUpperCase() },
            { linkName: input.teamName.toLowerCase() }
          ]
        },
        select: {
          teamName: true
        }
      })
    }),

  get: publicProcedure
    .input(z.object({ team: z.string().min(2) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.team.findFirst({
        where: {
          OR: [
            { linkName: input.team.toLowerCase() },
            { id: input.team.toUpperCase() }
          ]

        },
        include: {
          entrants: true
      }
    })
  }),

  getWithPoints: publicProcedure
    .input(z.object({ team: z.string().min(2) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.team.findFirst({
        where: {
          OR: [
            { linkName: input.team.toLowerCase() },
            { id: input.team.toUpperCase() }
          ]

        },
        include: {
          teamPoints: true,
          entrants: true,
      }
    })
  }),


  getList: publicProcedure.query(({ ctx }) => {
    return ctx.db.team.findMany({
        orderBy: { teamName: "desc" }
    })
  }),

//   getLatest: publicProcedure.query(({ ctx }) => {
//     return ctx.db.post.findFirst({
//       orderBy: { createdAt: "desc" },
//     });
//   }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.team.findMany({
        orderBy: { teamName: "asc" },
        include: {
            entrants: true
        }
    })
  }),

  getAllWithPoints: publicProcedure.query(({ ctx }) => {
    return ctx.db.team.findMany({
      include: {
        teamPoints: true
      },
      orderBy: [{teamName: "asc"}]
    })
  }),

  getAllWithPointsAndComps: publicProcedure.query(({ ctx }) =>{
    return ctx.db.team.findMany({
      include: {
        teamPoints: {
          include: {
            comp: true
          },
          orderBy: {
            comp: {date: "asc"}
          }
        }
      },
      orderBy: [
        {teamName: "asc"},
      ]
    })
  })
});