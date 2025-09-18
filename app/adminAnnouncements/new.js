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


export default function New() {
    const [data, setData] = useState([]);
    const [toAdd, setToAdd] = useState({
        title: '',
        announcement: '',
        announcement_link: ''
    });
    const [isAdded, setIsAdded]= useState(false);

    let info_response;

    useEffect(() => {
        async function db_query() {
            let query = 'select * from announcements order by id desc limit 10;';
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
                setData(result.results);
                //console.log('data:', data)
                //console.log('result:', result)
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching2')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);

    async function addAnnouncement() {
        let query = `insert into announcements (program_id, announcement_title, announcement, announcement_link) values (1, "${toAdd.title}", "${toAdd.announcement}", "${toAdd.announcement_link}"); `
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
            setIsAdded(true);
            setToAdd({ title: '', announcement: '', announcement_link: '' }); 


        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
    }

    const addNew = (toAdd) => {
        
        addAnnouncement();

    }

    useEffect(() => {
        if (isAdded){
            setIsAdded(false);
        }
    }, [isAdded])

    return (
        <div className="flex justify-center">
            
            <Fieldset className="w-4/5 flex-basis:80  bg-white pt-4 shadow-2xl block px-2 py-2 justify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">New Announcement</Legend>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Announcement Title</Label>
                    <Input 
                        
                        name="title"
                        className="border border-myrtleGreen px-3 py-1 border-1" 
                        placeholder="New Title- ex 'practice' or 'game'"
                        value={toAdd.title}
                        onChange={(e) => setToAdd({...toAdd, title: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Announcement</Label>
                    <Textarea 
                        name="announcement" 
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="New Announcement..."
                        value={toAdd.announcement}
                        onChange={(e) => setToAdd({...toAdd, announcement: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Announcement Link</Label>
                    <Textarea 
                        name="announcement link" 
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="New Announcement..."
                        value={toAdd.announcement_link}
                        onChange={(e) => setToAdd({...toAdd, announcement_link: e.target.value})}
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