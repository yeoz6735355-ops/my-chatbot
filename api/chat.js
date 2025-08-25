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
        model: "gpt-4o-mini",  // 최신 소형 모델 (빠르고 저렴)
        messages: [
          { role: "system", content: "You are Ultimate Diet Coach. Reply in Korean if the user writes Korean, otherwise reply in English." },
          { role: "user", content: message },
        ],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    console.log("🔍 OpenAI raw response:", JSON.stringify(data, null, 2));

    // ✅ 응답 파싱 보강 (text, message.content 둘 다 체크)
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      data.choices?.[0]?.text?.trim() ||
      "⚠ GPT gave no response.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}
