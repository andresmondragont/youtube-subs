// /backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;

const app = express();
const PORT = 5050;

app.use(cors());

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = "global";

const translationClient = new TranslationServiceClient();

app.get("/translate", async (req, res) => {
  const { text, lang } = req.query;
  if (!text || !lang) return res.status(400).json({ error: "Missing params" });

  try {
    const [response] = await translationClient.translateText({
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: "text/plain",
    //   sourceLanguageCode: "auto",
      targetLanguageCode: lang,
    });

    const translated = response.translations[0].translatedText;
    res.json({ translated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));