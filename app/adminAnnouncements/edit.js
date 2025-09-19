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
        announcement_title: '',
        announcement: '',
        announcement_link: ''
    });
    const [isAdded, setIsAdded] = useState(false);

    let info_response;
    

    useEffect(() => {
        let query = 'select * from announcements order by id desc limit 10;';
        async function db_query() {
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
                    setToEdit({
                        id: result.results[0].id,
                        announcement_title: result.results[0].announcement_title,
                        announcement: result.results[0].announcement,
                        announcement_link: result.results[0].announcement_link,

                    })
                    console.log("Initial announcements:", toEdit)
                } else {
                    console.log('initial announcement data', result.results);
                }
            }

            catch (error) {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching2')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);

    async function editAnnouncement() {
        let query = `update announcements set announcement_title = "${toEdit.announcement_title}", announcement = "${toEdit.announcement}", announcement_link = "${toEdit.announcement_link}" where id = ${toEdit.id};`

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
            await response.json();

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
        query = 'select * from announcements order by id desc limit 10;';

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
            setIsAdded(true);
            setToAdd({ title: '', announcement: '', announcement_link:'' }); 
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
            announcement:selection.announcement,
            announcement_title: selection.announcement_title,
            announcement_link: selection.announcement_link
        });
    }


    const addEdit = async (toEdit) => {
        await editAnnouncement();
        window.alert(`${toEdit.announcement_title} updated!`)


    }

    useEffect(() => {
            if (isAdded) {
                setIsAdded(false);
            }
        }, [isAdded])

    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white  shadow-2xl block px-2 py-2 pt-4 ssjustify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Edit Announcement</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Announcement to Edit</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={editSelect}
                    >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id} value={item.id}>
                                        {item.announcement?.length > 30 
                                        ? item.announcement.slice(0,30) + "..."
                                    : item.announcement}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Announcement Title</Label>
                    <Input
                        className="border border-myrtleGreen px-3 py-1 border-1" 
                        name="title"
                        value={toEdit.announcement_title !== 'null' ? toEdit.announcement_title : ' '}
                        onChange={(e) => setToEdit({ ...toEdit, announcement_title: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Announcement</Label>
                    <Textarea
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        name="announcement"
                        value={toEdit.announcement !== 'null' ? toEdit.announcement : ' '}
                        placeholder="Announcement"
                        onChange={(e) => setToEdit({ ...toEdit, announcement: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Announcement Link</Label>
                    <Textarea
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        name="announcement"
                        value={toEdit.announcement_link !== 'null' ? toEdit.announcement_link : ' '}
                        placeholder="Announcement Link"
                        onChange={(e) => setToEdit({ ...toEdit, announcement_link: e.target.value })}
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