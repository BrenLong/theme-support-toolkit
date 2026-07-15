# Userscripts

Local browser userscripts for Theme Support workflow improvements.

New to userscripts? The generic install steps (which manager to use, how to install) live in the [root README](../README.md#installing-a-userscript). This page covers the individual scripts, per-script notes, troubleshooting, and how to update them.

## Available scripts

| Script | Install | Runs on | Purpose |
| --- | --- | --- | --- |
| [`theme-editor-inspector-default-off.user.js`](theme-editor-inspector-default-off.user.js) | [Install](https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.user.js) | Shopify Admin + Theme Editor | Defaults the Shopify Theme Editor Preview inspector to off. |
| [`beacon-copilot-panel-toggle.user.js`](beacon-copilot-panel-toggle.user.js) | [Install](https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/beacon-copilot-panel-toggle.user.js) | Beacon | Hides Beacon's Copilot (suggested-response) sidebar by default to widen the chat panel, with a floating button to show/hide it. Remembers your last choice. |
| [`beacon-uximprovements.user.js`](beacon-uximprovements.user.js) | Work in progress | Beacon | Small quality-of-life tweaks for Beacon. Currently gives the internal Notes field more room. |

## Per-script notes

### Theme Editor Preview Inspector Default Off

Sets the Theme Editor's existing `previewInspectorEnabled` session preference to off before the editor initializes, so the Preview inspector isn't on by default.

The Theme Editor runs inside an embedded Online Store Web iframe (usually on `online-store-web.shopifyapps.com`). The script therefore matches both Shopify Admin and Online Store Web origins so the preference is set in the same browser context the editor reads from.

### Beacon Copilot Panel Toggle

Hides the Copilot column by default in both Beacon chat layouts (regular chat and live-assist consultation) to widen the chat, and adds a floating button to show/hide it. Your choice is remembered.

- When a consultation escalation panel opens inside the hidden column, the panel is revealed automatically and the button becomes a "Close panel" control.
- When the "Request to take over chat" button is present, the toggle button docks beside it; otherwise it sits in the top-right corner.

### Beacon UX Improvements (work in progress)

A home for small, general Beacon quality-of-life tweaks. Currently:

- Gives the internal Notes field (the yellow internal-note textarea) more room so pasted notes are visible without scrolling the little box. It stays drag-resizable.

Still in progress and not yet shared for install.

## Troubleshooting

If a userscript does not appear to be working after installation:

1. Confirm the script is enabled in your userscript manager.
2. Reload the relevant tab (Shopify Admin, Theme Editor, or Beacon).
3. Clear your browser cache for the relevant origin, then reload again.
4. Log out and back in if the tab relies on an authenticated session.
5. If it still needs attention, contact @BrenLong on Slack with the script name, browser, userscript manager, and what happened.

## Updating

Your userscript manager keeps these up to date automatically — it periodically checks each script's update link and installs new versions in the background (OrangeMonkey checks daily by default; Tampermonkey and Violentmonkey behave similarly).

To update right away instead of waiting:

1. Open your userscript manager's dashboard.
2. Trigger a check for updates:
   - **Tampermonkey:** the **Utilities** tab → **Check for userscript updates**.
   - **OrangeMonkey / Violentmonkey:** the **Check for updates** button on the installed script.
3. Reload the affected tab (Shopify Admin, Theme Editor, or Beacon).

## Notes

These scripts are for local browser workflow convenience only. They do not modify merchant theme code, storefront code, or Shopify platform behaviour.
