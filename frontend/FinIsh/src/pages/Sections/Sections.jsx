import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Sections.css";

const tags = ["Trading", "Asset Classes", "Stocks", "Bonds", "Risk Management"];

const videos = [
  { id: 1, tag: "Trading", url: "https://www.youtube.com/embed/3xXUQEvf8v0", title: "Financial Terms Explained as Simply as Possible" },
  { id: 2, tag: "Asset Classes", url: "https://www.youtube.com/embed/L9okFQ9B7pI", title: "How to Get and Use Credit Cards" },
  { id: 3, tag: "Stocks", url: "https://www.youtube.com/embed/VeJz2q0umJE", title: "Types of Insurance (Health, Life, Property, and Auto)" },
  { id: 4, tag: "Bonds", url: "https://www.youtube.com/embed/-wpHszfnJns", title: "A terrible guide to the terrible terminology of U.S. Health Insurance" },
  { id: 5, tag: "Risk Management", url: "https://www.youtube.com/embed/vZE0j_WCRvI", title: "What does a consultant actually do?" },
  { id: 6, tag: "Trading", url: "https://www.youtube.com/embed/uhR9Lq3fWM8", title: "The Ultimate Beginner's Guide to Consulting! (Hours, Lifestyle, Compensation, Pros & Cons)" },
  { id: 7, tag: "Asset Classes", url: "https://www.youtube.com/embed/DuBrreMiZlA", title: "What do Wall Street quants actually do?" },
  { id: 8, tag: "Stocks", url: "https://www.youtube.com/embed/yca0A3B7Pqc", title: "Private equity explained" },
  { id: 9, tag: "Bonds", url: "https://www.youtube.com/embed/VhwZ9t2b3Zk", title: "ACCOUNTING BASICS: Debits and Credits Explained" },
  { id: 10,tag: "Gaming", url: "https://www.youtube.com/embed/21STUhQ-iP0", title: "Stock Multiples: How to Tell When a Stock is Cheap/Expensive" },
  { id: 11,tag: "Trading", url: "https://www.youtube.com/embed/CMQLdJa64Wk", title: "How do investors choose stocks? - Richard Coffin" },
  { id: 12,tag: "Asset Classes", url: "https://www.youtube.com/embed/I5ZR0jMlxX0", title: "What causes economic bubbles? - Prateek Singh" },
  { id: 13,tag: "Stocks", url: "https://www.youtube.com/embed/R8VBRCs2jTU", title: "How does raising interest rates control inflation?" },
  { id: 14,tag: "Bonds", url: "https://www.youtube.com/embed/AkMsMDk_brU", title: "How the Fed Steers Interest Rates to Guide the Entire Economy | WSJ" },
  { id: 15,tag: "Risk Management", url: "https://www.youtube.com/embed/fTTGALaRZoc", title: "Banking Explained – Money and Credit" },
  { id: 16,tag: "Trading", url: "https://www.youtube.com/embed/OMtze1Mu_Eo", title: "The Bank of The Future" },
  { id: 17,tag: "Asset Classes", url: "https://www.youtube.com/embed/LeJkB_Moejs", title: "AI in banking: TOP use cases and examples" },
  { id: 18,tag: "Stocks", url: "https://www.youtube.com/embed/OyokCk5y7wU", title: "Future of Banking: A Glimpse into 2050" },
  { id: 19,tag: "Bonds", url: "https://www.youtube.com/embed/NLtnm_bRzPw", title: "Why can’t prices just stay the same?" },
  { id: 20,tag: "Risk Management", url: "https://www.youtube.com/embed/SwaCg7Gwtzw", title: "What causes an economic recession? - Richard Coffin" }
];

const Sections = () => {
    const [selectedTag, setSelectedTag] = useState(null);
    const navigate = useNavigate();
  
    const filteredVideos = selectedTag
      ? videos.filter((video) => video.tag === selectedTag)
      : videos;

    const handleVideoClick = async (video) => {
        try {

            await fetch("http://127.0.0.1:5000/sections/set_video", { // Updated URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ src: video.url, title: video.title }),
            });
            navigate("/explore"); // Redirect to the explore page
        } catch (error) {
            console.error("Error setting video:", error);
        }
    };
  
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
            <div key={video.id} className="video-item" onClick={() => handleVideoClick(video)}>
            {/* Display YouTube Thumbnail */}
            <img 
                src={`http://img.youtube.com/vi/${video.url.split("/embed/")[1]}/0.jpg`} 
                alt={video.title} 
                className="video-thumbnail"
            />
            <p className="video-title">{video.title}</p>
        </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Sections;
