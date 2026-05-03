# Userscripts

Local browser userscripts for Theme Support workflow improvements.

## Install

1. Install a userscript manager such as Tampermonkey.
2. Create a new userscript.
3. Copy the contents of the relevant `.user.js` file.
4. Save the userscript.
5. Reload affected Shopify Admin tabs.

## Available scripts

| Script | Purpose |
| --- | --- |
| [`theme-editor-inspector-default-off.user.js`](theme-editor-inspector-default-off.user.js) | Defaults the Shopify Theme Editor Preview inspector to off. |

## Notes

The Shopify Theme Editor runs inside an embedded Online Store Web iframe, usually on `online-store-web.shopifyapps.com`. Userscripts that change Theme Editor behaviour need to match that iframe origin, not only `admin.shopify.com`.
