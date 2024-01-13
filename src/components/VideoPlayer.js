"use client";

import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import socketIOClient from 'socket.io-client';
// const socket = io("http://localhost:30010", {
//         query: {
//             userId: 1,
//         },
//     });

const ENDPOINT = "http://192.168.4.90:30010"; // Replace with your server endpoint
const socket = socketIOClient(ENDPOINT);
let timeout = null;
const VideoPlayer = ({
    data
}) => {

    const {
        id: videoId,
        title,
        description,
        thumbnailUrl,
        videoUrl,
        uploadDate,
        userId } = data

    const [player, setPlayer] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [percent, setPercent] = useState(0);
    const [volume, setVolume] = useState(1);
    const playerRef = useRef(null);
    const [fullscreen, setFullscreen] = useState(false);
    useEffect(() => {
        const options = {
            preload: 'auto',
            autoplay: true,
            muted: muted,
            html5: {
                hls: {
                    withCredentials: true
                }
            },
        };

        const videoPlayer = videojs(playerRef.current, options, () => {
            setPlayer(videoPlayer);
            onDisplayActive()

        });
        return () => {
            if (player) {
                player.dispose();
            }
        };
    }, []);


    // useEffect(() => {
    //     const options = {
    //         preload: 'auto',
    //         autoplay: true,
    //         muted: muted,
    //         html5: {
    //             hls: {
    //                 withCredentials: true
    //             }
    //         },
    //     };

    //     const videoPlayer = videojs(playerRef.current, options, () => {
    //         setPlayer(videoPlayer);
    //         setPlaying(true) 
    //         if (videoPlayer) {
    //             // videoPlayer.play();
    //         }


    //     });
    //     return () => {
    //         if (player) {
    //             player.dispose();
    //         } 
    //     };
    // }, []);


    useEffect(() => {
        if (player) {
            player.src({
                src: `http://192.168.4.90:30010/api/v1/video/play/${videoUrl}`,
                type: "video/mp4",
            });
            // player.poster(data.coverPhotoUrl);
            // if (player) {
            //     player.play();

            // }
            // player.play()

        }
    }, [player,]);


    // useEffect(() => {
    //     if (player) {
    //         player.on("timeupdate", onProgress); // add a timeupdate event listener
    //     }
    //     return () => {
    //         if (player) {
    //             player.off("timeupdate", onProgress); // remove the timeupdate event listener when the component is unmounted
    //         }
    //     };
    // }, [player]);
    useEffect(() => {
        if (player) {
            player.muted(muted);
        }
    }, [player, muted]);

    useEffect(() => {
        if (player) {
            player.volume(volume);
        }
    }, [player, volume]);

    // useEffect(() => {
    //     if (player) {
    //         if (playing) {
    //             player?.play();
    //             player?.currentTime(currentTime);
    //         } else {
    //             player?.pause();
    //         }
    //     }
    // }, [player, playing]); 

    const [messageData, setMessageData] = useState([]);
    const [roomUsers, setRoomUsers] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
            socket.emit('joinRoom', { username: userId, room: videoId });
        });

        socket.on('disconnect', () => {
            console.log('disconnected');
        });

        socket.on('message', ({ message, action }) => {
            console.log("action", action);
            setMessageData(currentMessages => [...currentMessages, message]);
            if (action == 'play') {
                player.play();
                console.log("action", action);

            }
            if (action == 'startChannel') {

                // player.play();
                onDisplayActive()
                console.log("action", action);

            }
            else if (action == "pause") {
                console.log("action", action);
                player.pause();
            }
        });

        socket.on('roomUsers', ({ users }) => {
            setRoomUsers(users);
        });

        socket.on('error', (error) => {
            console.log(error);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
            socket.off('roomUsers');
            socket.off('error');
        };
    }, [socket, userId, videoId, player]);

    const [text, setText] = useState("")
    useEffect(() => {
        if (player) {
            if (playing) {
                player.play();
                player.currentTime(currentTime);
            } else {
                player.pause();
            }
        }
    }, [player, playing]);

    const onDisplayActive = () => {
        // setActive(true)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            setPlaying(true)
            if (player) {
                player.play();
            }
        }, 5000);
    }

    return (
        <div className='flex gap-2'>
            <div className='p-4  border-collapse border rounded-md w-[30%]' >
                {
                    messageData?.map((message, index) => <div key={index}>
                        {message?.username} : {message?.text} {message?.time}
                    </div>
                    )
                }

                <div className='flex flex-col gap-3 p-4  border-collapse border rounded-md'>
                    <input
                        value={text}
                        className='p-1 rounded bg-black text-white'
                        onChange={(e) => {
                            setText(e.target.value)
                        }} />
                    <button
                        className='bg-blue-500  p-1 rounded'
                        onClick={() => {
                            socket.emit("chatMessage", { room: videoId, msg: text, action: "message" });
                            setText("")

                        }}

                    >send massage</button>

                </div>
                <div className='flex  mt-2 justify-center gap-10'>
                    <button className='bg-green-500  p-1 rounded w-full'  onClick={() => {
                        if (playing) {
                            player.play();
                            socket.emit("chatMessage", { room: videoId, msg: `player ${userId}`, action: "play" });
                        }

                    }}>player</button>
                    <button
                        className='bg-red-500  p-1 rounded w-full'
                        onClick={() => {
                            if (playing) {
                                player.pause();
                                socket.emit("chatMessage", { room: videoId, msg: `player ${userId}`, action: "pause" });
                            }
                        }}>stop</button>
                </div>
            </div>

            <div className='p-4  border-collapse border rounded-md w-[70%]'>
                <div data-vjs-player >
                    <video ref={playerRef} className="video-js vjs-default-skin vjs-big-play-centered" />
                </div>
            </div>

        </div>

    );
};

export default VideoPlayer;



