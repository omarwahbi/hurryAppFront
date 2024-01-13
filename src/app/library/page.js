"use client";
import React from "react";
import "../globals.css";
import VideoCard from "../../components/VideoCard.js";

export default function Library() {
  return (
    <>
      <h1 className=" text-center text-5xl font-bold my-7 text-rose-500">
        Videos
      </h1>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-9 mx-24">
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
      </div>
    </>
  );
}
