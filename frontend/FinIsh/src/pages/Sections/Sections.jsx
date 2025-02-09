import React, { useState } from "react";
import "./Sections.css";

const tags = ["Trading", "Asset Classes", "Stocks", "Bonds", "Risk Management"];

const videos = [
    { id: 1, tag: "Trading", url: "https://www.youtube.com/embed/3xXUQEvf8v0" },
    { id: 2, tag: "Asset Classes", url: "https://www.youtube.com/embed/L9okFQ9B7pI" },
    { id: 3, tag: "Stocks", url: "https://www.youtube.com/embed/VeJz2q0umJE" },
    { id: 4, tag: "Bonds", url: "https://www.youtube.com/embed/-wpHszfnJns" },
    { id: 5, tag: "Risk Management", url: "https://www.youtube.com/embed/vZE0j_WCRvI" },
    { id: 6, tag: "Trading", url: "https://www.youtube.com/embed/uhR9Lq3fWM8" },
    { id: 7, tag: "Asset Classes", url: "https://www.youtube.com/embed/DuBrreMiZlA" },
    { id: 8, tag: "Stocks", url: "https://www.youtube.com/embed/yca0A3B7Pqc" },
    { id: 9, tag: "Bonds", url: "https://www.youtube.com/embed/VhwZ9t2b3Zk" },
    { id: 10, tag: "Gaming", url: "https://www.youtube.com/embed/21STUhQ-iP0" },
    { id: 11, tag: "Trading", url: "https://www.youtube.com/embed/CMQLdJa64Wk" },
    { id: 12, tag: "Asset Classes", url: "https://www.youtube.com/embed/I5ZR0jMlxX0" },
    { id: 13, tag: "Stocks", url: "https://www.youtube.com/embed/R8VBRCs2jTU" },
    { id: 14, tag: "Bonds", url: "https://www.youtube.com/embed/AkMsMDk_brU" },
    { id: 15, tag: "Risk Management", url: "https://www.youtube.com/embed/fTTGALaRZoc" },
    { id: 16, tag: "Trading", url: "https://www.youtube.com/embed/OMtze1Mu_Eo" },
    { id: 17, tag: "Asset Classes", url: "https://www.youtube.com/embed/LeJkB_Moejs" },
    { id: 18, tag: "Stocks", url: "https://www.youtube.com/embed/OyokCk5y7wU" },
    { id: 19, tag: "Bonds", url: "https://www.youtube.com/embed/NLtnm_bRzPw" },
    { id: 20, tag: "Risk Management", url: "https://www.youtube.com/embed/SwaCg7Gwtzw" }
];

const Sections = () => {
    const [selectedTag, setSelectedTag] = useState(null);
  
    const filteredVideos = selectedTag
      ? videos.filter((video) => video.tag === selectedTag)
      : videos;
  
    return (
      <div className="video-filter-container">
        {/* Tag Selection */}
        <div className="tag-container">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`tag-button ${selectedTag === tag ? "active" : ""}`}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
  
        {/* Video Grid */}
        <div className="video-grid">
          {filteredVideos.map((video) => (
            <iframe
              key={video.id}
              src={video.url}
              title={`YouTube video ${video.id}`}
              allowFullScreen
              className="video-frame"
            ></iframe>
          ))}
        </div>
      </div>
    );
  };
  
  export default Sections;
