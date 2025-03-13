import React from 'react';
import ReactPlayer from 'react-player';

type Props = { 
    videoUrl: string;
    onProgress?: (progress: number) => void;
};

function VideoPlayer({ videoUrl, onProgress }: Props) {
    const handleProgress = (state: { played: number }) => {
        if (onProgress) {
            onProgress(state.played * 100);
        }
    };

    return (
        <div className="aspect-video">
            <ReactPlayer
                url={videoUrl}
                controls={true}
                width="100%"
                height="100%"
                onProgress={handleProgress}
                config={{
                    file: {
                        attributes: {
                            controlsList: 'nodownload' // Disable download option
                        }
                        // tracks: [
                        //   {
                        //     kind: 'subtitles',
                        //     src: 'https://path-to-subtitles.vtt',
                        //     srcLang: 'en',
                        //     label: 'English',
                        //     default: true,
                        //   },
                        // ],
                    }
                }}
            />
        </div>
    );
}

export default VideoPlayer;
