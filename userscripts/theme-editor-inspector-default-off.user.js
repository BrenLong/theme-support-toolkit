// ==UserScript==
// @name         Shopify Theme Editor - Preview Inspector Default Off
// @namespace    theme-support-toolkit
// @version      1.1.1
// @description  Defaults the Shopify Theme Editor Preview inspector to off by setting previewInspectorEnabled=false before Online Store Web initializes.
// @author       Brendan Long
// @downloadURL  https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.user.js
// @updateURL    https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.user.js
// @match        https://admin.shopify.com/*
// @match        https://admin.shop.dev/*
// @match        https://*.myshopify.com/admin*
// @match        https://online-store-web.shopifyapps.com/*
// @match        https://online-store-web.shop.dev/*
// @match        https://online-store-web-canary.shopifycloud.com/*
// @match        https://online-store-web-staging.shopifycloud.com/*
// @match        https://online-store-web-staging2.shopifycloud.com/*
// @match        https://online-store-web-staging3.shopifycloud.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  if (window.__themeSupportInspectorDefaultOffInstalled) return;
  window.__themeSupportInspectorDefaultOffInstalled = true;

  const STORAGE_KEY = 'previewInspectorEnabled';

  function setInspectorOff() {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'false');
    } catch (error) {
      // If sessionStorage is unavailable, fail silently so Shopify Admin is not affected.
    }
  }

  // Set immediately, before the Online Store Web / Theme Editor app has a
  // chance to initialize. The Theme Editor runs inside an iframe on
  // online-store-web.shopifyapps.com, so this script must match both Shopify
  // Admin and Online Store Web origins.
  setInspectorOff();

  // Shopify Admin and Online Store Web can route client-side without a full page
  // load. Patch history methods so the preference is re-applied on SPA navigation.
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

  // Re-apply during the first few seconds in case app code writes the default
  // before the Theme Editor reads it.
  let attempts = 0;
  const interval = window.setInterval(function () {
    setInspectorOff();
    attempts += 1;

    if (attempts >= 40) {
      window.clearInterval(interval);
    }
  }, 250);
})();
