
import { compRouter } from "~/server/api/routers/comp";
import { teamRouter } from "~/server/api/routers/team";
import { userRouter } from "~/server/api/routers/user";
import { accountRouter } from "~/server/api/routers/account";
import { entrantRouter } from "./routers/entrant";
import { prizesRouter } from "./routers/prizes";
import { scorecardRouter } from "./routers/scorecard";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({

  team: teamRouter,
  comp: compRouter,
  user: userRouter,
  account: accountRouter,
  entrant: entrantRouter,
  prizes: prizesRouter,
  scorecard: scorecardRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
