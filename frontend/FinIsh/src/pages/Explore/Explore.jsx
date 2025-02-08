import React, { useState } from 'react';
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

    const handleVideoChange = (video) => {
        setCurrentVideo({ src: video.src, title: video.title });
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
