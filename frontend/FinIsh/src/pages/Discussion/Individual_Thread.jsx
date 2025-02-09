import React from "react";
import { MessageCircle, Clock, ThumbsUp } from "lucide-react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";

const cardStyle = {
  backgroundColor: "#FFFFFF",
  padding: "24px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  border: "1px solid #E5E7EB",
  transition: "box-shadow 0.3s ease-in-out",
  marginBottom: "16px",
  width: "90%", // Take up 90% of the container
};

const containerStyle = {
  width: "100vw",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "32px",
  backgroundColor: "#F3F4F6",
};

const headerStyle = {
  textAlign: "center",
  fontSize: "32px",
  fontWeight: "bold",
  color: "#111827",
  marginBottom: "24px",
};

const buttonStyle = {
  backgroundColor: "#3B82F6",
  color: "#FFFFFF",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s ease-in-out",
};

const discussions = [
  {
    id: 1,
    title: "Best Practices for React State Management?",
    author: "AliceJohnson",
    timestamp: "3 hours ago",
    comments: 5,
    content:
      "I'm exploring different state management solutions for a large React application. What are some best practices and recommendations for choosing the right approach?  I'm particularly interested in approaches that scale well with increasing complexity and team size.",
    answers: [
      { text: "Consider using Redux or Zustand for complex state management needs. They provide centralized state management and predictable data flow.", votes: 7 },
      { text: "React Context API is suitable for simpler applications or for passing data that doesn't change frequently.  However, be mindful of potential performance issues with frequent updates.", votes: 4 },
    ],
  },
  {
    id: 2,
    title: "Tips for Optimizing Website Performance?",
    author: "BobWilliams",
    timestamp: "1 day ago",
    comments: 10,
    content:
      "I'm working on improving the performance of a website. What are some effective strategies for optimizing loading times and overall performance?  I'm already using lazy loading and image optimization, but I'm still seeing some bottlenecks.",
    answers: [
      { text: "Optimize images and use lazy loading for offscreen content. Also, consider using a CDN to deliver images from geographically closer servers.", votes: 12 },
      { text: "Minify CSS and JavaScript files to reduce file sizes.  Also, consider code splitting to load only the code that's needed for the current page.", votes: 8 },
      { text: "Leverage browser caching to store static assets locally. Configure your server to set appropriate cache headers.", votes: 6 },
    ],
  },
  {
    id: 3,
    title: "How to Secure a Node.js API?",
    author: "CharlieBrown",
    timestamp: "2 days ago",
    comments: 3,
    content:
      "I'm building a Node.js API and want to ensure it's secure. What are the recommended security measures to protect against common threats? I'm using HTTPS and validating user input, but I'm concerned about other potential vulnerabilities.",
    answers: [
      { text: "Implement authentication and authorization mechanisms. Use JWTs for authentication and role-based access control for authorization.", votes: 9 },
      { text: "Sanitize user inputs to prevent injection attacks.  Use parameterized queries to prevent SQL injection and escape HTML entities to prevent XSS attacks.", votes: 5 },
    ],
  },
];

const DiscussionList = () => {
  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Fin & Tell</h1>
      <h2>Discussion Forum</h2>
      <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: "16px" }}>
        {discussions.map((discussion) => (
          <Link
            key={discussion.id}
            to={`/thread/${discussion.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={cardStyle}>
              <h3>{discussion.title}</h3>
              <p style={{ color: "#4B5563" }}>By {discussion.author}</p>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <span style={{ color: "#6B7280" }}>
                  <Clock size={16} /> {discussion.timestamp}
                </span>
                <span style={{ color: "#6B7280" }}>
                  <MessageCircle size={16} /> {discussion.comments} comments
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ThreadPage = () => {
  const { id } = useParams();
  const discussion = discussions.find((d) => d.id === parseInt(id));
  const [comment, setComment] = React.useState("");
  const [answers, setAnswers] = React.useState(discussion?.answers || []);

  const handleUpvote = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].votes += 1;
    setAnswers(updatedAnswers);
  };

  const handleComment = () => {
    if (comment.trim()) {
      setAnswers([...answers, { text: comment, votes: 0 }]);
      setComment("");
    }
  };

  if (!discussion) {
    return (
      <div style={containerStyle}>
        <h1 style={headerStyle}>Fin & Tell</h1>
        <h2>Discussion Thread Not Found</h2>
        <p>The discussion thread you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>{discussion.title}</h1>
      <div style={{ width: "90%", textAlign: "left", marginBottom: "24px", color: "#4B5563" }}>
        {discussion.content}
      </div>
      <h3 style={{ color: "#1F2937", marginBottom: "16px" }}>Answers</h3>
      {answers.map((answer, index) => (
        <div key={index} style={cardStyle}>
          <p style={{ color: "#374151", marginBottom: "12px", width: "100%" }}>{answer.text}</p>
          <button onClick={() => handleUpvote(index)} style={buttonStyle}>
            <ThumbsUp size={16} /> {answer.votes}
          </button>
        </div>
      ))}
      <div style={{ display: "flex", width: "90%", maxWidth: "none", marginTop: "24px" }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #D1D5DB",
            resize: "vertical",
            minHeight: "80px",
            width: "100%"
          }}
        />
        <button
          onClick={handleComment}
          style={{
            ...buttonStyle,
            borderRadius: "0 8px 8px 0",
            height: "auto",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ThreadPage;
