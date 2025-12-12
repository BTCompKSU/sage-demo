"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const el = document.querySelector("chat-kit");

    if (!el) return;

    el.setOptions({
      api: {
        async getClientSecret(existingClientSecret?: string) {
          const r = await fetch("/api/chatkit/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          });
          if (!r.ok) throw new Error("Failed to fetch client secret");
          const { client_secret } = await r.json();
          return client_secret;
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
            hue: 100,
            tint: 9,
            shade: 4
          },
          accent: {
            primary: "#264017",
            level: 1
          }
        }
      },

      startScreen: {
        greeting: "Hi! I'm Sage, your Grow Guide. What can I help you grow today?",
        prompts: [
          { icon: "sparkles", label: "Looking for blooms?", prompt: "Which flowers will thrive in my garden?" },
          { icon: "sparkles", label: "Nonstop color", prompt: "Help me pick flowering plants with continuous color." },
          { icon: "sparkles", label: "Not blooming?", prompt: "Why aren’t my flowers blooming?" },
          { icon: "sparkles", label: "Soil + Sunlight", prompt: "Here’s my soil and sunlight—what will bloom beautifully?" },
          { icon: "sparkles", label: "Pollinators", prompt: "Which flowers attract local pollinators?" }
        ]
      }
    });
  }, []);

  return (
    <main style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
      {/* Custom logo header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img 
          src="https://media.designrush.com/agencies/406942/conversions/Sunrise-Marketing-logo-profile.jpg"
          alt="Sunrise Marketing Logo"
          style={{ width: 60, height: 60, borderRadius: "50%" }}
        />
        <div style={{ marginTop: 10, fontSize: 20, fontWeight: 600 }}>Sage · Grow Guide</div>
      </div>

      {/* ChatKit widget */}
      <chat-kit style={{ width: 400, height: 700 }} />
    </main>
  );
}
