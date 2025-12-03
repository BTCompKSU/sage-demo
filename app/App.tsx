// app/App.tsx
"use client";

import { useCallback, useState } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useWhisperRecorder } from "@/components/useWhisperRecorder";

export default function App() {
  const { scheme, setScheme } = useColorScheme();

  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

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

  // Called when Whisper finishes transcribing
  const handleTranscription = useCallback((text: string) => {
    console.log("Whisper transcription:", text);
    setLastTranscript(text);
    setCopyStatus("idle");
  }, []);

  const { isRecording, isTranscribing, startRecording, stopRecording } =
    useWhisperRecorder(handleTranscription);

  const handleCopy = useCallback(async () => {
    if (!lastTranscript) return;
    try {
      await navigator.clipboard.writeText(lastTranscript);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (e) {
      console.error("Clipboard error:", e);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [lastTranscript]);

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

        {/* Transcript preview & Copy panel */}
        {lastTranscript && (
          <div
            className="fixed bottom-20 right-4 max-w-xs p-3 rounded-lg shadow-md text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <div className="font-semibold mb-1">
              Voice transcription
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-200 mb-2 max-h-24 overflow-y-auto">
              {lastTranscript}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-1 rounded text-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            >
              {copyStatus === "copied"
                ? "Copied!"
                : copyStatus === "error"
                ? "Copy failed"
                : "Copy & paste into chat"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
