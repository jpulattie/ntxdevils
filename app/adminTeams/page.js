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
        <div className="bg-primroseYellow bg-opacity-50">
            <Admin />
            <h1 className="text-lg font-bold text-myrtleGreen justify-center"> Teams </h1>

            <TabGroup>
                <TabList className="justify-center rounded-2xl px-2 py-2  inline-flex flex-wrap gap-x-2">
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl inline-block px-2 py-2 mb-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">New Team</Tab>
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl inline-block px-4 py-2 mb-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">Edit Team</Tab>
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl inline-block px-4 py-2 mb-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">Delete Team</Tab>
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-primroseYellow justify-center rounded-xl inline-block px-4 py-2 mb-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">New Player</Tab>
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-primroseYellow justify-center rounded-xl inline-block px-4 py-2 mb-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">Edit Player</Tab>
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-primroseYellow justify-center rounded-xl inline-block px-4 py-2 mb-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">Delete Player</Tab>
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