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
            let api_request = 'select * from info;';

            try {
                console.log('sending API request to route')//, api_request)
                const response = await fetch('api/info', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ api_request })
                });

                if (!response.ok) {
                    console.log('response with error:', response)
                    throw new Error("Error response not ok")
                }
                const result = await response.json();
                //console.log('result:',result)
                if (result.results.length > 0) {
                    setToDelete(result.results[0].id)
                    console.log("Initial info:", toDelete)
                } else {
                    console.log('initial info data', result.results);
                }
                setData(result.results);
                console.log('data:', data)
                console.log('result:', result)
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching2')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);

    async function deleteInfo(id) {
        let api_request = `delete from info where id = "${id}";`
        try {
            console.log('sending API request to route')//, api_request)
            const response = await fetch('api/info', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ api_request })
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

        api_request = 'select * from info;';

        try {
            console.log('sending API request to route')//, api_request)
            const response = await fetch('api/info', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ api_request })
            });

            if (!response.ok) {
                console.log('response with error:', response)
                throw new Error("Error response not ok")
            }
            const result = await response.json();
            //console.log('result:',result)
            if (result.results.length > 0) {
                setToDelete(result.results[0].id)
                console.log("Initial info:", toDelete)
            } else {
                console.log('initial info data', result.results);
            }
            setData(result.results);
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
                    <Label className="block flex justify-center py-2">Choose Info to Delete</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={deleteSelect}
                        
                    >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id} value={item.id}>{item.info_title} - {item.info_description}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field className="pt-4 pb-4">
                    <button
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"

                        onClick={() => {
                            deleteInfo(toDelete);
                        }}
                    >DELETE</button>
                </Field>
            </Fieldset>
        </div>
    )
}