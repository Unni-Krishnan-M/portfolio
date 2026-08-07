"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, seeded } from "@/lib/utils";
import type { Project } from "@/data/projects";

type Variant = Project["visual"];

/**
 * Procedurally drawn "interface portraits".
 *
 * None of these are screenshots — most of these repos aren't deployed, so
 * faking a product shot would be dishonest. Each variant is abstract UI
 * geometry: deep-navy panel, blue line art, assembled on entrance and left
 * with a slow ambient loop. Purely decorative, hence `aria-hidden`.
 *
 * Animation is class-driven so a variant only has to author markup:
 *   .pv-draw  strokes draw themselves      .pv-bar   grows from its baseline
 *   .pv-grow  extends from the left        .pv-node  lights up in place
 *   .pv-row   slides in                    .pv-fade  rises and fades in
 *   .pv-pop   scales up                    .pv-count counts to `data-to`
 *   .pv-pulse ambient breathing            .pv-flow  ambient dash travel
 *   .pv-fall  ambient drop of `data-dist`  .pv-sweep ambient scan sweep
 */

const PANEL = "#0B2350";
const EDGE = "#1E3E7A";
const BLUE = "#1261FF";
const ELEC = "#00C2FF";
const DIM = "#5C7DB8";
const WIRE = "#284B8C";

const MONO = "ui-monospace, SFMono-Regular, monospace";

function T({
  x,
  y,
  children,
  fill = DIM,
  size = 6,
  weight,
  anchor,
  className,
}: {
  x: number;
  y: number;
  children: ReactNode;
  fill?: string;
  size?: number;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={size}
      fontWeight={weight}
      fontFamily={MONO}
      letterSpacing="0.1em"
      textAnchor={anchor}
      className={className}
    >
      {children}
    </text>
  );
}

/** Window chrome shared by most variants. */
function Chrome({ label }: { label: string }) {
  return (
    <g className="pv-fade">
      <rect x="0" y="0" width="320" height="15" fill="#061634" />
      <line x1="0" y1="15" x2="320" y2="15" stroke={EDGE} strokeWidth="1" />
      {[10, 17.5, 25].map((cx, i) => (
        <circle key={cx} cx={cx} cy="7.5" r="2" fill={i === 0 ? BLUE : i === 1 ? "#24457F" : "#1B3565"} />
      ))}
      <T x={36} y={10} size={5}>
        {label}
      </T>
    </g>
  );
}

/* ------------------------------------------------------------------ backend */

function Backend() {
  const rows = [
    { m: "GET", w: 60 },
    { m: "POST", w: 78 },
    { m: "POST", w: 48 },
    { m: "PUT", w: 66 },
    { m: "DEL", w: 54 },
  ];
  const layers = ["api / v1", "services", "repositories", "models"];

  return (
    <>
      <Chrome label="fastapi · layered" />

      <rect className="pv-fade" x="8" y="24" width="126" height="120" rx="6" fill={PANEL} stroke={EDGE} />
      {rows.map((r, i) => (
        <g className="pv-row" key={r.m + i}>
          <rect
            x="14"
            y={32 + i * 22}
            width="27"
            height="11"
            rx="3"
            fill={i % 2 ? "rgba(0,194,255,0.14)" : "rgba(18,97,255,0.2)"}
            stroke={EDGE}
          />
          <T x={17} y={40 + i * 22} size={4.6} fill={i % 2 ? ELEC : "#89AEFF"} weight={700}>
            {r.m}
          </T>
          <rect className="pv-grow" x="46" y={35 + i * 22} width={r.w} height="4" rx="2" fill={WIRE} />
        </g>
      ))}

      {layers.map((l, i) => (
        <g className="pv-row" key={l}>
          <rect
            x="146"
            y={26 + i * 30}
            width="166"
            height="22"
            rx="5"
            fill={PANEL}
            stroke={i === 0 ? "rgba(18,97,255,0.55)" : EDGE}
          />
          <T x={154} y={40 + i * 30} size={5.4} fill={i === 0 ? "#A8C6FF" : DIM}>
            {l.toUpperCase()}
          </T>
          <rect x={296} y={33 + i * 30} width="8" height="8" rx="2" fill="rgba(18,97,255,0.28)" />
        </g>
      ))}

      {/* the request travelling down through the layers */}
      <line className="pv-draw" x1="229" y1="48" x2="229" y2="116" stroke={BLUE} strokeWidth="1" strokeDasharray="3 4" />
      <circle className="pv-fall" data-dist="66" cx="229" cy="50" r="3.2" fill={ELEC} />

      <rect className="pv-fade" x="8" y="152" width="304" height="38" rx="6" fill={PANEL} stroke={EDGE} />
      <T x={18} y={166} size={5}>
        POSTGRES · PGVECTOR
      </T>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect
          className="pv-bar"
          key={i}
          x={18 + i * 13}
          y={182 - (5 + seeded(i * 4.2) * 11)}
          width="7"
          height={5 + seeded(i * 4.2) * 11}
          rx="1.5"
          fill={i % 3 === 0 ? ELEC : BLUE}
          opacity="0.7"
        />
      ))}
      <circle className="pv-node pv-pulse" cx="296" cy="171" r="3" fill="#2FE08A" />
      <T x={288} y={185} size={4.4} anchor="middle">
        UP
      </T>
    </>
  );
}

