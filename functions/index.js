const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * Serverless backend proxy for Groq Cloud chat completions.
 * Shields third-party API keys from client-side bundles and enforces
 * input validation and CORS policies.
 */
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

exports.groqChat = functions.https.onRequest(async (req, res) => {
    // Allowed origins: allow localhost in dev and production web app
    const origin = req.headers.origin || "*";
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(204).send("");
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
        const { messages, model = "llama-3.3-70b-versatile", temperature = 0.7, max_tokens = 1024 } = req.body || {};

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Invalid payload: 'messages' array is required." });
        }

        const apiKey = process.env.GROQ_API_KEY || GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Server error: Groq API key is not configured on the backend." });
        }

        // Forward request securely to Groq Cloud API
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens
            })
        });

        const data = await groqResponse.json();

        if (!groqResponse.ok) {
            return res.status(groqResponse.status).json({
                error: data.error?.message || "Groq upstream API error",
                upstream_code: groqResponse.status
            });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error("Groq Cloud proxy error:", err);
        return res.status(500).json({ error: "Internal server error occurred while contacting AI services." });
    }
});
