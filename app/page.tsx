"use client";

import { useEffect } from "react";

type ChatKitElement = HTMLElement & {
  setOptions: (options: unknown) => void;
};

export default function Page() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // ✅ This registers the <openai-chatkit> custom element
      await import("@openai/chatkit");

      if (cancelled) return;

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
      });
    })();

    return () => {
      cancelled = true;
    };
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
    </main>
  );
}
