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

// In-memory sliding window rate limiter for abuse prevention
const rateLimitMap = new Map();
function isRateLimited(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 30;     // Max 30 AI queries per minute per IP

    const history = rateLimitMap.get(ip) || [];
    const recent = history.filter(ts => now - ts < windowMs);

    if (recent.length >= maxRequests) {
        return true;
    }

    recent.push(now);
    rateLimitMap.set(ip, recent);

    // Occasional cleanup of stale entries
    if (rateLimitMap.size > 2000) {
        for (const [storedIp, timestamps] of rateLimitMap.entries()) {
            if (timestamps.every(ts => now - ts >= windowMs)) {
                rateLimitMap.delete(storedIp);
            }
        }
    }

    return false;
}

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

    const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
    if (isRateLimited(clientIp)) {
        return res.status(429).json({
            error: "RATE_LIMITED: Tactical AI query frequency limit reached (30 req/min). Please standby."
        });
    }

    try {
        const { messages, model = "llama-3.3-70b-versatile", temperature = 0.7, max_tokens = 2048 } = req.body || {};

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

/**
 * Serverless dispatch endpoint for Operative Transmission Desk (contact form).
 * Validates inputs, handles bot traps, and records messages in Firestore via Admin SDK.
 */
exports.submitDispatch = functions.https.onRequest(async (req, res) => {
    const origin = req.headers.origin || "*";
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(204).send("");
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
        const { callsign, email, category, message, honeypot } = req.body || {};

        // Anti-Spam: Silently drop bots if honeypot trap field is filled
        if (honeypot) {
            console.warn("[Spam Defense] Bot honeypot triggered. Dropping transmission.");
            return res.status(200).json({ success: true, txId: "TX-PWN-BOTDROP" });
        }

        if (!callsign || !email || !message) {
            return res.status(400).json({ error: "Missing required transmission fields (callsign, email, message)." });
        }

        // Basic sanity limits
        const safeCallsign = String(callsign).trim().substring(0, 80);
        const safeEmail = String(email).trim().toLowerCase().substring(0, 120);
        const safeCategory = String(category || "General Feedback").trim().substring(0, 100);
        const safeMessage = String(message).trim().substring(0, 5000);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(safeEmail)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        const hexId = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
        const txId = `TX-PWN-${hexId}`;

        // Save into Firestore operative_dispatches collection
        await admin.firestore().collection("operative_dispatches").add({
            txId,
            callsign: safeCallsign,
            email: safeEmail,
            category: safeCategory,
            message: safeMessage,
            status: "unread",
            submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            userAgent: req.headers["user-agent"] || "unknown",
            clientIp: req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown"
        });

        return res.status(200).json({ success: true, txId });
    } catch (err) {
        console.error("Error saving dispatch to Firestore:", err);
        return res.status(500).json({ error: "Internal transmission error while storing dispatch." });
    }
});
