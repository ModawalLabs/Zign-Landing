import { connection } from "next/server";

import { Everybody } from "@/components/home/everybody";
import { Hero } from "@/components/home/hero";
import { Start } from "@/components/home/start";

/**
 * The home page, kept to three scenes: the brand's verb and its proof
 * (one pinned opening), who it is for, and where to begin. Everything
 * else about the product lives on the product page.
 */
export default async function Home() {
  // Rendered per request so the Content-Security-Policy nonce can be applied.
  await connection();

  return (
    <>
      <Hero />
      <Everybody />
      <Start />
    </>
  );
}
