import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Sections.css";

const tags = ["Trading", "Asset Classes", "Stocks", "Bonds", "Risk Management"];

const videos = [
  { id: '10fe9034-a602-48d7-bf97-36fe71a83f24', tag: "Trading", url: "https://www.youtube.com/embed/3xXUQEvf8v0", title: "Financial Terms Explained as Simply as Possible" },
  { id: '8fa974ec-d58b-46d9-91b1-e0e582c5cddf', tag: "Asset Classes", url: "https://www.youtube.com/embed/L9okFQ9B7pI", title: "How to Get and Use Credit Cards" },
  { id: '38b8e609-649e-4b48-a12d-e06c5b9a7b2e', tag: "Stocks", url: "https://www.youtube.com/embed/VeJz2q0umJE", title: "Types of Insurance (Health, Life, Property, and Auto)" },
  { id: 'aabd392c-e9a6-42d1-8b71-a6799eeb7c95', tag: "Bonds", url: "https://www.youtube.com/embed/-wpHszfnJns", title: "A terrible guide to the terrible terminology of U.S. Health Insurance" },
  { id: 'cd3ac2bc-1153-4d84-b25c-87261e8a4520', tag: "Risk Management", url: "https://www.youtube.com/embed/vZE0j_WCRvI", title: "What does a consultant actually do?" },
  { id: 'b238e9ca-1352-40e2-ad4c-814a81c38d68', tag: "Trading", url: "https://www.youtube.com/embed/uhR9Lq3fWM8", title: "The Ultimate Beginner's Guide to Consulting! (Hours, Lifestyle, Compensation, Pros & Cons)" },
  { id: '418a0f66-ae89-4e57-bee2-52f3affa9d67', tag: "Asset Classes", url: "https://www.youtube.com/embed/DuBrreMiZlA", title: "What do Wall Street quants actually do?" },
  { id: '0a476ffe-a460-42db-b745-45e92c37d01b', tag: "Stocks", url: "https://www.youtube.com/embed/yca0A3B7Pqc", title: "Private equity explained" },
  { id: '487c57bb-ed19-4cec-9714-23dde4e93eb3', tag: "Bonds", url: "https://www.youtube.com/embed/VhwZ9t2b3Zk", title: "ACCOUNTING BASICS: Debits and Credits Explained" },
  { id: 'a0b19272-b47d-43d2-92a4-79bf2e6ed77b',tag: "Gaming", url: "https://www.youtube.com/embed/21STUhQ-iP0", title: "Stock Multiples: How to Tell When a Stock is Cheap/Expensive" },
  { id: 'b865f45d-9b53-46f5-b776-6dcf9789d134',tag: "Trading", url: "https://www.youtube.com/embed/CMQLdJa64Wk", title: "How do investors choose stocks? - Richard Coffin" },
  { id: '5b86c8c4-0da7-4d9f-9150-fe8035487792',tag: "Asset Classes", url: "https://www.youtube.com/embed/I5ZR0jMlxX0", title: "What causes economic bubbles? - Prateek Singh" },
  { id: 'ee3f574f-c8e7-4006-bf9f-8ea264a2fd7b',tag: "Stocks", url: "https://www.youtube.com/embed/R8VBRCs2jTU", title: "How does raising interest rates control inflation?" },
  { id: 'be7c3821-8d22-402b-a19f-b01d1a37c6c6',tag: "Bonds", url: "https://www.youtube.com/embed/AkMsMDk_brU", title: "How the Fed Steers Interest Rates to Guide the Entire Economy | WSJ" },
  { id: '9caa389c-7250-421f-8921-434fe449389b',tag: "Risk Management", url: "https://www.youtube.com/embed/fTTGALaRZoc", title: "Banking Explained – Money and Credit" },
  { id: 'c36ab421-9027-43e0-b9ad-359ce7f28dc2',tag: "Trading", url: "https://www.youtube.com/embed/OMtze1Mu_Eo", title: "The Bank of The Future" },
  { id: '0655ab76-0d73-4f42-ac85-afb35ea06b67',tag: "Asset Classes", url: "https://www.youtube.com/embed/LeJkB_Moejs", title: "AI in banking: TOP use cases and examples" },
  { id: 'cdd2d6bd-62d6-4eb6-b91e-4bd00e04f706',tag: "Stocks", url: "https://www.youtube.com/embed/OyokCk5y7wU", title: "Future of Banking: A Glimpse into 2050" },
  { id: '314ded01-6441-402c-995a-e7eb1e4df8fd',tag: "Bonds", url: "https://www.youtube.com/embed/NLtnm_bRzPw", title: "Why can’t prices just stay the same?" },
  { id: '350dbe19-92da-457c-9b5c-625917b6ed70',tag: "Risk Management", url: "https://www.youtube.com/embed/SwaCg7Gwtzw", title: "What causes an economic recession? - Richard Coffin" }
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
                body: JSON.stringify({ src: video.url, title: video.title, id: video.id, tag: video.tag }),
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
