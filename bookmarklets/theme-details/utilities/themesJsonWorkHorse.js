// Description: This script is used to go through the Theme Store Dashboard
// and pull out the theme names, developers, and current versions.

// const themes = {}; // This is the object that will hold all the theme data,
// // which can be found in the theme-details-bookmarklet.js file or the
// // themes.json file.

const rows = [
  ...document.querySelectorAll(".internal-table.tablesort tbody tr"),
];

for (const row of rows) {
  let themeName = row.querySelector("td:nth-child(1) a").innerText;
  let themeNameLower = themeName.toLowerCase();
  let developerName = row.querySelector("td:nth-child(3) a").innerText;

  themes[themeNameLower] = themes[themeNameLower] || {};
  themes[themeNameLower]["name"] = themeName;
  themes[themeNameLower]["currentVersion"] =
    themes[themeNameLower]["currentVersion"] || "";
  themes[themeNameLower]["developer"] =
    themes[themeNameLower]["developer"] || developerName;
  themes[themeNameLower]["shopifyStoreTheme"] =
    themes[themeNameLower]["shopifyStoreTheme"] || true;
  themes[themeNameLower]["shopifyPartner"] =
    themes[themeNameLower]["developer"] === "Shopify" ? false : true;
  themes[themeNameLower]["newVersion"] =
    themes[themeNameLower]["newVersion"] || "";
  themes[themeNameLower]["supportDocs"] =
    themes[themeNameLower]["supportDocs"] || "";
  themes[themeNameLower]["releaseNotes"] =
    themes[themeNameLower]["releaseNotes"] || "";
  themes[themeNameLower]["customThemeNote"] =
    themes[themeNameLower]["customThemeNote"] || "";
  themes[themeNameLower]["sunset"] = themes[themeNameLower]["sunset"] || false;
}

console.log(themes);
