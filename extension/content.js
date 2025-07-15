// Utility: Fetches current YouTube captions from DOM (works with official subtitles)
function getCurrentCaption() {
  // YouTube subtitles are in <div class="ytp-caption-segment"> elements
  const segment = document.querySelector(".ytp-caption-segment");
  return segment ? segment.innerText : null;
}

// Injects subtitle overlay div
function injectSubtitleOverlay() {
  if (document.getElementById("bilingual-sub-overlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "bilingual-sub-overlay";
  overlay.style.position = "absolute";
  overlay.style.bottom = "10%";
  overlay.style.width = "100%";
  overlay.style.textAlign = "center";
  overlay.style.pointerEvents = "none";
  overlay.style.fontSize = "2.2vw";
  overlay.style.fontWeight = "bold";
  overlay.style.zIndex = "999999";
  overlay.style.color = "#fff";
  overlay.style.textShadow = "0 0 6px #000";
  document.querySelector("ytd-player").appendChild(overlay);
}

// Calls backend for translation
async function translateText(text, targetLang) {
  // e.g., http://localhost:5000/translate?text=hello&lang=es
  const resp = await fetch(
    `http://localhost:5050/translate?text=${encodeURIComponent(
      text
    )}&lang=${targetLang}`
  );
  const data = await resp.json();
  return data.translated;
}

// Main logic
let lastCaption = "";
let lastTranslated = "";
let userLang = "es";
let enabled = true;

chrome.storage.sync.get(["targetLang", "enabled"], (data) => {
  if (data.targetLang) userLang = data.targetLang;
  if (data.enabled !== undefined) enabled = data.enabled;
});

function updateSubtitles() {
  if (!enabled) return;
  const cap = getCurrentCaption();
  if (!cap) return;

  if (cap !== lastCaption) {
    lastCaption = cap;
    injectSubtitleOverlay();
    translateText(cap, userLang).then((translated) => {
      lastTranslated = translated;
      const overlay = document.getElementById("bilingual-sub-overlay");
      if (overlay) {
        overlay.innerHTML = `
          <span>${cap}</span>
          <br>
          <span style="color: #ffd700">${translated}</span>
        `;
      }
    });
  }
}

// Poll captions every 200ms
setInterval(updateSubtitles, 200);