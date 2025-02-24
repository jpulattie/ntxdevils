'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useTeam } from '../teamChoice'; 


export default function Schedule() {
    const [teams, setTeams] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const { teamChoice, setTeamChoice } = useTeam(null);
    let query;
    let get_teams_query = `select team_name from team;`

    let get_schedule_query = `select
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

    let get_team_schedule_query = `select
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

    useEffect(() => {

        get_schedule();
    }, [teamChoice]);

    function render_schedules() {
        //// RUN THE IF THAN FOR NO TEAM CHOICE ON RENDER IN THE JSX?????????

        return (
            <div>
                <h1><strong>Schedules</strong></h1>
                <table>

                    <tbody>
                        {schedule && schedule.length > 0 ? (
                            (() => {
                                let team = null;
                                return schedule
                                    .filter(item => item !== null && item !== undefined)
                                    .map((item, index) => {
                                        return (

                                            <tr key={`${item.player_name}-${index}`}>
                                                <td>{item.event_name}</td>
                                                <td>{item.event_type}</td>
                                                <td>{item.event_date}</td>
                                                <td>{item.event_time}</td>
                                                <td>{item.event_description}</td>
                                                <td>{item.event_address}, {item.event_city} ,{item.event_state}, {item.event_zip}</td>
                                                <td>{item.opponent}</td>
                                                <td>{item.team_score}</td>
                                                <td>{item.opponent_score}</td>
                                                <td>{item.result}</td>
                                            </tr>

                                        );
                                    });
                            })()
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    {teamChoice !== null ? "No events to display" : 'Loading...'}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    };



    return (
        <div>
            {render_schedules()}
        </div>

    )
}
