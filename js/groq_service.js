/**
 * Groq AI Service Client for PwnBox
 * 
 * Provides unified, secure access to Groq Cloud chat completions.
 * Routes requests to the serverless proxy endpoint (/api/chat) in production
 * to prevent leaking credentials, with automatic client-side fallback
 * for local development and offline environments.
 */

const DEFAULT_MODEL = "openai/gpt-oss-20b";
const PROXY_ENDPOINT = "/api/chat";
const DIRECT_GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Execute a chat completion request.
 * 
 * @param {Object} options
 * @param {Array<{role: string, content: string}>} options.messages
 * @param {string} [options.model]
 * @param {number} [options.temperature]
 * @param {number} [options.max_tokens]
 * @returns {Promise<Object>} Groq completion response object
 */
async function callGroqChat({
    messages,
    model = DEFAULT_MODEL,
    temperature = 0.7,
    max_tokens = 1024
}) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new Error("Invalid payload: 'messages' array is required.");
    }

    // Step 1: Attempt execution via Serverless Cloud Function Proxy (/api/chat)
    let proxyFailed = false;
    try {
        const proxyResponse = await fetch(PROXY_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages, model, temperature, max_tokens })
        });

        if (proxyResponse.ok) {
            return await proxyResponse.json();
        }

        // If the proxy explicitly responded with 404 (endpoint not configured or local static server), fallback
        if (proxyResponse.status === 404 || proxyResponse.status === 405) {
            proxyFailed = true;
        } else {
            const errData = await proxyResponse.json().catch(() => ({}));
            throw new Error(errData.error || `Proxy error: HTTP ${proxyResponse.status}`);
        }
    } catch (proxyErr) {
        // Network failure (e.g. static dev server without functions) triggers fallback
        proxyFailed = true;
    }

    // Step 2: Fallback to direct client call if proxy is unavailable (e.g. local file/dev server)
    if (proxyFailed) {
        const fallbackKey = (typeof window !== "undefined" && window.GROQ_API_KEY) ||
            (typeof localStorage !== "undefined" && localStorage.getItem('pwnbox_groq_api_key')) ||
            (typeof GROQ_API_KEY !== "undefined" ? GROQ_API_KEY : "");

        if (!fallbackKey) {
            throw new Error("Missing Groq API Key! Server proxy is unreachable and no client key is configured in js/config.js.");
        }

        const directResponse = await fetch(DIRECT_GROQ_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${fallbackKey}`
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens
            })
        });

        if (!directResponse.ok) {
            const errData = await directResponse.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Groq direct API error: HTTP ${directResponse.status}`);
        }

        return await directResponse.json();
    }
}

// Global browser compatibility
if (typeof window !== "undefined") {
    window.GroqService = {
        callGroqChat,
        DEFAULT_MODEL
    };
}

// Export for modern ES6 / module environments
if (typeof module !== "undefined" && module.exports) {
    module.exports = { callGroqChat, DEFAULT_MODEL };
}
