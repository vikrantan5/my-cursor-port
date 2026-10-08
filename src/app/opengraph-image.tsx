import { ImageResponse } from "next/og";
import { OG_ALT, SITE_TAGLINE } from "@/lib/site";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const files = [
  { name: "README.md", active: true },
  { name: "about.md", active: false },
  { name: "career.md", active: false },
  { name: "projects.ts", active: false },
  { name: "extras/", active: false },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0b0b0b",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "#141414",
            border: "1px solid #2b2b2b",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              height: 56,
              alignItems: "center",
              paddingLeft: 22,
              paddingRight: 22,
              background: "#181818",
              borderBottom: "1px solid #2b2b2b",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: "#ff5f57",
                  marginRight: 8,
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: "#febc2e",
                  marginRight: 8,
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: "#28c840",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                color: "#9d9d9d",
                fontSize: 22,
              }}
            >
              iresharma — portfolio
            </div>
            <div style={{ width: 62 }} />
          </div>

          <div style={{ display: "flex", flex: 1 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 280,
                padding: 28,
                background: "#181818",
                borderRight: "1px solid #2b2b2b",
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#6e6e6e",
                  fontSize: 16,
                  letterSpacing: 1.4,
                  marginBottom: 18,
                }}
              >
                EXPLORER
              </div>
              {files.map((file) => (
                <div
                  key={file.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 12px",
                    marginBottom: 4,
                    borderRadius: 6,
                    background: file.active ? "#04395e" : "transparent",
                    color: file.active ? "#cccccc" : "#9d9d9d",
                    fontSize: 22,
                  }}
                >
                  {file.name}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: 48,
                background: "#1e1e1e",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#6e6e6e",
                  fontSize: 20,
                  marginBottom: 16,
                }}
              >
                README.md
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#ffffff",
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: -1.4,
                  lineHeight: 1.1,
                }}
              >
                Iresh Sharma
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#cccccc",
                  fontSize: 28,
                  marginTop: 16,
                }}
              >
                {SITE_TAGLINE}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 28,
                  color: "#9d9d9d",
                  fontSize: 22,
                }}
              >
                Salesforce · Voice infra · Bengaluru
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 10,
                  color: "#3794ff",
                  fontSize: 20,
                }}
              >
                iresharma.com
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
