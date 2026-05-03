const terser = require("terser");
const fs = require("fs");
const path = require("path");
// import json from "./themes.json";
const themes = require("../src/themes.json");

const baseCode = fs.readFileSync(
  path.join(__dirname, "../src/themeDetailsBookmarkletCore.js"),
  "utf8"
);

const buildCode = (themes) => {
  const outputCode = `(function () {
    const themes = ${JSON.stringify(themes)};
    ${baseCode}
    })();`;

  // build a new file called toMinify.js, which will later be deleted
  fs.writeFileSync(path.join(__dirname, "/toMinify.js"), outputCode);
};

// minify the new file
const minifyCode = () => {
  buildCode(themes);
  const code = fs.readFileSync(path.join(__dirname, "./toMinify.js"), "utf8");

  terser.minify(code).then((result) => {
    fs.writeFileSync(
      path.join(__dirname, "../themeDetailsBookmarklet.min.js"),
      `javascript:${result.code}`
    );
  });
};

// delete the new file
const deleteCode = () => {
  minifyCode();
  fs.unlinkSync(path.join(__dirname, "./toMinify.js"));
};

deleteCode();