/* --------------------------------------------------------------------- chat */

function Chat() {
  const cluster = [
    { x: 258, y: 148 },
    { x: 284, y: 136 },
    { x: 300, y: 158 },
    { x: 268, y: 172 },
    { x: 294, y: 180 },
  ];
  return (
    <>
      <Chrome label="assistant · session" />

      <g className="pv-pop">
        <rect x="14" y="26" width="128" height="26" rx="9" fill={PANEL} stroke={EDGE} />
        <rect className="pv-grow" x="22" y="34" width="86" height="3.5" rx="1.75" fill={WIRE} />
        <rect className="pv-grow" x="22" y="42" width="58" height="3.5" rx="1.75" fill={WIRE} />
      </g>

      <g className="pv-pop">
        <rect x="150" y="60" width="156" height="36" rx="9" fill="rgba(18,97,255,0.18)" stroke="rgba(18,97,255,0.5)" />
        <rect className="pv-grow" x="158" y="68" width="120" height="3.5" rx="1.75" fill="rgba(168,198,255,0.7)" />
        <rect className="pv-grow" x="158" y="76" width="140" height="3.5" rx="1.75" fill="rgba(168,198,255,0.5)" />
        <rect className="pv-grow" x="158" y="84" width="74" height="3.5" rx="1.75" fill="rgba(168,198,255,0.35)" />
      </g>

      <g className="pv-pop">
        <rect x="14" y="104" width="142" height="26" rx="9" fill={PANEL} stroke={EDGE} />
        <rect className="pv-grow" x="22" y="112" width="104" height="3.5" rx="1.75" fill={WIRE} />
        <rect className="pv-grow" x="22" y="120" width="66" height="3.5" rx="1.75" fill={WIRE} />
      </g>

      {/* typing indicator */}
      <g className="pv-fade">
        <rect x="14" y="140" width="46" height="18" rx="9" fill={PANEL} stroke={EDGE} />
        {[24, 32, 40].map((cx) => (
          <circle className="pv-pulse" key={cx} cx={cx} cy="149" r="2.4" fill={ELEC} />
        ))}
      </g>

      {/* output formats */}
      {["PDF", "PPTX"].map((f, i) => (
        <g className="pv-fade" key={f}>
          <rect x={14 + i * 44} y="168" width="40" height="16" rx="4" fill="rgba(0,194,255,0.1)" stroke={EDGE} />
          <T x={34 + i * 44} y={179} size={5} anchor="middle" fill={ELEC}>
            {f}
          </T>
        </g>
      ))}

      {/* small node cluster */}
      {cluster.map((n, i) =>
        cluster.slice(i + 1).map((m) => (
          <line
            className="pv-draw"
            key={`${n.x}-${m.x}`}
            x1={n.x}
            y1={n.y}
            x2={m.x}
            y2={m.y}
            stroke={WIRE}
            strokeWidth="0.8"
          />
        )),
      )}
      {cluster.map((n, i) => (
        <circle
          className={cn("pv-node", i % 2 === 0 && "pv-pulse")}
          key={`n${n.x}`}
          cx={n.x}
          cy={n.y}
          r={i === 1 ? 4 : 2.6}
          fill={i === 1 ? ELEC : BLUE}
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- dashboard */

function Dashboard() {
  const bars = [0.42, 0.68, 0.35, 0.86, 0.55, 0.74, 0.48];
  return (
    <>
      <Chrome label="admin · analytics" />

      {/* sidebar */}
      <rect className="pv-fade" x="8" y="22" width="56" height="168" rx="6" fill={PANEL} stroke={EDGE} />
      <rect className="pv-grow" x="15" y="30" width="26" height="5" rx="2.5" fill={BLUE} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g className="pv-row" key={i}>
          <rect x="15" y={48 + i * 17} width="6" height="6" rx="1.5" fill={i === 1 ? ELEC : WIRE} />
          <rect x="26" y={50 + i * 17} width={16 + seeded(i * 9) * 20} height="3" rx="1.5" fill={i === 1 ? "#A8C6FF" : WIRE} />
        </g>
      ))}

      {/* stat tiles */}
      {[0, 1, 2].map((i) => (
        <g className="pv-pop" key={`t${i}`}>
          <rect x={72 + i * 82} y="22" width="76" height="36" rx="5" fill={PANEL} stroke={EDGE} />
          <T x={79 + i * 82} y={34} size={4.6}>
            {["VERIFIED", "PENDING", "REJECTED"][i]}
          </T>
          <T x={79 + i * 82} y={50} size={13} weight={700} fill={i === 0 ? "#DCE9FF" : i === 1 ? ELEC : "#7FA0D8"} className="pv-count" >
            <tspan data-to={[86, 24, 7][i]}>{[86, 24, 7][i]}</tspan>
          </T>
        </g>
      ))}

      {/* chart */}
      <rect className="pv-fade" x="72" y="64" width="158" height="62" rx="5" fill={PANEL} stroke={EDGE} />
      {bars.map((b, i) => (
        <rect
          className="pv-bar"
          key={i}
          x={82 + i * 20}
          y={118 - b * 42}
          width="11"
          height={b * 42}
          rx="2"
          fill={i === 3 ? ELEC : "rgba(18,97,255,0.75)"}
        />
      ))}
      <polyline
        className="pv-draw"
        points={bars.map((b, i) => `${87.5 + i * 20},${118 - b * 42 - 5}`).join(" ")}
        fill="none"
        stroke={ELEC}
        strokeWidth="1.2"
      />

      {/* side panel */}
      <rect className="pv-fade" x="238" y="64" width="74" height="62" rx="5" fill={PANEL} stroke={EDGE} />
      <circle cx="275" cy="95" r="20" fill="none" stroke={EDGE} strokeWidth="5" />
      <circle
        cx="275"
        cy="95"
        r="20"
        fill="none"
        stroke={BLUE}
        strokeWidth="5"
        strokeDasharray="88 126"
        transform="rotate(-90 275 95)"
      />
      <circle className="pv-node pv-pulse" cx="275" cy="75" r="2.6" fill={ELEC} />

      {/* table */}
      <rect className="pv-fade" x="72" y="132" width="240" height="58" rx="5" fill={PANEL} stroke={EDGE} />
      {[0, 1, 2, 3].map((i) => (
        <g className="pv-row" key={`r${i}`}>
          <rect x="80" y={141 + i * 13} width={54 + seeded(i * 6) * 40} height="3.4" rx="1.7" fill={WIRE} />
          <rect x="200" y={141 + i * 13} width="34" height="3.4" rx="1.7" fill={WIRE} />
          <rect
            x={266}
            y={138 + i * 13}
            width="38"
            height="9"
            rx="4.5"
            fill={i % 2 ? "rgba(0,194,255,0.14)" : "rgba(18,97,255,0.2)"}
          />
        </g>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------- neural */

const NEURAL_NODES = Array.from({ length: 22 }, (_, i) => {
  const a = seeded(i * 1.37) * Math.PI * 2;
  const r = 0.3 + seeded(i * 2.11) * 0.7;
  // Rounded for the same SSR/client trig-precision reason as elsewhere.
  const q = (n: number) => Math.round(n * 1e4) / 1e4;
  return { x: q(160 + Math.cos(a) * r * 120), y: q(104 + Math.sin(a) * r * 64) };
});

const NEURAL_EDGES: [number, number][] = [];
NEURAL_NODES.forEach((n, i) => {
  NEURAL_NODES.forEach((m, j) => {
    if (j <= i || NEURAL_EDGES.length > 36) return;
    if (Math.hypot(n.x - m.x, n.y - m.y) < 44) NEURAL_EDGES.push([i, j]);
  });
});

function Neural() {
  return (
    <>
      <Chrome label="matching engine" />

      <ellipse cx="160" cy="104" rx="128" ry="72" fill="rgba(18,97,255,0.05)" />
      {NEURAL_EDGES.map(([a, b], i) => {
        const n = NEURAL_NODES[a];
        const m = NEURAL_NODES[b];
        const live = i % 5 === 0;
        return (
          <line
            className={cn("pv-draw", live && "pv-flow")}
            key={`${a}-${b}`}
            x1={n.x}
            y1={n.y}
            x2={m.x}
            y2={m.y}
            stroke={live ? ELEC : WIRE}
            strokeWidth={live ? 1 : 0.7}
            strokeDasharray={live ? "4 6" : undefined}
            opacity={live ? 0.9 : 0.55}
          />
        );
      })}
      {NEURAL_NODES.map((n, i) => (
        <g key={`nn${i}`}>
          {i % 4 === 0 && (
            <circle className="pv-pulse" cx={n.x} cy={n.y} r="7" fill="none" stroke={BLUE} strokeWidth="0.8" opacity="0.5" />
          )}
          <circle
            className="pv-node"
            cx={n.x}
            cy={n.y}
            r={i % 6 === 0 ? 3.8 : 2.3}
            fill={i % 3 === 0 ? ELEC : "#7FA8FF"}
          />
        </g>
      ))}

      {["STUDENT", "INDUSTRY", "ADMIN"].map((l, i) => (
        <g className="pv-fade" key={l}>
          <rect x={16 + i * 98} y="176" width="90" height="16" rx="4" fill={PANEL} stroke={i === 0 ? "rgba(18,97,255,0.5)" : EDGE} />
          <T x={61 + i * 98} y={187} size={5} anchor="middle" fill={i === 0 ? "#A8C6FF" : DIM}>
            {l}
          </T>
        </g>
      ))}
    </>
  );
}

/* -------------------------------------------------------------- supplychain */

function SupplyChain() {
  const blocks = [0, 1, 2, 3];
  const hashes = ["0x9f4a", "0x21c8", "0xbe07", "0x5d13"];
  const curve = [0.3, 0.42, 0.38, 0.56, 0.62, 0.58, 0.74];
  return (
    <>
      <Chrome label="sha256 ledger" />

      {blocks.map((i) => (
        <g className="pv-pop" key={i}>
          <rect x={12 + i * 76} y="30" width="64" height="46" rx="5" fill={PANEL} stroke={i === 3 ? "rgba(0,194,255,0.55)" : EDGE} />
          <rect className="pv-grow" x={19 + i * 76} y="38" width="34" height="3.4" rx="1.7" fill={WIRE} />
          <rect className="pv-grow" x={19 + i * 76} y="46" width="48" height="3.4" rx="1.7" fill={WIRE} />
          <T x={19 + i * 76} y={62} size={5.4} fill={i === 3 ? ELEC : DIM}>
            {hashes[i]}
          </T>
          <T x={19 + i * 76} y={71} size={4.2}>
            BLOCK {i + 1}
          </T>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <line
          className="pv-flow"
          key={`l${i}`}
          x1={76 + i * 76}
          y1="53"
          x2={88 + i * 76}
          y2="53"
          stroke={BLUE}
          strokeWidth="1.4"
          strokeDasharray="3 3"
        />
      ))}

      {/* QR-ish batch mark */}
      <g className="pv-fade">
        <rect x="12" y="88" width="52" height="52" rx="4" fill={PANEL} stroke={EDGE} />
        {Array.from({ length: 24 }).map((_, i) => (
          <rect
            key={i}
            x={18 + (i % 6) * 7}
            y={94 + Math.floor(i / 6) * 7}
            width="5"
            height="5"
            rx="1"
            fill={seeded(i * 3.7) > 0.45 ? "rgba(168,198,255,0.75)" : "transparent"}
          />
        ))}
      </g>

      {/* forecast chart */}
      <rect className="pv-fade" x="74" y="88" width="238" height="52" rx="5" fill={PANEL} stroke={EDGE} />
      <polyline
        className="pv-draw"
        points={curve.map((v, i) => `${84 + i * 26},${132 - v * 38}`).join(" ")}
        fill="none"
        stroke={BLUE}
        strokeWidth="1.4"
      />
      <polyline
        className="pv-draw"
        points={`${84 + 6 * 26},${132 - curve[6] * 38} ${84 + 7 * 26},${132 - 0.84 * 38} ${84 + 8 * 26},${132 - 0.92 * 38}`}
        fill="none"
        stroke={ELEC}
        strokeWidth="1.4"
        strokeDasharray="4 4"
      />
      {curve.map((v, i) => (
        <circle className="pv-node" key={i} cx={84 + i * 26} cy={132 - v * 38} r="1.8" fill="#A8C6FF" />
      ))}
      <T x={84} y={100} size={4.6}>
        DEMAND FORECAST · ENSEMBLE
      </T>

      {/* risk index */}
      <rect className="pv-fade" x="12" y="150" width="300" height="40" rx="5" fill={PANEL} stroke={EDGE} />
      <T x={20} y={164} size={4.6}>
        SUPPLY CHAIN RISK INDEX
      </T>
      <rect x="20" y="172" width="240" height="6" rx="3" fill={WIRE} />
      <rect className="pv-grow" x="20" y="172" width="146" height="6" rx="3" fill={BLUE} />
      <T x={272} y={178} size={9} weight={700} fill={ELEC} className="pv-count pv-fade">
        <tspan data-to={61}>61</tspan>
      </T>
    </>
  );
}

/* -------------------------------------------------------------------- event */

const STARS = Array.from({ length: 34 }, (_, i) => ({
  x: seeded(i * 1.91) * 320,
  y: seeded(i * 3.17) * 130,
  r: 0.5 + seeded(i * 5.3) * 1.4,
}));

function Event() {
  const digits = [
    { v: 18, l: "HRS" },
    { v: 42, l: "MIN" },
    { v: 9, l: "SEC" },
  ];
  return (
    <>
      {STARS.map((s, i) => (
        <circle
          className={cn("pv-node", i % 6 === 0 && "pv-pulse")}
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={i % 5 === 0 ? ELEC : "#8FB4FF"}
          opacity={0.35 + seeded(i * 7.1) * 0.6}
        />
      ))}

      <T x={160} y={38} size={5.4} anchor="middle" className="pv-fade">
        HACKFINITY 3.0 · STARTS IN
      </T>

      {digits.map((d, i) => (
        <g className="pv-fade" key={d.l}>
          <rect x={20 + i * 100} y="52" width="80" height="52" rx="7" fill="rgba(11,35,80,0.72)" stroke={EDGE} />
          <T
            x={60 + i * 100}
            y={92}
            size={30}
            weight={800}
            anchor="middle"
            fill={i === 1 ? ELEC : "#E3EDFF"}
            className="pv-count"
          >
            <tspan data-to={d.v}>{String(d.v).padStart(2, "0")}</tspan>
          </T>
          <T x={60 + i * 100} y={116} size={4.8} anchor="middle">
            {d.l}
          </T>
        </g>
      ))}

      {/* track grid receding to a vanishing point */}
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => (
        <line
          className="pv-draw"
          key={k}
          x1={160 + k * 8}
          y1="128"
          x2={160 + k * 62}
          y2="200"
          stroke={WIRE}
          strokeWidth="0.8"
          opacity="0.7"
        />
      ))}
      {[142, 158, 178, 200].map((y, i) => (
        <line className="pv-grow" key={y} x1="0" y1={y} x2="320" y2={y} stroke={i === 0 ? EDGE : WIRE} strokeWidth="0.8" opacity="0.6" />
      ))}
      <circle className="pv-node pv-pulse" cx="160" cy="128" r="3" fill={ELEC} />
    </>
  );
}

/* ------------------------------------------------------------------- mobile */

function Mobile() {
  return (
    <>
      <Chrome label="flutter · riverpod" />

      {/* floating side chips */}
      {["ML KIT SCAN", "STATE MACHINE", "OFFLINE CACHE"].map((c, i) => (
        <g className="pv-row" key={c}>
          <rect x="12" y={38 + i * 26} width="82" height="18" rx="9" fill={PANEL} stroke={EDGE} />
          <T x={20} y={50 + i * 26} size={4.6}>
            {c}
          </T>
        </g>
      ))}
      <line className="pv-draw" x1="94" y1="47" x2="112" y2="60" stroke={WIRE} strokeWidth="0.8" strokeDasharray="3 3" />
      <line className="pv-draw" x1="94" y1="73" x2="112" y2="86" stroke={WIRE} strokeWidth="0.8" strokeDasharray="3 3" />

      {/* phone */}
      <g className="pv-pop">
        <rect x="112" y="24" width="104" height="166" rx="16" fill={PANEL} stroke="rgba(18,97,255,0.45)" strokeWidth="1.2" />
        <rect x="148" y="30" width="32" height="4" rx="2" fill={EDGE} />
      </g>

      {/* card stack inside */}
      {[0, 1, 2].map((i) => (
        <rect
          className="pv-pop"
          key={i}
          x={120 + i * 3}
          y={44 + i * 14}
          width={88 - i * 6}
          height="34"
          rx="6"
          fill={i === 0 ? "rgba(18,97,255,0.24)" : "rgba(9,28,66,0.95)"}
          stroke={i === 0 ? "rgba(0,194,255,0.5)" : EDGE}
        />
      ))}
      {/* barcode on the top card */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect
          className="pv-bar"
          key={`b${i}`}
          x={126 + i * 5}
          y="54"
          width={seeded(i * 2.3) > 0.5 ? 2.4 : 1.2}
          height="14"
          fill="#CFE0FF"
          opacity="0.85"
        />
      ))}

      {/* chat bubbles below the stack */}
      {[
        { x: 120, w: 58, a: false },
        { x: 148, w: 60, a: true },
        { x: 120, w: 44, a: false },
      ].map((b, i) => (
        <rect
          className="pv-pop"
          key={`c${i}`}
          x={b.x}
          y={98 + i * 20}
          width={b.w}
          height="15"
          rx="7.5"
          fill={b.a ? "rgba(18,97,255,0.28)" : "rgba(9,28,66,0.9)"}
          stroke={b.a ? "rgba(18,97,255,0.5)" : EDGE}
        />
      ))}
      <g className="pv-fade">
        <rect x="120" y="160" width="88" height="18" rx="9" fill="rgba(9,28,66,0.9)" stroke={EDGE} />
        {[132, 140, 148].map((cx) => (
          <circle className="pv-pulse" key={cx} cx={cx} cy="169" r="2.2" fill={ELEC} />
        ))}
      </g>

      {/* right rail */}
      {["FHIR R4", "WIDGET", "AUTH"].map((c, i) => (
        <g className="pv-row" key={c}>
          <rect x="226" y={44 + i * 26} width="82" height="18" rx="4" fill={PANEL} stroke={EDGE} />
          <T x={234} y={56 + i * 26} size={4.6} fill={i === 0 ? ELEC : DIM}>
            {c}
          </T>
        </g>
      ))}
      <circle className="pv-node pv-pulse" cx="267" cy="150" r="16" fill="none" stroke={BLUE} strokeWidth="1" opacity="0.6" />
      <circle className="pv-node" cx="267" cy="150" r="5" fill={BLUE} />
    </>
  );
}

/* ---------------------------------------------------------------- workspace */

function Workspace() {
  const code = [
    { i: 0, w: 62, t: BLUE },
    { i: 1, w: 92, t: WIRE },
    { i: 2, w: 48, t: ELEC },
    { i: 2, w: 74, t: WIRE },
    { i: 1, w: 84, t: WIRE },
    { i: 0, w: 56, t: BLUE },
    { i: 1, w: 96, t: WIRE },
    { i: 2, w: 42, t: ELEC },
  ];
  return (
    <>
      <Chrome label="kfive · workspace" />

      {/* icon rail */}
      <rect className="pv-fade" x="8" y="22" width="24" height="168" rx="5" fill={PANEL} stroke={EDGE} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect className="pv-node" key={i} x="14" y={32 + i * 18} width="12" height="12" rx="3" fill={i === 0 ? BLUE : WIRE} />
      ))}

      {/* file tree */}
      <rect className="pv-fade" x="36" y="22" width="62" height="168" rx="5" fill={PANEL} stroke={EDGE} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g className="pv-row" key={i}>
          <rect x={42 + (i % 3) * 4} y={34 + i * 17} width="4" height="4" rx="1" fill={i === 2 ? ELEC : WIRE} />
          <rect x={50 + (i % 3) * 4} y={35 + i * 17} width={20 + seeded(i * 8) * 22} height="3" rx="1.5" fill={i === 2 ? "#A8C6FF" : WIRE} />
        </g>
      ))}

      {/* editor */}
      <rect className="pv-fade" x="102" y="22" width="132" height="168" rx="5" fill={PANEL} stroke={EDGE} />
      {["chat.ts", "agent.ts"].map((t, i) => (
        <g className="pv-fade" key={t}>
          <rect x={108 + i * 54} y="28" width="50" height="14" rx="3" fill={i === 0 ? "rgba(18,97,255,0.2)" : "transparent"} stroke={i === 0 ? "rgba(18,97,255,0.45)" : EDGE} />
          <T x={133 + i * 54} y={38} size={4.4} anchor="middle" fill={i === 0 ? "#A8C6FF" : DIM}>
            {t}
          </T>
        </g>
      ))}
      {code.map((l, i) => (
        <g key={i}>
          <T x={108} y={58 + i * 15} size={4.2} fill="#2E5490">
            {String(i + 1).padStart(2, "0")}
          </T>
          <rect className="pv-grow" x={118 + l.i * 8} y={54 + i * 15} width={l.w} height="3.4" rx="1.7" fill={l.t} opacity={l.t === WIRE ? 0.9 : 0.75} />
        </g>
      ))}
      <rect x="118" y={54 + code.length * 15} width="1.6" height="9" fill={ELEC} style={{ animation: "bm-caret 1.1s steps(1) infinite" }} />

      {/* right panel */}
      <rect className="pv-fade" x="238" y="22" width="74" height="168" rx="5" fill={PANEL} stroke={EDGE} />
      <T x={246} y={36} size={4.4}>
        SOCKET.IO
      </T>
      <circle className="pv-node pv-pulse" cx="303" cy="33" r="2.6" fill="#2FE08A" />
      {[0.5, 0.78, 0.36, 0.62, 0.9].map((v, i) => (
        <rect className="pv-bar" key={i} x={246 + i * 13} y={92 - v * 44} width="8" height={v * 44} rx="2" fill={i === 4 ? ELEC : "rgba(18,97,255,0.7)"} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <g className="pv-row" key={`q${i}`}>
          <rect x="246" y={110 + i * 16} width="4" height="4" rx="2" fill={i === 0 ? ELEC : WIRE} />
          <rect x="256" y={111 + i * 16} width={26 + seeded(i * 4.4) * 24} height="3" rx="1.5" fill={WIRE} />
        </g>
      ))}
    </>
  );
}

