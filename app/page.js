'use client'

import { useState, useEffect } from 'react'
import Navbar from "./Navbar";


export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        
       

        <div className=" text-myrtleGreen bg-white rounded-xl m-8 items-center text-center m-6">
          <h1 className="inline-block text-2xl font-bold justify-center rounded-xl px-3 py-2 mt-2 mb-2">AUSSIE RULES - OVERVIEW</h1>
          <div className="justify-center items-center flex flex-grow">
            <iframe 
              className="w-[80%] max-h-[600px] min-h-[600px]"

              src="https://www.youtube.com/embed/XMZYZcoAcU0?si=s7pTRoLhXS012f1Q" 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen>

            </iframe>
            </div>
            <div className="text-myrtleGreen bg-white flex flex-col rounded-xl m-4 pl-[10%] pr-[10%]">
            <p className="text-center bg-white text-2xl rounded-xl text-xl m-6">This short 5 minute video provides a great overview of the game with commentary and clips from the professional league. </p>
            <p className=" text-center bg-white text-2xl rounded-xl text-xl m-6">Remember, we're an amateur club and the rules and game play have been modified a little for the US, but this clip will definitely help understand why this amazing sport if growing so fast!
          </p>
          </div>
            
        </div>
      </main>
      
    </div>
  );
}
