/**
 * PWNBOX CYBER COMMAND — CLIENT CONFIGURATION
 * 
 * SECURITY NOTICE:
 * Never hardcode production API credentials in client-side code.
 * The application connects securely through the serverless backend proxy (/api/chat).
 * For offline testing or local development, operatives can set their key via localStorage:
 * localStorage.setItem('pwnbox_groq_api_key', 'your_personal_key_here');
 */

const GROQ_API_KEY = (typeof localStorage !== "undefined" && localStorage.getItem('pwnbox_groq_api_key')) || "";

// Expose globally for browser script tag compatibility
if (typeof window !== "undefined") {
    window.GROQ_API_KEY = GROQ_API_KEY;
}

// Support CommonJS/ES modules if required in other environments
if (typeof module !== "undefined" && module.exports) {
    module.exports = { GROQ_API_KEY };
}
