"use client";

import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function EditPage() {

   
   const searchParams = useSearchParams();
 
   const videoId = searchParams.get("videoId");

   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   async function handleSubmit(e) {
      e.preventDefault();

      setIsLoading(true);

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

      const url = "http://192.168.4.90:30010/api/v1/";

      const formData2 = new FormData(); 

      formData2.append("title", title);
      formData2.append("description", description );

      try {
         const response = await axios.put(`${url}video/${videoId}`, formData2, {
            headers: {
               // 'Authorization': `Bearer ${Cookies.get("accessToken")}`,
               'Content-Type': 'multipart/form-data',
            },
         }); 

         if (response.status !== 200) return;

         const data = await response.data;

         router.push("/library");

      } catch (error) {
         setError("error");
         isLoading(false);
         return;
      }

   }

   return <>
      <div className="mt-32 mx-auto max-w-[400px]">
         <h1 className="mx-auto mb-20 w-fit text-4xl text-gray-900">Edit Video</h1>
         <div className="mx-5">
            <form onSubmit={handleSubmit}>
               <label htmlFor="title" className="w-fit block text-gray-900">Title</label>
               <input
                  required
                  type="text"
                  name="title"
                  id="title"
                  className="px-2 py-1 mb-5 block border-[1px] rounded-md w-full border-gray-300 focus:border-gray-500 active:border-gray-500 focus:outline-none active:outline-none "
               />
               <label htmlFor="description" className="w-fit block">Description</label>
               <input
                  required
                  type="text"
                  name="description"
                  id="description"
                  className="px-2 py-1 block mb-5 border-[1px] rounded-md w-full border-gray-300 focus:border-gray-500 active:border-gray-500 focus:outline-none active:outline-none"
               />
               <button type="submit" className="flex w-full text-lg justify-center rounded-md bg-indigo-600 px-3 py-2 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Update
               </button>
            </form>
            <p>{ isLoading && "Loading..." }</p>
            <p className="text-red-500">{ error }</p>
         </div>
      </div>
   </>;
}

export default EditPage;