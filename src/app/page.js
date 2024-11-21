'use client'
import React, { useState, useEffect } from "react";

export default function TranslatorApp() {
  const [languages, setLanguages] = useState([
    { no: "0", name: "Auto", native: "Detect", code: "auto" },
    { no: "1", name: "Afrikaans", native: "Afrikaans", code: "af" },
    { no: "2", name: "Albanian", native: "Shqip", code: "sq" },
    { no: "3", name: "Arabic", native: "عربي", code: "ar" },
    { no: "4", name: "Armenian", native: "Հայերէն", code: "hy" },
    { no: "5", name: "Azerbaijani", native: "آذربایجان دیلی", code: "az" },
    { no: "6", name: "Basque", native: "Euskara", code: "eu" },
    { no: "7", name: "Belarusian", native: "Беларуская", code: "be" },
    { no: "8", name: "Bulgarian", native: "Български", code: "bg" },
    { no: "9", name: "Catalan", native: "Català", code: "ca" },
    { no: "10", name: "Chinese (Simplified)", native: "中文简体", code: "zh-CN" },
    { no: "11", name: "Chinese (Traditional)", native: "中文繁體", code: "zh-TW" },
    { no: "12", name: "Croatian", native: "Hrvatski", code: "hr" },
    { no: "13", name: "Czech", native: "Čeština", code: "cs" }
  ]);
  const [inputLanguage, setInputLanguage] = useState("");
  const [outputLanguage, setOutputLanguage] = useState("");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputChars, setInputChars] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (inputText) translateText();
  }, [inputText, inputLanguage, outputLanguage]);

  const translateText = async () => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURIComponent(inputText)}`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      const translated = result[0]?.map((item) => item[0]).join("") || "";
      setOutputText(translated);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        setUploadedFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          setInputText(event.target.result);
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid file");
      }
    }
  };

  const handleDownload = () => {
    if (outputText) {
      const blob = new Blob([outputText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `translated-to-${outputLanguage}.txt`;
      link.href = url;
      link.click();
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = inputLanguage;
    setInputLanguage(outputLanguage);
    setOutputLanguage(tempLang);

    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
  };

  return (
    <div className={`translator-app ${darkMode ? "dark" : ""}`}>
      <header>
        <h1>Language Translator</h1>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Dark Mode
        </label>
      </header>

      <div className="dropdown-container">
        <div className="dropdown">
          <label>Input Language:</label>
          <select
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.native})
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown">
          <label>Output Language:</label>
          <select
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.native})
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleSwapLanguages}>Swap Languages</button>

      <textarea
        id="input-text"
        value={inputText}
        onChange={(e) => {
          const value = e.target.value.slice(0, 5000);
          setInputText(value);
          setInputChars(value.length);
        }}
        placeholder="Enter text to translate"
      ></textarea>
      <p>Characters: {inputChars}/5000</p>

      <textarea
        id="output-text"
        value={outputText}
        readOnly
        placeholder="Translated text will appear here"
      ></textarea>

      <div>
        <label>
          Upload Document:
          <input type="file" onChange={handleFileUpload} />
        </label>
        {uploadedFileName && <p>Uploaded: {uploadedFileName}</p>}
      </div>

      <button onClick={handleDownload}>Download Translated Text</button>
    </div>
  );
}
