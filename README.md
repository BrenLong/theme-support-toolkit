# Theme Support Toolkit

A personal collection of browser tools that make day-to-day Shopify Theme Support work smoother.

These are local browser tools (bookmarklets and userscripts) for personal workflow convenience. They do **not** modify merchant theme code, storefront code, or Shopify platform behaviour — they only adjust what you see in your own browser.

## What's in here

This repository holds the tools listed below. Anyone on the team can install them from the links in the table.

## Tools

| Tool | Type | Runs on | Install | Details |
| --- | --- | --- | --- | --- |
| Theme Details | Bookmarklet | Shopify storefronts | Build + paste (see details) | [bookmarklets/theme-details](bookmarklets/theme-details/README.md) |
| Theme Editor Preview Inspector Default Off | Userscript | Shopify Admin + Theme Editor | [Install](https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.user.js) | [userscripts](userscripts/README.md) |
| Beacon Copilot Panel Toggle | Userscript | Beacon | [Install](https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/beacon-copilot-panel-toggle.user.js) | [userscripts](userscripts/README.md) |

**What each tool does:**

- **Theme Details** — identifies the active Shopify theme from a storefront using `Shopify.theme` and shows theme name, version, theme ID, known developer, and docs/release-note links.
- **Theme Editor Preview Inspector Default Off** — defaults the Shopify Theme Editor's Preview inspector to off, so it isn't enabled every time you open the editor.
- **Beacon Copilot Panel Toggle** — hides Beacon's Copilot (suggested-response) sidebar by default to widen the chat panel, with a floating button to show/hide it. Remembers your last choice.

## Installing a userscript

1. Install a userscript manager. [OrangeMonkey](https://kepler.shopify.io/services/orangemonkey) is the current Kepler-approved manager as of 05/05/2026. Tampermonkey, Violentmonkey, or similar may also work.
2. Open the raw `.user.js` install link for the tool you want (see the table above).
3. Accept the install prompt from your userscript manager.
4. Reload any already-open Shopify Admin, Theme Editor, or Beacon tabs.

Install from the raw GitHub link rather than copying and pasting the code — installing from the URL lets your userscript manager receive future updates automatically. See [`userscripts/README.md`](userscripts/README.md) for per-script notes and troubleshooting.

## Installing the bookmarklet

The Theme Details bookmarklet is built from source and pasted into a browser bookmark. See [`bookmarklets/theme-details/README.md`](bookmarklets/theme-details/README.md) for build and install steps. From Pi you can run `theme-details-bookmarklet open-install` for a local install page.

## Updates

Userscripts update automatically — your userscript manager checks for new versions (or use its "Check for updates" button). The Theme Details bookmarklet shows a message when a newer version is available.

## Safety notes

- These tools are for local browser workflow convenience only and do not modify merchant theme code, storefront code, or Shopify platform behaviour.
- This repository is public — do not add merchant data, ticket details, credentials, or internal-only information to it.
