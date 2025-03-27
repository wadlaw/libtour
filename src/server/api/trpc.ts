/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
// import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@clerk/nextjs";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/api";
import { db } from "~/server/db";


interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject
}



/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

const createInnerTRPCContext = ({ auth }: AuthContext, opts: { headers: Headers }) => {
  return {
    auth,
    db, 
    ...opts
  }
}

export const createTRPCContext = async (opts: { headers: Headers }) => {

  return createInnerTRPCContext({ auth: auth() }, opts)
};

// export const createTRPCContext = async (opts: CreateNextContextOptions) => {
//   const  auth = await getAuth(opts.req)
//   return {
//     db,
//     auth,
//     ...opts,
//   };
// };

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// check if the user is signed in, otherwise through a UNAUTHORIZED CODE
const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
 
  const user = await ctx.db.entrant.findUniqueOrThrow({ 
    where: { userId: ctx.auth.userId },
    include: { team: true}
  })

  return next({
    ctx: {
      auth: ctx.auth,
      entrant: user,
    },
  });
});

const isAdmin = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  if (!ctx.auth.sessionClaims?.metadata?.adminPermission) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

const canSetEntry = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  if (!ctx.auth.sessionClaims?.metadata?.entryPermission && !ctx.auth.sessionClaims?.metadata?.captain) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

const canSetWildcard = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  if (!ctx.auth.sessionClaims?.metadata?.captain && !ctx.auth.sessionClaims?.metadata?.entryPermission) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

const canSetTransaction = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  if (!ctx.auth.sessionClaims?.metadata?.financePermission) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

const canSetCompStatus = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  if (!ctx.auth.sessionClaims?.metadata?.compPermission) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

const canSetComp = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
 
  if (!ctx.auth.sessionClaims?.metadata?.compPermission) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

const canSetEclectic = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
 
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (!(ctx.auth.sessionClaims?.metadata?.adminPermission || ctx.auth.sessionClaims?.metadata?.eclecticPermission)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

// const canSetEntrant = t.middleware(({ next, ctx }) => {
//   if (!ctx.auth.userId) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
  
//   if (!ctx.auth.sessionClaims?.metadata?.entryPermission) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }

//   return next({
//     ctx: {
//       auth: ctx.auth,
//     },
//   });
// });

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
export const entryProcedure = t.procedure.use(canSetEntry);
export const wildcardProcedure = t.procedure.use(canSetWildcard);
export const transactionProcedure = t.procedure.use(canSetTransaction);
export const compStatusProcedure = t.procedure.use(canSetCompStatus);
export const compProcedure = t.procedure.use(canSetComp);
export const eclecticProcedure = t.procedure.use(canSetEclectic);