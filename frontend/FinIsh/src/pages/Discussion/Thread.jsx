import React from "react";
import { MessageCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
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

const subHeaderStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#374151",
  marginBottom: "24px",
};

const discussionContainerStyle = {
  width: "60%",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
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

const Thread_Page = () => {
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Fin & Tell</h1>
      <h2 style={subHeaderStyle}>Discussion Forum</h2>
      <div style={discussionContainerStyle}>
        {discussions.map((discussion) => (
          <Link 
          key={discussion.id} 
          to={`/discussion/${discussion.id}`} 
          style={{ textDecoration: "none", color: "inherit" }}
        >
          
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Thread_Page;
