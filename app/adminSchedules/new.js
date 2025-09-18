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
import { Lexend_Tera } from 'next/font/google';


export default function New() {
    const [data, setData] = useState([]);
    const [teams, setTeams] = useState([]);
    const [all, setAll] = useState(false);
    const [toAdd, setToAdd] = useState({
        team_id: '',
        team_name: '',
        event_name: '',
        event_type: '',
        event_date: null,
        event_time: null,
        event_description: '',
        event_address: '',
        event_city: '',
        event_state: '',
        event_zip: '',
        opponent: '',
        team_score: null,
        opponent_score: null,
        result: ''
    });
    const [isAdded, setIsAdded] = useState(false);
    const router = useRouter();
    let info_response;
    let team_score;
    let opponent_score;
    let created_id;
    let event_date;
    let event_time;
    let team_ids = [];
    let intersection_id;
    let query;

    useEffect(() => {
        let query = "select team_name, id from team;"
        const getTeams = async () => {
            try {
                const response = await fetch('api/teams/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query })
                });
                const data = await response.json();
                console.log('teams data', data.results);
                console.log('attempting to access id', data.results?.[0]?.id);
                setTeams(data.results);
                //setToAdd({ ...toAdd, team_id: data.results?.[0]?.id })
            } catch (error) {
                console.error('error loading teams', error)
            }
        };
        getTeams();

    }, []);

    async function insertIntersection(team) {
        console.log('team id param', team)
        console.log("team id type", typeof (team))
        query = `insert into schedule (team_id, event_id) values ("${team}", ${intersection_id}); `

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

        } catch (error) {
            console.error('error', error);
        }
    }

    async function addEvent() {
        console.log('team score', toAdd.team_score);
        console.log('opp score', toAdd.opponent_score);
        if (toAdd.team_score === '') {
            console.log('team score blank')
            team_score = null;
        } else if (toAdd.team_score !== '') {
            team_score = toAdd.team_score
        }
        if (toAdd.opponent_score === '') {
            console.log('opp score blank')

            opponent_score = null;
        } else if (toAdd.opponent_score !== '') {
            opponent_score = toAdd.opponent_score
        }
        if (toAdd.team_id === '') {
            console.log(toAdd.team_id)
            window.confirm(`Please choose a team or teams for this event`)
        }

        if (toAdd.event_time === '') {
            console.log('event time blank')

            event_time = null;
        } else if (toAdd.event_time !== '') {
            event_time = `'${toAdd.event_time}'`
        }


        let query = `insert into event (event_name, event_type, event_date, event_time, event_description, event_address, event_city, event_state, event_zip, opponent, team_score, opponent_score, result) values ("${toAdd.event_name}", "${toAdd.event_type}", '${toAdd.event_date}', ${event_time}, "${toAdd.event_description}", "${toAdd.event_address}", "${toAdd.event_city}", "${toAdd.event_state}", "${toAdd.event_zip}", "${toAdd.opponent}", ${team_score}, ${opponent_score}, "${toAdd.result}"); `

        console.log("query on insert page.js:", query)
        try {
            console.log('sending API request to route...', query)//, query)
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
            console.log('resulty:', result)

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching in addSponsor')
            console.log('data:', data)
        }

        query = `select id from event where event_name = "${toAdd.event_name}" AND event_date = '${toAdd.event_date}' AND event_time=${event_time} AND event_type = "${toAdd.event_type}"  AND event_description= "${toAdd.event_description}" AND event_address= "${toAdd.event_address}" AND opponent ="${toAdd.opponent}"; `

        console.log("query:", query)
        //console.log('sponsor name2', setToAdd.sponsor_name);
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
            console.log('resulty:', result.results)
            created_id = result.results[0];

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching in addSponsor')
            console.log('data:', data)
        }

        intersection_id = created_id.id
        console.log('intersection id', intersection_id);

        /// INSERT FUNCTIONALITY TO INSERT THE EVENT INTO MULTIPLE TEAMS
        // at this point the event is created
        // probably need a call to get back all team id's - select id from team;
        // take that, parse it into a list and iterate through sending the insert call for each team_id below

        //call to get team id's
        console.log('team id check', toAdd.team_id)
        if (toAdd.team_id === '') {
            window.confirm(`Please choose a team or teams for this event`)
        } else {
            if (toAdd.team_id === 'All') {

                console.log("team Id all!!")
                query = `select id from team;`
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
                    team_ids = result.results
                    console.log('team ids', team_ids)
                    console.log('team ids length', team_ids.length)

                } catch (error) {
                    console.error('error', error);
                }
                console.log('team ids length outside', team_ids.length)
                for (let i = 0; i < team_ids.length; i++) {
                    console.log('team_id = ', team_ids[i].id)
                    insertIntersection(team_ids[i].id)
                }

            } else {
                insertIntersection(toAdd.team_id)
            }
            /*
            query = `insert into schedule (team_id, event_id) values ("${toAdd.team_id}", ${intersection_id}); `
    
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
    
            } catch (error) {
                console.error('error', error);
            }
            */
            setIsAdded(true);
            setToAdd({
                team_id: '',
                team_name: '',
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
        }
    }

    async function addNew() {
        console.log(toAdd)
        if (toAdd.event_date !== null) {
            if (window.confirm(`Are you sure you wish to add...
                Name:${toAdd.event_name} 
                Type:${toAdd.event_type} 
                Date:${toAdd.event_date}
                Time:${toAdd.event_time}
                Description: ${toAdd.event_description}`)) {


                await addEvent();

            }
            else { console.log("canceled") }
        } else {
            alert("Please choose a Date")
        }
    }


    useEffect(() => {
        if (isAdded) {
            setIsAdded(false);
        }
    }, [isAdded])

    useEffect(()=> {
        console.log(setToAdd.team_id)
    }, [setToAdd])

    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white pt-4 shadow-2xl block px-2 py-2 justify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">New Event</Legend>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Team</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={(e) => {
                            setToAdd({ ...toAdd, team_id: e.target.value })
                            console.log("chosen team to add...", e.target.value)
                        }}

                    >
                        <option>Select Team</option>
                        <option value='All' >All</option>
                        {teams && teams.length > 0 ? (
                            teams
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id} value={item.id}>{item.team_name}</option>
                                ))) : null
                        };
                    </Select>
                </Field>

                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Name</Label>
                    <Input

                        name="title"
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        placeholder="New event name..."
                        value={toAdd.event_name}
                        onChange={(e) => setToAdd({ ...toAdd, event_name: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Type</Label>
                    <Input
                        name="level"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="type of event"
                        value={toAdd.event_type}
                        onChange={(e) => setToAdd({ ...toAdd, event_type: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Address</Label>
                    <Input
                        name="address"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="event address..."
                        value={toAdd.event_address}
                        onChange={(e) => setToAdd({ ...toAdd, event_address: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event City</Label>
                    <Input
                        name="city"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="event city..."
                        value={toAdd.event_city}
                        onChange={(e) => setToAdd({ ...toAdd, event_city: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event State</Label>
                    <Input
                        name="state"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="event state..."
                        value={toAdd.event_state}
                        onChange={(e) => setToAdd({ ...toAdd, event_state: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Date</Label>
                    <Input
                        name="date"
                        type="date"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="date"
                        required
                        value={toAdd.event_date}
                        onChange={(e) => setToAdd({ ...toAdd, event_date: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Event Time</Label>
                    <Input
                        name="time"
                        type="time"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="time"
                        value={toAdd.event_time || ''}
                        onChange={(e) => setToAdd({ ...toAdd, event_time: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Opponent</Label>
                    <Input
                        name="opponent"
                        type="text"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="leave blank if there is no opponent"
                        value={toAdd.opponent}
                        onChange={(e) => setToAdd({ ...toAdd, opponent: e.target.value })}
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
                        onChange={(e) => {
                            setToAdd({ ...toAdd, team_score: e.target.value });
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
                        onChange={(e) => {
                            setToAdd({ ...toAdd, opponent_score: e.target.value });
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
                            setToAdd({ ...toAdd, result: e.target.value });
                        }}
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