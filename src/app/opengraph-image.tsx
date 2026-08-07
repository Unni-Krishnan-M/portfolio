import { ImageResponse } from "next/og";

export const alt = "Unni Krishnan M — AI & Data Science Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#F7FAFF",
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(18,97,255,0.16), transparent 55%), radial-gradient(circle at 8% 88%, rgba(0,194,255,0.14), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "linear-gradient(135deg,#1261FF,#00C2FF)",
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            UK
          </div>
          <div style={{ fontSize: 17, letterSpacing: "0.26em", color: "#1261FF", fontWeight: 600 }}>
            BLUE//MOTION
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 20, letterSpacing: "0.2em", color: "#64748B", fontWeight: 600 }}>
            AI &amp; DATA SCIENCE · DEVELOPER
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: "#07111F",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Unni Krishnan M</span>
            <span style={{ color: "#1261FF" }}>I build intelligent systems.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 21,
            color: "#64748B",
            borderTop: "1px solid #DCE7F5",
            paddingTop: 26,
          }}
        >
          <span>github.com/Unni-Krishnan-M</span>
          <span>Python · FastAPI · Next.js · Java · ML</span>
        </div>
      </div>
    ),
    size,
  );
}
