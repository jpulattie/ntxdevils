
import { Roboto } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Image from "next/image";
import Navbar from "./Navbar";
import { TeamProvider } from './teamChoice';
import { PlayerProvider } from './playerChoice';
import Providers from './Providers'; 
import {LoginProvider } from './loginProvider'
import './globals.css';
import {headers} from 'next/headers';


import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';


const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const pages = [
  {
    name: 'Rosters',
    link: "/teams"
  }, 
  {
    name: 'Schedules',
    link: "/schedules"
  },
  {
    name: 'Info',
    link: "/info"
  },
  {
    name: 'Photos',
    link: "/photos"

  },
  {
    name: 'Sponsors',
    link: "/sponsors"
  },
  {
    name: 'Announcements',
    link: "/announcements"
  }
]

console.log('pages', pages);


export const metadata = {
  title: "NTX Devils",
  description: "North Texas Devils Australian Rules Football Club",
};

export default function RootLayout({ children, hideNavbar = false }) {

  return (
    <html lang="en" >
      <head>
        <title>NTX Devils</title>
        <meta name="description" content="NTX Aussie Rules Football Club" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body
        className={`md:ml-[min(10%,25%)] md:mr-[min(10%,25%)] md:text-base text-sm text-myrtleGreen text-center ${roboto.variable} antialiased flex flex-col min-h-screen shadow-2xl shadow-myrtleGreen-99 rounded`}
      >

        <Providers>
         


          <header> 
            <div className="fixed w-full md:w-[min(80%,95%)] flex flex-col justify-between items-center bg-myrtleGreen text-primroseYellow">
              
              <div className="flex justify-between items-center w-full p-2">


              <div className="flex max-w-[65px] object-contain p-2 justify-center items-center ">
              <Image
                src="/logo.png"
                alt="NTX Devils logo"
                className="h-full w-auto max-h-[95px]"
                width={180}
                height={38}
                sizes="(max-width: 65px) 50vw, 180px" // Optional: specify how the image scales on smaller screens
                priority
              />
              </div>
              <Link href="/" className="col-span-2 font-roboto text-lg text-4.5xl bg-myrtleGreen text-primroseYellow justify-center text-center">
                <h1 className="text-xl md:text-3xl text-primroseYellow font-bold">NTX DEVILS FOOTY</h1>
              </Link>
              <div className="flex w-auto max-h-[65px] p-2 justify-center items-center ">
              <Image
                src="/usaflLogo.png"
                alt="USAFL logo"
                className="h-full w-auto max-h-[65px]"
                width={180}
                height={38}
                priority
              />
              </div>

              </div>

              <Navbar /> 
            </div>
          </header>
          <main className="flex-grow w-full m-auto pt-[132px] pb-2 text-center grid grid-cols-1 grid-row-6 row-span-6 text-myrtleGreen bg-white bg-opacity-70">
            <div className="flex-grow">
            {children}
            </div>
          </main>
          <footer className="bg-white grid grid-cols-1 grid-row-6 w-full ">
            <p>&copy; Josh Pulattie 2024</p>
            <Link href="/login/" className="col-span-2 font-roboto text-lg text-4.5xl bg-myrtleGreen text-primroseYellow text-center">
              Admin Login
              </Link>
          </footer>

        </Providers>
        

      </body>

    </html >
  );
}

//put header, nav, and footer in this layout folder
//anything that goes on ALL PAGES, goes in this layout page
