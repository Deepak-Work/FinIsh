import React, { useState, useEffect } from 'react';
import './Explore.css'; // Make sure your CSS file is properly linked

const Explore = () => {
    const [currentVideo, setCurrentVideo] = useState({
        src: 'https://www.youtube.com/embed/3xXUQEvf8v0', // Embedded format for YouTube
        title: 'Financial Terms Explained as Simply as Possible',
    });

    const recommendedVideos = [
        { 
            id: 1, 
            src: 'https://www.youtube.com/watch?v=yYX4bvQSqbo', 
            title: 'ACCOUNTING BASICS: a Guide to (Almost) Everything', 
            thumbnail: 'http://img.youtube.com/vi/yYX4bvQSqbo/0.jpg' 
        },
        { 
            id: 2, 
            src: 'https://youtu.be/06kJXhOZhLU?si=GAz9qp_bMZR3I65Y', 
            title: 'What do investment bankers actually do?', 
            thumbnail: 'http://img.youtube.com/vi/06kJXhOZhLU/0.jpg' 
        },
        { 
            id: 3, 
            src: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo', 
            title: 'How does the stock market work? - Oliver Elfenbaum', 
            thumbnail: 'http://img.youtube.com/vi/p7HKvqRI_Bo/0.jpg' 
        },
        { 
            id: 4, 
            src: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo', 
            title: 'How does the stock market work? - Oliver Elfenbaum', 
            thumbnail: 'http://img.youtube.com/vi/p7HKvqRI_Bo/0.jpg' 
        },
    ];

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/sections/get_video", {method: "GET"});
                const data = await response.json();
                setCurrentVideo({ src: data.src, title: data.title });
            } catch (error) {
                console.error("Error fetching video:", error);
            }
        };
    
        fetchVideo();
    }, []); 

    const handleVideoChange = async (video) => {
        try {
            await fetch("http://127.0.0.1:5000/sections/set_video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ src: video.src, title: video.title }),
            });
            setCurrentVideo({ src: video.src, title: video.title });
        } catch (error) {
            console.error("Error setting video:", error);
        }
    };

    return (
        <div className="video-platform">
            <div className="main-video">
                <h2>{currentVideo.title}</h2>
                <iframe
                    width="720"
                    height="405"
                    src={currentVideo.src}
                    title={currentVideo.title}
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="recommendations">
                <h3>Recommended</h3>
                {recommendedVideos.map((video) => (
                    <div
                        className="recommended-video"
                        key={video.id}
                        onClick={() => handleVideoChange(video)}
                    >
                        <img src={video.thumbnail} alt={video.title} className="thumbnail" />
                        <div className="video-info">
                            <p className="video-title">{video.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explore;
