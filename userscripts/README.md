# Userscripts

Local browser userscripts for Theme Support workflow improvements.

## Install

1. Install a userscript manager. [OrangeMonkey](https://kepler.shopify.io/services/orangemonkey) is the current Kepler-approved userscript manager as of 05/05/2026. Tampermonkey, Violentmonkey, or similar userscript managers may also work.
2. Click the install link beside the relevant script below.
3. Accept the install prompt from your userscript manager.
4. Reload Shopify Admin or Theme Editor tabs.

Avoid copying and pasting the script manually unless you are testing local changes. Installing from the raw GitHub URL gives the userscript manager the best chance of detecting future updates.

## Available scripts

| Script | Install link | Purpose |
| --- | --- | --- |
| [`theme-editor-inspector-default-off.user.js`](theme-editor-inspector-default-off.user.js) | [Install](https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.user.js) | Defaults the Shopify Theme Editor Preview inspector to off. |

## Troubleshooting

If a userscript does not appear to be working after installation:

1. Confirm the script is enabled in your userscript manager.
2. Reload Shopify Admin and any open Theme Editor tabs.
3. Clear your browser cache for Shopify Admin and Online Store Web, then reload again.
4. Log out of Shopify Admin and log back in.
5. If the issue still needs attention, contact @BrenLong on Slack with the script name, browser, userscript manager, and what happened.

## Updating

By default, OrangeMonkey automatically checks installed scripts for updates every day. You can also manually use the "Check for updates" button after the script is installed.

When an update is available, OrangeMonkey checks the script metadata and downloads the latest version from GitHub.

## Notes

The Shopify Theme Editor runs inside an embedded Online Store Web iframe, usually on `online-store-web.shopifyapps.com`. Userscripts that change Theme Editor behaviour need to match that iframe origin, not only `admin.shopify.com`.

These scripts are intended for local browser workflow convenience only. They do not modify merchant theme code, storefront code, or Shopify platform behaviour.
