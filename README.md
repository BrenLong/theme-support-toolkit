# Theme Support Toolkit

A personal collection of browser tools that make day-to-day Shopify Theme Support work smoother.

These are local browser tools (bookmarklets and userscripts) for personal workflow convenience. They do **not** modify merchant theme code, storefront code, or Shopify platform behaviour — they only adjust what you see in your own browser.

## What's in here

This repository holds the **shareable** tools listed below. Anyone on the team can install them from the links in the table.

Some tools are kept **personal and local-only** and are intentionally not included here.

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

## How updates work

- **Userscripts:** each script includes an `@updateURL` (a small `.meta.js`) and `@downloadURL` (the full `.user.js`). Userscript managers compare the installed `@version` against the remote metadata and offer an update when it changes. To ship an update, bump `@version` in **both** the `.user.js` and its matching `.meta.js`, then commit and push.
- **Bookmarklet:** the installed bookmarklet checks this repo's `version.json` and shows an update message when it's behind.

## Safety notes

- Review scripts before running them.
- These tools are for local browser workflow convenience only.
- They do not modify merchant theme code, storefront code, or Shopify platform behaviour.
- Do **not** add merchant data, ticket details, credentials, or internal-only infrastructure/documentation to this repository. It is public.
- Be careful with anything that targets Shopify Admin or internal tools. Keep the scope narrow and the behaviour easy to understand.

## Planned scope

The initial scope is browser tools and userscripts. Possible future additions:

- Theme support diagnostics for DevTools
- Reusable troubleshooting checklists
- Theme customization snippets
- Known issue notes

The goal is to keep the repository small, useful, and easy to maintain.
