"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useWhisperRecorder } from "@/components/useWhisperRecorder";

export default function App() {
  const { scheme, setScheme } = useColorScheme();

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  const sendIntoChatKit = useCallback((text: string) => {
    const doc = document;

    // Try in order of most specific → most generic
    const el =
      (doc.querySelector(
        '[placeholder*="Type or write your question here"]'
      ) as HTMLInputElement | HTMLTextAreaElement | null) ||
      (doc.querySelector(
        '[placeholder*="Ask anything"]'
      ) as HTMLInputElement | HTMLTextAreaElement | null) ||
      (doc.querySelector(
        "textarea"
      ) as HTMLTextAreaElement | null) ||
      (doc.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null) ||
      (doc.querySelector(
        '[contenteditable="true"]'
      ) as HTMLElement | null);

    if (!el) {
      console.warn("ChatKit input element not found");
      return;
    }

    // Set value depending on element type
    if ("value" in el) {
      (el as HTMLInputElement | HTMLTextAreaElement).value = text;
    } else {
      el.textContent = text;
    }

    // Trigger React's change handling
    el.dispatchEvent(new Event("input", { bubbles: true }));

    // Simulate pressing Enter to send the message
    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
    });
    el.dispatchEvent(enterEvent);
  }, []);

  const { isRecording, isTranscribing, startRecording, stopRecording } =
    useWhisperRecorder(sendIntoChatKit);

  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl relative">
        <ChatKitPanel
          theme={scheme}
          onWidgetAction={handleWidgetAction}
          onResponseEnd={handleResponseEnd}
          onThemeRequest={setScheme}
        />

        {/* Floating mic button */}
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isTranscribing}
          className="fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-md text-sm"
          style={{
            background: "#0069b4",
            color: "#fff",
            opacity: isTranscribing ? 0.7 : 1,
          }}
        >
          {isTranscribing
            ? "Transcribing..."
            : isRecording
            ? "Stop"
            : "🎤 Talk / Hablar"}
        </button>
      </div>
    </main>
  );
}
