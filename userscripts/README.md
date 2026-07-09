# Userscripts

Local browser userscripts for Theme Support workflow improvements.

New to userscripts? The generic install steps (which manager to use, how to install, how updates work) live in the [root README](../README.md#installing-a-userscript). This page covers the individual scripts, per-script notes, troubleshooting, and my own maintainer notes.

## Available scripts

| Script | Install | Runs on | Purpose |
| --- | --- | --- | --- |
| [`theme-editor-inspector-default-off.user.js`](theme-editor-inspector-default-off.user.js) | [Install](https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.user.js) | Shopify Admin + Theme Editor | Defaults the Shopify Theme Editor Preview inspector to off. |
| [`beacon-copilot-panel-toggle.user.js`](beacon-copilot-panel-toggle.user.js) | [Install](https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/beacon-copilot-panel-toggle.user.js) | Beacon | Hides Beacon's Copilot (suggested-response) sidebar by default to widen the chat panel, with a floating button to show/hide it. Remembers your last choice. |

## Per-script notes

### Theme Editor Preview Inspector Default Off

Sets the Theme Editor's existing `previewInspectorEnabled` session preference to off before the editor initializes, so the Preview inspector isn't on by default.

The Theme Editor runs inside an embedded Online Store Web iframe (usually on `online-store-web.shopifyapps.com`). The script therefore matches both Shopify Admin and Online Store Web origins so the preference is set in the same browser context the editor reads from.

### Beacon Copilot Panel Toggle

Hides the Copilot column by default in both Beacon chat layouts (regular chat and live-assist consultation) to widen the chat, and adds a floating button to show/hide it. Your choice is remembered.

- When a consultation escalation panel opens inside the hidden column, the panel is revealed automatically and the button becomes a "Close panel" control.
- When the "Request to take over chat" button is present, the toggle button docks beside it; otherwise it sits in the top-right corner.

## Troubleshooting

If a userscript does not appear to be working after installation:

1. Confirm the script is enabled in your userscript manager.
2. Reload the relevant tab (Shopify Admin, Theme Editor, or Beacon).
3. Clear your browser cache for the relevant origin, then reload again.
4. Log out and back in if the tab relies on an authenticated session.
5. If it still needs attention, contact @BrenLong on Slack with the script name, browser, userscript manager, and what happened.

## Maintainer notes

Just for me, since I'm the one who updates these. To ship a change:

1. Edit the `.user.js`.
2. Bump `@version` in both the `.user.js` and its matching `.meta.js` (userscript managers compare against the `.meta.js`).
3. Commit and push — installed copies update on their next check.

## Notes

These scripts are for local browser workflow convenience only. They do not modify merchant theme code, storefront code, or Shopify platform behaviour.
