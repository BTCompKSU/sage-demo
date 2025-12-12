// app/api/chatkit/session/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;

    if (!apiKey || !workflowId) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY or NEXT_PUBLIC_CHATKIT_WORKFLOW_ID" },
        { status: 500 }
      );
    }

    // optional JSON body with deviceId
    let deviceId = "sage-grow-guide";
    try {
      const body = await req.json();
      if (body?.deviceId) deviceId = body.deviceId;
    } catch {
      // no body – fine, keep default
    }

    const res = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1"
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: deviceId
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ChatKit session creation failed", res.status, text);
      return NextResponse.json(
        { error: "Failed to create ChatKit session", detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(
      { client_secret: data.client_secret },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error creating ChatKit session", err);
    return NextResponse.json(
      { error: "Unexpected error creating ChatKit session" },
      { status: 500 }
    );
  }
}
