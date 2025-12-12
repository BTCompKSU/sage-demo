"use client";

import { useEffect } from "react";

type OpenAIChatKitElement = HTMLElement & {
  setOptions: (options: unknown) => void;
};

const LOGO_URL =
  "https://media.designrush.com/agencies/406942/conversions/Sunrise-Marketing-logo-profile.jpg";

export default function Page() {
  useEffect(() => {
    const apply = () => {
      const el = document.getElementById("sage-chat") as OpenAIChatKitElement | null;
      if (!el) return;

      if (typeof el.setOptions !== "function") {
        setTimeout(apply, 50);
        return;
      }

      el.setOptions(buildOptions());
    };

    apply();
  }, []);

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        background: "transparent",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Single-row header (logo + title + refresh) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={LOGO_URL}
            alt="Sunrise"
            style={{ height: 34, width: "auto", display: "block" }}
          />
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#264017",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            Sage · Grow Guide
          </div>
        </div>

        <button
          type="button"
          title="Reset"
          onClick={() => window.location.reload()}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 999,
            color: "#264017",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ↻
        </button>
      </div>

      {/* Chat fills the rest */}
      <div style={{ flex: "1 1 auto", minHeight: 0, background: "#ffffff" }}>
        <openai-chatkit
          id="sage-chat"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>
    </main>
  );
}

function buildOptions() {
  return {
    api: {
      async getClientSecret(existingClientSecret?: string) {
        const r = await fetch("/api/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId: "sage-grow-guide",
            existingClientSecret: existingClientSecret ?? null,
          }),
        });

        if (!r.ok) {
          const text = await r.text().catch(() => "");
          throw new Error(`create-session failed: ${r.status} ${text}`);
        }

        const data = (await r.json()) as { client_secret: string };
        return data.client_secret;
      },
    },

    theme: {
      colorScheme: "light",
      radius: "pill",
      density: "normal",
      color: {
        grayscale: { hue: 94, tint: 9, shade: -3 },
        accent: { primary: "#264017", level: 1 },
        surface: { background: "#ffffff", foreground: "#ffffff" },
      },
    },

    // IMPORTANT: do NOT set ChatKit header; we own the header in JSX
    // header: { ... }  <-- leave this out

    composer: {
      placeholder: "Message the AI",
      attachments: { enabled: true, maxCount: 5, maxSize: 10_485_760 },
    },

    startScreen: {
      greeting:
        "Hi there! I’m Sage, your Grow Guide from Sunrise. What can I help you grow today?",
      prompts: [
        {
          icon: "circle-question",
          label: "Looking for blooms?",
          prompt:
            "Looking for blooms? Ask me which flowers will thrive in your garden!",
        },
        {
          icon: "circle-question",
          label: "Nonstop color",
          prompt:
            "Want nonstop color? I can help you pick the perfect flowering plants.",
        },
        {
          icon: "circle-question",
          label: "Not blooming?",
          prompt:
            "Not sure why your flowers aren’t blooming? Let’s figure it out together!",
        },
        {
          icon: "circle-question",
          label: "Soil + sunlight",
          prompt:
            "Tell me your sunlight and soil—I’ll tell you what will bloom beautifully.",
        },
        {
          icon: "circle-question",
          label: "Pollinator-friendly",
          prompt:
            "Need pollinator-friendly flowers? I know all the local favorites.",
        },
      ],
    },
  };
}
