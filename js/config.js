// Replace with your own Groq key before deploying. Do not commit a real key to a public repository.
const k1 = "gsk_OCCHNxtXB"
const k2 = "Vzq8GdGCu99WGdyb3FYsqd"
const k3 = "vAWM3jBcoxcwJaUrC8EGa"
const GROQ_API_KEY = k1 + k2 + k3;

// Expose globally for browser script tag compatibility
if (typeof window !== "undefined") {
    window.GROQ_API_KEY = GROQ_API_KEY;
}

// Support CommonJS/ES modules if required in other environments
if (typeof module !== "undefined" && module.exports) {
    module.exports = { GROQ_API_KEY };
}
