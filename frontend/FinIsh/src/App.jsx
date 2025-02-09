import React from "react";
import HomePage from "./pages/Homepage.jsx";
import Header from "./Header.jsx"
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Thread_Page from "./pages/Discussion/thread.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import Sections from "./pages/Sections/Sections.jsx"
function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* <HomePage/> */}  
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discussion" element={<Thread_Page />} />
        <Route path="/explore" element={<Explore />}/>
        <Route path="/sections" element={<Sections />}/>
      </Routes>
    </div>
  );
}

export default App;
