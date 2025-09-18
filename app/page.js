'use client'

import { useState, useEffect } from 'react'
import Navbar from "./Navbar";


export default function Home() {
  return (
    <div>
      <main>
        
       

        <div className=" text-myrtleGreen bg-white rounded-xl m-8 items-center text-center m-6">
          <h1 className="block md:text-3xl md:text-strong text-3xl font-bold justify-start text-left rounded-xl pl-[5%] pt-[5%] m-6">Be a Devil.</h1>
          
          <div className="flex flex-col pl-[5%] m-6  space-y-4  text-lg">
            <div className="flex-1">
              <h2 className="block md:text-xl md:text-strong text-xl font-bold justify-start text-left rounded-xl pb-3">Our Team</h2>
              <p className="text-left bg-white rounded-xl ">NTX Devils are the 48th team to enter the USAFL. Established in 2020 amid the COVID pandemic, the Devils sought to help bolster awareness of Australian Football across DFW and provide a playing option for those living in the north DFW market. 
                The Devil logo and club colors are aligned to, and used with the permission of, the Tasmanian branch of the AFL. AFL TAS have formally submitted a bid to have a professional team based out of the state for the 2025 AFL season. 
                We hope to grow the Devils brand in the USA and raise awareness of the impending AFL team, building a supporter base here in Texas. </p>
            </div>
            <div className="flex-1">
              <h2 className="block md:text-xl md:text-strong text-xl font-bold justify-start text-left rounded-xl pb-3">Our Mission</h2>
              <p className="text-left bg-white rounded-xl ">
                We focus on growing the AFL sport and Brand in the USA by bringing together communities to play and support our great game. As a Club, we seek to grow and develop all involved, and present a competitive, drive and successful team on a mission to win games, have fun and give back to our communities.
              </p>
            </div>
            <div className="flex-1">
              <h2 className="block md:text-xl md:text-strong text-xl font-bold justify-start text-left rounded-xl pb-3">Our History</h2>
              <p className="text-left bg-white rounded-xl  ">
                The USAFL was incorporated in 1997 and has since spread to multiple states, with 48 teams to creating a robust National competition. Each year club will play 'local', regional and national games. This growth has seen new club start ups and we're proud to pull on the Devils jumper to represent North Texas. Actively seeking Club Officials, Sponsors, and Players - contact us for more information.
              </p>
            </div>
          </div>



          <h1 className="block md:text-2xl md:text-strong text-2xl font-bold justify-start text-left rounded-xl pl-[5%] pt-2 m-6">What is Aussie Rules Football?</h1>
          <p className="text-left bg-white text-2xl rounded-xl text-xl m-6 pl-[5%]">Australian football, also called Australian rules football or Aussie rules, or more simply football or footy, is a contact sport played between two teams of 18 players on an oval field, often a modified cricket ground.</p>

          <h1 className="block md:text-2xl md:text-strong text-2xl font-bold justify-start text-left rounded-xl pl-[5%] pt-2 m-6">Aussie Rules - Overview</h1>
          <div className="justify-center items-center flex flex-grow">
            <iframe 
              className="w-[80%] aspect-video"

              src="https://www.youtube.com/embed/XMZYZcoAcU0?si=s7pTRoLhXS012f1Q" 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen>

            </iframe>
            </div>
            <p className="text-left bg-white text-xl rounded-xl text-xl m-6 pl-[5%]">This short 5 minute video provides a great overview of the game with commentary and clips from the professional league. </p>
            <p className="text-left bg-white text-xl rounded-xl text-xl m-6 pl-[5%] pb-[5%]">Remember, we're an amateur club and the rules and game play have been modified a little for the US, but this clip will definitely help understand why this amazing sport if growing so fast!
          </p>
            
        </div>
      </main>
      
    </div>
  );
}
