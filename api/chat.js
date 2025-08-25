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
        model: "gpt-4o-mini",   // ✅ 최신 모델
        messages: [
          { role: "system", content: "You are Ultimate Diet Coach, a helpful assistant that answers in Korean or English depending on user input." },
          { role: "user", content: message }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    console.log("🔍 OpenAI API raw response:", data);

    // ✅ 응답 구조 확인 후 안전하게 처리
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||   // 혹시 text 형식으로 올 때 대비
      "⚠️ Error: No reply from GPT";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}
