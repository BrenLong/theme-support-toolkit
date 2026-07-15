// ==UserScript==
// @name         Beacon - UX Improvements
// @namespace    theme-support-toolkit
// @version      1.0.0
// @description  Small quality-of-life tweaks for Beacon. Currently: gives the internal Notes field more room so pasted notes are visible without scrolling the little box.
// @author       Brendan Long
// @updateURL    https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/beacon-uximprovements.meta.js
// @downloadURL  https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/beacon-uximprovements.user.js
// @match        https://beacon.shopify.io/*
// @match        https://beacon.shop.dev/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  if (window.__beaconUxImprovementsInstalled) return;
  window.__beaconUxImprovementsInstalled = true;

  // All tweaks are pure CSS, so a single injected stylesheet does the whole job.
  // Stylesheet rules apply to elements created at any time (React re-renders,
  // navigation), so there is nothing to observe or re-run.
  function injectStyles() {
    if (document.getElementById('tsx-beacon-ux-styles')) return;
    const style = document.createElement('style');
    style.id = 'tsx-beacon-ux-styles';
    style.textContent = `
      /* Give the internal Notes field (the yellow internal-note textarea, which
         ships at min-h-[72px]) more room so pasted notes are visible without
         scrolling the little box. It stays drag-resizable. */
      [class*="bg-bg-internal-note"] {
        min-height: 260px !important;
      }
    `;
    document.head.appendChild(style);
  }

  if (document.head) {
    injectStyles();
  } else {
    document.addEventListener('DOMContentLoaded', injectStyles);
  }
})();
