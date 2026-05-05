# Userscripts

Local browser userscripts for Theme Support workflow improvements.

## Install

1. Install a userscript manager such as OrangeMonkey, Tampermonkey, or Violentmonkey.
2. Open the raw GitHub `.user.js` install link for the script you want to use.
3. Accept the install prompt from your userscript manager.
4. Reload affected Shopify Admin or Theme Editor tabs.

Avoid copying and pasting the script manually unless you are testing local changes. Installing from the raw GitHub URL gives the userscript manager the best chance of detecting future updates.

## Available scripts

| Script | Install link | Purpose |
| --- | --- | --- |
| [`theme-editor-inspector-default-off.user.js`](theme-editor-inspector-default-off.user.js) | [Install](https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.user.js) | Defaults the Shopify Theme Editor Preview inspector to off. |

## Updating

Shared userscripts should use a metadata-only update file:

- `@updateURL` points to the matching `.meta.js` file.
- `@downloadURL` points to the full `.user.js` file.
- `@version` must be bumped in both files whenever the script changes.

For example, the Theme Editor inspector script uses:

```javascript
// @updateURL    https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.meta.js
// @downloadURL  https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/userscripts/theme-editor-inspector-default-off.user.js
```

## Notes

The Shopify Theme Editor runs inside an embedded Online Store Web iframe, usually on `online-store-web.shopifyapps.com`. Userscripts that change Theme Editor behaviour need to match that iframe origin, not only `admin.shopify.com`.

These scripts are intended for local browser workflow convenience only. They do not modify merchant theme code, storefront code, or Shopify platform behaviour.
