'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';
import { useRef } from 'react';

import Link from 'next/link';
import { useTeam } from '../teamChoice';
import { useRouter } from 'next/navigation';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Admin from "../loggedin/page.js"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'
import { Lexend_Tera } from 'next/font/google';


export default function New() {
    const [data, setData] = useState([]);
    const [toAdd, setToAdd] = useState({
        team_name: '',

    });
    const [isAdded, setIsAdded] = useState(false);
    //const [folder, setFolder] = useState('sponsors')
    //const [newPhoto, setNewPhoto] = useState(false);
    //let newURL = null;
    //let newKey = null;
    //const fileInputRef = useRef(null);
    const router = useRouter();

    let info_response;



    async function addTeam() {
        console.log('adding new team...', toAdd.team_name);
        let query = `insert into team (program_id, team_name) values (1, "${toAdd.team_name}"); `

        try {
            console.log('sending API request to route')//, query)
            const response = await fetch('api/teams', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                console.log('response with error:', response)
                throw new Error("Error response not ok")
            }
            const result = await response.json();
            //console.log('result:',result)
            setIsAdded(true);
            setToAdd({
                team_name: ''

            });
        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching in addTeam')
            console.log('data:', data)
        }
    }

    async function addNew() {
        console.log('checking photo', (toAdd.sponsor_photo === undefined))
        console.log('to add...', toAdd)
        if (window.confirm(`Are you sure you wish to add...
            Name:${toAdd.team_name}`)) {
            console.log('check new team', toAdd.team_name);
            await addTeam();
        }
        else { console.log("canceled") }
    }

    useEffect(() => {
        if (isAdded) {
            setIsAdded(false);
        }
    }, [isAdded])

    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white pt-4 shadow-2xl block px-2 py-2 justify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">New Team</Legend>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Team Name</Label>
                    <Input

                        name="title"
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        placeholder="New Team name..."
                        value={toAdd.team_name}
                        onChange={(e) => setToAdd({ ...toAdd, team_name: e.target.value })}
                    />
                </Field>


                <Field className="pt-4 pb-4">
                    <button
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"
                        onClick={() => {
                            addNew(toAdd);
                        }}
                    >ADD</button>
                </Field>
            </Fieldset>
        </div>
    )
}