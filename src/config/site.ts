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
  url: siteUrl,
  links: {
    /* Every call to action opens the sign-in page; the ones that start
       an account open it on its sign-up side. */
    start: "/login?mode=signup",
    signIn: "/login",
    contact: safeMailto(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  },
  /* The top navigation. The home page is the landing page; everything
     else lives on the product page, so the links lead into it. */
  nav: [
    { label: "Product", href: "/product" },
    { label: "Zign AI", href: "/product#copilot" },
    { label: "Security", href: "/product#record" },
    { label: "Pricing", href: "/product#pricing" },
  ],
} as const;

/* The product page's sections, in order. Its "on this page" list, the
   progress rail and the footer all read from here, so a section is added
   or renamed in one place. */
export const productSections = [
  { id: "workflow", n: "01", label: "How it works", night: false },
  { id: "copilot", n: "02", label: "Zign AI", night: true },
  { id: "workspace", n: "03", label: "Workspace", night: false },
  { id: "capabilities", n: "04", label: "Around the signature", night: false },
  { id: "record", n: "05", label: "Security", night: false },
  { id: "pricing", n: "06", label: "Pricing", night: false },
] as const;
