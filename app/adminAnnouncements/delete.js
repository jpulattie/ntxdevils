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

    let info_response;

    useEffect(() => {
        async function db_query() {
            let query = 'select * from announcements;';

            try {
                console.log('sending API request to route')//, api_request)
                const response = await fetch('api/announcements', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    console.log('response with error:', response)
                    throw new Error("Error response not ok")
                }
                const result = await response.json();
                setData(result.results);

                console.log('result:',result)
                if (result.results.length > 0 ) {
                    setToDelete(result.results[0].id)
                    console.log("Initial announcements:", toDelete)
                } else {
                    console.log('initial announcement data', result.results);
                }

                console.log('data:', data)
                console.log('result:', result)
            }

            catch (error) {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching3')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);

    async function deleteAnnouncement(id) {
        let query = `delete from announcements where id = "${id}";`
        try {
            console.log('sending API request to route')//, api_request)
            const response = await fetch('api/announcements', {
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
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
        query = 'select * from announcements;';

        try {
            console.log('sending API request to route')//, api_request)
            const response = await fetch('api/announcements', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                console.log('response with error:', response)
                throw new Error("Error response not ok")
            }
            const result = await response.json();
            console.log('result:',result)
            setData(result.results);

            if (result.results.length > 0 ) {
                setToDelete(result.results[0].id)
                console.log("Initial announcements:", toEdit)
            } else {
                console.log('initial announcement data', result.results);
            }

            console.log('data:', data)
            console.log('result:', result)
            
        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
    }

    const deleteSelect = (event) => {
        setToDelete(event.target.value);
    }

    return (
        <div className="flex justify-center">
            
            <Fieldset className="w-4/5 flex-basis:80 pt-4 bg-white  shadow-2xl block px-2 py-2 justify-center rounded-2xl">
                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Delete Announcement</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Announcement to Delete</Label>
                    <Select 
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={deleteSelect}
                        >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id}value={item.id}>{item.announcement}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field className="pt-4 pb-4">
                    <button 
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"

                        onClick={() => {
                            deleteAnnouncement(toDelete);
                        }}
                        >DELETE</button>
                </Field>
            </Fieldset>
        </div>
    )
}