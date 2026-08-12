"use client";

/**
 * Renders any value described by a FieldSpec. Recursive, so nesting (a project's
 * metrics, a toolkit category's items) needs no special cases — which is what
 * makes every field in content.json editable without hand-writing 18 forms.
 */

import { blankFor, type FieldSpec } from "@/lib/admin/schema";

const humanise = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

const inputClass =
  "w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-[0.9rem] text-ink " +
  "outline-none transition-colors placeholder:text-muted/50 focus:border-blue " +
  "focus:ring-2 focus:ring-blue/20";

const ghostButton =
  "rounded-md border border-line bg-bg-2 px-2 py-1 font-mono text-[0.65rem] tracking-[0.08em] " +
  "uppercase text-muted transition-colors hover:border-blue hover:text-blue " +
  "disabled:cursor-not-allowed disabled:opacity-40";

type Props = {
  spec: FieldSpec;
  value: unknown;
  label?: string;
  hint?: string;
  onChange: (next: unknown) => void;
};

export default function Field({ spec, value, label, hint, onChange }: Props) {
  switch (spec.kind) {
    case "text":
      return (
        <Labelled label={label} hint={hint ?? spec.hint}>
          {spec.long ? (
            <textarea
              className={`${inputClass} min-h-[5.5rem] resize-y leading-relaxed`}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : (
            <input
              type="text"
              className={inputClass}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </Labelled>
      );

    case "number":
      return (
        <Labelled label={label} hint={hint ?? undefined}>
          <input
            type="number"
            step={spec.int ? 1 : "any"}
            className={inputClass}
            value={typeof value === "number" ? value : 0}
            onChange={(e) => {
              const n = e.target.value === "" ? 0 : Number(e.target.value);
              onChange(Number.isFinite(n) ? (spec.int ? Math.round(n) : n) : 0);
            }}
          />
        </Labelled>
      );

    case "bool":
      return (
        <label className="flex cursor-pointer items-center gap-2.5 py-1.5">
          <input
            type="checkbox"
            className="size-4 accent-blue"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-[0.85rem] text-ink">{label ? humanise(label) : ""}</span>
        </label>
      );

    case "enum":
      return (
        <Labelled label={label} hint={hint ?? undefined}>
          <select
            className={inputClass}
            value={typeof value === "string" ? value : spec.values[0]}
            onChange={(e) => onChange(e.target.value)}
          >
            {spec.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Labelled>
      );

    case "list": {
      const items = Array.isArray(value) ? value : [];
      const replace = (i: number, next: unknown) =>
        onChange(items.map((item, j) => (j === i ? next : item)));
      const move = (i: number, delta: number) => {
        const to = i + delta;
        if (to < 0 || to >= items.length) return;
        const next = [...items];
        [next[i], next[to]] = [next[to], next[i]];
        onChange(next);
      };

      return (
        <div className="space-y-3">
          {label ? <FieldLabel label={label} hint={hint} /> : null}

          {items.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-[0.8rem] text-muted">
              Nothing here yet.
            </p>
          ) : null}

          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-line bg-bg/60 p-3 transition-colors hover:border-blue/30"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[0.65rem] tracking-[0.08em] text-muted/70 uppercase">
                  {String(i + 1).padStart(2, "0")}
                  {spec.titleKey ? ` · ${summarise(item, spec.titleKey)}` : ""}
                </span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    className={ghostButton}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={ghostButton}
                    disabled={i === items.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={`${ghostButton} hover:border-red-400 hover:text-red-500`}
                    onClick={() => onChange(items.filter((_, j) => j !== i))}
                    aria-label="Remove"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <Field spec={spec.of} value={item} onChange={(next) => replace(i, next)} />
            </div>
          ))}

          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-blue/40 px-3 py-2 text-[0.8rem] font-semibold text-blue transition-colors hover:bg-soft"
            onClick={() => onChange([...items, blankFor(spec.of)])}
          >
            + Add
          </button>
        </div>
      );
    }

    case "group": {
      const record = (value ?? {}) as Record<string, unknown>;
      const entries = Object.entries(spec.fields);
      return (
        <div className="space-y-3.5">
          {label ? <FieldLabel label={label} hint={hint} /> : null}
          {entries.map(([key, childSpec]) => {
            const nested = childSpec.kind === "list" || childSpec.kind === "group";
            return (
              <div key={key} className={nested ? "rounded-xl bg-soft/40 p-3" : undefined}>
                <Field
                  spec={childSpec}
                  value={record[key]}
                  label={key}
                  onChange={(next) => onChange({ ...record, [key]: next })}
                />
              </div>
            );
          })}
        </div>
      );
    }
  }
}

function summarise(item: unknown, titleKey: string): string {
  if (typeof item === "object" && item !== null) {
    const raw = (item as Record<string, unknown>)[titleKey];
    if (typeof raw === "string" && raw.trim()) {
      return raw.length > 44 ? `${raw.slice(0, 44)}…` : raw;
    }
    if (typeof raw === "number") return String(raw);
    return "untitled";
  }
  return "";
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div>
      <span className="font-mono text-[0.68rem] font-medium tracking-[0.1em] text-muted uppercase">
        {humanise(label)}
      </span>
      {hint ? <p className="mt-0.5 text-[0.75rem] text-muted/70">{hint}</p> : null}
    </div>
  );
}

function Labelled({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  if (!label) return <>{children}</>;
  return (
    <label className="block space-y-1.5">
      <FieldLabel label={label} hint={hint} />
      {children}
    </label>
  );
}
