import { createMcpHandler } from "@modelcontextprotocol/server";

import { createLibtourMcpServer } from "~/server/mcp/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = createMcpHandler(() => createLibtourMcpServer());

const handle = (request: Request) => handler.fetch(request);

export { handle as GET, handle as POST, handle as DELETE };
