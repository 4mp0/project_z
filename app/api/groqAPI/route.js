

export async function POST(request) {
    const { userMessage } = await request.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            messages: [{ role: "user", content: userMessage }],
            model: "openai/gpt-oss-120b",
            temperature: 1,
            top_p: 1,
            stream: false,
            reasoning_effort: "medium",
            stop: null
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Groq error:", data);
        return Response.json({ error: data }, { status: 500 });
    }

    const reply = data.choices[0].message.content;
    return Response.json({ reply });
}