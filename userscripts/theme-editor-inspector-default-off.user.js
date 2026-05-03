// ==UserScript==
// @name         Shopify Theme Editor - Preview Inspector Default Off
// @namespace    theme-support-toolkit
// @version      1.0.0
// @description  Defaults the Shopify Theme Editor Preview inspector to off by setting previewInspectorEnabled=false across Shopify Admin SPA navigation.
// @author       Brendan Long
// @match        https://admin.shopify.com/*
// @match        https://*.myshopify.com/admin*
// @match        https://*.myshopify.com/admin/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'previewInspectorEnabled';

  function setInspectorOff() {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'false');
    } catch (error) {
      // If sessionStorage is unavailable, fail silently so Shopify Admin is not affected.
    }
  }

  // Set immediately, before the Theme Editor app has a chance to initialize.
  setInspectorOff();

  // Shopify Admin can route client-side without a full page load. Patch history
  // methods so the preference is re-applied on SPA navigation.
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    const result = originalPushState.apply(this, arguments);
    setInspectorOff();
    return result;
  };

  history.replaceState = function () {
    const result = originalReplaceState.apply(this, arguments);
    setInspectorOff();
    return result;
  };

  window.addEventListener('popstate', setInspectorOff);
  window.addEventListener('pageshow', setInspectorOff);
  document.addEventListener('DOMContentLoaded', setInspectorOff);

  // Re-apply during the first few seconds in case another Admin script writes
  // the default before the Theme Editor reads it.
  let attempts = 0;
  const interval = window.setInterval(function () {
    setInspectorOff();
    attempts += 1;

    if (attempts >= 40) {
      window.clearInterval(interval);
    }
  }, 250);
})();
