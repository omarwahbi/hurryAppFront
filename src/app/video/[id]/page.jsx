"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function VideoPage() {

   // TDOD: get user data. Dependant on back-end and where to store user data (localStorage, cookies, context)

   const SERVER_URL = "/";
   const videoId = useParams().id;
   const searchParams = useSearchParams();
 
   const isPartyText = searchParams.get("party");

   const videoRef = useRef(null);
   const [ws, setWs] = useState(null);
   const isUpdating = useRef(false);
   
   const [title, setTitle] = useState("Title"); // TODO: should be an empty string
   const [description, setDescription] = useState("Descriptionnnnnnnnnn jsndkjsnkjdn"); // TODO: should be an empty string

   const [isChatOn, setIsChatOn] = useState(false);

   useEffect(() => {
      if (isPartyText !== "true") return;

      const websocket = new WebSocket("ws://localhost:3000");
      setWs(websocket);

      websocket.onmessage = (event) => {
         isUpdating.current = true;
         const data = JSON.parse(event.data);
         // console.log(data.type);

         switch (data.type) {
            case "PLAY":
               videoRef.current.currentTime = data.currentTime;
               videoRef.current.play();
               break;
            case "PAUSE":
               videoRef.current.currentTime = data.currentTime;
               videoRef.current.pause();
               break;
            // case for SEEK
         }
         setTimeout(() => (isUpdating.current = false), 300); // Adjust delay as needed
      };

      return () => {
         websocket.close();
      };
   }, [isPartyText]);

   function handlePlay() {
      if (isPartyText !== "true") return;
      if (!isUpdating.current) {
         const currentTime = videoRef.current?.currentTime || 0;
         ws?.send(JSON.stringify({ type: "PLAY", currentTime }));
      }
   }

   function handlePause() {
      if (isPartyText !== "true") return;
      if (!isUpdating.current) {
         const currentTime = videoRef.current?.currentTime || 0;
         ws?.send(JSON.stringify({ type: "PAUSE", currentTime }));
      }
   }

   // TODO: add seek handling when back end complete
   // function handleSeek() {}


   return <div className="overflow-hidden h-[100svh]">
      <main className="md:w-[60%]">
         <video
            ref={videoRef}
            width="100%"
            controls
            onPlay={handlePlay}
            onPause={handlePause}
         >
            <source src={`${SERVER_URL}${videoId}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
         </video>
      </main>
      <div className="relative h-full">
         <section className="py-3 px-5">
            <h2 className="mb-3 text-xl">{title}</h2>
            <div className={`grid ${/* userId === uploadedUserId */ false ? 'grid-cols-2' : 'grid-cols-1'} justify-around align-middle`}>
               {isPartyText !== "true" /* && userId === uploadedUserId */ && <Link href={`edit?videoId=${videoId}`} className="w-fit mx-auto">
                  <center><Image src="/icons/edit.png" alt="edit icon" width={35} height={35} className="mb-1" /></center>
                  Edit
               </Link>}
               {isPartyText !== "true" ? <button className="w-fit mx-auto"> {/* only if it's not a watch party */}
                  <center><Image src="/icons/live.png" alt="edit icon" width={35} height={35} className="mb-1" /></center>
                  Create Watch Party
               </button>
               : <button className="w-fit mx-auto" onClick={(e) => setIsChatOn(p => !p)}> {/* only if it's a watch party */}
                  <center><Image src="/icons/chat.png" alt="edit icon" width={35} height={35} className="mb-1" /></center>
                  Live Chat
               </button>}
            </div>
            <p className="text-lg mt-5 mb-2">Description</p>
            <p className="">{description}</p>
         </section>
         <section className={`no-scrollbar bg-red-300 w-full px-5 absolute overflow-y-auto scroll transition-all ${isPartyText === "true" && isChatOn ? "h-full top-0 bottom-0" : "h-0"}`}>
            <div className={`w-full ${isPartyText === "true" && isChatOn ? "fixed bottom-0" : ""}`}>
               <input
                  type="text"
                  name="message"
                  id="message"
                  className="w-[70%] px-2 py-1 mb-5 mr-3 border-[1px] rounded-md border-gray-300 focus:border-gray-500 active:border-gray-500 focus:outline-none active:outline-none"
               />
               <button className="mx-auto w-fit">Send</button>
            </div>
         </section>
      </div>
   </div>;
}

export default VideoPage;