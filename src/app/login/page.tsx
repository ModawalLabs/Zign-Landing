import type { Metadata } from "next";
import { connection } from "next/server";

import { SignIn, type SignInMode } from "@/components/auth/sign-in";
import { FilmGrain } from "@/components/fx/grain";
import { site } from "@/config/site";

type Props = { searchParams: Promise<{ mode?: string | string[] }> };

/* "Start free" opens this page on its sign-up side; everything else
   opens it to sign in. */
async function modeOf(searchParams: Props["searchParams"]) {
  const { mode } = await searchParams;
  return (mode === "signup" ? "signup" : "signin") satisfies SignInMode;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const mode = await modeOf(searchParams);
  return {
    title: mode === "signup" ? "Start free · Zign" : "Sign in · Zign",
    description: "Sign in to Zign, the agreement copilot.",
    /* A sign-in page is not something to find in search. */
    robots: { index: false, follow: true },
    ...(site.url ? { alternates: { canonical: "/login" } } : {}),
  };
}

export default async function LoginPage({ searchParams }: Props) {
  // Rendered per request so the Content-Security-Policy nonce can be applied.
  await connection();
  const mode = await modeOf(searchParams);

  return (
    <>
      <SignIn mode={mode} />
      <FilmGrain />
    </>
  );
}
