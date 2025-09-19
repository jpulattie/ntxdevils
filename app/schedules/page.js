'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useTeam } from '../teamChoice';
import { usePlayer } from '../playerChoice';

import Navbar from "../Navbar";

//example of searching google maps for 4502 pershing ave ft worth tx
//https://www.google.com/maps/search/?api=1&query=4502+Pershing+Ave+Fort+Worth+TX
//need to conver address to a string where spaces are + signs, input into that search, and display it on the page
//example commented out at bottom of page

export default function Schedule() {
    const [teams, setTeams] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const { teamChoice, setTeamChoice } = useTeam(null);
    const {player, setPlayer} = usePlayer();
    
    const [ loading, setLoading ] = useState();
    let query;
    let get_teams_query = `select team_name from team;`

    let get_schedule_query = `select
    event.id,
    event.event_name,
    event.event_date,
    event.event_type,
    event.event_time,
    event.event_description,
    event.event_address,
    event.event_city,
    event.event_state,
    event.event_zip,
    event.opponent,
    event.team_score,
    event.opponent_score,
    event.result,
    GROUP_CONCAT(DISTINCT team.team_name ORDER BY team.team_name SEPARATOR ', ') AS teams
from
    event left outer join
    schedule
        on event.id = schedule.event_id left outer join
    team on schedule.team_id = team.id
group by
    event.id,
    event.event_name,
    event.event_date,
    event.event_type,
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
order by
    event.event_date;`

    let get_team_schedule_query = `select
    team.team_name,
    event.event_name,
    event.event_type,
    event.event_date,
    event.event_time,
    event.event_city,
    event.event_state,
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
                console.log('teamChoice is..', teamChoice)
                query = get_team_schedule_query;
            } else {

                // need to display ALL without duplicates by updating the sql query here

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
                
                <h1 className="inline-block text-lg font-bold text-white bg-myrtleGreen justify-center rounded-xl px-3 py-2 mt-2 mb-2"><strong>Schedule - </strong>{teamChoice ? teamChoice: 'All'} </h1>
                <div className="md:w-4/5 w-full mx-auto rounded-xl px-4">

                    <table className="w-full text-left px-2 py-2 gap-x-2 overflow-hidden bg-white rounded-2xl">

                        <tbody className="w-full md:w-4/5 justify-end rounded-xl">
                            <tr className="w-full bg-myrtleGreen text-white rounded-xl p-4">
                                <th colSpan={2} className=" text-center">Event</th>
                                <th className=" text-center">Date</th>
                                <th className=" text-center">Score</th>

                            </tr>
                            <tr className="w-full bg-myrtleGreen text-white bg-opacity-60 rounded-xl  border-myrtleGreen p-4">
                                <th colSpan={2} className=" text-center">Map - Location</th>

                                <th className=" text-center">Time</th>
                                <th className=" text-center">Result</th>
                            </tr>
                            {schedule && schedule.length > 0 ? (
                                (() => {
                                    let team = null;
                                    return schedule
                                        .filter(item => item !== null && item !== undefined)
                                        .map((item, index) => {
                                            return (
                                                <>
                                                <tr key={`${item.index}-${index}`} className="pt-2 pb-2 text-left md:text-lg  bg-white text-myrtleGreen rounded-xl border-t-2 border-opacity-20 border-myrtleGreen p-2">
                                                   
                                                    {item.event_type && item.event_type === "Game" 
                                                    ? <td colSpan={2} className="text-center  text-left p-1">
                                                        <strong>{item.event_type}</strong> {item.event_type && item.event_type !== item.event_name 
                                                                                            ? <>- {item.event_name} (<i>{item.teams ? item.teams : item.team_name}</i>)</>
                                                                                            : '' } 
                                                                                            {item.event_type && item.event_type === item.event_name 
                                                                                            ? ( item.teams ? <>(<i>{item.teams}</i>)</> : <>(<i>{item.team_name}</i>)</>)
                                                                                            : '' } 
                                                                                            </td> 
                                                        : ''
                                                    }
                                                    {item.event_type && item.event_type === "Social" 
                                                    ? <td colSpan={2} className="text-center  text-left p-1">
                                                        <strong>{item.event_type}</strong> {item.event_type ? '-': ''} {item.event_name}</td> 
                                                        : ''
                                                    }
                                                    {item.event_type && item.event_type === "Tournament" 
                                                    ? <td colSpan={2} className="text-center  text-left p-1">
                                                        <strong>{item.event_type}</strong> {item.event_type && item.event_type !== item.event_name 
                                                                                            ? <>- {item.event_name} (<i>{item.teams ? item.teams : item.team_name}</i>)</>
                                                                                            : '' } 
                                                                                            {item.event_type && item.event_type === item.event_name 
                                                                                            ? ( item.teams ? <>(<i>{item.teams}</i>)</> : <>(<i>{item.team_name}</i>)</>)
                                                                                            : '' } 
                                                                                            </td> 
                                                        : ''
                                                    }
                                                    {item.event_type && item.event_type === "Fundraiser" 
                                                    ? <td colSpan={2} className="text-center  text-left p-1">
                                                        <strong>{item.event_type}</strong> {item.event_type ? '-': ''} {item.event_name}</td> 
                                                        : ''
                                                    }
                                                    {item.event_type && item.event_type === "Metro" 
                                                    ? <td colSpan={2} className="text-center  text-left p-1">
                                                        <strong>{item.event_type}</strong> {item.event_type && item.event_type !== item.event_name 
                                                                                            ? <>- {item.event_name} (<i>{item.teams ? item.teams : item.team_name}</i>)</>
                                                                                            : '' } 
                                                                                            {item.event_type && item.event_type === item.event_name 
                                                                                            ? ( item.teams ? <>(<i>{item.teams}</i>)</> : <>(<i>{item.team_name}</i>)</>)
                                                                                            : '' } 
                                                                                            </td> 
                                                        : ''
                                                    }
                                                    {item.event_type && (item.event_type === "Other" || item.event_type === null || item.event_type === 'null')
                                                    ? <td colSpan={2} className="text-center  text-left p-1">
                                                        {item.event_type} {item.event_type && item.event_type !== item.event_name ? '-': ''} {item.event_type && item.event_type !== item.event_name ? item.event_name : ''}</td> 
                                                        : ''
                                                    }
                                                   
                                                    <td className=" text-center">{new Date(item.event_date).toLocaleDateString('en-us', { month: 'short', day: 'numeric'})}</td>
                                                    {item.opponent && item.team_score !== null ? <td className=" text-center whitespace-nowrap">{item.team_score}-{item.opponent_score}</td> : <td className=" text-center"></td>}
                                                    </tr>
                                                    <tr key={`${item.index}-${index}-2`} className="pt-2 pb-1 text-left md:text-lg  rounded-xl border-b-2 border-opacity-20 border-myrtleGreen">
                                                    <td colSpan={2} className=" text-center hover:text-roseRed focus:text-roseRed p-1"> {item.event_address ?
                                                        <a
                                                            href={`https://www.google.com/maps?q=${encodeURIComponent(item.event_address)}`}
                                                            target="_blank"
                                                            className="hover:text-roseRed focus:text-roseRed"
                                                            > View Map </a>
                                                         : <p></p>}{item.event_city ? <span> {item.event_city && item.event_address ? '-' : ''} {item.event_city}, {item.event_state}</span> : <span></span> }
                                                      </td>
                                                    {(item.event_time === "00:00:00") ? <td className=" text-center"></td> : <td className="w-fit text-center">{new Date(`1970-01-01T${item.event_time}`).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}</td>}
                                                    {item.opponent && item.result !== null && item.result !== 'null'? <td className=" text-center">{item.result}</td> : <td className=" text-center"></td>}                                                    
                                                </tr>
                                                </>
                                            );
                                        });
                                })()
                            ) : (
                                <tr className="pt-2 pb-2 text-center md:text-lg border-black border  rounded-xl">
                                <td className=" pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen ">{loading}</td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>)
        
    };



    return (
        <div>
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