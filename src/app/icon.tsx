import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#1261FF 0%,#00C2FF 100%)",
          color: "#fff",
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          borderRadius: 14,
        }}
      >
        UK
      </div>
    ),
    size,
  );
}
