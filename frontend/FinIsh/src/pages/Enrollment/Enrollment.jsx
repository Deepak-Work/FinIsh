import React, { useState, useEffect } from "react";
import "./Enrollment.css"; // Import styles

const Enrollment = () => {
  const [videos, setVideos] = useState([]);
  const [questionsAsked, setQuestionsAsked] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/enrollments/get_user_data");
      const data = await response.json();
      
      setVideos(data.videos || []);
      setQuestionsAsked(data.questions_asked || []);
      setQuestionsAnswered(data.questions_answered || []);
    } catch (error) {
      console.error("Error fetching user enrollment data:", error);
    }
  };

  return (
    <div className="enrollment-container">
      {/* Left Section: Videos */}
      <div className="left-section">
        <h2>Videos Watched</h2>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.video_id} className="video-item">
              <h3>{video.title}</h3>
              <iframe
                width="300"
                height="170"
                src={video.url.replace("watch?v=", "embed/")} // Convert normal YouTube link to embeddable format
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          ))
        ) : (
          <p>No videos watched yet.</p>
        )}
      </div>

      {/* Right Section: Questions Asked & Answered */}
      <div className="right-section">
        <div className="top-half">
          <h2>Questions Asked</h2>
          {questionsAsked.length > 0 ? (
            questionsAsked.map((question) => (
              <div key={question.question_id} className="question-row">
                <p className="question-text">{question.title}</p>
              </div>
            ))
          ) : (
            <p>No questions asked yet.</p>
          )}
        </div>

        <div className="bottom-half">
          <h2>Questions Answered</h2>
          {questionsAnswered.length > 0 ? (
            questionsAnswered.map((question) => (
              <div key={question.question_id} className="question-row">
                <p className="question-text">{question.title}</p>
              </div>
            ))
          ) : (
            <p>No questions answered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
