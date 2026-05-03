# Theme Support Toolkit

A personal collection of browser tools and workflow helpers for Shopify Theme Support work.

This toolkit starts small: the MVP is focused on local browser userscripts that make day-to-day theme support workflows smoother. These tools are intended for personal workflow convenience and do not modify merchant theme code, storefront code, or Shopify platform behaviour.

## Tools

### Theme Details Bookmarklet

Identifies the active Shopify theme from a storefront using `Shopify.theme` and shows theme name, version, theme ID, known developer, docs/release-note links, and copy helpers.

- File: [`bookmarklets/theme-details/themeDetailsBookmarklet.min.js`](bookmarklets/theme-details/themeDetailsBookmarklet.min.js)
- Source: [`bookmarklets/theme-details/src/themeDetailsBookmarkletCore.js`](bookmarklets/theme-details/src/themeDetailsBookmarkletCore.js)
- Theme database: [`bookmarklets/theme-details/src/themes.json`](bookmarklets/theme-details/src/themes.json)
- Type: Bookmarklet
- Scope: Local browser only
- Target: Shopify storefronts

From Pi, run `theme-details-bookmarklet open-install` for a local install page, or `theme-details-bookmarklet copy` to copy the bookmarklet code.

### Theme Editor Preview Inspector Default Off

Defaults the Shopify Theme Editor Preview inspector to off by setting the editor's existing local session preference before the editor initializes.

- File: [`userscripts/theme-editor-inspector-default-off.user.js`](userscripts/theme-editor-inspector-default-off.user.js)
- Type: Tampermonkey/userscript
- Scope: Local browser only
- Target: Shopify Admin and the embedded Online Store Web iframe

The Theme Editor itself runs inside an embedded Online Store Web iframe, usually on `online-store-web.shopifyapps.com`. The userscript therefore matches both Shopify Admin and Online Store Web origins so the `previewInspectorEnabled` session storage value is set in the same browser context that the editor reads from.

## Install a bookmarklet

1. Open the bookmarklet install page or copy the generated `javascript:` code.
2. Create a browser bookmark.
3. Paste the generated code into the bookmark's URL field.
4. Save it.
5. Open a Shopify storefront and click the bookmark.

## Install a userscript

1. Install a userscript manager such as Tampermonkey.
2. Open the `.user.js` file for the tool you want to use.
3. Copy the script into a new userscript.
4. Save it.
5. Reload any already-open Shopify Admin or Theme Editor tabs.

## Safety notes

- Review scripts before running them.
- These tools are designed for local browser workflow convenience only.
- Do not add merchant data, ticket details, credentials, or internal-only documentation to this repository.
- Be careful when adding anything that targets Shopify Admin. Keep the scope narrow and the behaviour easy to understand.

## Planned scope

The initial scope is browser tools and userscripts. Possible future additions:

- Theme support diagnostics for DevTools
- Reusable troubleshooting checklists
- Theme customization recipes
- Known issue notes

For now, the goal is to keep the repository small, useful, and easy to maintain.
