"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ChatKit?: {"use client";

import { useEffect } from "react";

type ChatKitElement = HTMLElement & {
  setOptions: (options: unknown) => void;
};

const LOGO_URL =
  "https://media.designrush.com/agencies/406942/conversions/Sunrise-Marketing-logo-profile.jpg";

export default function Page() {
  useEffect(() => {
    const scriptId = "openai-chatkit-ck1";

    const init = () => {
      const el = document.getElementById("sage-chat") as unknown as ChatKitElement | null;
      if (!el || typeof el.setOptions !== "function") {
        // Wait a tick for the custom element to register
        setTimeout(init, 50);
        return;
      }

      el.setOptions({
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

        header: {
          title: "Sage · Grow Guide",
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

        composer: {
          placeholder: "Message the AI",
          attachments: { enabled: true, maxCount: 5, maxSize: 10_485_760 },
        },
      });
    };

    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;

      // ✅ This matches the ck1 “index-*.js” bundle style you were seeing working
      // If you have a specific ck1 URL from your working app, replace this with that exact URL.
      s.src = "https://cdn.platform.openai.com/assets/ck1/index.js";

      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }
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
      {/* Logo header */}
      <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
        <img src={LOGO_URL} alt="Sunrise logo" style={{ height: 46, width: "auto" }} />
      </div>

      {/* Chat fills remaining space */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <openai-chatkit
          id="sage-chat"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </main>
  );
}

      create: (options: unknown) => void;
    };
  }
}

const LOGO_URL =
  "https://media.designrush.com/agencies/406942/conversions/Sunrise-Marketing-logo-profile.jpg";

export default function Page() {
  useEffect(() => {
    const scriptId = "openai-chatkit-cdn";

    const init = () => {
      const root = document.getElementById("chatkit-root");
      if (!root) return;

      if (!window.ChatKit?.create) {
        console.error("ChatKit CDN loaded but window.ChatKit.create is missing");
        return;
      }

      window.ChatKit.create({
        // Mount into our div
        element: root,

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
            grayscale: { hue: 94, tint: 9, shade: -3 }, // hue for #264017
            accent: { primary: "#264017", level: 1 },
            surface: { background: "#ffffff", foreground: "#ffffff" },
          },
        },

        header: {
          // Keep header simple here; we’ll render the logo ourselves above
          title: "Sage · Grow Guide",
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

        composer: {
          placeholder: "Message the AI",
          attachments: { enabled: true, maxCount: 5, maxSize: 10_485_760 },
        },
      });
    };

    // Load ChatKit from CDN once
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;

      // ✅ Use the official ChatKit CDN entry used in the docs
      // If your previous working app used a slightly different URL, use that same URL here.
      s.src = "https://cdn.platform.openai.com/assets/ck1/chatkit.js";
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }
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
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      {/* “frameless” container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Your embedded header logo (centered) */}
        <div
          style={{
            textAlign: "center",
            padding: "10px 0 6px",
            background: "transparent",
          }}
        >
          <img
            src={LOGO_URL}
            alt="Sunrise logo"
            style={{ height: 46, width: "auto", display: "inline-block" }}
          />
        </div>

        {/* ChatKit mounts here */}
        <div
          id="chatkit-root"
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        />
      </div>
    </main>
  );
}
