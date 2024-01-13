import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <div>
      <footer class="bg-white dark:bg-gray-900 mt-8">
        <div class="mx-auto w-full max-w-screen-xl p-2 py-2 ">
          <div class="md:flex md:justify-between">
            <div class="mb-6 md:mb-0 justify-center items-center flex">
              <a href="https://flowbite.com/" class="flex items-center">
                <Image
                  width={200}
                  height={100}
                  src="/assets/Screenshot__79_-removebg-preview.png"
                  class=" me-3"
                  alt="FlowBite Logo"
                />
              </a>
            </div>
            <div class="grid gap-8 sm:gap-6">
              <div>
                <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                  Made By:
                </h2>

                <ul class="text-gray-500 dark:text-gray-400 font-medium">
                  <li class="mb-4">
                    <a href="#" class="hover:underline">
                      Omar Wahbi
                    </a>
                  </li>
                  <li class="mb-4">
                    <a href="#" class="hover:underline">
                      Mohamed Baqer Ghazee
                    </a>
                  </li>
                  <li class="mb-4">
                    <a href="#" class="hover:underline">
                      Abbas Faek
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
