// Cookie Banner Management
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookieConsent';
    const COOKIE_CONSENT_EXPIRY_DAYS = 365;

    // Function to set a cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    // Function to get a cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Function to show cookie banner
    function showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    }

    // Function to hide cookie banner
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Function to handle accept
    function acceptCookies() {
        setCookie(COOKIE_CONSENT_KEY, 'accepted', COOKIE_CONSENT_EXPIRY_DAYS);
        hideCookieBanner();
        
        // Here you can initialize analytics or other tracking scripts
        // For example:
        // if (typeof initAnalytics === 'function') {
        //     initAnalytics();
        // }
    }

    // Function to handle decline
    function declineCookies() {
        setCookie(COOKIE_CONSENT_KEY, 'declined', COOKIE_CONSENT_EXPIRY_DAYS);
        hideCookieBanner();
        
        // Optionally, you can remove existing cookies
        // This would require a more comprehensive cookie management system
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        const consent = getCookie(COOKIE_CONSENT_KEY);
        
        // If no consent has been given, show the banner
        if (!consent) {
            showCookieBanner();
        }

        // Attach event listeners
        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', declineCookies);
        }
    });
})();

