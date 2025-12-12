<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Sage Grow Guide Widget</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    }

    .sage-launcher {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 999999;
    }

    .sage-button {
      width: 56px;
      height: 56px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      background: #264017;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
    }

    /* Panel is now ONLY a positioning wrapper */
    .sage-panel {
      position: absolute;
      right: 0;
      bottom: 72px; /* clears the button cleanly */

      width: 400px;
      height: 80vh;
      max-height: 820px;

      background: transparent;
      box-shadow: none;
      border-radius: 0;
      display: none;
    }

    .sage-panel.open {
      display: block;
    }

    /* iframe is the ONLY visual card */
    .sage-iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
      border-radius: 22px;
      overflow: hidden;
    }

    .sage-close {
      position: absolute;
      top: -14px;
      right: -14px;
      z-index: 2;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      background: rgba(0,0,0,0.55);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 420px) {
      .sage-panel {
        width: calc(100vw - 24px);
        height: 80vh;
      }

      .sage-launcher {
        right: 12px;
        bottom: 12px;
      }
    }
  </style>
</head>

<body>

  <div class="sage-launcher">
    <div class="sage-panel" id="sagePanel" aria-hidden="true">
      <button class="sage-close" id="sageClose" aria-label="Close chat">✕</button>

      <iframe
        class="sage-iframe"
        src="https://sage-demo-five.vercel.app/"
        title="Sage Grow Guide"
        loading="lazy"
        allow="microphone; clipboard-read; clipboard-write"
      ></iframe>
    </div>

    <button class="sage-button" id="sageButton" aria-label="Open chat">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 5.8C4 4.8 4.8 4 5.8 4h12.4C19.2 4 20 4.8 20 5.8v8.4c0 1-.8 1.8-1.8 1.8H9l-4.2 3.2c-.4.3-.8 0-.8-.4V16Z"
              stroke="currentColor"
              stroke-width="2" />
        <path d="M7 8h10M7 11h7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"/>
      </svg>
    </button>
  </div>

  <script>
    (function () {
      const button = document.getElementById("sageButton");
      const panel = document.getElementById("sagePanel");
      const closeBtn = document.getElementById("sageClose");

      function openPanel() {
        panel.classList.add("open");
        panel.setAttribute("aria-hidden", "false");
      }

      function closePanel() {
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
      }

      button.addEventListener("click", () => {
        panel.classList.contains("open") ? closePanel() : openPanel();
      });

      closeBtn.addEventListener("click", closePanel);

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePanel();
      });
    })();
  </script>

</body>
</html>
