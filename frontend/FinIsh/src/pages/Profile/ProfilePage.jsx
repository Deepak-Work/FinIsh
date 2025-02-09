import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // Add styles for the profile page

const ProfilePage = () => {
    const [user, setUser] = useState({
        full_name: '',
        username: '',
        email: '',
        bio: '',
        profile_picture_url: '',
        credits: 0,
        total_watched: 0,
        total_questions: 0,
        total_answers: 0,
        created_at: '',
        updated_at: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = '7f4e6426-1202-4ff5-a969-eb8adb24c267'; // Replace with dynamic user ID from auth (use something like user.id)
                console.log(userId)
                const response = await fetch(`http://127.0.0.1:5000/profile/${userId}`,{ // Updated URL
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }); // Change to your API endpoint
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        
        fetchUserData();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info">
                    <h2>{user.full_name}</h2>
                    <p>@{user.username}</p>
                    <p>{user.email}</p>
                    <p>{user.bio}</p>
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-item">
                    <h3>Credits</h3>
                    <p>{user.credits}</p>
                </div>
                <div className="stat-item">
                    <h3>Videos Watched</h3>
                    <p>{user.total_watched}</p>
                </div>
                <div className="stat-item">
                    <h3>Total Questions</h3>
                    <p>{user.total_questions}</p>
                </div>
                <div className="stat-item">
                    <h3>Total Answers</h3>
                    <p>{user.total_answers}</p>
                </div>
                <div className="stat-item">
                    <h3>Member Since</h3>
                    <p>{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
