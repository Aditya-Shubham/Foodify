

import { useState } from "react";
import { FiSearch, FiMic, FiX } from "react-icons/fi";


const TopBar =({isVeg,setIsVeg}) => {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  


  const handleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setQuery(voiceText);   // voice → text
    };

    recognition.onerror = (event) => {
      console.error("Mic error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };
  
  const clearSearch =() =>{
    setQuery("");
  };

  return (
    <nav className="navbar">
      

      {/* SEARCH BAR */}
      <div className={`search-bar ${listening ? "listening" : ""}`}>
        <FiSearch className="icon" />

        <input
          type="text"
          placeholder="Search for food, restaurant"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // typing works
        />

        {/* Clear Button */}
        {query &&(
          <FiX
          className="clear"
          onClick={clearSearch}
          title="Clear"
          />
        )}

        <FiMic
          className="mic"
          onClick={handleMic}
          title="Voice search"
        />
      </div>
      <div
        className={`swiggy-toggle ${isVeg ? "veg" : "nonveg"}`}
        onClick={() => setIsVeg(!isVeg)}
      >
        <span className="label veg-label">VEG</span>
        <span className="label nonveg-label">NON-VEG</span>
        <div className="thumb"></div>
      </div>
    </nav>
  );
};

export default TopBar;