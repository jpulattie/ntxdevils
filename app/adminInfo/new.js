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
        info_title: '',
        info_description: '',
        info_link: ''
    });
    const [isAdded, setIsAdded ] = useState(false);


    let info_response;


    async function addInfo() {
        let api_request = `insert into info (program_id, info_title, info_description, info_link) values (1, "${toAdd.info_title}", "${toAdd.info_description}", "${toAdd.info_link}"); `
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
            setIsAdded(true);
            setToAdd({ info_title: '', info_description: '', info_link: '' }); 

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
    }

    const addNew = (toAdd) => {
        
        addInfo();
    }

    useEffect(() => {
            if (isAdded){
                setIsAdded(false);
            }
        }, [isAdded])

    return (
        <div className="flex justify-center">
            
            <Fieldset className="w-4/5 flex-basis:80  bg-white pt-4 shadow-2xl block px-2 py-2 justify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">New Info</Legend>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Info Title</Label>
                    <Input 
                        
                        name="title"
                        className="border border-myrtleGreen px-3 py-1 border-1" 
                        placeholder="New Title- ex 'Location' or 'Rules'"
                        value={toAdd.info_title}
                        onChange={(e) => setToAdd({...toAdd, info_title: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Info Description</Label>
                    <Textarea 
                        name="announcement" 
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="New Info..."
                        value={toAdd.info_description}
                        onChange={(e) => setToAdd({...toAdd, info_description: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Info Link</Label>
                    <Textarea 
                        name="announcement" 
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="New Link..."
                        value={toAdd.info_link}
                        onChange={(e) => setToAdd({...toAdd, info_link: e.target.value})}
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