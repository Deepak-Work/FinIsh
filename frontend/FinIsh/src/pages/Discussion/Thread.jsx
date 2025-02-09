import React from "react";
import { MessageCircle, Clock } from "lucide-react";

const cardStyle = {
  backgroundColor: "white",
  padding: "24px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  border: "1px solid #D1D5DB",
  transition: "box-shadow 0.3s ease-in-out",
};

const cardHoverStyle = {
  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
};

const containerStyle = {
  width: "100vw",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#F9FAFB",
};

const headerContainerStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px 0",
  backgroundColor: "#000",
  color: "#fff",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#fff",
  marginBottom: "8px",
};

const subHeaderStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#E5E7EB",
};

const discussionContainerStyle = {
  width: "60%",
  marginTop: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const discussions = [
  {
    id: 1,
    title: "Optimal Solution for Two Sum?",
    author: "JohnDoe",
    timestamp: "2 hours ago",
    comments: 12,
  },
  {
    id: 2,
    title: "Why is my DP solution not working?",
    author: "JaneSmith",
    timestamp: "5 hours ago",
    comments: 8,
  },
  {
    id: 3,
    title: "Best Resources for Graph Algorithms?",
    author: "AliceJohnson",
    timestamp: "1 day ago",
    comments: 15,
  },
];

const Thread_Page = () => {
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerContainerStyle}>
        <h1 style={titleStyle}>Fin & Tell</h1>
        <h2 style={subHeaderStyle}>Discussion Forum</h2>
      </div>

      {/* Discussion Threads */}
      <div style={discussionContainerStyle}>
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            style={{ ...cardStyle, ...(hovered === discussion.id ? cardHoverStyle : {}) }}
            onMouseEnter={() => setHovered(discussion.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              {discussion.title}
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6B7280" }}>
              <span>By {discussion.author}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <Clock size={16} style={{ marginRight: "4px", color: "#6B7280" }} /> {discussion.timestamp}
                </span>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <MessageCircle size={16} style={{ marginRight: "4px", color: "#6B7280" }} /> {discussion.comments} comments
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Thread_Page;
