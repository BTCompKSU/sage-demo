// app/api/create-session/route.ts
import { NextRequest, NextResponse } from "next/server";

function mask(value: string) {
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;

    if (!apiKey || !workflowId) {
      return NextResponse.json(
        {
          error: "Missing required env vars",
          has_OPENAI_API_KEY: Boolean(apiKey),
          has_NEXT_PUBLIC_CHATKIT_WORKFLOW_ID: Boolean(workflowId)
        },
        { status: 500 }
      );
    }

    // Optional deviceId from body
    let deviceId = "sage-grow-guide";
    try {
      const body = await req.json();
      if (body?.deviceId) deviceId = body.deviceId;
    } catch {
      // ignore
    }

    const upstream = await fetch("https://api.openai.com/v1/chatkit/sessions", {
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

    const text = await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: "Upstream OpenAI call failed",
          upstream_status: upstream.status,
          workflowId: mask(workflowId),
          apiKey: mask(apiKey),
          upstream_body: text
        },
        { status: upstream.status }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json({ client_secret: data.client_secret }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error", detail: String(err) },
      { status: 500 }
    );
  }
}
