"use client";

import { useEffect } from "react";

type OpenAIChatKitElement = HTMLElement & {
  setOptions: (options: unknown) => void;
};

const LOGO_URL =
  "https://media.designrush.com/agencies/406942/conversions/Sunrise-Marketing-logo-profile.jpg";

export default function Page() {
  useEffect(() => {
    const el = document.getElementById("sage-chat") as OpenAIChatKitElement | null;
    if (!el) return;

    // If the custom element hasn't upgraded yet, wait briefly.
    if (typeof el.setOptions !== "function") {
      const t = setTimeout(() => {
        const el2 = document.getElementById("sage-chat") as OpenAIChatKitElement | null;
        if (el2 && typeof el2.setOptions === "function") {
          el2.setOptions(buildOptions());
        }
      }, 50);
      return () => clearTimeout(t);
    }

    el.setOptions(buildOptions());
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
      {/* Top header logo (centered) */}
      <div
        style={{
          textAlign: "center",
          paddingTop: 10,
          paddingBottom: 6,
          background: "transparent",
          flex: "0 0 auto",
        }}
      >
        <img
          src={LOGO_URL}
          alt="Sunrise logo"
          style={{ height: 46, width: "auto", display: "inline-block" }}
        />
      </div>

      {/* Chat fills remaining space */}
      <div style={{ flex: "1 1 auto", minHeight: 0 }}>
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
        // Hue equivalent for #264017 (approx.)
        grayscale: { hue: 94, tint: 9, shade: -3 },
        accent: { primary: "#264017", level: 1 },
        surface: { background: "#ffffff", foreground: "#ffffff" },
      },
    },

    header: {
      title: "Sage · Grow Guide",
    },

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
