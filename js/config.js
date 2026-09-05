// Replace with your own Groq key before deploying. Do not commit a real key to a public repository.
const GROQ_API_KEY = "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";

// Expose globally for browser script tag compatibility
if (typeof window !== "undefined") {
    window.GROQ_API_KEY = GROQ_API_KEY;
}

// Support CommonJS/ES modules if required in other environments
if (typeof module !== "undefined" && module.exports) {
    module.exports = { GROQ_API_KEY };
}
