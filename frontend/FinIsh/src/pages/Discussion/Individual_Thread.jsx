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
    title: "How to Start Investing with Limited Funds?",
    author: "FinanceGuru",
    timestamp: "3 hours ago",
    comments: 5,
    content:
      "I’m new to investing and don’t have a large budget. What are some smart ways to start investing with limited funds? Are index funds or fractional shares a good option?",
    answers: [
      { text: "Consider investing in index funds or ETFs with low expense ratios. They offer diversification and require minimal effort.", votes: 10 },
      { text: "Fractional shares allow you to invest in expensive stocks without needing to buy a full share. Great way to start!", votes: 7 },
    ],
  },
  {
    id: 2,
    title: "Understanding Compound Interest and Its Impact?",
    author: "MoneyMatters",
    timestamp: "1 day ago",
    comments: 8,
    content:
      "I recently heard about the 'power of compound interest,' but I don’t fully understand how it works. Can someone explain its benefits and how I can use it to grow wealth?",
    answers: [
      { text: "Compound interest helps your money grow exponentially. The earlier you start investing, the more you benefit from reinvested earnings.", votes: 12 },
      { text: "Use the rule of 72: Divide 72 by your expected annual return to estimate how many years it takes to double your money.", votes: 8 },
    ],
  },
  {
    id: 3,
    title: "What Are the Best Strategies for Saving Money?",
    author: "SavvySaver",
    timestamp: "2 days ago",
    comments: 6,
    content:
      "I struggle with saving money consistently. What are some effective savings strategies that I can implement in my daily life?",
    answers: [
      { text: "Try the 50/30/20 rule: Allocate 50% of income to needs, 30% to wants, and 20% to savings or investments.", votes: 9 },
      { text: "Automate savings by setting up recurring transfers to a high-yield savings account.", votes: 6 },
    ],
  },
  {
    id: 4,
    title: "Should I Pay Off Debt First or Invest?",
    author: "DebtFreeJourney",
    timestamp: "5 days ago",
    comments: 4,
    content:
      "I have some high-interest debt but also want to start investing. Should I focus on paying off debt first, or is it possible to do both?",
    answers: [
      { text: "If your debt has an interest rate above 7-8%, prioritize paying it off before investing. High-interest debt can eat away at your returns.", votes: 11 },
      { text: "You can balance both by allocating a portion of your income to investments while aggressively paying down high-interest debt.", votes: 7 },
    ],
  },
  {
    id: 5,
    title: "How Does Inflation Affect My Savings?",
    author: "EconEnthusiast",
    timestamp: "1 week ago",
    comments: 3,
    content:
      "I keep most of my savings in a regular bank account, but I’m worried about inflation. How does inflation impact savings, and how can I protect my money?",
    answers: [
      { text: "Inflation erodes the purchasing power of money over time. Consider putting your savings in assets that outpace inflation, like stocks or real estate.", votes: 9 },
      { text: "High-yield savings accounts and inflation-protected bonds (TIPS) are safer options to combat inflation’s effects.", votes: 5 },
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
