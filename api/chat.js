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
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 안정적인 최신 모델
        messages: [
          {
            role: "system",
            content:
              "You are Ultimate Diet Coach, a helpful assistant. Always reply in Korean if the user writes Korean, otherwise reply in English.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("🔍 API response:", data);

    if (!data || !data.choices || data.choices.length === 0) {
      return res.status(500).json({ reply: "⚠️ GPT gave no response." });
    }

    // ✅ 응답 구조에서 안전하게 답 추출
    const reply =
      data.choices[0].message?.content ||
      data.choices[0].text ||
      "⚠️ GPT returned empty content.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}
