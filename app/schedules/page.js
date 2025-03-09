'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useTeam } from '../teamChoice';
import Navbar from "../Navbar";

//example of searching google maps for 4502 pershing ave ft worth tx
//https://www.google.com/maps/search/?api=1&query=4502+Pershing+Ave+Fort+Worth+TX
//need to conver address to a string where spaces are + signs, input into that search, and display it on the page
//example commented out at bottom of page

export default function Schedule() {
    const [teams, setTeams] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const { teamChoice, setTeamChoice } = useTeam(null);
    const [ loading, setLoading ] = useState();
    let query;
    let get_teams_query = `select team_name from team;`

    let get_schedule_query = `select
    team.team_name,
    event.event_name,
    event.event_type,
    event.event_date,
    event.event_time,
    event.event_description,
    event.event_address,
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

    let get_team_schedule_query = `select
    team.team_name,
    event.event_name,
    event.event_type,
    event.event_date,
    event.event_time,
    event.event_description,
    event.event_address,
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
    

    useEffect(()=> {
        if (teamChoice) {
            setLoading(false);
        }
    }, [teamChoice]);

    async function get_schedule() {
        try {
            console.log('teamChoice = ', teamChoice);
            if (teamChoice !== null && teamChoice !== 'All') {

                query = get_team_schedule_query;
            } else {
                console.log('initial loading of all schedules')
                query = get_schedule_query;
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

    useEffect(()=> {
        if (schedule.length === 0) {
            setLoading("No events");
        } 
    }, [schedule]);
    
    useEffect(() => {
        setLoading("Loading");
        get_schedule();
    }, [teamChoice]);

    function render_schedules() {
        //// RUN THE IF THAN FOR NO TEAM CHOICE ON RENDER IN THE JSX?????????

        return (
            
            <div className="rounded rounded-xl">
                
                <h1 className="inline-block text-lg font-bold text-white bg-myrtleGreen justify-center rounded-xl px-3 py-2 mt-2 mb-2"><strong>Schedule - </strong>{teamChoice} </h1>
                <div className="w-4/5 mx-auto rounded-xl">

                    <table className="w-full text-left rounded-2xl px-2 py-2 gap-x-2 overflow-hidden">

                        <tbody className="w-4/5 justify-end rounded-xl">
                            <tr className="w-full bg-myrtleGreen text-white rounded-xl">
                                <th className="w-[10%] pl-2 pr-2 pt-2 pb-2">Type</th>
                                <th className="w-[15%] text-center"></th>
                                <th className="w-[15%] text-center">Date</th>
                                <th className="w-[10%] text-center">Time</th>
                                <th className="w-[20%] text-center">Description</th>
                                <th className="w-[10%] text-center">Address</th>
                                <th className="w-[10%] text-center">Score</th>
                                <th className="w-[10%] text-center">Result</th>
                            </tr>
                            {schedule && schedule.length > 0 ? (
                                (() => {
                                    let team = null;
                                    return schedule
                                        .filter(item => item !== null && item !== undefined)
                                        .map((item, index) => {
                                            return (

                                                <tr key={`${item.index}-${index}`} className="pt-2 pb-2 text-left text-lg shadow-lg bg-white text-myrtleGreen border-2 border-myrtleGreen border border-opacity-20 rounded-xl">
                                                    <td className="w-[10%] pl-2 pt-2 pb-2">{item.event_type}</td>
                                                    {!item.opponent ? <td className="w-[15%] text-left">{item.event_name}</td> : <td className="w-[15%] text-left">{item.team_name} vs. {item.opponent}</td>}
                                                    <td className="w-[15%] text-center">{new Date(item.event_date).toLocaleDateString('en-us', { month: 'long', day: 'numeric'})}</td>
                                                    <td className="w-[10%] text-center">{new Date(`1970-01-01T${item.event_time}`).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}</td>
                                                    {item.event_description ? <td className="w-[20%] text-center">{item.event_description}</td> : <td className="w-[20%]"></td> }
                                                    <td className="w-[10%] text-center"> {item.event_address ?
                                                        <a
                                                            href={`https://www.google.com/maps?q=${encodeURIComponent(item.event_address)}`}
                                                            target="_blank"
                                                            className="hover:text-roseRed"
                                                            > View Map </a>

                                                         : <td>no address</td>}
                                                    </td>
                                                    {item.opponent && item.team_score !== null ? <td className="w-[10%] text-center">{item.team_score} - {item.opponent_score}</td> : <td className="w-[10%] text-center">?-?</td>}
                                                    {item.opponent && item.result !== null && item.result !== 'null'? <td className="w-[10%] text-center">{item.result}</td> : <td className="w-[10%] text-center">No result</td>}                                                    
                                                </tr>

                                            );
                                        });
                                })()
                            ) : (
                                <tr className="pt-2 pb-2 text-center text-lg shadow-lg border-myrtleGreen border border-opacity-20 rounded-xl">
                                <td className="w-[10%] pt-2 pb-2 text-center text-lg bg-white text-myrtleGreen ">{loading}</td>
                                <td className="pt-2 pb-2 text-center text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center text-lg bg-white text-myrtleGreen "></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>)
        
    };



    return (
        <div>
            <Navbar />

            {render_schedules()}
        </div>

    )
}
/*
<iframe
  width="600"
  height="450"
  style="border:0"
  loading="lazy"
  allowfullscreen
  referrerpolicy="no-referrer-when-downgrade"
  src="https://www.google.com/maps?q=4502+Pershing+Ave+Fort+Worth+TX&output=embed">
</iframe>
  */