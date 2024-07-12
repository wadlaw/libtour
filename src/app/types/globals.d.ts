export { };

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      teamId?: "2B" | "BB" | "BD" | "EU" | "RF" | "SH" | "SW",
      captain?: boolean,
        entryPermission?: boolean,
        financePermission?: boolean,
        compPermission?: boolean,
        adminPermission?: boolean,
    };
  }
}