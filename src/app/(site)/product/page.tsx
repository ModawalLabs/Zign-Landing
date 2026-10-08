import type { Metadata } from "next";
import { connection } from "next/server";

import { Capabilities } from "@/components/sections/capabilities";
import { Closing } from "@/components/sections/closing";
import { Copilot } from "@/components/sections/copilot";
import { Pricing } from "@/components/sections/pricing";
import { ProductHeader } from "@/components/sections/product-header";
import { Record } from "@/components/sections/record";
import { Workflow } from "@/components/sections/workflow";
import { Workspace } from "@/components/sections/workspace";
import { ProgressRail } from "@/components/site/progress-rail";
import { SpotlightTracker } from "@/components/ui/spotlight";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Product · Zign",
  description:
    "How Zign drafts, prepares, negotiates and signs agreements with you, what Zign AI does on the page, how every signature is sealed, and what it costs.",
  ...(site.url ? { alternates: { canonical: "/product" } } : {}),
};

/** Everything Zign does, in the order an agreement meets it. */
export default async function ProductPage() {
  // Rendered per request so the Content-Security-Policy nonce can be applied.
  await connection();

  return (
    <>
      <ProductHeader />
      <Workflow />
      <Copilot />
      <Workspace />
      <Capabilities />
      <Record />
      <Pricing />
      <Closing secondary={{ href: site.links.signIn, label: "Sign in" }} />
      <ProgressRail />
      <SpotlightTracker />
    </>
  );
}
