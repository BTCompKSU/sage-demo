"use client";

import { useEffect } from "react";
import { ChatKit } from "@openai/chatkit";

export default function Page() {
  useEffect(() => {
    ChatKit.create({
      api: {
        endpoint: "/api/create-session",
      },

      // IMPORTANT: no ChatKit header config here
      // We fully own the header in JSX below

      theme: {
        colorScheme: "light",
        radius: "pill",
        density: "normal",
        color: {
          accent: {
            primary: "#2f6b2f",
          },
        },
      },
    });
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 24,
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: 420,
          borderRadius: 24,
          background: "#ffffff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* HEADER — single flex container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img
              src="https://sunrisenursery.com/logo.png"
              alt="Sunrise"
              style={{
                height: 36,
                width: "auto",
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#1f3d1a",
                whiteSpace: "nowrap",
              }}
            >
              Sage · Grow Guide
            </span>
          </div>

          <button
            title="Reset conversation"
            onClick={() => window.location.reload()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "#2f6b2f",
            }}
          >
            ↻
          </button>
        </div>

        {/* CHATKIT MOUNT */}
        <div
          id="chatkit"
          style={{
            height: 560,
          }}
        />
      </div>
    </main>
  );
}
