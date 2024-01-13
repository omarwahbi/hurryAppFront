"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

import Image from "next/image";
import Link from "next/link";

import MessageComponent from "@/components/message";
import useIsIntersecting from "@/hooks/useIntersecting";

import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://192.168.4.90:30010/api/v1"; // Replace with your server endpoint
const getDataVideoByID = async (id) => {


   try {
      var myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("Authorization", "Bearer yUqEioYBzV7JWOHVQP.p.d3KRgELr5OMdhYBTNNFZzIkZBhP1FSFWqd5WhotkAeR");

      var requestOptions = {
         method: 'GET',
         headers: myHeaders,
         redirect: 'follow'
      };
      const res = await fetch(`${ENDPOINT}/video/1`, requestOptions)
      return await res.json()

   } catch (error) {
      console.log("error", error);

      return {}
   }

}

const socket = socketIOClient("http://192.168.4.90:30010");
let timeout = null;
function VideoPage() {

   const data = useRef(null);
   const videoId = useParams().id;

   useEffect(() => {
      getDataVideoByID(videoId).then(d => data.current = d);
   }, [videoId]);

   const { title, description, thumbnailUrl, videoUrl, uploadDate, userId } = data;

   const searchParams = useSearchParams();
 
   const isPartyText = searchParams.get("party");
   const streamId = searchParams.get("streamId");
   const [player, setPlayer] = useState(null);


   const videoRef = useRef(null);
   const [ws, setWs] = useState(null);
   const isUpdating = useRef(false);
   const isSeeking = useRef(false);

   const [messages, setMessages] = useState([]);
   const textInputRef = useRef(null);
   
   // const [title, setTitle] = useState("Title"); // TODO: should be an empty string
   // const [description, setDescription] = useState("Descriptionnnnnnnnnn jsndkjsnkjdn"); // TODO: should be an empty string

   const [isChatOn, setIsChatOn] = useState(false);
   const bottomDivRef = useRef(null);
   const scrollerRef = useRef(null);

   const isIntersecting = useIsIntersecting(bottomDivRef);

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
         setMessages(currentMessages => [...currentMessages, message]);
         if (action == 'play') {
            player.play();
            console.log("action", action);

         }
         if (action == 'startChannel') {

            // player.play();
            // onDisplayActive();
            console.log("action", action);

         }
         else if (action == "pause") {
            console.log("action", action);
            player.pause();
         }
      });

      // socket.on('roomUsers', ({ users }) => {
      //    setRoomUsers(users);
      // });

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

   function handlePlay() {
      if (isPartyText !== "true") return;
      if (!isUpdating.current) {
         const currentTime = videoRef.current?.currentTime || 0;
         ws?.send(JSON.stringify({ type: "PLAY", currentTime }));
      }
   }

   function handlePause() {
      if (isPartyText !== "true") return;
      // if (!isUpdating.current) {
      //    const currentTime = videoRef.current?.currentTime || 0;
      //    ws?.send(JSON.stringify({ type: "PAUSE", currentTime }));
      // }
   }

   function handleSendMessage() {
      
      
      if (isPartyText !== "true") return;
      const text = textInputRef.current?.value;
      
      if (!text) return;
      
      socket.emit("chatMessage", { room: videoId, msg: text, action: "message" });
      textInputRef.current.value = "";
      
      if (isIntersecting) {
         scrollerRef.current.scrollIntoView({ behavior: "smooth" });
      }
      
   }

   function handleSeek() {
      if (isPartyText !== "true") return;
      if (!isUpdating.current && ws) {
         isSeeking.current = true;
         videoRef.current.currentTime = seekTime;
         videoRef.current.play();
         ws.send(JSON.stringify({ type: 'SEEK', currentTime: seekTime }));
         setTimeout(() => {
            isSeeking.current = false;
         }, 300);
      }
   }


   return <div className="overflow-hidden md:w-[60%] h-[100svh]">
      <main>
         <video
            ref={videoRef}
            width="100%"
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            // onClick={(e) => {
            //    const rect = e.currentTarget.getBoundingClientRect();
            //    const offsetX = e.clientX - rect.left;
            //    const width = rect.width;
            //    const seekTime = (offsetX / width) * videoRef.current.duration;
            //    handleSeek(seekTime);
            // }}
            muted
         >
            <source src={`${ENDPOINT}/video/play/${videoUrl}`} type="video/mp4" />
            Your browser does not support the video tag.
         </video>
      </main>
      <div className="relative h-[60%] md:h-[100%]">
      <div className="relative h-full">
         <section className="py-3 px-5">
            <h2 className="mb-3 text-xl">{title}</h2>
            <div className={`grid ${/* userId === uploadedUserId */ true ? 'grid-cols-2' : 'grid-cols-1'} justify-around align-middle`}>
               {/* && userId === uploadedUserId */ <Link href={`edit?videoId=${videoId}`} className="w-fit mx-auto">
                  <center><Image src="/icons/edit.png" alt="edit icon" width={35} height={35} className="mb-1" /></center>
                  Edit
               </Link>}
               {isPartyText !== "true" ? <button className="w-fit mx-auto" > {/* only if it's not a watch party */}
                  <center><Image src="/icons/live.png" alt="edit icon" width={35} height={35} className="mb-1" /></center>
                  Create Watch Party
               </button>
               : <button className="w-fit mx-auto" onClick={(e) => setIsChatOn(true)}> {/* only if it's a watch party */}
                  <center><Image src="/icons/chat.png" alt="edit icon" width={35} height={35} className="mb-1" /></center>
                  Live Chat
               </button>}
            </div>
            <p className="text-lg mt-5 mb-2">Description</p>
            <p className="">{description}</p>
         </section>
         <section className={`no-scrollbar px-5 md:fixed absolute left-0 right-0 transition-all ${isChatOn ? "top-0 bottom-0 h-full" : "top-[100%] bottom-0 h-0"} md:left-[60%] md:right-0`}>
            <div className="no-scrollbar overflow-y-scroll h-[80%] bg-blue-300" ref={scrollerRef}>
               {messages.map((message, i) =>
                  <MessageComponent
                     key={i}
                     message={message.content}
                     username={message.name}
                  />)}
               <div className="w-full h-3" ref={bottomDivRef} />
            </div>
            <div className=" h-10" />
            <div className={`w-full opacity-0 bg-white ${isChatOn ? "fixed bottom-0 opacity-100" : ""}`}>
               <div className="mb-5 grid grid-cols-[50%_35%] md:grid-cols-1 align-middle justify-center">
                  <input
                     ref={textInputRef}
                     type="text"
                     name="message"
                     id="message"
                     className="w-full md:w-[35%] md:my-2 px-2 py-1 mr-3 border-[1px] rounded-md border-gray-300 focus:border-gray-500 active:border-gray-500 focus:outline-none active:outline-none"
                  />
                  <div className="ml-5 h-full">
                     <button className="mr-3 px-2 h-full rounded-md w-fit bg-indigo-500" onClick={handleSendMessage}>Send</button>
                     <button className="px-2 md:py-1 h-full rounded-md w-fit bg-red-500" onClick={(e) => setIsChatOn(false)}>Close</button>
                  </div>
               </div>
            </div>
         </section>
         </div>
         </div>
         
   </div>;
}

export default VideoPage;