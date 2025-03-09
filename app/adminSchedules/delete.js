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
    let get_schedules_query = `select
    team.team_name,
    event.id,
    event.event_name,
    event.event_type,
    event.event_date,
    event.event_time,
    event.event_description,
    event.event_address,
    event.event_city,
    event.event_state,
    event.event_zip,
    event.opponent,
    event.team_score,
    event.opponent_score,
    event.result
from
    event
left outer join
    schedule on event.id = schedule.event_id
left outer join
    team on schedule.team_id = team.id;`;


    useEffect(() => {
        async function db_query() {
            let query = get_schedules_query

            try {
                console.log('sending API request to route')//, query)
                const response = await fetch('api/schedules', {
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
                    console.log("Initial sponsors:", toDelete)
                } else {
                    console.log('initial sponsors data', result.results);
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

    async function deleteEvent(id) {
        let query = `delete from event where id = "${id}";`
        try {
            console.log('sending API request to route')//, query)
            const response = await fetch('api/sponsor', {
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
            

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
        query = `delete from schedule where event_id = "${id}";`
        try {
            console.log('sending API request to route')//, query)
            const response = await fetch('api/sponsor', {
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
            

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }


        
        query = get_schedules_query;

        try {
            console.log('sending API request to route')//, query)
            const response = await fetch('api/sponsor', {
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
                console.log("Initial sponsor:", toDelete)
            } else {
                console.log('initial sponsor data', result.results);
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
                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Delete Event</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Event to Delete</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={deleteSelect}
                        
                    >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id} value={item.id}>Team: {item.team_name} || Event: {item.event_name} || Type: {item.event_type} || id: {item.id}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field className="pt-4 pb-4">
                    <button
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"

                        onClick={() => {
                            deleteEvent(toDelete);
                        }}
                    >DELETE</button>
                </Field>
            </Fieldset>
        </div>
    )
}