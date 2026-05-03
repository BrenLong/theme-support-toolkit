// We check to see if the BOOMR object is present
// so that we know it's a Shopify store
if (!Shopify.theme) {
  alert(
    "No Shopify theme detected - this is normal in the Theme Editor, on the Shopify Checkout or if the store is Headless!"
  );
} else if (document.querySelector("dialog.theme-details-dialog[open]")) {
  return; // prevents multiple popups
} else if (document.querySelector("dialog.theme-details-dialog")) {
  document.querySelector("dialog.theme-details-dialog").showModal();
} else {
  // bookmarkletVersion should be updated when new themes are
  // added to the theme.json or when there is a
  // more significant update
  const bookmarketVersion = "0.1.4";
  const bookmarkletVersionUrl =
    "https://raw.githubusercontent.com/BrenLong/theme-support-toolkit/main/bookmarklets/theme-details/version.json";
  const defaultCustomMessage = {
    enable: false,
    dependentTheme: "",
    dependentVersion: "",
    dependentThemeDev: "",
    textColour: "#000000",
    backgroundColour: "#ffffff",
    customMessage: "",
  };

  const isNewerVersion = (latestVersion, installedVersion) => {
    const latestParts = `${latestVersion}`.split(".").map((part) => parseInt(part, 10) || 0);
    const installedParts = `${installedVersion}`.split(".").map((part) => parseInt(part, 10) || 0);
    const partCount = Math.max(latestParts.length, installedParts.length);

    for (let i = 0; i < partCount; i++) {
      const latestPart = latestParts[i] || 0;
      const installedPart = installedParts[i] || 0;

      if (latestPart > installedPart) return true;
      if (latestPart < installedPart) return false;
    }

    return false;
  };

  /**
   * Fetches the latest Brendan toolkit bookmarklet version and optional custom message.
   * If the GitHub version file is unavailable, the bookmarklet continues without an update warning.
   */
  const getBookmarkletVersionAndMessage = () => {
    const versionUrl = `${bookmarkletVersionUrl}?installed=${bookmarketVersion}&cacheBust=${Date.now()}`;

    return fetch(versionUrl, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => [data.latestVersion, data.customMessage || defaultCustomMessage]);
  };

  /**
   * Compares the installed bookmarklet version with the latest version file in this toolkit repo.
   * This displays a message only when the toolkit version is newer than the installed bookmarklet.
   */
  const compareBookmarkletVersion = async () => {
    try {
      const [newestVersion, customMessageJson] =
        await getBookmarkletVersionAndMessage();

      return [isNewerVersion(newestVersion, bookmarketVersion), customMessageJson];
    } catch (error) {
      console.warn("Theme Details bookmarklet version check failed", error);
      return [false, defaultCustomMessage];
    }
  };

  const dialog = document.createElement("dialog");
  dialog.classList.add("theme-details-dialog");
  dialog.style.maxWidth = "1600px";
  dialog.style.width = "95%";
  dialog.style.borderRadius = "5px";
  dialog.style.zIndex = "999999";
  dialog.style.position = "fixed";
  dialog.style.top = "50%";
  dialog.style.left = "50%";
  dialog.style.transform = "translate(-50%, -50%)";

  const close = document.createElement("button");
  close.classList.add("btn-close");
  close.innerHTML = "X";
  close.addEventListener("click", () => {
    dialog.close();
  });

  const content = document.createElement("div");
  content.style.padding = "20px";
  content.style.backgroundColor = "#fff";
  content.style.borderRadius = "5px";

  dialog.appendChild(close);
  dialog.appendChild(content);
  document.body.appendChild(dialog);
  dialog.showModal();

  /**
   * Detects if the pagespeed spoofing script is present on the page
   * This script is sometimes used by partners to artificially inflate pagespeed scores
   * @returns {boolean} true if the spoofing script is detected, false if not.
   */
  const detectPagespeedSpoofingScript = () => {
    // Check for multiple indicators of the speed optimization hack script
    const indicators = [
      // Check for specific obfuscated function names from the provided script
      typeof window.a3_0x3aa2 === "function",
      typeof window.a3_0x4d58 === "function",

      // Check for ShopifyAnalytics being overridden to a string (normally it's an object)
      typeof window.ShopifyAnalytics === "string",

      // Check for scripts with speed testing tool detection patterns
      Array.from(document.querySelectorAll("script")).some((script) => {
        const content = script.textContent || script.innerHTML || "";
        return (
          // Look for hex-encoded strings that check for speed testing tools
          content.includes(
            "\\x43\\x68\\x72\\x6F\\x6D\\x65\\x2D\\x4C\\x69\\x67\\x68\\x74\\x68\\x6F\\x75\\x73\\x65"
          ) || // Chrome-Lighthouse
          content.includes("\\x47\\x54\\x6D\\x65\\x74\\x72\\x69\\x78") || // GTmetrix
          content.includes("\\x70\\x69\\x6E\\x67\\x62\\x6F\\x74") || // pingbot
          // Look for user agent checking patterns common in these scripts
          (content.includes("userAgent") &&
            content.includes("indexOf") &&
            (content.includes("Chrome-Lighthouse") ||
              content.includes("GTmetrix") ||
              content.includes("pingbot"))) ||
          // Look for the specific obfuscated patterns from the original script
          (content.includes("a3_0x3aa2") && content.includes("a3_0x4d58")) ||
          content.includes("425096EPZPcH") ||
          // Look for event listener overriding patterns typical in speed hacks
          (content.includes("addEventListener") &&
            content.includes("DOMContentLoaded") &&
            content.includes("readyState") &&
            content.includes("complete") &&
            content.includes("window["))
        );
      }),

      // Check for trekkie being overridden with minimal fake data (real trekkie has many properties)
      window.trekkie &&
        typeof window.trekkie === "object" &&
        window.trekkie.version &&
        Object.keys(window.trekkie).length < 5,
    ];

    // Return true if 2 or more indicators are present (to avoid false positives)
    return indicators.filter(Boolean).length >= 2;
  };

  /**
   * Displays a message to the user if a new version of the bookmarklet is available.
   * This function is called at the end of this file.
   * @returns {boolean} true if a new version is available, false if not.
   */
  const displayUpdateMessage = async () => {
    let [newAvailable, customMessageJson] = await compareBookmarkletVersion();

    if (
      customMessageJson.enable &&
      customMessageJson.dependentTheme == "" &&
      customMessageJson.dependentVersion == "" &&
      customMessageJson.dependentThemeDev == ""
    ) {
      const customMessage = document.createElement("div");
      customMessage.style.color = customMessageJson.textColour;
      customMessage.style.backgroundColor = customMessageJson.backgroundColour;
      customMessage.style.marginBottom = "1em";
      customMessage.style.padding = "0.5em";
      customMessage.style.border = `1px solid ${customMessageJson.textColour}`;
      customMessage.style.borderRadius = "5px";
      customMessage.innerHTML = `${customMessageJson.customMessage}`;
      customMessage.style.width = "75%";
      customMessage.style.margin = "0 auto 2em";
      customMessage.style.padding = "1em";
      content.prepend(customMessage);
    } else if (
      customMessageJson.enable &&
      customMessageJson.dependentTheme == Shopify.theme.schema_name &&
      customMessageJson.dependentVersion == Shopify.theme.schema_version
    ) {
      const customMessage = document.createElement("div");
      customMessage.style.color = customMessageJson.textColour;
      customMessage.style.backgroundColor = customMessageJson.backgroundColour;
      customMessage.style.marginBottom = "1em";
      customMessage.style.padding = "0.5em";
      customMessage.style.border = `1px solid ${customMessageJson.textColour}`;
      customMessage.style.borderRadius = "5px";
      customMessage.innerHTML = `${customMessageJson.customMessage}`;
      customMessage.style.width = "75%";
      customMessage.style.margin = "0 auto 2em";
      customMessage.style.padding = "1em";
      content.prepend(customMessage);
    } else if (
      customMessageJson.enable &&
      customMessageJson.dependentTheme == Shopify.theme.schema_name &&
      customMessageJson.dependentVersion == ""
    ) {
      const customMessage = document.createElement("div");
      customMessage.style.color = customMessageJson.textColour;
      customMessage.style.backgroundColor = customMessageJson.backgroundColour;
      customMessage.style.marginBottom = "1em";
      customMessage.style.padding = "0.5em";
      customMessage.style.border = `1px solid ${customMessageJson.textColour}`;
      customMessage.style.borderRadius = "5px";
      customMessage.innerHTML = `${customMessageJson.customMessage}`;
      customMessage.style.width = "75%";
      customMessage.style.margin = "0 auto 2em";
      customMessage.style.padding = "1em";
      content.prepend(customMessage);
    } else if (
      themes.hasOwnProperty(Shopify.theme.schema_name.toLowerCase()) &&
      customMessageJson.enable &&
      customMessageJson.dependentVersion == "" &&
      customMessageJson.dependentTheme == "" &&
      customMessageJson.dependentThemeDev ==
        themes[Shopify.theme.schema_name.toLowerCase()]["developer"]
    ) {
      const customMessage = document.createElement("div");
      customMessage.style.color = customMessageJson.textColour;
      customMessage.style.backgroundColor = customMessageJson.backgroundColour;
      customMessage.style.marginBottom = "1em";
      customMessage.style.padding = "0.5em";
      customMessage.style.border = `1px solid ${customMessageJson.textColour}`;
      customMessage.style.borderRadius = "5px";
      customMessage.innerHTML = `${customMessageJson.customMessage}`;
      customMessage.style.width = "75%";
      customMessage.style.margin = "0 auto 2em";
      customMessage.style.padding = "1em";
      content.prepend(customMessage);
    }

    // Check for pagespeed spoofing script and display warning
    if (detectPagespeedSpoofingScript()) {
      const spoofingWarning = document.createElement("div");
      spoofingWarning.style.color = "#721c24";
      spoofingWarning.style.backgroundColor = "#f8d7da";
      spoofingWarning.style.marginBottom = "1em";
      spoofingWarning.style.padding = "1em";
      spoofingWarning.style.border = "1px solid #f5c6cb";
      spoofingWarning.style.borderRadius = "5px";
      spoofingWarning.style.width = "75%";
      spoofingWarning.style.margin = "0 auto 2em";
      spoofingWarning.innerHTML = `<strong>⚠️ Warning: Pagespeed Spoofing Script Detected!</strong><br>
        This store appears to be using a script that artificially manipulates pagespeed metrics. 
        This can cause performance issues and inaccurate analytics data.`;
      content.prepend(spoofingWarning);
    }

    if (newAvailable) {
      const updateMessage = document.createElement("div");
      updateMessage.style.color = "red";
      updateMessage.style.padding = "0.5em";
      updateMessage.style.paddingBottom = "1em";
      updateMessage.innerHTML = `A new version of the bookmarklet is available: <a style="color:blue; text-decoration:underline;" href="https://github.com/BrenLong/theme-support-toolkit/tree/main/bookmarklets/theme-details" target="_blank">Click here for the code and instructions to update it.</a>`;
      content.prepend(updateMessage);
    }
  };

  displayUpdateMessage();

  const title = document.createElement("h1");
  title.classList.add("theme-details-title");
  title.innerHTML = `Theme details (v${bookmarketVersion})`;

  const themeDetailsContainer = document.createElement("div");
  themeDetailsContainer.classList.add("theme-details-grid");

  const themeDetailsLeft = document.createElement("div");
  themeDetailsLeft.classList.add("boomr-info");
  const themeDetailsLeftContent = document.createElement("div");

  const themeDetailsMiddle = document.createElement("div");
  const themeDetailsRight = document.createElement("div");

  const themeName = document.createElement("p");
  themeName.innerHTML = `<strong>Theme name:</strong> ${Shopify.theme.schema_name}`;

  const themeVersion = document.createElement("p");
  themeVersion.innerHTML = `<strong>Theme version:</strong> ${Shopify.theme.schema_version}`;

  const themeId = document.createElement("p");
  themeId.innerHTML = `<strong>Theme ID:</strong> ${Shopify.theme.id}`;

  content.appendChild(title);
  content.appendChild(themeDetailsContainer);
  themeDetailsContainer.appendChild(themeDetailsLeft);
  themeDetailsContainer.appendChild(themeDetailsMiddle);
  themeDetailsContainer.appendChild(themeDetailsRight);
  themeDetailsLeft.appendChild(themeDetailsLeftContent);
  themeDetailsLeftContent.appendChild(themeName);
  themeDetailsLeftContent.appendChild(themeVersion);
  themeDetailsLeftContent.appendChild(themeId);

  const themeLower = Shopify.theme.schema_name.toLowerCase();
  if (themes.hasOwnProperty(themeLower)) {
    if (themes[themeLower]["developer"] !== "Shopify") {
      const shopifyPartner = document.createElement("p");
      shopifyPartner.innerHTML = themes[themeLower].shopifyPartner
        ? `<strong>Theme developer:</strong> ${themes[themeLower].developer} (Shopify partner)`
        : "<strong>Theme developer:</strong> This is a third-party (non-partner) theme";
      themeDetailsMiddle.appendChild(shopifyPartner);
    } else {
      const shopifyPartner = document.createElement("p");
      shopifyPartner.innerHTML = `<strong>Theme developer:</strong> ${themes[themeLower].developer}`;
      themeDetailsMiddle.appendChild(shopifyPartner);
    }

    if (themes[themeLower]["currentVersion"] !== "") {
      const currentVersion = document.createElement("p");
      const currentVersionNumbers =
        themes[themeLower].currentVersion.split(".");
      const installedVersionNumbers = Shopify.theme.schema_version.split(".");
      let isUpdateAvailable = false;
      for (let i = 0; i < currentVersionNumbers.length; i++) {
        const currentNumber = parseInt(currentVersionNumbers[i]);
        const installedNumber = parseInt(installedVersionNumbers[i]);
        if (currentNumber > installedNumber) {
          isUpdateAvailable = true;
          break;
        } else if (currentNumber < installedNumber) {
          break;
        }
      }
      currentVersion.innerHTML = `<strong>Latest version:</strong> ${themes[themeLower].currentVersion}`;
      if (isUpdateAvailable) {
        currentVersion.innerHTML +=
          " - have they considered updating their theme?";
      }
      themeDetailsMiddle.appendChild(currentVersion);
    }

    if (themes[themeLower]["supportDocs"]) {
      const supportDocs = document.createElement("p");
      supportDocs.innerHTML = `<strong>Support docs:</strong> <a style="color:blue; text-decoration:underline;" href="${themes[themeLower].supportDocs}" target="_blank">Click here for the theme's support docs</a>`;
      themeDetailsMiddle.appendChild(supportDocs);
    } else {
      const supportDocs = document.createElement("p");
      if (themes[themeLower]["sunset"] == true) {
        supportDocs.innerHTML = `<strong>Support docs:</strong> This theme has been sunset and may no longer have public support docs.`;
      } else {
        supportDocs.innerHTML = `<strong>Support docs:</strong> We don't have a record of support docs for this theme - <a style="color:blue; text-decoration:underline;" href="https://docs.google.com/forms/d/e/1FAIpQLSc1ScOu70hiYm9gdTQfNMCxZBM-O15k-T-o0xBxGyvIxKcN6g/viewform?usp=sf_link" target="_blank">please let us know</a>`;
      }
      themeDetailsMiddle.appendChild(supportDocs);
    }

    if (themes[themeLower]["releaseNotes"]) {
      const releaseNotes = document.createElement("p");
      releaseNotes.innerHTML = `<strong>Release notes:</strong> <a style="color:blue; text-decoration:underline;" href="${themes[themeLower].releaseNotes}" target="_blank">Click here for the theme's release notes</a>`;
      themeDetailsMiddle.appendChild(releaseNotes);
    } else {
      const releaseNotes = document.createElement("p");
      if (themes[themeLower]["sunset"] == true) {
        releaseNotes.innerHTML = `<strong>Release notes:</strong> This theme has been sunset and may no longer have public release notes.`;
      } else {
        releaseNotes.innerHTML = `<strong>Release notes:</strong> We don't have a record of the release notes for this theme - <a style="color:blue; text-decoration:underline;" href="https://docs.google.com/forms/d/e/1FAIpQLSc1ScOu70hiYm9gdTQfNMCxZBM-O15k-T-o0xBxGyvIxKcN6g/viewform?usp=sf_link" target="_blank">please let us know</a>`;
      }
      themeDetailsMiddle.appendChild(releaseNotes);
    }

    if (themes[themeLower]["customThemeNote"]) {
      const customThemeMessage = document.createElement("p");
      customThemeMessage.classList.add("custom-theme-note");
      customThemeMessage.innerHTML = `<strong>Note about ${
        themes[themeLower]["name"]
      }:</strong> ${themes[themeLower]["customThemeNote"].replace(
        "\n ",
        "<br>"
      )}`;
      themeDetailsContainer.appendChild(customThemeMessage);
    }
  } else {
    const themeDetails = document.createElement("div");
    themeDetails.style.margin = "0 0 10px 0";
    themeDetails.style.padding = "0";
    themeDetails.style.fontSize = "16px";
    themeDetails.style.fontWeight = "regular";
    themeDetails.style.color = "rgba(0, 0, 0, 1)";
    themeDetails.innerHTML = `<strong>Theme details:</strong> We don't have additional details for this theme - <a style="color:blue; text-decoration:underline;" href="https://docs.google.com/forms/d/e/1FAIpQLSc1ScOu70hiYm9gdTQfNMCxZBM-O15k-T-o0xBxGyvIxKcN6g/viewform?usp=sf_link" target="_blank">click here to provide info on this theme for the next version of the bookmarklet! :)</a>`;
    themeDetailsMiddle.appendChild(themeDetails);
  }

  // add GitHub link to bottom right of the dialog
  const githubSvg = `<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;

  const githubLink = document.createElement("a");
  githubLink.classList.add("social-icon");
  githubLink.href =
    "https://github.com/BrenLong/theme-support-toolkit/tree/main/bookmarklets/theme-details";
  githubLink.target = "_blank";
  githubLink.innerHTML = githubSvg;

  const githubContainer = document.createElement("div");
  githubContainer.style.float = "right";
  githubContainer.style.marginTop = "1em";
  githubContainer.style.marginRight = "1em";
  githubContainer.appendChild(githubLink);
  content.appendChild(githubContainer);

  // Css rules
  const bookmarkletStyle = document.createElement("style");
  bookmarkletStyle.innerText = `
      dialog * {
        direction: ltr;
      }

      .btn-close {
        position: absolute;
        color: #fff;
        top: 0;
        right: 0;
        padding: 10px 15px;
        background-color: red;
        border: none;
        border-radius: 5px 0px 5px 5px;
        max-width: 40px;
        z-index: 999999;
      }

      .theme-details-grid {
        display: grid;
        grid-template-columns: 2fr 3fr 2fr;
        gap: 2rem;
      }

      .theme-details-title {
        margin: 0 0 20px 0;
        padding: 0;
        font-size: 24px;
        font-weight: normal;
        color: rgba(0, 0, 0, 1);
      }

      /*
      This level of specificity is needed
      to ensure the text color is not overwritten
      by the theme
      */
      div.theme-details-grid > div > p {
        color: #000000;
        margin: 0 0 10px 0;
        font-size: 16px;
        font-weight: regular;
        padding: 0;
      }

      .boomr-info {
        display: flex;
      }

      .boomr-info p {
        margin-top: 1em;
      }

      .boomr-info p:nth-child(1) {
        margin-top: 0;
      }


      .social-icon + .social-icon {
        margin-left: 1em;
      }

      .social-icon svg {
        width: 3rem;
        max-width: 35px;
        height: auto;
        transition: transform 0.2s ease;
        cursor: pointer;
      }

      .social-icon svg {
        fill: black;
      }

      .social-icon:hover svg {
        transform: scale(1.1);
      }

      .social-icon:hover svg {
        fill: currentColor;
      }

      /* Spinner animation */
      .loading-animation {
        position: relative;
      }

      .loading-animation:before {
        content: "";
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin-top: -20px;
        margin-left: -20px;
        border-radius: 50%;
        border: 2px solid #ccc;
        border-top-color: #333;
        animation: loading-animation 1s linear infinite;
      }

      .custom-theme-note {
        border: 1px solid #9e4848;
        border-radius: 10px;
        padding: 0.25em;
        background-color: #ffff86;
        text-align: center;
        grid-column: 2;
      }

      @keyframes loading-animation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @media only screen and (max-width : 750px) {
        .theme-details-grid {
          grid-template-columns: auto;
        }
      }
    `;

  document.head.appendChild(bookmarkletStyle);

  content.appendChild(close);

  dialog.appendChild(content);
  document.body.appendChild(dialog);
}
