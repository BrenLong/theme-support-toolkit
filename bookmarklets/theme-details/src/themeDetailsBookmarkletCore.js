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
  const bookmarketVersion = "0.1.0";
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

  /**
   * Fetches the latest Brendan toolkit bookmarklet version and optional custom message.
   * If the GitHub version file is unavailable, the bookmarklet continues without an update warning.
   */
  const getBookmarkletVersionAndMessage = () => {
    return fetch(bookmarkletVersionUrl)
      .then((response) => response.json())
      .then((data) => [data.latestVersion, data.customMessage || defaultCustomMessage]);
  };

  /**
   * Compares the installed bookmarklet version with the latest version file in this toolkit repo.
   * This displays a message to the user when a newer toolkit bookmarklet is available.
   */
  const compareBookmarkletVersion = async () => {
    try {
      const [newestVersion, customMessageJson] =
        await getBookmarkletVersionAndMessage();

      if (newestVersion == bookmarketVersion) {
        return [false, customMessageJson];
      } else {
        return [true, customMessageJson];
      }
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
   * This message includes a link to the Guru card with the code and instructions
   * to update the bookmarklet.
   * This function is called at the end of this file.
   * @returns {boolean} true if a new version is available, false if not.
   * @see https://app.getguru.com/card/igjRR5ET/Theme-Details-Bookmarklet
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
        This can cause performance issues and inaccurate analytics data.<br>
        <a style="color:#721c24; text-decoration:underline;" href="https://app.getguru.com/card/T8ARxjqc/Developer-Support-Siae-Speed-Optimization-Workaround" target="_blank">See our Guru card for handling this issue</a>.`;
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

  const rightCurlyBracket = document.createElement("span");
  const copyPreviewLinkButton = document.createElement("button");
  copyPreviewLinkButton.classList.add("clipboard-button", "copy-preview-link");
  copyPreviewLinkButton.setAttribute(
    "title",
    "Copy preview link to this theme"
  );
  rightCurlyBracket.classList.add("right-curly-bracket");
  rightCurlyBracket.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="119" height="616" viewBox="0 0 119 616" fill="none">
  <path d="M8 608C36.4434 608 59.5 578.153 59.5 541.333V418.85C59.5 402.543 59.5 394.39 60.924 386.717C62.1857 379.917 64.2663 373.413 67.0885 367.447C70.2738 360.72 74.7285 354.953 83.6355 343.423L111 308L83.6355 272.577C74.7285 261.047 70.2738 255.28 67.0885 248.553C64.2663 242.587 62.1857 236.085 60.924 229.282C59.5 221.61 59.5 213.457 59.5 197.151V74.6667C59.5 37.8477 36.4434 8 8 8" stroke="black" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  copyPreviewLinkButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="647" height="788" viewBox="0 0 647 788" fill="none">
  <path d="M451.571 21H194.429C113.616 21 73.2102 21 48.1053 45.2452C23 69.49 23 108.512 23 186.556V600.444C23 678.487 23 717.509 48.1053 741.754C73.2102 766 113.616 766 194.429 766H451.571C532.383 766 572.789 766 597.894 741.754C623 717.509 623 678.487 623 600.444V186.556C623 108.512 623 69.49 597.894 45.2452C572.789 21 532.383 21 451.571 21ZM194.587 21.4582V115.293C194.587 149.843 232.915 177.85 280.196 177.85H365.804C413.086 177.85 451.413 149.843 451.413 115.293V21.4582M405.125 463.5C405.125 485.181 396.512 505.975 381.181 521.306C365.85 536.637 345.056 545.25 323.375 545.25C301.694 545.25 280.9 536.637 265.569 521.306C250.238 505.975 241.625 485.181 241.625 463.5C241.625 441.819 250.238 421.025 265.569 405.694C280.9 390.363 301.694 381.75 323.375 381.75C345.056 381.75 365.85 390.363 381.181 405.694C396.512 421.025 405.125 441.819 405.125 463.5ZM364.25 463.5C364.25 474.341 359.944 484.737 352.278 492.403C344.612 500.069 334.216 504.375 323.375 504.375C312.534 504.375 302.138 500.069 294.472 492.403C286.806 484.737 282.5 474.341 282.5 463.5C282.5 452.659 286.806 442.263 294.472 434.597C302.138 426.931 312.534 422.625 323.375 422.625C334.216 422.625 344.612 426.931 352.278 434.597C359.944 442.263 364.25 452.659 364.25 463.5Z" stroke="#323232" stroke-width="45" stroke-linejoin="round"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M405.125 463.5C405.125 485.181 396.512 505.975 381.181 521.306C365.85 536.637 345.056 545.25 323.375 545.25C301.694 545.25 280.9 536.637 265.569 521.306C250.238 505.975 241.625 485.181 241.625 463.5C241.625 441.819 250.238 421.025 265.569 405.694C280.9 390.363 301.694 381.75 323.375 381.75C345.056 381.75 365.85 390.363 381.181 405.694C396.512 421.025 405.125 441.819 405.125 463.5ZM364.25 463.5C364.25 474.341 359.944 484.737 352.278 492.403C344.612 500.069 334.216 504.375 323.375 504.375C312.534 504.375 302.138 500.069 294.472 492.403C286.806 484.737 282.5 474.341 282.5 463.5C282.5 452.659 286.806 442.263 294.472 434.597C302.138 426.931 312.534 422.625 323.375 422.625C334.216 422.625 344.612 426.931 352.278 434.597C359.944 442.263 364.25 452.659 364.25 463.5Z" fill="#323232"/>
  </svg>`;

  rightCurlyBracket.append(copyPreviewLinkButton);
  const bracketPath = rightCurlyBracket.querySelector("path");
  const bracketLength = bracketPath.getTotalLength();

  themeDetailsLeftContent.addEventListener("mouseenter", () => {
    bracketPath.classList.add("visible");
    copyPreviewLinkButton.classList.add("visible");
  });

  content.appendChild(title);
  content.appendChild(themeDetailsContainer);
  themeDetailsContainer.appendChild(themeDetailsLeft);
  themeDetailsContainer.appendChild(themeDetailsMiddle);
  themeDetailsContainer.appendChild(themeDetailsRight);
  themeDetailsLeft.appendChild(themeDetailsLeftContent);
  themeDetailsLeft.appendChild(rightCurlyBracket);
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

    if (themes[themeLower]["newVersion"] == "NA") {
      const newVersion = document.createElement("p");
      newVersion.innerHTML = `<strong>2.0?:</strong> This theme is not compatible with 2.0`;
      themeDetailsMiddle.appendChild(newVersion);
    } else if (themes[themeLower]["newVersion"]) {
      const newVersion = document.createElement("p");
      newVersion.innerHTML = `<strong>JSON Templates?:</strong> This has been a JSON-template theme since version ${themes[themeLower].newVersion}`;
      const newVersionNumbers = themes[themeLower].newVersion.split(".");
      const installedVersionNumbers = Shopify.theme.schema_version.split(".");
      let isUpdateAvailable = false;
      for (let i = 0; i < newVersionNumbers.length; i++) {
        const newNumber = parseInt(newVersionNumbers[i]);
        const installedNumber = parseInt(installedVersionNumbers[i]);
        if (newNumber > installedNumber) {
          isUpdateAvailable = true;
          break;
        } else if (newNumber < installedNumber) {
          break;
        }
      }
      if (isUpdateAvailable) {
        newVersion.innerHTML +=
          " - have they considered updating to a new version?";
      }
      themeDetailsMiddle.appendChild(newVersion);
    } else {
      const newVersion = document.createElement("p");
      newVersion.innerHTML = `<strong>2.0?:</strong> We don't know when this became a JSON-template theme - <a style="color:blue; text-decoration:underline;" href="https://docs.google.com/forms/d/e/1FAIpQLSc1ScOu70hiYm9gdTQfNMCxZBM-O15k-T-o0xBxGyvIxKcN6g/viewform?usp=sf_link" target="_blank">please let us know</a>`;
      themeDetailsMiddle.appendChild(newVersion);
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

  const copyTextToClipboard = (el, textToCopy, toastText = "Copied!") => {
    const toast = document.createElement("div");
    toast.classList.add("toast-message");
    toast.innerHTML = toastText;

    // Copy the text to the clipboard
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        el.appendChild(toast);
        // Remove the toast message after a short delay
        setTimeout(() => {
          el.removeChild(toast);
        }, 1000);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  copyPreviewLinkButton.addEventListener("click", async () => {
    copyTextToClipboard(
      copyPreviewLinkButton,
      `https://${window.Shopify.shop}/?preview_theme_id=${Shopify.theme.id}`,
      "Copied theme preview link!"
    );
  });

  // copy to clipboard
  const clipboardIcon = document.createElement("button");
  clipboardIcon.classList.add("clipboard-button");
  clipboardIcon.style.background = "none";
  clipboardIcon.setAttribute("title", "Copy to clipboard for Slack");
  clipboardIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="clipboard-icon" width="647" height="788" viewBox="0 0 647 788" fill="none">
  <g clip-path="url(#clip0_101_2)">
  <path d="M451.571 21C532.383 21 572.789 21 597.894 45.2452C623 69.49 623 108.512 623 186.556V600.444C623 678.487 623 717.509 597.894 741.754C572.789 766 532.383 766 451.571 766H194.429C113.616 766 73.2102 766 48.1053 741.754C23 717.509 23 678.487 23 600.444V186.556C23 108.512 23 69.49 48.1053 45.2452C73.2102 21 113.616 21 194.429 21H451.571Z" stroke="#323232" stroke-width="45" stroke-linejoin="round"/>
  <path d="M194.587 21.4582V115.293C194.587 149.843 232.915 177.85 280.196 177.85H365.804C413.086 177.85 451.413 149.843 451.413 115.293V21.4582" stroke="#323232" stroke-width="45" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M205.815 519.264C205.815 541.686 186.848 560.003 163.63 560.003C140.412 560.003 121.446 541.686 121.446 519.264C121.446 496.841 140.412 478.524 163.63 478.524H205.815V519.264Z" fill="#E01E5A"/>
  <path d="M227.071 519.264C227.071 496.841 246.038 478.524 269.256 478.524C292.474 478.524 311.441 496.841 311.441 519.264V621.27C311.441 643.693 292.474 662.01 269.256 662.01C246.038 662.01 227.071 643.693 227.071 621.27V519.264Z" fill="#E01E5A"/>
  <path d="M269.256 355.673C246.038 355.673 227.071 337.356 227.071 314.934C227.071 292.511 246.038 274.194 269.256 274.194C292.474 274.194 311.441 292.511 311.441 314.934V355.673H269.256Z" fill="#36C5F0"/>
  <path d="M269.256 376.201C292.474 376.201 311.441 394.518 311.441 416.941C311.441 439.363 292.474 457.68 269.256 457.68H163.63C140.412 457.68 121.446 439.363 121.446 416.941C121.446 394.518 140.412 376.201 163.63 376.201H269.256Z" fill="#36C5F0"/>
  <path d="M438.649 416.941C438.649 394.518 457.616 376.201 480.834 376.201C504.052 376.201 523.019 394.518 523.019 416.941C523.019 439.363 504.052 457.68 480.834 457.68H438.649V416.941Z" fill="#2EB67D"/>
  <path d="M417.393 416.941C417.393 439.363 398.427 457.68 375.209 457.68C351.991 457.68 333.024 439.363 333.024 416.941V314.934C333.024 292.511 351.991 274.194 375.209 274.194C398.427 274.194 417.393 292.511 417.393 314.934V416.941Z" fill="#2EB67D"/>
  <path d="M375.209 580.531C398.427 580.531 417.394 598.848 417.394 621.27C417.394 643.693 398.427 662.01 375.209 662.01C351.991 662.01 333.024 643.693 333.024 621.27V580.531H375.209Z" fill="#ECB22E"/>
  <path d="M375.209 560.003C351.991 560.003 333.024 541.686 333.024 519.264C333.024 496.841 351.991 478.524 375.209 478.524H480.834C504.052 478.524 523.019 496.841 523.019 519.264C523.019 541.686 504.052 560.003 480.834 560.003H375.209Z" fill="#ECB22E"/>
  </g>
  <defs>
  <clipPath id="clip0_101_2">
  <rect width="647" height="788" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;

  // Add event listener to copy text to clipboard
  clipboardIcon.addEventListener("click", async () => {
    copyTextToClipboard(
      clipboardIcon,
      `*Theme Version:* ${Shopify.theme.schema_name} (${
        Shopify.theme.schema_version
      })${
        // account for missing theme dev name
        themes[themeLower]
          ? `\n*Supported by:* ${themes[themeLower].developer}`
          : ""
      }\n*Theme ID:* ${Shopify.theme.id}
      }\n*Storefront URL:* https://${window.Shopify.shop}\n`,
      "Copied details for Slack!"
    );
  });

  content.appendChild(clipboardIcon);

  // add github and guru svgs to bottom
  // right of the dialog
  const githubSvg = `<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
  const guruSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162.31 162.01"><defs><style>.d{fill:#fff;}.e{fill:#080b0e;}</style></defs><g id="a"/><g id="b"><g id="c"><g><path class="e" d="M162.28,96.29c.57,20.21-8.19,35.32-25.42,45.02-23.91,13.45-49.54,21.53-77.3,20.64-15.64-.5-28.15-8.01-36.35-21.09C7.51,115.82-.94,88.36,.08,58.64c.54-15.6,8.6-27.88,21.78-35.94C46.67,7.52,73.69-.9,102.98,.08c15.87,.53,28.12,8.76,36.46,22.05,14.21,22.64,20.84,47.73,22.84,74.16Z"/><g><path class="d" d="M92.34,111.57c-6.26,2.28-12.96,2.67-18.88,1.08-14.71-3.95-25.39-17.48-25.39-32.16,0-11.7,5.26-19.36,9.68-23.73,6.08-6.01,14.53-9.58,22.67-9.58,.1,0,.21,0,.31,0,15.52,.17,25.35,11.89,25.44,12,1.35,1.66,3.78,1.9,5.43,.56,1.65-1.34,1.91-3.78,.56-5.43-.49-.6-12.13-14.64-31.35-14.85-10.38-.06-20.79,4.19-28.49,11.8-7.72,7.63-11.97,18.01-11.97,29.22,0,18.11,13.08,34.78,31.11,39.62,3.05,.82,6.25,1.22,9.5,1.22,4.68,0,9.47-.84,14.04-2.51,11.87-4.34,23.47-15.76,23.05-28.96-2.62,1.92-5.47,3.67-8.47,5.33-2.31,7.25-9.61,13.6-17.23,16.38Z"/><path class="d" d="M121.5,71.35c-.07,.07-3.39,3.63-8.36,7.2-5.16-5.03-13.38-7.42-19.32-7.42-4.87,0-8.59,1.28-11.07,3.79-1.95,1.98-2.95,4.57-2.91,7.49,.08,5.25,3.85,10.93,14.16,11.16,5.75,.14,11.38-1.72,16.29-4.24,3.43-1.74,5.9-3.48,7.01-4.27,5.76-4.07,9.56-8.13,9.88-8.48,1.45-1.57,1.35-4.01-.22-5.46-1.56-1.44-4-1.35-5.46,.21Zm-27.34,14.5c-2.99-.07-6.56-.74-6.6-3.56-.02-1.23,.52-1.78,.69-1.95,.55-.56,2-1.49,5.57-1.49,3.78,0,8.83,1.45,12.33,3.95-3.76,1.85-7.81,3.14-11.99,3.05Z"/></g></g></g></g></svg>`;

  const githubLink = document.createElement("a");
  githubLink.classList.add("social-icon");
  githubLink.href = "https://www.github.com/Shopify/theme-details-bookmarklet";
  githubLink.target = "_blank";
  githubLink.innerHTML = githubSvg;

  const guruLink = document.createElement("a");
  guruLink.classList.add("social-icon");
  guruLink.href =
    "https://app.getguru.com/card/igjRR5ET/Theme-Details-Bookmarklet";
  guruLink.target = "_blank";
  guruLink.innerHTML = guruSvg;

  const githubGuruContainer = document.createElement("div");
  githubGuruContainer.style.float = "right";
  githubGuruContainer.style.marginTop = "1em";
  githubGuruContainer.style.marginRight = "1em";
  githubGuruContainer.appendChild(githubLink);
  githubGuruContainer.appendChild(guruLink);
  content.appendChild(githubGuruContainer);

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

      .right-curly-bracket {
        position: relative;
        display: flex;
        align-items: center;
        height: 120px;
      }

      .right-curly-bracket > svg {
        height: 100%;
        width: auto;
      }

      .right-curly-bracket > svg path {
        opacity: 0;
      }

      .right-curly-bracket svg path.visible {
        stroke-dasharray: ${bracketLength};
        stroke-dashoffset: ${bracketLength};
        animation: draw 0.75s ease-in-out forwards;
      }

      @keyframes draw {
        to {
          stroke-dashoffset: 0;
          opacity: 1;
        }
      }

      .toast-message {
        color: white;
        font-weight: bold;
        font-size: 12px;
        position: absolute;
        bottom: 1rem;
        right: -300%;
        background: darkslategrey;
        padding: 0.25em;
        border-radius: 6px;
        animation-name: slide-up;
        animation-duration: 0.4s;
      }

      /* keyframe declaration */
      @keyframes slide-up {
        from {
          opacity: 0;
          bottom: -3rem;
        }
        to {
          opacity: 1;
          bottom: 1rem;
        }
      }

      .clipboard-button {
        border: none;
        padding: 0;
        position: relative;
      }

      .copy-preview-link {
        display: none;
        margin-left: 1em;
      }

      .copy-preview-link.visible {
        display: block;
      }

      .social-icon + .social-icon {
        margin-left: 1em;
      }

      .clipboard-icon, .copy-preview-link svg, .social-icon svg {
        width: 3rem;
        max-width: 35px;
        height: auto;
        transition: transform 0.2s ease;
        cursor: pointer;
      }

      .social-icon svg {
        fill: black;
      }

      .clipboard-button:focus {
        outline: 1px solid currentColor;
        outline-offset: 2px;
      }

      .clipboard-button:hover, .social-icon:hover svg {
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
