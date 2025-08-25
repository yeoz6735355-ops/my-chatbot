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
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ Vercel 환경변수
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",   // ✅ 최신 경량 모델 (빠르고 저렴)
        messages: [
          { role: "system", content: "You are Ultimate Diet Coach, a friendly Korean/English diet assistant." },
          { role: "user", content: message }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API Error:", error);
      return res.status(response.status).json({ error });
    }

    const data = await response.json();

    // ✅ GPT 응답 전달
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}
