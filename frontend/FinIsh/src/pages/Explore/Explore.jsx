import React, { useState, useEffect, useRef } from 'react';
import './Explore.css'; // Make sure your CSS file is properly linked

const Explore = () => {
    const [currentVideo, setCurrentVideo] = useState({
        src: 'https://www.youtube.com/embed/3xXUQEvf8v0', // Embedded format for YouTube
        title: 'Financial Terms Explained as Simply as Possible',
        id: '5e33acdd-143e-468c-946f-2274fad79e76',
        tag: 'Trading'
    });
    const playerRef = useRef(null); // Ref to store the YouTube player instance

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

    // UseEffect to load YouTube API script
    useEffect(() => {
        const loadYouTubeAPI = () => {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            document.body.appendChild(script);
        };

        loadYouTubeAPI();

        const fetchVideo = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/sections/get_video", { method: "GET" });
                const data = await response.json();
                setCurrentVideo({ src: data.src, title: data.title, id: data.id, tag: data.tag });
            } catch (error) {
                console.error("Error fetching video:", error);
            }
        };

        fetchVideo();
    }, []); 

    // Create the YouTube player when the API is ready
    useEffect(() => {
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId: currentVideo.src.split('/embed/')[1], // Extract the video ID from the embedded URL
                events: {
                    'onStateChange': handleVideoStateChange,
                },
            });
        };
    }, [currentVideo]);

    // Handle the state change event of the video player
    const handleVideoStateChange = (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            handleVideoEnd();
        }
    };

    const handleVideoChange = async (video) => {
        try {
            await fetch("http://127.0.0.1:5000/sections/set_video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ src: video.src, title: video.title, id: video.id, tag: video.tag }),
            });
            setCurrentVideo({ src: video.src, title: video.title, id: video.id });
        } catch (error) {
            console.error("Error setting video:", error);
        }
    };

    const handleVideoEnd = async () => {
        console.log("Video ended");

        // Send the video ID to the backend when the video is finished
        try {
            const videoLink = currentVideo.src.split('/embed/')[1]; // Extract video ID from the URL

            // Send a request to update the video ID in the user's record
            await fetch("http://127.0.0.1:5000/explore/update_user_video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videolink: videoLink, id: currentVideo.id }),
            });

            console.log("Video ID updated in database");
        } catch (error) {
            console.error("Error updating video ID:", error);
        }
    };

    return (
        <div className="video-platform">
            <div className="main-video">
                <h2>{currentVideo.title}</h2>
                <div id="youtube-player"></div> {/* This is where the YouTube player will be embedded */}
                <div className="video-tag">
                    <p>Tag: {currentVideo.tag}</p> {/* Displaying the tag */}
                </div>
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
