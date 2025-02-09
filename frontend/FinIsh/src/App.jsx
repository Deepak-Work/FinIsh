import React, { useState, useContext, useEffect } from "react";
import HomePage from "./pages/Homepage.jsx";
import Header from "./Header.jsx";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Thread_Page from "./pages/Discussion/thread.jsx";
import ThreadPage from "./pages/Discussion/Individual_Thread.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import Sections from "./pages/Sections/Sections.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthOptions } from "./authentication/AuthOptions.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
function App() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthOptions);

  useEffect(() => {
    setTimeout(setLoading.bind(null, false), 500);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* <HomePage/> */}
      <Header />
      <Routes>
        <Route path="login" element = {<Login />} />
        <Route path="register" element = {<Register />} />
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Login />} />
        <Route
          path="discussion"
          element={isAuthenticated &&
            <ProtectedRoute>
              <Thread_Page />
            </ProtectedRoute>
          }
        />

        <Route
          path="discussion/:id"
          element={
            isAuthenticated &&
            <ProtectedRoute>
              <Thread_Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="explore"
          element={
            isAuthenticated &&
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="sections"
          element={
            isAuthenticated &&
            <ProtectedRoute>
              <Sections />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