/* --------------------------------------------------------------------- grid */

function Wireframe({ x, y, accent }: { x: number; y: number; accent: boolean }) {
  return (
    <g className="pv-pop">
      <rect x={x} y={y} width="144" height="78" rx="6" fill={PANEL} stroke={accent ? "rgba(18,97,255,0.5)" : EDGE} />
      <line x1={x} y1={y + 12} x2={x + 144} y2={y + 12} stroke={EDGE} strokeWidth="0.8" />
      <rect x={x + 6} y={y + 5} width="14" height="3" rx="1.5" fill={accent ? BLUE : WIRE} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + 104 + i * 12} y={y + 5.5} width="8" height="2" rx="1" fill={WIRE} />
      ))}
      <rect className="pv-grow" x={x + 8} y={y + 20} width="72" height="6" rx="2" fill={accent ? "rgba(0,194,255,0.6)" : "#39619E"} />
      <rect className="pv-grow" x={x + 8} y={y + 30} width="50" height="3" rx="1.5" fill={WIRE} />
      <rect x={x + 92} y={y + 18} width="44" height="26" rx="4" fill="rgba(18,97,255,0.16)" stroke={EDGE} />
      {[0, 1, 2].map((i) => (
        <rect className="pv-bar" key={`c${i}`} x={x + 8 + i * 44} y={y + 50} width="38" height="20" rx="4" fill="rgba(9,28,66,0.9)" stroke={EDGE} />
      ))}
    </g>
  );
}

