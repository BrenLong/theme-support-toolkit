# Theme Details Bookmarklet

A locally maintained version of Stephen Dawson's Theme Details Bookmarklet for Shopify storefronts.

When run on a Shopify storefront, the bookmarklet opens a modal that shows the active theme details from `Shopify.theme`, including theme name, version, theme ID, known developer, support docs, release notes, and a preview-link copy helper.

## Current toolkit version

`0.1.2`

The installed bookmarklet checks this repo's `version.json` file for the latest version and will show an update message when the installed version is behind.

## Install / update

From this folder:

```bash
pnpm install
pnpm run build
cat themeDetailsBookmarklet.min.js | pbcopy
```

Then paste the clipboard contents into the URL field of a browser bookmark.

From Pi, the helper command is easier:

```bash
theme-details-bookmarklet copy
```

Or open a local install page with a draggable bookmarklet link:

```bash
theme-details-bookmarklet open-install
```

## Maintain the bookmarklet

Edit source files only:

- `src/themeDetailsBookmarkletCore.js` - UI and bookmarklet logic
- `src/themes.json` - theme database
- `version.json` - latest published toolkit version and optional custom message

Then rebuild:

```bash
pnpm run build
```

Commit both source changes and the rebuilt `themeDetailsBookmarklet.min.js`.

## Versioning

This toolkit uses its own semantic versioning starting at `0.1.0`.

When changing bookmarklet logic or theme data:

1. Update `bookmarketVersion` in `src/themeDetailsBookmarkletCore.js`.
2. Update `version` in `package.json`.
3. Update `latestVersion` in `version.json`.
4. Run `pnpm run build`.
5. Commit the rebuilt `themeDetailsBookmarklet.min.js`.

## Updating theme versions from the Shopify Theme Store

The theme database can be refreshed from public Theme Store pages:

```bash
pnpm run update:versions
pnpm run build
```

The updater only changes `currentVersion` and only for active Theme Store themes. Some themes may be skipped if their Theme Store URL no longer exists, if the page structure changes, or if the Theme Store rate-limits requests. Skipped themes should be checked manually if needed.

## Original source

This local version is based on the Shopify `theme-details-bookmarklet` project originally created by Stephen Dawson, with contributions from Brendan Long and others.
