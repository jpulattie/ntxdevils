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


export default function Edit() {
    const [data, setData] = useState([]);
    const [toEdit, setToEdit] = useState({
        id: '',
        info_title: '',
        info_description: '',
        info_link: ''
    });
    const [isAdded, setIsAdded] = useState(false);
    const [index, setIndex] = useState(0);
    let info_response;
    let newLink;


    useEffect(() => {
        let api_request = 'select * from info;';
        async function db_query() {
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
                console.log('result:', result)
                setData(result.results);
                if (result.results.length > 0) {
                    setToEdit({
                        id: result.results[index].id,
                        info_title: result.results[index].info_title,
                        info_description: result.results[index].info_description,
                        info_link: result.results[index].info_link,

                    });
                    
                    console.log("Initial announcements:", toEdit)
                } else {
                    console.log('initial announcement data', result.results);
                }
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching2')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);

    async function editInfo() {
        if (!toEdit.info_link || toEdit.info_link.startsWith('https://')) {
            newLink = toEdit.info_link
        } else {
            newLink = `https://${toEdit.info_link}`
        }
        
        let api_request = `update info set info_title = "${toEdit.info_title}", info_description = "${toEdit.info_description}", info_link = "${newLink}" where id = ${toEdit.id};`

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
            await response.json();

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
            console.log('result:', result)
            setIsAdded(true);
            setData(result.results);
            setIndex(0);
            if (result.results.length > 0) {
                setToEdit({
                    id: result.results[index].id,
                    info_title: result.results[index].info_title,
                    info_description: result.results[index].info_description,
                    info_link: result.results[index].info_link,

                });
                console.log("Initial announcements after update:", toEdit)
            } else {
                console.log('initial announcement data', result.results);
            }

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
    }

    const editSelect = (event) => {
        const selection = JSON.parse(event.target.value);
        setToEdit({
            id: selection.id,
            info_title: selection.info_title,
            info_description: selection.info_description,
            info_link: selection.info_link
        });
    }


    const addEdit = async (toEdit) => {
        await editInfo();

    }

    useEffect(() => {
        if (isAdded) {
            setIndex(0);
            setIsAdded(false);
        }
    }, [isAdded])

 

    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white  shadow-2xl block px-2 py-2 pt-4 justify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Edit Info</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Info to Edit</Label>
                    <Select
                        className="max-w-full max-w-[250px] md:max-w-[500px] truncate border border-myrtleGreen px-4 py-1 border-1 overflow-hidden"
                        onChange={(e)=>{
                            setIndex(e.target.index);
                            editSelect(e)
                        }}
                    >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id} value={item}>
                                        {item.info_description?.length > 40 
                                        ? item.info_description.slice(0,40) + "..."
                                    : item.info_description}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Info Title</Label>
                    <Input
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        name="title"
                        value={toEdit.info_title !== 'null' ? toEdit.info_title : ' '}
                        onChange={(e) => setToEdit({ ...toEdit, info_title: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Description</Label>
                    <Textarea
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        name="announcement"
                        value={toEdit.info_description !== 'null' ? toEdit.info_description : ' '}
                        placeholder="Announcement"
                        onChange={(e) => setToEdit({ ...toEdit, info_description: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Link</Label>
                    <Textarea
                        name="announcement"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        value={toEdit.info_link !== 'null' ? toEdit.info_link : ' '}

                        placeholder="Web link"
                        onChange={(e) => 
                            setToEdit({ ...toEdit, info_link: e.target.value })}
                    />
                </Field>

                <Field className="pt-4 pb-4">
                    <button
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"

                        onClick={() => {
                            addEdit(toEdit);
                        }}
                    >UPDATE</button>
                </Field>
            </Fieldset>
        </div>
    )
}