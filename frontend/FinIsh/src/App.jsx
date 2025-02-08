import React from "react";
import HomePage from "./pages/Homepage.jsx";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Thread_Page from "./pages/Discussion/thread.jsx";
function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* <HomePage/> */}  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discussion" element={<Thread_Page />} />
      </Routes>
    </div>
  );
}

export default App;
