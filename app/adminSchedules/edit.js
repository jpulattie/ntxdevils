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
        team_id: '',
        team_name: '',
        id: '',
        event_name: '',
        event_type: '',
        event_date: '',
        event_time: '',
        event_description: '',
        event_address: '',
        event_city: '',
        event_state: '',
        event_zip: '',
        opponent: '',
        team_score: '',
        opponent_score: '',
        result: ''
    });
    const [index, setIndex] = useState(0);
    const [newPhoto, setNewPhoto] = useState(false);
    let info_response;
    let team_score;
    let opponent_score;
    let created_id;
    const SQLDate = (isoDate) => {
        return isoDate.split('T')[0];
    };

    let get_schedules_query = `select
    team.id as team_id,
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


    const router = useRouter();

    async function editEvent() {
        if (toEdit.team_score === '') {
            console.log('team score blank')
            team_score = null;
        } else if (toEdit.team_score !== '') {
            team_score = toEdit.team_score
        }
        if (toEdit.opponent_score === '') {
            console.log('opp score blank')

            opponent_score = null;
        } else if (toEdit.opponent_score !== '') {
            opponent_score = toEdit.opponent_score
        }
        let query = `update event set 
event_name = "${toEdit.event_name}", 
event_type = "${toEdit.event_type}", 
event_date = '${toEdit.event_date}', 
event_time = '${toEdit.event_time}',
event_description = "${toEdit.event_description}", 
event_address = "${toEdit.event_address}",
opponent = "${toEdit.opponent}",
team_score = ${team_score},
opponent_score = ${opponent_score},
result = "${toEdit.result}" where id = ${toEdit.id};`

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
            await response.json();

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
        query = get_schedules_query

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
            console.log('results:', result.results)
            console.log('current index', index)
            setData(result.results);
            //ßsetIndex(0);


            if (result.results.length > 0) {
                setToEdit({
                    team_id: result.results[index].team_id,
                    team_name: result.results[index].team_name,
                    id: result.results[index].id,
                    event_name: result.results[index].event_name,
                    event_type: result.results[index].event_type,
                    event_date: SQLDate(result.results[index].event_date),
                    event_time: result.results[index].event_time,
                    event_description: result.results[index].event_description,
                    event_address: result.results[index].event_address,
                    event_city: result.results[index].event_city,
                    event_state: result.results[index].event_state,
                    event_zip: result.results[index].event_zip,
                    opponent: result.results[index].opponent,
                    team_score: result.results[index].team_score,
                    opponent_score: result.results[index].opponent_score,
                    result: result.results[index].result,

                });


                console.log("Initial sponsors after update:", toEdit)
                setNewPhoto(false);
            } else {
                console.log('initial sponsors data', result.results);
            }

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }

    }


    useEffect(() => {
        let query = get_schedules_query;
        async function db_query() {
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
                console.log('result:', result)
                console.log('result.results[0]', result.results[index])
                setData(result.results);
                if (result.results.length > 0) {
                    setToEdit({
                        team_id: result.results[index].team_id,
                        team_name: result.results[index].team_name,
                        id: result.results[index].id,
                        event_name: result.results[index].event_name,
                        event_type: result.results[index].event_type,
                        event_date: SQLDate(result.results[index].event_date),
                        event_time: result.results[index].event_time,
                        event_description: result.results[index].event_description,
                        event_address: result.results[index].event_address,
                        event_city: result.results[index].event_city,
                        event_state: result.results[index].event_state,
                        event_zip: result.results[index].event_zip,
                        opponent: result.results[index].opponent,
                        team_score: result.results[index].team_score,
                        opponent_score: result.results[index].opponent_score,
                        result: result.results[index].result,
                    });

                    console.log("Initial sponsors:", toEdit)
                } else {
                    console.log('initial sponsor data', result.results);
                }
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching7')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);


    const editSelect = (selection) => {

        console.log("SELECTION'", selection);
        setToEdit({
            team_id: selection.team_id,
            team_name: selection.team_name,
            id: selection.id,
            event_name: selection.event_name,
            event_type: selection.event_type,
            event_date: SQLDate(selection.event_date),
            event_time: selection.event_time,
            event_description: selection.event_description,
            event_address: selection.event_address,
            event_city: selection.event_city,
            event_state: selection.event_state,
            event_zip: selection.event_zip,
            opponent: selection.opponent,
            team_score: selection.team_score,
            opponent_score: selection.opponent_score,
            result: selection.result,
        });
    }


    const addEdit = async (toEdit) => {
        window.alert(`Updating ${toEdit.event_name}`)
        await editEvent();

    }




    useEffect(() => {
        console.log('index changed', index);
    }, [index]);

    useEffect(() => {
        console.log('DATA UPDATED', data)
    }, [data]);

    useEffect(() => {
        console.log('toEdit updated', toEdit);
    }, [toEdit]);


    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white  shadow-2xl block px-2 py-2 pt-4 ssjustify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Edit Event</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Event to Edit</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={(e) => {
                            const selectedIndex = e.target.selectedIndex
                            console.log('INDEX CHOSEN', selectedIndex)
                            console.log('trying to find team id', selectedIndex.event_name)
                            const selectedItem = data.find(item => item.id.toString() === e.target.value);

                            setIndex(selectedIndex);
                            editSelect(selectedItem)
                        }}
                    >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => {
                                const selectFull = `${item.event_type}-${item.event_name} Team[${item.team_name}]`;
                                const selectDisplay = selectFull.length > 40 ? selectFull.slice(0,40) + "..." : selectFull;
                                return    (
                                    <option key={`${item.id}-${item.team_name}`} value={item.id} >{selectDisplay} </option>
                                )})) : null
                        };
                    </Select>
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Name</Label>
                    <Input

                        name="title"
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        placeholder="New event name..."
                        value={toEdit.event_name}
                        onChange={(e) => setToEdit({ ...toEdit, event_name: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Type</Label>
                    <Input
                        name="level"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="type of event"
                        value={toEdit.event_type}
                        onChange={(e) => setToEdit({ ...toEdit, event_type: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Address</Label>
                    <Input
                        name="address"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="event address..."
                        value={toEdit.event_address}
                        onChange={(e) => setToEdit({ ...toEdit, event_address: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event City</Label>
                    <Input
                        name="city"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="event city..."
                        value={toEdit.event_city}
                        onChange={(e) => setToEdit({ ...toAdd, event_city: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event State</Label>
                    <Input
                        name="state"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="event state..."
                        value={toEdit.event_state}
                        onChange={(e) => setToEdit({ ...toAdd, event_state: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Date</Label>
                    <Input
                        name="date"
                        type="date"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="date"
                        value={toEdit.event_date ? SQLDate(toEdit.event_date) : ''}
                        onChange={(e) => {
                            console.log('date check', SQLDate(e.target.value)),
                                setToEdit({ ...toEdit, event_date: SQLDate(e.target.value) })
                        }
                        }
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Time</Label>
                    <Input
                        name="time"
                        type="time"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="time"
                        value={toEdit.event_time || ''}
                        onChange={(e) => setToEdit({ ...toEdit, event_time: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Opponent</Label>
                    <Input
                        name="opponent"
                        type="text"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="leave blank if there is no opponent"
                        value={toEdit.opponent}
                        onChange={(e) => setToEdit({ ...toEdit, opponent: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Team Score</Label>
                    <input
                        name="team_score"
                        type="number"
                        //multiple  - for later use in photos, multiple allows for multiple file uploads, but doesn't apply here
                        //for multiple change e.target.files[0] to Awway.from(e.target.files)
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="Our score - leave blank if no scoreor '0' if no points were scored"
                        value={toEdit.team_score}
                        onChange={(e) => {
                            setToEdit({ ...toEdit, team_score: e.target.value });
                        }}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Opponent Score</Label>
                    <input
                        name="opponent_score"
                        type="number"
                        //multiple  - for later use in photos, multiple allows for multiple file uploads, but doesn't apply here
                        //for multiple change e.target.files[0] to Awway.from(e.target.files)
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="Opponent score - leave blank if no score or '0' if no points were scored"
                        value={toEdit.opponent_score}

                        onChange={(e) => {
                            setToEdit({ ...toEdit, opponent_score: e.target.value });
                        }}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Result</Label>
                    <input
                        name="result"
                        type="text"
                        //multiple  - for later use in photos, multiple allows for multiple file uploads, but doesn't apply here
                        //for multiple change e.target.files[0] to Awway.from(e.target.files)
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="example: 'W' - 'L'"
                        onChange={(e) => {
                            setToEdit({ ...toEdit, result: e.target.value });
                        }}
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