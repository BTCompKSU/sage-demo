"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const el = document.getElementById("sage-chat") as HTMLElement | null;
    if (!el) return;

    // ChatKit options must be set imperatively
    (el as unknown as {
      setOptions: (options: {
        api: {
          getClientSecret: (existingClientSecret?: string) => Promise<string>;
        };
        header: {
          title: string;
        };
      }) => void;
    }).setOptions({
      api: {
        async getClientSecret(existingClientSecret?: string) {
          const r = await fetch("/api/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId: "sage-grow-guide" }),
          });

          if (!r.ok) {
            throw new Error("Failed to create session");
          }

          const data: { client_secret: string } = await r.json();
          return data.client_secret;
        },
      },
      header: {
        title: "Sage · Grow Guide",
      },
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
