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
        model: "gpt-4o-mini", // 또는 gpt-4o, gpt-3.5-turbo (본인 요금제에 맞게)
        messages: [
          {
            role: "system",
            content:
              "You are 'Ultimate Diet Coach'. 답변은 한국어로 기본 제공하되, 사용자가 영어로 말하면 영어로 답해.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    // 로그 확인용
    console.log("🔍 OpenAI raw response:", JSON.stringify(data, null, 2));

    // 오류 응답 처리
    if (data.error) {
      return res.status(500).json({ reply: `❌ API Error: ${data.error.message}` });
    }

    // 응답 파싱 보강
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      data.choices?.[0]?.text?.trim() ||
      "⚠ GPT gave no response.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ reply: `Server Error: ${error.message}` });
  }
}
