import type { Prisma } from "@prisma/client";

export const publicEntrantSelect = {
  id: true,
  name: true,
  systemName: true,
  captain: true,
  teamId: true,
  team: {
    select: {
      id: true,
      teamName: true,
      linkName: true,
    },
  },
} satisfies Prisma.EntrantSelect;

export const publicEntrantProfileSelect = {
  ...publicEntrantSelect,
  user: {
    select: {
      avatarUrl: true,
    },
  },
} satisfies Prisma.EntrantSelect;
