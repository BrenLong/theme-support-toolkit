const fs = require("fs");
const path = require("path");

const themesPath = path.join(__dirname, "../src/themes.json");
const themes = require(themesPath);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const slugForThemeStore = (key, theme) =>
  (theme.name || key).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const extractVersion = (html) => {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const match = text.match(/\bVersion\s+([0-9]+(?:\.[0-9A-Za-z-]+)*)\b/);
  return match ? match[1] : null;
};

const fetchThemeVersion = async (slug) => {
  const url = `https://themes.shopify.com/themes/${slug}/styles/default`;
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 Theme Support Toolkit theme-details updater",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  return extractVersion(html);
};

(async () => {
  const changed = [];
  const skipped = [];

  for (const [key, theme] of Object.entries(themes)) {
    if (theme.shopifyStoreTheme !== true || theme.sunset === true) {
      skipped.push([key, "not active Theme Store theme"]);
      continue;
    }

    const slug = slugForThemeStore(key, theme);

    try {
      const currentVersion = await fetchThemeVersion(slug);

      if (!currentVersion) {
        skipped.push([key, "version not found"]);
      } else if (theme.currentVersion !== currentVersion) {
        changed.push([key, theme.currentVersion || "", currentVersion]);
        theme.currentVersion = currentVersion;
      }
    } catch (error) {
      skipped.push([key, error.message]);
    }

    // Keep this intentionally slow to avoid hammering the Theme Store or triggering 429s.
    await sleep(900);
  }

  fs.writeFileSync(themesPath, `${JSON.stringify(themes, null, 2)}\n`);

  console.log(`Updated ${changed.length} theme version(s).`);
  changed.forEach(([key, oldVersion, newVersion]) =>
    console.log(`- ${key}: ${oldVersion || "(blank)"} -> ${newVersion}`)
  );

  if (skipped.length) {
    console.log(`Skipped ${skipped.length} theme(s).`);
    skipped.slice(0, 25).forEach(([key, reason]) => console.log(`- ${key}: ${reason}`));
    if (skipped.length > 25) console.log(`- ... ${skipped.length - 25} more`);
  }
})();
