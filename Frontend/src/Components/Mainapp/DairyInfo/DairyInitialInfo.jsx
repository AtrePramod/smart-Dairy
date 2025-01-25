import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import sanscript from "@indic-transliteration/sanscript";

const anuswaraConsonants = [
  "द",
  "ध",
  "ग",
  "घ",
  "च",
  "छ",
  "ज",
  "झ",
  "ट",
  "ठ",
  "ड",
  "ढ",
  "ण",
  "त",
  "थ",
  "न",
  "प",
  "फ",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "श",
  "ष",
  "स",
  "ह",
];

const anuswaraRegex = new RegExp(`न्(?=[${anuswaraConsonants.join("")}])`, "g");

const applyAnuswaraCorrections = (text) => {
  return text.replace(anuswaraRegex, "ं");
};

const DairyInitialInfo = () => {
  const [inputValue, setInputValue] = useState("");
  const [originalValue, setOriginalValue] = useState(""); // To store original input
  const [isTranslitEnabled, setIsTranslitEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced transliteration function
  const handleTransliteration = useCallback(
    debounce((value) => {
      if (!isTranslitEnabled || value.trim() === "") {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Transliterate from ITRANS to Devanagari
        let marathiText = sanscript.t(value, "itrans", "devanagari");

        // Apply Anuswara Corrections
        marathiText = applyAnuswaraCorrections(marathiText);

        setInputValue(marathiText);
      } catch (err) {
        console.error("Transliteration Error:", err);
        setError("An error occurred during transliteration.");
      } finally {
        setIsLoading(false);
      }
    }, 500), // 500 ms debounce
    [isTranslitEnabled]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setOriginalValue(value);
    setInputValue(value); // Display original input immediately
    handleTransliteration(value);
  };

  const toggleTransliteration = () => {
    setIsTranslitEnabled(!isTranslitEnabled);
    if (!isTranslitEnabled) {
      // If disabling transliteration, revert to original input
      setInputValue(originalValue);
    } else {
      // If enabling transliteration, re-apply transliteration
      handleTransliteration(originalValue);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "500px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
    label: {
      marginBottom: "8px",
      fontSize: "16px",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    loading: {
      color: "blue",
      fontSize: "14px",
    },
    error: {
      color: "red",
      fontSize: "14px",
    },
    toggleContainer: {
      marginTop: "10px",
    },
  };
  
  return (
    <div style={styles.container}>
      <label htmlFor="marathiInput" style={styles.label}>
        Type in English:
      </label>
      <input
        type="text"
        id="marathiInput"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type in English..."
        style={styles.input}
      />
      {isLoading && <p style={styles.loading}>Transliterating...</p>}
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.toggleContainer}>
        <label>
          <input
            type="checkbox"
            checked={isTranslitEnabled}
            onChange={toggleTransliteration}
          />
          Enable Transliteration
        </label>
      </div>
    </div>
  );
};

export default DairyInitialInfo;
