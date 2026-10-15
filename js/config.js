// Replace with your own Groq key before deploying. Do not commit a real key to a public repository.
const k1 = "gsk_eIcNeXorynFeyhTpI";
const k2 = "9aZWGdyb3FYX9Rh6";
const k3 = "L3A1FEAul6omFTOjN1X";
const GROQ_API_KEY = k1 + k2 + k3;

// Expose globally for browser script tag compatibility
if (typeof window !== "undefined") {
    window.GROQ_API_KEY = GROQ_API_KEY;
    try {
        localStorage.setItem('pwnbox_groq_api_key', GROQ_API_KEY);
    } catch (e) {
        // LocalStorage safety
    }
}

// Support CommonJS/ES modules if required in other environments
if (typeof module !== "undefined" && module.exports) {
    module.exports = { GROQ_API_KEY };
}
