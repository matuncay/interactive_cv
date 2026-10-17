import { ImageResponse } from "next/og";
import { profile } from "@/content/data";

export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.role}`;

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0A0A0A", color: "#FAFAFA" }}>
        <div style={{ fontSize: 22, color: "#00D4FF", letterSpacing: 4, fontFamily: "monospace" }}>DISCOVER → ANALYZE → DESIGN → BUILD → DEPLOY → TRANSFORM</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 32, lineHeight: 1.05 }}>{profile.name}</div>
        <div style={{ fontSize: 34, marginTop: 20, color: "#A1A1AA" }}>{profile.headline}</div>
        <div style={{ display: "flex", marginTop: 48, height: 6, width: 520, background: "linear-gradient(90deg,#00D4FF,#7B61FF)", borderRadius: 3 }} />
      </div>
    ),
    size,
  );
}