function Grid() {
  return (
    <>
      <Chrome label="four studies" />
      <Wireframe x={10} y={24} accent />
      <Wireframe x={166} y={24} accent={false} />
      <Wireframe x={10} y={110} accent={false} />
      <Wireframe x={166} y={110} accent={false} />
      <circle className="pv-node pv-pulse" cx="160" cy="102" r="4" fill={ELEC} />
    </>
  );
}

/* -------------------------------------------------------------------- shell */

const VARIANTS: Record<Variant, () => ReactNode> = {
  backend: Backend,
  chat: Chat,
  dashboard: Dashboard,
  neural: Neural,
  supplychain: SupplyChain,
  event: Event,
  mobile: Mobile,
  workspace: Workspace,
  grid: Grid,
};

/**
 * Entrance definitions. `vars` doubles as the pre-state so nothing flashes, and
 * `to` is spelled out because the pre-state is written inline first — a plain
 * `.from()` would tween hidden → hidden and the panel would stay blank.
 * `clearProps` hands styling back to the markup (SVG `opacity` attributes) once
 * the tween lands.
 */
const STAGES: { sel: string; vars: gsap.TweenVars; to: gsap.TweenVars; at: number }[] = [
  { sel: ".pv-draw", vars: { drawSVG: "0%" }, to: { drawSVG: "100%" }, at: 0 },
  { sel: ".pv-fade", vars: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0, clearProps: "opacity" }, at: 0.04 },
  {
    sel: ".pv-pop",
    vars: { opacity: 0, scale: 0.86, transformOrigin: "center center" },
    to: { opacity: 1, scale: 1, clearProps: "opacity" },
    at: 0.12,
  },
  { sel: ".pv-row", vars: { opacity: 0, x: -14 }, to: { opacity: 1, x: 0, clearProps: "opacity" }, at: 0.18 },
  { sel: ".pv-grow", vars: { scaleX: 0, transformOrigin: "left center" }, to: { scaleX: 1 }, at: 0.24 },
  { sel: ".pv-bar", vars: { scaleY: 0, transformOrigin: "center bottom" }, to: { scaleY: 1 }, at: 0.28 },
  {
    sel: ".pv-node",
    vars: { opacity: 0, scale: 0.2, transformOrigin: "center center" },
    to: { opacity: 1, scale: 1, clearProps: "opacity" },
    at: 0.2,
  },
];

