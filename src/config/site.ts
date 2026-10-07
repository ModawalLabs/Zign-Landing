/* Only http(s) origins are accepted, so a misconfigured value can never
   become a javascript: link. */
function safeOrigin(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.origin
      : fallback;
  } catch {
    return fallback;
  }
}

/* A contact address is shown only when one is configured and looks like one. */
function safeMailto(value: string | undefined) {
  if (!value) return null;
  return /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(value)
    ? `mailto:${value}`
    : null;
}

/* This site's own public origin. Empty in development, which leaves the
   sitemap empty and metadata relative. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? safeOrigin(process.env.NEXT_PUBLIC_SITE_URL, "")
  : "";

export const site = {
  name: "Zign",
  url: siteUrl,
  links: {
    /* Every call to action opens the sign-in page; the ones that start
       an account open it on its sign-up side. */
    start: "/login?mode=signup",
    signIn: "/login",
    contact: safeMailto(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  },
  nav: [
    { label: "How it works", href: "#workflow" },
    { label: "Copilot", href: "#copilot" },
    { label: "Workspace", href: "#workspace" },
    { label: "Security", href: "#record" },
    { label: "Pricing", href: "#pricing" },
  ],
} as const;
