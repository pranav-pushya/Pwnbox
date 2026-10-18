/**
 * PWNBOX CYBER COMMAND — GOOGLE ANALYTICS 4 & EU/UK CONSENT ENGINE
 * Implements Google Consent Mode v2, ePrivacy, and GDPR compliance.
 */

(function () {
    'use strict';

    // Optional: Set your Google Analytics 4 Measurement ID here (e.g., 'G-XXXXXXXXXX')
    const GA_MEASUREMENT_ID = window.PWNBOX_GA_MEASUREMENT_ID || '';

    // Initialize Google Tag dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // Set initial Google Consent Mode v2 defaults to DENIED
    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'wait_for_update': 500
    });

    /**
     * Dynamically inject the official Google tag (gtag.js) script
     */
    function loadGoogleAnalytics(measurementId) {
        if (!measurementId || document.getElementById('ga4-script-tag')) return;

        const script = document.createElement('script');
        script.id = 'ga4-script-tag';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        gtag('js', new Date());
        gtag('config', measurementId, {
            'anonymize_ip': true,
            'send_page_view': true
        });

        console.log(`[PwnBox Analytics] Initialized GA4 with ID: ${measurementId}`);
    }

    /**
     * Apply consent update dynamically
     */
    window.pwnboxApplyConsent = function (consentStatus) {
        if (consentStatus === 'granted') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
            if (GA_MEASUREMENT_ID) {
                loadGoogleAnalytics(GA_MEASUREMENT_ID);
            }
            console.log('[PwnBox Analytics] Consent mode updated: GRANTED');
        } else {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
            console.log('[PwnBox Analytics] Consent mode updated: DENIED (Essential Only)');
        }
    };

    /**
     * Create and render the Tactical Consent Banner if not previously decided
     */
    function renderConsentBanner() {
        const existingConsent = localStorage.getItem('pwnbox_cookie_consent');
        if (existingConsent) {
            // Already decided
            window.pwnboxApplyConsent(existingConsent);
            return;
        }

        // Create Banner DOM element
        const banner = document.createElement('div');
        banner.id = 'pwnboxConsentBanner';
        banner.className = 'consent-banner-wrapper';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Privacy and Telemetry Consent Notice');

        banner.innerHTML = `
            <div class="consent-text">
                <strong>TACTICAL PRIVACY DIRECTIVE:</strong>
                PwnBox uses browser local storage for mission progress and optional anonymous telemetry to optimize simulation stability. No personal identity is ever tracked or sold. Read our <a href="privacy.html">Privacy Policy</a>.
            </div>
            <div class="consent-buttons">
                <button type="button" class="consent-btn-accept" id="consentAcceptBtn">ACCEPT ALL</button>
                <button type="button" class="consent-btn-deny" id="consentDenyBtn">ESSENTIAL ONLY</button>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('consentAcceptBtn').addEventListener('click', function () {
            localStorage.setItem('pwnbox_cookie_consent', 'granted');
            window.pwnboxApplyConsent('granted');
            banner.remove();
        });

        document.getElementById('consentDenyBtn').addEventListener('click', function () {
            localStorage.setItem('pwnbox_cookie_consent', 'denied');
            window.pwnboxApplyConsent('denied');
            banner.remove();
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderConsentBanner);
    } else {
        renderConsentBanner();
    }
})();
