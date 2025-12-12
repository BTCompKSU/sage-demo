"use client";

import { useEffect } from "react";

type ChatKitElement = HTMLElement & {
  setOptions: (options: unknown) => void;
};

export default function Page() {
  useEffect(() => {
    const el = document.getElementById("sage-chat");
    if (!el) return;

    const chatkit = el as unknown as ChatKitElement;

    chatkit.setOptions({
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

      // keep your theme + prompts etc in the workflow itself,
      // or add them here if you previously had them in setOptions.
    });
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

        /* This is what moves the widget LOWER */
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      {/* Wrapper gives you spacing from the bottom/right if desired */}
      <div
        style={{
          width: "100%",
          height: "100%",

          /* Adjust these two to get it closer to your launcher button */
          paddingRight: 0,
          paddingBottom: 0,

          boxSizing: "border-box",
        }}
      >
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
