// ==UserScript==
// @name         Beacon - Copilot Panel Toggle
// @namespace    theme-support-toolkit
// @version      1.9.0
// @description  Hides Beacon's Copilot (suggested response) sidebar by default to widen the chat panel, with a floating button to show/hide it. Remembers your last choice.
// @author       Brendan Long
// @updateURL    https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/beacon-copilot-panel-toggle.meta.js
// @downloadURL  https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/beacon-copilot-panel-toggle.user.js
// @match        https://beacon.shopify.io/*
// @match        https://beacon.shop.dev/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  if (window.__beaconCopilotToggleInstalled) return;
  window.__beaconCopilotToggleInstalled = true;

  // localStorage key. Default is hidden. Value '0' means the user chose to show it.
  const STATE_KEY = 'tsx-beacon-copilot-hidden';
  // Beacon has two chat layouts, each a 3-column CSS grid whose rightmost
  // column is the Copilot panel (marked by `bg-bg-app`):
  //   - actionBar-wrapper          -> regular chat  (/chat/...)
  //   - consultation-chat-wrapper  -> live assist / consultation (/consultation/...)
  const GRID_TESTIDS = ['actionBar-wrapper', 'consultation-chat-wrapper'];
  const GRID_SELECTOR = GRID_TESTIDS
    .map(function (id) { return '[data-testid="' + id + '"]'; })
    .join(', ');
  // Marker attribute we set on the grid container. We deliberately do NOT touch
  // any class/style that React owns (see note below), so this is the only DOM
  // mutation the script makes to Beacon's own elements.
  const HIDDEN_ATTR = 'data-tsx-copilot-hidden';
  // The consultation "Prepare escalation" flow renders this panel INSIDE the
  // same bg-bg-app column we hide, so we must force the column visible while it
  // is open. NOTE: the chat-route ActionBar also renders this same testid, but
  // inside a separate RightSheet OVERLAY (not the column) -- so we only react
  // when the panel is an actual descendant of the hidden column (see
  // escalationInHiddenColumn), otherwise we'd pop the column open needlessly.
  const ESCALATION_SELECTOR = '[data-testid="prepare-escalation-panel"]';
  // The consultation "Request to take over chat" button. When present it sits in
  // the top-right where our button lives, so we dock our button to its left and
  // vertically centre on it. Otherwise our button uses the top-right corner.
  const ANCHOR_SELECTOR = '[data-testid="handoff-button"]';
  const ANCHOR_GAP = 8;

  // True when an escalation (or any) panel is rendered inside the Copilot
  // column we hide, meaning we must reveal the column so it stays usable.
  function escalationInHiddenColumn() {
    const grids = document.querySelectorAll(GRID_SELECTOR);
    for (let i = 0; i < grids.length; i++) {
      const cols = grids[i].querySelectorAll(':scope > [class*="bg-bg-app"]');
      for (let j = 0; j < cols.length; j++) {
        if (cols[j].querySelector(ESCALATION_SELECTOR)) return true;
      }
    }
    return false;
  }

  // A grid only has a Copilot panel to toggle if it contains a bg-bg-app column.
  // The phones route reuses the actionBar-wrapper testid but is a 2-column
  // layout with no Copilot column, so we must not touch it.
  function gridHasCopilotColumn(grid) {
    return !!grid.querySelector(':scope > [class*="bg-bg-app"]');
  }

  function anyCopilotColumn() {
    const grids = document.querySelectorAll(GRID_SELECTOR);
    for (let i = 0; i < grids.length; i++) {
      if (gridHasCopilotColumn(grids[i])) return true;
    }
    return false;
  }

  // True when a right-anchored RightSheet overlay is slid on-screen (follow-up,
  // incidents, transfer, macro/escalation, chat-escalation in the chat route).
  // These are Beacon overlays with their own close controls, so we hide our
  // floating button while one is open to avoid overlapping it. Detected by the
  // Sheet element (data-testid="sheet") being right-anchored and on-screen
  // (when closed it is unmounted or translated fully off the right edge).
  function rightOverlayOpen() {
    const sheets = document.querySelectorAll('[data-testid="sheet"]');
    for (let i = 0; i < sheets.length; i++) {
      const r = sheets[i].getBoundingClientRect();
      if (
        r.width > 40 && r.height > 40 &&
        r.right >= window.innerWidth - 4 &&
        r.left < window.innerWidth - 40
      ) {
        return true;
      }
    }
    return false;
  }

  // Returns the escalation panel's own Close/Back button when the panel is
  // rendered inside the hidden Copilot column. The consultation grid is
  // min-w-[850px] and overflows narrow windows, pushing that button off the
  // right edge -- so our toggle clicks it programmatically instead.
  function inColumnPanelCloseButton() {
    const grids = document.querySelectorAll(GRID_SELECTOR);
    for (let i = 0; i < grids.length; i++) {
      const cols = grids[i].querySelectorAll(':scope > [class*="bg-bg-app"]');
      for (let j = 0; j < cols.length; j++) {
        const panel = cols[j].querySelector(ESCALATION_SELECTOR);
        if (panel) {
          return panel.querySelector('[aria-label="Close"], [aria-label="Back"]');
        }
      }
    }
    return null;
  }

  let toggleButton = null;
  let observer = null;
  let rafPending = false;

  function isHidden() {
    // Default hidden: only treat as shown when explicitly stored as '0'.
    return localStorage.getItem(STATE_KEY) !== '0';
  }

  function setHidden(hidden) {
    try {
      localStorage.setItem(STATE_KEY, hidden ? '1' : '0');
    } catch (error) {
      // Ignore storage failures; state simply won't persist.
    }
  }

  // Why CSS instead of toggling a class on the Copilot column:
  //
  // Beacon's ChatLayout renders three grid children -- AccountInfo (`bg-bg`),
  // ChatPane, and the Copilot column (`bg-bg-app relative`). The Copilot <div>
  // is owned by React and its className is a hardcoded JSX string. If we add a
  // "hidden" class to that <div>, the next React re-render (and there are many
  // on first load: auth, streaming, notifications, quick-tips) reconciles the
  // className back to its original value and strips our class, so Copilot pops
  // back into view. That is the "doesn't work on first load / three panels"
  // bug.
  //
  // Instead we set a data-* attribute on the GRID container (React does not
  // manage unknown data-* attributes, so re-renders leave it in place) and let
  // these style rules do the hiding + column resizing. `> [class*="bg-bg-app"]`
  // matches only the Copilot column (AccountInfo uses `bg-bg`, ChatPane has no
  // bg-*), and never the inner Copilot content div (not a direct child).
  function injectStyles() {
    if (document.getElementById('tsx-copilot-toggle-styles')) return;
    const CHAT = '[data-testid="actionBar-wrapper"][' + HIDDEN_ATTR + ']';
    const CONSULT = '[data-testid="consultation-chat-wrapper"][' + HIDDEN_ATTR + ']';
    const style = document.createElement('style');
    style.id = 'tsx-copilot-toggle-styles';
    style.textContent = `
      /* Hide the Copilot column (the bg-bg-app direct child) in both layouts. */
      ${CHAT} > [class*="bg-bg-app"],
      ${CONSULT} > [class*="bg-bg-app"] {
        display: none !important;
      }

      /* Regular chat (actionBar-wrapper): 26rem_1fr_32rem at lg, 1fr_1fr_1fr at
         md, 2 cols at sm (the account column is hidden below md). */
      @media (min-width: 1024px) {
        ${CHAT} { grid-template-columns: 26rem 1fr !important; }
      }
      @media (min-width: 768px) and (max-width: 1023.98px) {
        ${CHAT} { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 767.98px) {
        ${CHAT} { grid-template-columns: 1fr !important; }
      }

      /* Live assist / consultation (consultation-chat-wrapper): 3 equal cols
         below lg (min-width 850px), 26rem_1fr_32rem at lg. The left Notes/
         Account column is always present here, so keep it and widen the chat. */
      @media (min-width: 1024px) {
        ${CONSULT} { grid-template-columns: 26rem 1fr !important; }
      }
      @media (max-width: 1023.98px) {
        ${CONSULT} { grid-template-columns: minmax(0, 20rem) 1fr !important; }
      }
      #tsx-copilot-toggle-btn {
        position: fixed;
        top: 66px;
        right: 12px;
        z-index: 2147483000;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        font: 500 12px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #1a1a1a;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        user-select: none;
        transition: background 0.12s ease, box-shadow 0.12s ease;
      }
      #tsx-copilot-toggle-btn:hover {
        background: #f4f4f4;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
      }
      #tsx-copilot-toggle-btn .tsx-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #8a3ffc;
      }
    `;
    document.head.appendChild(style);
  }

  // Reflect the current state onto every chat-layout grid on the page. This is
  // idempotent and content-independent, so it is safe to call as often as we
  // like (mount, re-render, navigation, resize).
  function applyState() {
    // Force the panel open while the escalation sheet is showing, since it
    // renders inside the column we hide. The stored preference is untouched, so
    // the panel reverts to hidden once the escalation sheet closes.
    const escalationOpen = escalationInHiddenColumn();
    const hidden = isHidden() && !escalationOpen;
    const grids = document.querySelectorAll(GRID_SELECTOR);
    grids.forEach(function (grid) {
      // Only manage grids that actually have a Copilot column (skip the phones
      // 2-column layout, which shares the actionBar-wrapper testid).
      if (hidden && gridHasCopilotColumn(grid)) {
        if (!grid.hasAttribute(HIDDEN_ATTR)) grid.setAttribute(HIDDEN_ATTR, '');
      } else if (grid.hasAttribute(HIDDEN_ATTR)) {
        grid.removeAttribute(HIDDEN_ATTR);
      }
    });
    updateButton();
  }

  function scheduleApply() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      applyState();
      positionButton();
    });
  }

  // Keep our button in the top-right corner. When the take-over button is
  // present, nudge IT left (reserve room via margin-right) so our button sits
  // to its right, and vertically centre our button on it.
  function positionButton() {
    const anchor = document.querySelector(ANCHOR_SELECTOR);
    const anchorRect =
      anchor && anchor.getBoundingClientRect().width > 0
        ? anchor.getBoundingClientRect()
        : null;
    const shown = !!toggleButton && toggleButton.style.display !== 'none';

    // Reserve space to the right of the take-over button for our corner button.
    if (anchor) {
      if (anchorRect && shown) {
        const w = Math.round(toggleButton.getBoundingClientRect().width) || 120;
        anchor.style.marginRight = w + 12 + ANCHOR_GAP + 'px';
      } else {
        anchor.style.marginRight = '';
      }
    }

    if (!shown) return;

    toggleButton.style.left = 'auto';
    toggleButton.style.height = 'auto';
    toggleButton.style.right = '12px';
    if (anchorRect) {
      // Vertically centre on the take-over button (measured before the margin,
      // which only shifts it horizontally).
      toggleButton.style.top = Math.round(anchorRect.top + anchorRect.height / 2) + 'px';
      toggleButton.style.transform = 'translateY(-50%)';
    } else {
      toggleButton.style.top = '66px';
      toggleButton.style.transform = 'none';
    }
  }

  function updateButton() {
    if (!toggleButton) return;
    const inColumnPanel = escalationInHiddenColumn();

    // Show the button when a Copilot column exists AND we're not being covered
    // by a right overlay -- except keep it visible for an in-column escalation
    // panel, where our button IS the closer.
    const show =
      anyCopilotColumn() && (inColumnPanel || !rightOverlayOpen());
    toggleButton.style.display = show ? 'inline-flex' : 'none';
    if (!show) return;

    // While an escalation panel is force-shown inside the column, the button
    // becomes its closer (its own Close X can be scrolled off-screen).
    if (inColumnPanel) {
      toggleButton.innerHTML = '<span class="tsx-dot"></span>Close panel';
      toggleButton.title = 'Close the escalation panel';
      return;
    }

    const hidden = isHidden();
    toggleButton.innerHTML = '<span class="tsx-dot"></span>' +
      (hidden ? 'Show Copilot' : 'Hide Copilot');
    toggleButton.title = hidden
      ? 'Show the Copilot suggested-response panel'
      : 'Hide the Copilot panel to widen the chat';
  }

  function createButton() {
    if (toggleButton) return;
    toggleButton = document.createElement('button');
    toggleButton.id = 'tsx-copilot-toggle-btn';
    toggleButton.type = 'button';
    toggleButton.style.display = 'none';
    toggleButton.addEventListener('click', function () {
      // If an escalation panel is open inside the column, close it (its native
      // Close button may be off-screen in narrow windows).
      const closeBtn = inColumnPanelCloseButton();
      if (closeBtn) {
        closeBtn.click();
        scheduleApply();
        return;
      }
      setHidden(!isHidden());
      scheduleApply();
    });
    document.body.appendChild(toggleButton);
    updateButton();
  }

  function startObserver() {
    if (observer) return;
    // We only need to know when the grid is (re)mounted so we can re-stamp the
    // attribute. We do NOT watch style/class anymore: the script no longer
    // mutates React-owned style/class, so there is nothing to fight and no
    // feedback loop to guard against.
    observer = new MutationObserver(function () {
      scheduleApply();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Fast retries for the first few seconds to catch the initial mount, then a
    // steady low-frequency re-check for the rest of the session (covers the
    // grid being swapped out on navigation between chats).
    let quick = 0;
    const quickTimer = window.setInterval(function () {
      scheduleApply();
      quick += 1;
      if (quick >= 20) window.clearInterval(quickTimer);
    }, 250);
    window.setInterval(scheduleApply, 1000);
  }

  function init() {
    injectStyles();
    createButton();
    startObserver();
    scheduleApply();

    // Re-apply on SPA navigation between chats.
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function () {
      const r = push.apply(this, arguments);
      scheduleApply();
      return r;
    };
    history.replaceState = function () {
      const r = replace.apply(this, arguments);
      scheduleApply();
      return r;
    };
    window.addEventListener('popstate', scheduleApply);
    window.addEventListener('resize', scheduleApply);
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
