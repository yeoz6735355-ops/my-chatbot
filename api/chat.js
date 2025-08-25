// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // Vercel 환경변수
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  // 최신 안정 모델
        messages: [
          { role: "system", content: "You are Ultimate Diet Coach. If user writes Korean, answer in Korean. If English, answer in English." },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("🔍 API raw response:", JSON.stringify(data, null, 2));

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      data.choices?.[0]?.text?.trim() ||
      "⚠️ GPT gave no response.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}
