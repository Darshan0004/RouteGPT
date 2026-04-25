import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;
    const disruptions = body.disruptions || "None";

    console.log("INCOMING MESSAGE:", message);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // =========================
    // 🚀 CALL GEMINI WITH RETRY
    // =========================
    async function callGemini() {
      let attempt = 0;
      const maxRetries = 3;

      while (attempt <= maxRetries) {
        try {
          if (attempt > 0) {
            console.log("Retry attempt:", attempt);
            const delay = attempt * 1000;
            await new Promise((res) => setTimeout(res, delay));
          }

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: message }],
                  },
                ],
              }),
            }
          );

          const data = await res.json();

          // Detect 503 or UNAVAILABLE
          const isUnavailable =
            res.status === 503 ||
            (data.error && data.error.message && data.error.message.includes("UNAVAILABLE")) ||
            (data.error && data.error.status === "UNAVAILABLE");

          if (isUnavailable) {
            console.log("Gemini failed: UNAVAILABLE / 503");
            attempt++;
            continue;
          }

          if (
            res.ok &&
            data.candidates &&
            data.candidates[0]?.content?.parts?.[0]?.text
          ) {
            return data.candidates[0].content.parts[0].text;
          }

          console.log("Gemini failed:", data.error || "Unknown error");
          return null;
        } catch (err) {
          console.log("Gemini failed:", err);
          attempt++;
        }
      }

      return null;
    }

    let reply = null;

    if (GEMINI_API_KEY) {
      reply = await callGemini();
    } else {
      console.warn("⚠️ GEMINI_API_KEY missing");
    }

    // =========================
    // 🧠 SMART FALLBACK (IMPORTANT)
    // =========================
    if (!reply) {
      reply = generateFallback(disruptions);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json({
      reply: "⚠️ System error. Unable to process request.",
    });
  }
}

// =========================
// 🧠 FALLBACK LOGIC
// =========================
function generateFallback(disruptions: string) {
  if (!disruptions || disruptions === "None") {
    return "✅ All shipments operating normally.";
  }

  const disruptionList = disruptions
    .split("&")
    .map((d) => d.trim())
    .filter((d) => d !== "");

  return [
    "⚠️ AI temporarily unavailable",
    "",
    "Detected disruptions:",
    ...disruptionList.map((d) => `- ${d}`),
    "",
    "Suggested actions:",
    "- Reroute high-risk shipments",
    "- Monitor situation closely",
  ].join("\n");
}