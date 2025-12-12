"use client";

import { useEffect } from "react";
import Script from "next/script";

type ChatKitElement = HTMLElement & {
  setOptions?: (options: any) => void;
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
          async getClientSecret(existingClientSecret?: string) {
            if (existingClientSecret) return existingClientSecret;

            const res = await fetch("/api/chatkit/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deviceId: getDeviceId() })
            });

            if (!res.ok) {
              console.error("Failed to fetch client_secret", res.status);
              throw new Error("Unable to create ChatKit session");
            }

            const data = await res.json();
            return data.client_secret;
          }
        },

        header: {
          enabled: true,
          avatar: {
            src: "https://media.designrush.com/agencies/406942/conversions/Sunrise-Marketing-logo-profile.jpg",
            shape: "circle"
          },
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
              hue: 98,  // hex #264017
              tint: 9,
              shade: 4
            },
            accent: {
              primary: "#ffa200",
              level: 1
            },
            surface: {
              background: "#ffffff",
              foreground: "#ffffff"
            }
          }
        },

        startScreen: {
          greeting: "Hi there! I'm Sage, your Grow Guide. What can I help you nurture today?",
          prompts: [
            {
              icon: "circle-question",
              label: "Which flowers will thrive in my garden?",
              prompt: "Which flowers will thrive in my garden?"
            },
            {
              icon: "circle-question",
              label: "Help me pick nonstop blooming plants",
              prompt: "Help me choose flowering plants that bloom nonstop."
            },
            {
              icon: "circle-question",
              label: "Why aren't my flowers blooming?",
              prompt: "My flowers are not blooming. What might be wrong?"
            },
            {
              icon: "circle-question",
              label: "Sunlight + soil → recommended plants",
              prompt:
                "I will tell you my sunlight + soil. Please recommend what will grow beautifully."
            },
            {
              icon: "circle-question",
              label: "Pollinator-friendly flowers",
              prompt:
                "What are the best pollinator-friendly flowers for my region?"
            }
          ]
        }
      });
    }

    init();
  }, []);

  return (
    <>
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
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
          }}
        >
          <openai-chatkit
            id="sage-chat"
            style={{ width: "100%", height: "640px", display: "block" }}
          />
        </div>
      </main>
    </>
  );
}