export default function ProjectVisual({
  variant,
  active,
  className,
}: {
  variant: Variant;
  /** Flip to true once the card is on screen — assembles the interface. */
  active: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Art = VARIANTS[variant];

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = gsap.utils.selector(root);

      // Before it is on screen the interface sits disassembled.
      if (!active) {
        STAGES.forEach((s) => {
          const t = q(s.sel);
          if (t.length) gsap.set(t, s.vars);
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      STAGES.forEach((s) => {
        const t = q(s.sel);
        if (!t.length) return;
        tl.fromTo(
          t,
          s.vars,
          {
            ...s.to,
            duration: s.sel === ".pv-draw" ? 0.85 : 0.6,
            stagger: { each: 0.035, from: s.sel === ".pv-node" ? "random" : "start" },
          },
          s.at,
        );
      });

      // Digits count up rather than appearing.
      q(".pv-count tspan").forEach((el) => {
        const to = Number((el as unknown as SVGTSpanElement).dataset.to ?? 0);
        const box = { v: 0 };
        el.textContent = "00";
        tl.to(
          box,
          {
            v: to,
            duration: 1.1,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              el.textContent = String(Math.round(box.v)).padStart(2, "0");
            },
          },
          0.25,
        );
      });

      /* ---- ambient loops: never visually dead, never expensive ---- */
      const pulses = q(".pv-pulse");
      if (pulses.length) {
        gsap.to(pulses, {
          opacity: 0.28,
          scale: 1.45,
          transformOrigin: "center center",
          duration: 1.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.24,
          delay: 1,
        });
      }

      const flows = q(".pv-flow");
      if (flows.length) {
        gsap.to(flows, { strokeDashoffset: -80, duration: 3, repeat: -1, ease: "none", stagger: 0.3, delay: 0.9 });
      }

      q(".pv-fall").forEach((el, i) => {
        const dist = Number((el as unknown as SVGElement).dataset.dist ?? 80);
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.5, delay: 1 + i * 0.3 })
          .set(el, { y: 0, opacity: 0 })
          .to(el, { opacity: 1, duration: 0.22 }, 0)
          .to(el, { y: dist, duration: 1.7, ease: "power1.inOut" }, 0)
          .to(el, { opacity: 0, duration: 0.3 }, 1.45);
      });

      const sweep = q(".pv-sweep");
      if (sweep.length) {
        gsap.fromTo(
          sweep,
          { xPercent: -130 },
          { xPercent: 560, duration: 4.4, ease: "none", repeat: -1, repeatDelay: 2.6, delay: 1.4 },
        );
      }
    },
    { scope: ref, dependencies: [active, variant] },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("relative overflow-hidden bg-deep", className)}
    >
      {/* interior glow so the panel never reads as flat black */}
      <span className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,rgb(18_97_255/0.28),transparent_62%)]" />
      <span className="absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_100%,rgb(0_194_255/0.16),transparent_60%)]" />

      <svg
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        shapeRendering="geometricPrecision"
      >
        <Art />
      </svg>

      {/* scanning sweep */}
      <span className="pv-sweep pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 bg-[linear-gradient(90deg,transparent,rgb(0_194_255/0.13),transparent)]" />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
    </div>
  );
}
