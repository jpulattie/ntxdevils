'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';

import Link from 'next/link';
import { useTeam } from '../teamChoice';
import { useRouter } from 'next/navigation';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Admin from "../loggedin/page.js"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'



export default function Delete() {
    const [data, setData] = useState([]);
    const [toDelete, setToDelete] = useState(null);
    const [deletekey, setDeletekey] = useState(null);
    let info_response;

    async function delPhoto() {
        
        const formData = new FormData();
        formData.append("folder", "rosters");
        formData.append("key", deletekey);

        try {
            const response = await fetch("/api/deletePhotos", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log('delete successful', data);
            //console.log('url', data.url);

            //data.url gives the url of the photo, need to send that to an 
            // API route with the other fields at api/sponsors and add the user
            // using the data.url as the url for the photo
            return 
            
            
        } catch (error) {
            console.error("upload failed", data.error);
        }

    }

    useEffect(() => {
        async function db_query() {
            let query = 'select * from roster;';

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
                if (result.results.length > 0) {
                    setToDelete(result.results[0].id)
                    console.log("Initial players:", toDelete)
                } else {
                    console.log('initial players data', result.results);
                }
                setData(result.results);
                console.log('data:', data)
                console.log('result:', result)
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching delete player1')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);

    async function deletePlayer(id) {
        let query = `delete from roster where id = "${id}";`
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
            await db_query();

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching delete player2')
            console.log('data:', data)
        }

        query = 'select * from roster;';
        delPhoto();

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
            if (result.results.length > 0) {
                setToDelete(result.results[0].id)
                console.log("Initial roster:", toDelete)
            } else {
                console.log('initial roster data', result.results);
            }
            setData(result.results);
            console.log('data:', data)
            console.log('result:', result)
        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching delete player 3')
            console.log('data:', data)
        }
    }

    const deleteSelect = (event) => {
        const deleteId = event.target.value
        setToDelete(deleteId);
        const key = data.find(item => item.id.toString() === deleteId);
        if (deleteId) {
            setDeletekey(key.picture_key)
        }
    }

    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80 pt-4 bg-white  shadow-2xl block px-2 py-2 justify-center rounded-2xl">
                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Delete Player</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Player to Delete</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={deleteSelect}
                        
                    >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id} value={JSON.stringify(item.player_name)}>
                                        {item.player_name?.length > 30 
                                        ? item.player_name.slice(0,30) + "..."
                                    : item.player_name}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field className="pt-4 pb-4">
                    <button
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"

                        onClick={() => {
                            deletePlayer(toDelete);
                        }}
                    >DELETE</button>
                </Field>
            </Fieldset>
        </div>
    )
}