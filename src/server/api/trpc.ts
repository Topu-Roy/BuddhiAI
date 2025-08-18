/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { getServerAuthSession } from "@/auth/auth";
import { db } from "@/server/db";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { tryCatch } from "@/lib/helpers/try-catch";

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
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get type-safety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

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
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise(resolve => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Provides context for authenticationMiddleware (ctx)
 */
type AuthenticatedContext = {
  session: NonNullable<Awaited<ReturnType<typeof getServerAuthSession>>>["session"];
  user: NonNullable<Awaited<ReturnType<typeof getServerAuthSession>>>["user"];
};

/**
 * tRPC middleware for authenticating incoming requests.
 *
 * - Attempts to retrieve the current user session via `getServerAuthSession()`.
 * - Throws an INTERNAL_SERVER_ERROR if session retrieval fails unexpectedly.
 * - Throws an UNAUTHORIZED error if there is no valid authenticated user.
 * - Passes the `session` and `user` objects into `ctx` for all downstream procedures.
 *
 * Use this middleware for protecting procedures that require the user to be logged in.
 */
const authenticationMiddleware = t.middleware(async ({ next }) => {
  const { data: session, error: sessionError } = await tryCatch(getServerAuthSession());

  if (sessionError)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to check authentication" });
  if (!session?.user.id) throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });

  const result = await next({
    ctx: {
      session: session.session,
      user: session.user,
    } satisfies AuthenticatedContext,
  });

  return result;
});

/**
 * Provides context for adminMiddleware (ctx)
 */
type AdminAuthenticationContext = {
  session: NonNullable<Awaited<ReturnType<typeof getServerAuthSession>>>["session"];
  user: NonNullable<Awaited<ReturnType<typeof getServerAuthSession>>>["user"];
  profile: {
    id: string;
    email: string;
  };
};

/**
 * tRPC middleware for authenticating incoming requests for Admin or super user.
 *
 * - Throws an UNAUTHORIZED error if user is not admin.
 *
 * Use this middleware for protecting procedures that require the user to be an Admin.
 */
const adminMiddleware = t.middleware(async ({ next, ctx }) => {
  const { data: session, error: sessionError } = await tryCatch(getServerAuthSession());

  if (sessionError)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to check authentication" });
  if (!session?.user.id || !session.session.id)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });

  // Get the profile
  const { data: profile, error: profileError } = await tryCatch(
    ctx.db.profile.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        email: true,
      },
    })
  );

  if (profileError) {
    console.error(profileError);
    throw new TRPCError({ code: "NOT_FOUND", message: "User profile query failed" });
  }

  if (!profile?.id) throw new TRPCError({ code: "NOT_FOUND", message: "User profile not found" });

  // Check if admin or not
  if (profile.email !== "topu.roy.ttr@gmail.com")
    throw new TRPCError({ code: "FORBIDDEN", message: "Not an admin" });

  const result = await next({
    ctx: {
      session: session.session,
      user: session.user,
      profile: profile,
    } satisfies AdminAuthenticationContext,
  });

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * - Base procedure for endpoints that require the user to be logged in.
 * - Runs the `authenticationMiddleware` to validate the session and inject `ctx.user` + `ctx.session`.
 * - Throws UNAUTHORIZED if no valid session is found.
 * - Guarantees strongly typed `ctx.user` and `ctx.session` for downstream resolvers.
 */
export const protectedProcedure = t.procedure.use(authenticationMiddleware);

/**
 * Admin procedure
 *
 * - Base procedure for endpoints that require the user to be logged in and an admin.
 * - Runs the `adminMiddleware` to validate the session and inject `ctx.user` + `ctx.session`.
 * - Guarantees strongly typed `ctx.user` and `ctx.session` for downstream resolvers.
 */
export const adminProcedure = t.procedure.use(adminMiddleware);
