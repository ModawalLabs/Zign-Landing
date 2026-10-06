"use client";

import { motion } from "motion/react";

import { SignatureMark } from "@/components/ui/signature-mark";
import { Tick } from "@/components/ui/tick";
import { useBeats } from "@/lib/use-beats";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const FIELDS = [
  { label: "Signature", tone: 0 },
  { label: "Name", tone: 0 },
  { label: "Date", tone: 0 },
  { label: "Signature", tone: 1 },
  { label: "Name", tone: 1 },
  { label: "Date", tone: 1 },
] as const;

const CHECKS = [
  "Parties and addresses",
  "Governing law",
  "Payment terms",
  "Signature blocks",
];

/** Chapter 2: smart setup finds the signers and fields; the checkpoint runs. */
export function PrepareScene({ play }: { play: boolean }) {
  const reduce = usePrefersReducedMotion();
  const beat = useBeats(
    play,
    [
      300, 700, 1100, 1300, 1500, 1700, 1900, 2100, 2600, 3000, 3400, 3800,
      4300,
    ],
    reduce,
  );
  // 1 signers · 2 fields label · 3–8 fields · 9 order · 10–13 checks · 14 flag
  return (
    <div className="flex h-full flex-col gap-4">
      <Card>
        <Header
          title="Smart setup"
          aside={beat >= 9 ? "Done in 2.4s" : beat >= 1 ? "Reading" : ""}
        />
        <dl className="divide-y divide-line-soft text-[12.5px]">
          <Row label="Signers" show={beat >= 1}>
            <span className="flex items-center gap-3">
              <Person initials="HB" name="Hannah Brooks" tone={0} />
              <Person initials="ME" name="Maya Ellison" tone={1} />
            </span>
          </Row>
          <Row label="Fields" show={beat >= 2}>
            <span className="flex flex-wrap gap-1.5">
              {FIELDS.map((f, i) => (
                <motion.span
                  key={i}
                  initial={false}
                  animate={
                    beat >= 3 + i
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.85 }
                  }
                  transition={{ duration: 0.4, ease: EASE }}
                  className={cn(
                    "rounded-[4px] border border-dashed px-1.5 py-0.5 text-[10.5px] font-medium",
                    f.tone === 0
                      ? "border-indigo/50 bg-indigo/[0.05] text-indigo"
                      : "border-ink/30 bg-ink/[0.03] text-ink-soft",
                  )}
                >
                  {f.label}
                </motion.span>
              ))}
            </span>
          </Row>
          <Row label="Order" show={beat >= 9}>
            <span className="text-ink-soft">
              Hannah Brooks, then Maya Ellison
            </span>
          </Row>
        </dl>
      </Card>

      <Card className="flex-1">
        <Header
          title="Compliance checkpoint"
          aside={
            beat >= 14
              ? "1 to resolve"
              : beat >= 10
                ? `${Math.min(beat - 9, 4)} of 5`
                : ""
          }
          plain
        />
        <ul className="space-y-2.5 px-4 pt-1 pb-4 text-[12.5px] sm:px-5">
          {CHECKS.map((c, i) => {
            const done = beat >= 10 + i;
            return (
              <li key={c} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full transition-colors duration-300",
                    done ? "bg-signed text-night" : "border border-line",
                  )}
                >
                  {done && <Tick className="size-2.5" />}
                </span>
                <span className={done ? "text-ink-soft" : "text-subtle"}>
                  {c}
                </span>
              </li>
            );
          })}
          <li>
            <motion.div
              initial={false}
              animate={
                beat >= 14
                  ? { opacity: 1, height: "auto", marginTop: 4 }
                  : { opacity: 0, height: 0, marginTop: 0 }
              }
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-pending/25 bg-pending/[0.06] p-3">
                <p className="flex items-center gap-2 font-medium text-pending">
                  <span className="grid size-4 place-items-center rounded-full bg-pending text-[9px] font-bold text-night">
                    !
                  </span>
                  Schedule B is missing
                </p>
                <p className="mt-1 pl-6 text-[12px] leading-relaxed text-ink-soft">
                  Clause 9 refers to Schedule B, which isn&rsquo;t attached.
                </p>
                <div className="mt-2.5 flex gap-1.5 pl-6">
                  <span className="rounded-md bg-ink px-2.5 py-1 text-[11px] font-medium text-paper">
                    Attach it
                  </span>
                  <span className="rounded-md border border-line bg-card px-2.5 py-1 text-[11px] text-ink-soft">
                    Remove the reference
                  </span>
                </div>
              </div>
            </motion.div>
          </li>
        </ul>
      </Card>
    </div>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-card shadow-panel",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Header({
  title,
  aside,
  plain = false,
}: {
  title: string;
  aside: string;
  plain?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-3 sm:px-5",
        !plain && "border-b border-line-soft",
      )}
    >
      {!plain && (
        <SignatureMark size={16} strokeWidth={9} className="text-indigo" />
      )}
      <span className="text-[13px] font-semibold text-ink">{title}</span>
      <motion.span
        key={aside}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="ml-auto font-mono text-[10.5px] text-subtle"
        data-tabular
      >
        {aside}
      </motion.span>
    </div>
  );
}

function Row({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[64px_1fr] items-center gap-3 px-4 py-3 sm:grid-cols-[76px_1fr] sm:px-5">
      <dt className="text-muted">{label}</dt>
      <dd className="min-h-6">
        <motion.div
          initial={false}
          animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {children}
        </motion.div>
      </dd>
    </div>
  );
}

function Person({
  initials,
  name,
  tone,
}: {
  initials: string;
  name: string;
  tone: 0 | 1;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={cn(
          "grid size-6 place-items-center rounded-full text-[9px] font-semibold",
          tone === 0 ? "bg-indigo text-night" : "bg-ink text-paper",
        )}
      >
        {initials}
      </span>
      <span className="text-ink-soft">{name}</span>
    </span>
  );
}
