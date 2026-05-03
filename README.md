# Theme Support Toolkit

A personal collection of browser tools and workflow helpers for Shopify Theme Support work.

This toolkit starts small: the MVP is focused on local browser userscripts that make day-to-day theme support workflows smoother. These tools are intended for personal workflow convenience and do not modify merchant theme code, storefront code, or Shopify platform behaviour.

## Tools

### Theme Editor Preview Inspector Default Off

Defaults the Shopify Theme Editor Preview inspector to off by setting the editor's existing local session preference before the editor initializes.

- File: [`userscripts/theme-editor-inspector-default-off.user.js`](userscripts/theme-editor-inspector-default-off.user.js)
- Type: Tampermonkey/userscript
- Scope: Local browser only
- Target: Shopify Admin Theme Editor

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
