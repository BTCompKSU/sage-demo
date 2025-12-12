"use client";

import { useEffect } from "react";
import Script from "next/script";

type ChatKitElement = HTMLElement & {
  setOptions?: (options: unknown) => void;
};

function getDeviceId() {
  if (typeof window === "undefined") return "sage-grow-guide";
  const key = "sage-grow-guide-device-id";
  let existing = window.localStorage.getItem(key);
  if (!existing) {
    existing = crypto.randomUUID();
    window.localStorage.setItem(key, existing);
  }
  return existing;
}

export default function Page() {
  useEffect(() => {
    function init() {
      const el = document.getElementById("sage-chat") as ChatKitElement | null;

      if (!el || typeof el.setOptions !== "function") {
        setTimeout(init, 300);
        return;
      }

      el.setOptions({
        api: {
          async getClientSecret() {
            const res = await fetch("/api/create-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deviceId: getDeviceId() })
            });

            if (!res.ok) {
              console.error("Failed to fetch client_secret", res.status);
              throw new Error("Unable to create ChatKit session");
            }

            const data = await res.json();
            return data.client_secret as string;
          }
        },

        header: {
          enabled: true,
          title: {
            enabled: true,
            text: "Sage · Grow Guide"
          }
        },

        theme: {
          colorScheme: "light",
          radius: "pill",
          density: "normal",
          color: {
            grayscale: {
              hue: 98, // tuned toward #264017
              tint: 9,
              shade: 4
            },
            accent: {
              primary: "#264017",
              level: 1
            },
            surface: {
              background: "#ffffff",
              foreground: "#ffffff"
            }
          }
        },

        startScreen: {
          greeting:
            "Hi there! I’m Sage, your Grow Guide from Sunrise. What can I help you grow today?",
          prompts: [
            {
              icon: "circle-question",
              label: "Looking for blooms?",
              prompt:
                "Looking for blooms. Which flowers will thrive in my garden?"
            },
            {
              icon: "circle-question",
              label: "Nonstop color",
              prompt:
                "I want nonstop color. Help me pick the perfect flowering plants."
            },
            {
              icon: "circle-question",
              label: "Not blooming?",
              prompt:
                "My flowers aren’t blooming. Can you help me figure out why?"
            },
            {
              icon: "circle-question",
              label: "Soil + sunlight",
              prompt:
                "Here’s my sunlight and soil. What will bloom beautifully there?"
            },
            {
              icon: "circle-question",
              label: "Pollinator-friendly",
              prompt:
                "I need pollinator-friendly flowers. What are the local favorites?"
            }
          ]
        }
      });
    }

    init();
  }, []);

  return (
    <>
      {/* ChatKit web component script */}
      <Script
        src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
        strategy="afterInteractive"
      />

      <main
        style={{
          margin: 0,
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#f3f4f6"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            background: "#ffffff"
          }}
        >
          {/* Logo + title header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
              background: "#ffffff"
            }}
          >
            <img
              src="https://media.designrush.com/agencies/406942/conversions/Sunrise-Marketing-logo-profile.jpg"
              alt="Sunrise Marketing"
              style={{
                height: 48,
                width: "auto",
                objectFit: "contain"
              }}
            />
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#264017"
              }}
            >
              Sage · Grow Guide
            </div>
          </div>

          {/* ChatKit widget */}
          <openai-chatkit
            id="sage-chat"
            style={{ width: "100%", height: "600px", display: "block" }}
          />
        </div>
      </main>
    </>
  );
}
