import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          color: "#3794ff",
          fontSize: 118,
          fontWeight: 700,
          letterSpacing: "-0.08em",
        }}
      >
        i
      </div>
    ),
    { ...size },
  );
}
