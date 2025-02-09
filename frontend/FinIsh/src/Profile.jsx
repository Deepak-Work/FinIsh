import React from "react";
import "./Profile.css"; // Import the CSS for styling

const Profile = ({ user, onClose }) => {
  if (!user) return null; // Do not render if no user is provided

  return (
    <div className="profile-panel">
      <button className="close-btn" onClick={onClose}>&times;</button>
      <h2>User Profile</h2>
      <div className="profile-content">
        <img src={user.profilePic || "/default-avatar.png"} alt="Profile" className="profile-pic" />
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {user.joinedDate}</p>
      </div>
    </div>
  );
};

export default Profile;
