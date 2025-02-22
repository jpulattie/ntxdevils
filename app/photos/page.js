'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
//import AWS from 'aws-sdk';

export default function Photos() {
    const [teams, setTeams] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [teamChoice, setTeamChoice] = useState(null);
    const [eventChoice, setEventChoice] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [bucketName, setBucketName] = useState('');
    const [region, setRegion] = useState('');

    let query;
    let get_teams_query = `select team_name from team;`

    let get_photos_query = `select
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
    team on schedule.team_id = team.id;`

    let get_team_photos_query = `select
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
    team on schedule.team_id = team.id
where
    team.team_name = "${teamChoice}";`

    console.log('team choice', teamChoice);
    useEffect(() => {
        setTeamChoice(null);
    }, []);

    async function getPhotos() {
        console.log('PHOTOS CALLED')
        try {
            const response = await fetch('api/photos');
            const data = await response.json();
            setPhotos(data.Contents);
            setBucketName(data.bucketName);
            setRegion(data.region);
            setPhotos(data.photos);
            console.log('data from photos:', data);
        }
        catch (error) {
            console.error('Error getting photos:', error);
        }
    }

    async function get_schedule() {
        try {
            console.log('teamChoice = ', teamChoice);
            if (teamChoice !== null && teamChoice !== 'All') {

                query = get_team_photos_query;
            } else {
                console.log('initial loading of all schedules')
                query = get_photos_query;
                console.log("TEAMCHOICE:", teamChoice)
            };
            //console.log('query:', query)
            const response = await fetch('api/schedules/', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                console.log('error in response here')
                throw new Error("Error response not ok")
            }

            const result = await response.json();

            console.log('HERE')
            console.log('result.results:', result.results)
            setSchedule(result.results);
        } catch (error) {
            console.log('Problem with data: ', schedule)
            console.error('error:', error);
        }
    }

    useEffect(() => {
        console.log("useEffect for getPhotos running...");

        getPhotos();
    }, []);

    useEffect(() => {

        get_schedule();
    }, [teamChoice]);

    useEffect(() => {
        async function get_teams() {
            try {
                let query = get_teams_query;
                //console.log('query:', query)
                const response = await fetch('api/teams/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    console.log('error in response here')
                    throw new Error("Error response not ok")
                }

                const result = await response.json();

                console.log('result:', result)
                console.log('result.results:', result.results)
                setTeams([...result.results, { team_name: "All" }]);
            } catch (error) {
                console.log('Problem with data: ', teams)
                console.error('error:', error);
            }
        }
        get_teams()
    }, []);

    //console.log('teams2:', teams);
    //console.log('schedules2:', schedule);


    function render_teams() {
        return (
            <Listbox value={teamChoice} onChange={setTeamChoice} >
                <ListboxButton className="text-primroseYellow bg-myrtleGreen text-base px-4 py-2">Select Team</ListboxButton>
                <ListboxOptions anchor="bottom" text-primroseYellow bg-myrtleGreen text-base>
                    {teams.map((item) => (
                        <ListboxOption key={item.team_name} value={item.team_name} className="cursor-pointer data-[focus]:bg-roseRed text-primroseYellow bg-myrtleGreen text-base px-4 py-2">
                            {item.team_name}
                        </ListboxOption>
                    ))}
                </ListboxOptions>

            </Listbox>


        )
    };

    function render_photos() {
        if (!photos || photos.length === 0) {
            console.log('phtos:', photos);
            return <div><h1>Loading...</h1></div>
        } else {
            //// RUN THE IF THAN FOR NO TEAM CHOICE ON RENDER IN THE JSX?????????
            //  

            // 
            return (
                <div>
                    <h1>Photos</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {photos.map((item, index) => (
                            <div key={index} >
                                <img 
                                    src={`https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`}
                                    alt={item.key}
                                    className="w-full h-auto"
                                />

                            </div>
                        ))}

                    </div>
                </div>
            );
        };
    }



    return (
        <div>
            {render_teams()}
            {render_photos()}
        </div>

    )
}
