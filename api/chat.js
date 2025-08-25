export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    // 🚨 에러 응답 처리
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return res.status(500).json({ reply: "API Error: " + data.error.message });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ reply: "Error connecting to GPT API" });
  }
}
