import React from "react";
import { MessageCircle, Clock, ThumbsUp } from "lucide-react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";

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
  justifyContent: "center",
  padding: "32px",
  backgroundColor: "#F9FAFB",
};

const headerStyle = {
  textAlign: "center",
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1F2937",
  marginBottom: "24px",
};

const discussions = [
  {
    id: 1,
    title: "Optimal Solution for Two Sum?",
    author: "JohnDoe",
    timestamp: "2 hours ago",
    comments: 12,
    content: "I'm struggling to find the most optimal solution for the Two Sum problem. Any suggestions?",
    answers: [{ text: "Use a hash map for O(n) time complexity.", votes: 5 }],
  },
  {
    id: 2,
    title: "Why is my DP solution not working?",
    author: "JaneSmith",
    timestamp: "5 hours ago",
    comments: 8,
    content: "My DP approach is failing on some edge cases. Any debugging tips?",
    answers: [{ text: "Check base cases and memoization setup.", votes: 3 }],
  },
];

const DiscussionList = () => {
  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Fin & Tell</h1>
      <h2>Discussion Forum</h2>
      <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: "16px" }}>
        {discussions.map((discussion) => (
          <Link key={discussion.id} to={`/thread/${discussion.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={cardStyle}>
              <h3>{discussion.title}</h3>
              <p>By {discussion.author}</p>
              <span><Clock size={16} /> {discussion.timestamp}</span>
              <span><MessageCircle size={16} /> {discussion.comments} comments</span>
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
  const [answers, setAnswers] = React.useState(discussion.answers);

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

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>{discussion.title}</h1>
      <p>{discussion.content}</p>
      <h3>Answers</h3>
      {answers.map((answer, index) => (
        <div key={index} style={cardStyle}>
          <p>{answer.text}</p>
          <button onClick={() => handleUpvote(index)}>
            <ThumbsUp size={16} /> {answer.votes}
          </button>
        </div>
      ))}
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." />
      <button onClick={handleComment}>Submit</button>
    </div>
  );
};


export default ThreadPage;