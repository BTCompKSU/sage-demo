// app/api/whisper/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const transcription = await client.audio.transcriptions.create({
      file,
      model: "gpt-4o-mini-transcribe", // or "whisper-1" if you prefer
      response_format: "json",
    });

    // Log on the server just in case
    console.log("Whisper transcription:", transcription);

    // Most OpenAI responses expose `.text`
    const text = (transcription as any).text ?? "";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Whisper route error:", err);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
