'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
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
        team_name: '',
    });
    const [index, setIndex] = useState(0);
    const [newPhoto, setNewPhoto] = useState(false);
    let info_response;

   
    const router = useRouter();

    async function editTeam() {
        
        let query = `update team set team_name = "${toEdit.team_name}" where id = ${toEdit.id};`

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
            await response.json();

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error edit team 1')
            console.log('data:', data)
        }
        query = 'select * from team;';

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
            console.log('results:', result.results)
            console.log('current index', index)
            setData(result.results);
            //ßsetIndex(0);
            
            
            if (result.results.length > 0) {
                setToEdit({
                    id: result.results[index].id,
                    team_name: result.results[index].team_name,
                });
                console.log("Initial teams after update:", toEdit)
                setNewPhoto(false);
            } else {
                console.log('initial teams data', result.results);
            }

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching edit teams2')
            console.log('data:', data)
        }

    }


    useEffect(() => {
        let query = 'select * from team;';
        async function db_query() {
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
                console.log('result:', result)
                console.log('result.results[0]', result.results[index])
                setData(result.results);
                if (result.results.length > 0) {
                    setToEdit({
                        id: result.results[index].id,
                        team_name: result.results[index].team_name,
                        
                    });

                    console.log("Initial teams:", toEdit)
                } else {
                    console.log('initial teams restuls', result.results);
                }
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching edit team 3?')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);


    const editSelect = (event) => {
        const selection = JSON.parse(event.target.value);
        setToEdit({
            id: selection.id,
            team_name: selection.team_name,
            
        });
    }


    const addEdit = async (toEdit) => {
        await editTeam();

    }

    

    useEffect(()=> {
        console.log('index changed', index);
    },[index]);

    useEffect(()=> {
        console.log('DATA UPDATED', data)
    }, [data]);

    useEffect(() => {
        console.log('toEdit updated', toEdit);
    }, [toEdit]);


    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white  shadow-2xl block px-2 py-2 pt-4 ssjustify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Edit Team</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Team to Edit</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={(e) => {
                            const selectedIndex = e.target.selectedIndex
                            console.log('INDEX CHOSEN', selectedIndex)
                            setIndex(selectedIndex);
                            editSelect(e)
                        }}
                    >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id}  value={JSON.stringify(item)}>{item.team_name}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Team Name</Label>
                    <Input
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        name="title"
                        value={toEdit.team_name !== 'null' ? toEdit.team_name : ' '}
                        onChange={(e) => setToEdit({ ...toEdit, team_name: e.target.value })}
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