"use client";

import Image from "next/image";
import { useRef, useState } from "react";

function UploadPage() {

   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const videoRef = useRef(null);
   const thumbnailRef = useRef(null);

   function handleSubmit(e) {
      e.preventDefault();

      setIsLoading(true);

      if (!videoRef.current) { //
         setError("No video uploaded!");
         setIsLoading(false);
      }

      if (!thumbnailRef.current) {
         setError("No thumbnail image uploaded!");
         setIsLoading(false);
      }

      const title = e.target[1].value;
      const description = e.target[3].value;

      if (!title) {
         setError("No title uploaded!");
         setIsLoading(false);
      }

      if (!description) {
         setError("No description uploaded!");
         setIsLoading(false);
      }

      // upload data

   }

   return <>
      <div className="mt-32 mx-auto max-w-[400px]">
         <h1 className="mx-auto mb-20 w-fit text-4xl text-gray-900">Upload Video</h1>
         <div className="mx-auto mb-10 w-fit flex">
            <label htmlFor="video" className="mx-2 flex items-center w-full justify-center rounded-md bg-indigo-600 pl-3 pr-5 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer">
               <Image src="/icons/upload-white.png" alt="upload icon" width={30} height={30} className="mr-2" />
               Video
               <input
                  ref={videoRef}
                  type="file"
                  id="video"
                  name="video"
                  accept="video/mp4" // video type
                  hidden
               />
            </label>
            <label htmlFor="tumbnail" className="pl-10 pr-16 mx-2 flex items-center rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 border-[1px] hover:border-gray-500 cursor-pointer">
               <Image src="/icons/picture.png" alt="picture icon" width={30} height={30} className="mr-2" />
               Thumbnail
               <input
                  ref={thumbnailRef}
                  type="file"
                  id="tumbnail"
                  name="tumbnail"
                  accept="image/jpg" // tumbnail image type
                  hidden
               />
            </label>
         </div>
         <div className="mx-5">
            <form onSubmit={handleSubmit}>
               <label htmlFor="title" className="w-fit block text-gray-900">Title</label>
               <input type="text" name="title" id="title" className="px-2 py-1 mb-5 block border-[1px] rounded-md w-full border-gray-300 focus:border-gray-500 active:border-gray-500 focus:outline-none active:outline-none " />
               <label htmlFor="description" className="w-fit block">Description</label>
               <input type="text" name="description" id="description" className="px-2 py-1 block mb-5 border-[1px] rounded-md w-full border-gray-300 focus:border-gray-500 active:border-gray-500 focus:outline-none active:outline-none" />
               <button type="submit" className="flex w-full text-lg justify-center rounded-md bg-indigo-600 px-3 py-2 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Upload
               </button>
            </form>
            <p>{ isLoading && "Loading..." }</p>
            <p className="text-red-500">{ error }</p>
         </div>
      </div>
   </>;
}

export default UploadPage;