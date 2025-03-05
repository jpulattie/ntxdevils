'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';

import Link from 'next/link';
import { useTeam } from '../teamChoice';
import { useRouter } from 'next/navigation';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Admin from "../loggedin/page.js"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import New from "./new.js"
import Delete from "./delete.js"
import Edit from "./edit.js"



export default function adminInfo() {
    const [ choice, setChoice ]= useState([]);
    const [data, setData] = useState([]);

    return (
        <div className="bg-primroseYellow">
            <Admin />
            <h1 className="text-lg font-bold text-myrtleGreen justify-center"> INFO </h1>

            <TabGroup>
                <TabList className="justify-center rounded-2xl px-2 py-2  inline-flex gap-x-2">
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl inline-block px-4 py-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">New</Tab>
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl inline-block px-4 py-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">Edit</Tab>
                    <Tab className="flex text-lg font-bold shadow-lg bg-myrtleGreen text-white justify-center rounded-xl inline-block px-4 py-2 focus:bg-white focus:text-myrtleGreen focus:inset-shadow-xl hover:bg-opacity-80 hover:bg-white hover:text-myrtleGreen">Delete</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <New />
                    </TabPanel>
                    <TabPanel>
                        <Edit />
                    </TabPanel>
                    <TabPanel>
                        <Delete />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    )
}