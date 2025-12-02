import { useRef, useState } from "react";

export function useWhisperRecorder(onText: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        try {
          setIsTranscribing(true);
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          chunksRef.current = [];

          const formData = new FormData();
          formData.append("audio", blob, "speech.webm");

          const res = await fetch("/api/whisper", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (data.text) {
            onText(data.text);
          }
        } catch (err) {
          console.error("Transcription failed:", err);
        } finally {
          setIsTranscribing(false);
        }

        // stop mic tracks
        recorder.stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic permission or init error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return { isRecording, isTranscribing, startRecording, stopRecording };
}
