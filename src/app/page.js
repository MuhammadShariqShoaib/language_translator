import { useState } from "react";
import axios from "axios";

export default function Translator() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es"); // Default to Spanish

  const handleTranslate = async () => {
    try {
      const apiKey = "YOUR_API_KEY"; // Replace with your API key
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2`,
        {
          q: text,
          target: targetLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      setTranslatedText(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Language Translator</h1>
      <textarea
        className="border p-2 w-full"
        placeholder="Enter text to translate"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <select
        className="border p-2 mt-2"
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
      >
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="zh">Chinese</option>
        {/* Add more languages as needed */}
      </select>
      <button
        className="bg-blue-500 text-white p-2 mt-2"
        onClick={handleTranslate}
      >
        Translate
      </button>
      {translatedText && (
        <p className="mt-4">
          <strong>Translated Text:</strong> {translatedText}
        </p>
      )}
    </div>
  );
}
