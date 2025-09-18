'use client'

import React, { Fragment } from 'react';
import Admin from "../loggedin/page.js"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import NewPlayer from "./newPlayer.js"
import DeletePlayer from "./deletePlayer.js"
import EditPlayer from "./editPlayer.js"
import NewTeam from "./newTeam.js"
import DeleteTeam from "./deleteTeam.js"
import EditTeam from "./editTeam.js"



export default function adminSchedules() {


    return (
        <div>
            <Admin />
            <h1 className="text-lg font-bold text-myrtleGreen justify-center"> Teams </h1>

            <TabGroup>
                <TabList className="justify-center rounded-2xl px-2 py-2 flex inline-flex flex-wrap gap-x-2">
                    <div className="flex w-full m-2 justify-center">
                        <Tab className="flex sm:text-lg text-sm font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl m-2 px-4 py-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">New Team</Tab>
                        <Tab className="flex sm:text-lg text-sm font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl m-2 px-4 py-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">Edit Team</Tab>
                        <Tab className="flex sm:text-lg text-sm font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl m-2 px-4 py-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">Delete Team</Tab>
                    </div>
                    <div className="flex w-full m-2 justify-center">
                        <Tab className="flex sm:text-lg text-sm font-bold shadow-lg bg-white text-myrtleGreen justify-center rounded-xl m-2 px-4 py-2 focus:bg-primroseYellow focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-primroseYellow hover:text-myrtleGreen">New Player</Tab>
                        <Tab className="flex sm:text-lg text-sm font-bold shadow-lg bg-white text-myrtleGreen justify-center rounded-xl m-2 px-4 py-2 focus:bg-primroseYellow focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-primroseYellow hover:text-myrtleGreen">Edit Player</Tab>
                        <Tab className="flex sm:text-lg text-sm font-bold shadow-lg bg-white text-myrtleGreen justify-center rounded-xl m-2 px-4 py-2 focus:bg-primroseYellow focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-primroseYellow hover:text-myrtleGreen">Delete Player</Tab>
                    </div>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <NewTeam />
                    </TabPanel>
                    <TabPanel>
                        <EditTeam />
                    </TabPanel>
                    <TabPanel>
                        <DeleteTeam />
                    </TabPanel>
                    <TabPanel>
                        <NewPlayer />
                    </TabPanel>
                    <TabPanel>
                        <EditPlayer />
                    </TabPanel>
                    <TabPanel>
                        <DeletePlayer />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    )
}