import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
 
// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
 
export default authMiddleware({
  afterAuth(auth, req) {
    
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // Redirect signed in users to organization selection page if they are not active in an organization
    // ! Changed to not use organizations and role due to limitations. Each user now has their own metadata with their permissions
    // if (
    //   auth.userId &&
    //   !auth.orgId &&
    //   req.nextUrl.pathname !== "/org-selection"
    // ) {
    //   const orgSelection = new URL("/org-selection", req.url);
    //   return NextResponse.redirect(`${orgSelection}?redir=${req.nextUrl.pathname}`);
    // }
    
    // Finance Routes=================
    //all routes that start with '/accounts' to be classed as finance routes
    if (req.nextUrl.pathname.startsWith('/accounts')) {
      if (!auth.sessionClaims?.metadata?.financePermission){
        const homePage = new URL("/", req.url);
        return NextResponse.redirect(homePage);
      }
      return NextResponse.next();
    } 

    // Admin routes=====================
    const adminRoutes = ['/users']

    if (adminRoutes.includes(req.nextUrl.pathname)) {
      if (!auth.sessionClaims?.metadata?.adminPermission){
        const homePage = new URL("/", req.url);
        return NextResponse.redirect(homePage);
      }
      return NextResponse.next();
    }
    // If the user is signed in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      
    }
    // Allow users visiting public routes to access them or any other routes that reached this point
    return NextResponse.next();
  },
  // Allow signed out users to access the specified routes:
  publicRoutes: ['/', '/teams', '/teams/:path', '/events', '/events/:path', '/entrants/:path', '/api/webhooks/user', '/sign-in', '/prizewinners', '/halloffame', '/wallofshame', '/eclectic', '/honoursboards'],
  // Prevent the specified routes from accessing
  // authentication information:
  // ignoredRoutes: ['/no-auth-in-this-route'],
});
 
export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
 
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)"
  ]
};