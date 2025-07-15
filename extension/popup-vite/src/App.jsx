import React, { useState, useEffect } from "react";

export default function App() {
  const [targetLang, setTargetLang] = useState("fr");
  const [enabled, setEnabled] = useState(true);

  // Save user preference
  useEffect(() => {
    chrome.storage.sync.get(["targetLang", "enabled"], (data) => {
      if (data.targetLang) setTargetLang(data.targetLang);
      if (data.enabled !== undefined) setEnabled(data.enabled);
    });
  }, []);

  function saveOptions() {
    chrome.storage.sync.set({ targetLang, enabled });
  }

  return (
    <div style={{ width: 280, padding: 16 }}>
      <h3>YouTube Bilingual Subtitles</h3>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            setEnabled(e.target.checked);
            chrome.storage.sync.set({ enabled: e.target.checked });
          }}
        />
        Enable subtitles
      </label>
      <br />
      <label>
        Target Language:
        <select
          value={targetLang}
          onChange={(e) => {
            setTargetLang(e.target.value);
            chrome.storage.sync.set({ targetLang: e.target.value });
          }}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="jp">Japanese</option>
          <option value="zh">Chinese</option>
          <option value="id">Indonesian</option>
        </select>
      </label>
      <br />
      <button onClick={saveOptions} style={{ marginTop: 10 }}>Save</button>
      <p style={{ fontSize: 12, color: "#777" }}>
        Dual subtitles with AI-powered translation.
      </p>
    </div>
  );
}