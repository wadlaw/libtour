"use server";
import { cookies } from "next/headers";

export async function SetHandicapIndex(handicapIndex: number) {
  const cookieStore = cookies();
  cookieStore.set("handicapIndex", handicapIndex.toString());
  return {
    success: true,
  };
}
