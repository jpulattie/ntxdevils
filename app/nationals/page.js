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

const [data, setData] = useState([]);

    let info_response;

    useEffect(() => {
        async function db_query() {
            let query = `select * from announcements WHERE announcement LIKE '%Nationals%' OR announcement_title LIKE '%Nationals%' OR announcement LIKE '%nationals%' OR announcement_title LIKE '%nationals%' order by id desc limit 15;`;

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

    let get_schedule_query = `select
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
    event.event_type = "Nationals" 
order by event.event_date, event.event_time ;`

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
                
                <h1 className="inline-block text-lg font-bold text-white bg-myrtleGreen justify-center rounded-xl px-3 py-2 mt-2"><strong>USAFL NATIONALS 2025</strong></h1>
                <div className="md:w-4/5 w-full mx-auto rounded-xl px-4">
                
            <div className="w-full flex justify-center rounded-2xl px-2 gap-x-2">
            <div className="md:w-4/5 text-md md:text-large justify-end rounded-xl px-2 pt-2">
                    {data && data.length > 0 ? (
                        data
                            .filter(item => item !== null && item !== undefined)
                            .map((item, index) => (
                                <div key={index}>
                                    <div className="block justify-center text-lg shadow-lg bg-white text-myrtleGreen border-2 border-myrtleGreen border border-opacity-20 rounded-xl mb-2 p-2">
                                        {item.announcement_title && item.announcement_title !== 'null' && (item.announcement.includes("nationals")||item.announcement.includes("Nationals")||item.announcement_title.includes("nationals")||item.announcement_title.includes("Nationals")) ?
                                            <h2 className="block mb-1 font-bold">{item.announcement_title} </h2>
                                            : <div> </div>}
                                        
                                        {item.announcement && item.announcement !== 'null' ?
                                            <div className= "block italic whitespace-pre-line text-sm">{item.announcement}</div>
                                            : <div> </div>}
                                        {item.announcement_link && item.announcement_link !== "null" && item.announcement_link !== null ?
                                        <div><a href={`${item.announcement_link}`} target="_blank"><p className="inline-block text-sm hover:bg-myrtleGreen hover:text-white text-blue-400 px-1 rounded-lg ">View Link</p></a></div>
                                        : null}

                                    </div>
                                </div>
                            ))
                    ) : (<div><div>Loading...</div></div>)}
                

            </div>
            </div>

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
                                                   
                                                    
                                                    {item.event_type && item.event_type === "Nationals"
                                                    ? <td colSpan={2} className="text-center  text-left p-1">
                                                        <strong>{item.event_type}</strong> {item.event_type && item.event_type !== item.event_name 
                                                                                            ? <>- {item.event_name}</>
                                                                                            : '' } 
                                                                                            {item.event_type && item.event_type === item.event_name 
                                                                                            ? ( item.teams ? <>(<i>{item.teams}</i>)</> : <>(<i>{item.team_name}</i>)</>)
                                                                                            : '' } 
                                                                                            </td> 
                                                        : ''
                                                    }
                                                    
                                                    {item.event_type && item.event_name.includes("Nationals")
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
                                                    
                                                   
                                                    <td className=" text-center">{new Date(item.event_date).toLocaleDateString('en-us', { month: 'short', day: 'numeric', timeZone: 'UTC'})}</td>
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