import { Roboto } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Image from "next/image";
import Navbar from "./Navbar";
import { TeamProvider } from './teamChoice';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';


const roboto = Roboto({
  variable: "--font-roboto",
  //subsets: ["latin"],
  weight: ["400", "700"]
});

const pages = [
  {
    name: 'Teams',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>NTX Devils</title>
        <meta name="description" content="NTX Aussie Rules Football Club" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`ml-[10%] mr-[10%] bg-white text-myrtleGreen text-center ${roboto.variable} antialiased flex flex-col min-h-screen`}
      >
        <TeamProvider>


          <header>
            <div className="col-span-1 sm:col-span-6 md:col-span-6 lg:col-span-6 flex justify-between items-center bg-myrtleGreen text-primroseYellow">

              <Image
                className="dark:invert max-w-[65px] object-contain p-2"
                src="/logo.png"
                alt="NTX Devils logo"
                width={180}
                height={38}
                sizes="(max-width: 65px) 50vw, 180px" // Optional: specify how the image scales on smaller screens
                priority
              />
              <Link href="/" className="col-span-2 font-roboto text-lg text-4.5xl bg-myrtleGreen text-primroseYellow text-center">
                <h1>NTX DEVILS FOOTY</h1>
              </Link>
              <Image
                className="dark:invert w-auto max-h-[65px] p-2"
                src="/usaflLogo.png"
                alt="USAFL logo"
                width={180}
                height={38}
                priority
              />
            </div>
            <Navbar />
          </header>
          <main className="flex-grow container m-auto text-center grid grid-cols-1 grid-row-6 row-span-6 text-myrtleGreen bg-white">
            {children}
          </main>
          <footer className="grid grid-cols-1 grid-row-6 container m-auto bg-[#]">
            <p>&copy; Josh Pulattie 2024</p>
          </footer>
        </TeamProvider>

      </body>

    </html >
  );
}

//put header, nav, and footer in this layout folder
//anything that goes on ALL PAGES, goes in this layout page
