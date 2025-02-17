import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
    videoUrl: string;
    title: string;
};

function CoursePlayer({ videoUrl }: Props) {
    const [videoData, setVideoData] = useState({ otp: '', playbackInfo: '' });

    useEffect(() => {
        axios
            .post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/getVdoCipherOTP`,
                {
                    videoId: videoUrl
                },
                { withCredentials: true }
            )
            .then((res) => setVideoData(res.data));
    }, [videoUrl]);

    return (
        <div style={{ paddingTop: '41%', position: 'relative' }}>
            {videoData.otp && videoData.playbackInfo !== '' && (
                <iframe
                    src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=${process.env.VIDEOCIPHER_PLAYER_ID}`}
                    allowFullScreen={true}
                    allow="encrypted-media"
                    style={{
                        border: 0,
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                ></iframe>
            )}
        </div>
    );
}

export default CoursePlayer;
