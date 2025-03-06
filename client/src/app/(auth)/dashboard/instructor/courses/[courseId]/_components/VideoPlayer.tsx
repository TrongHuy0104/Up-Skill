import React from 'react';
import ReactPlayer from 'react-player';

type Props = { videoUrl: string };

function VideoPlayer({ videoUrl }: Props) {
    return (
        <div className="aspect-video">
            <ReactPlayer
                url={videoUrl}
                controls={true}
                width="100%"
                height="100%"
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
