'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import { useTeam } from '../teamChoice'; 
import Navbar from "../Navbar";



export default function Roster() {
    const [teams, setTeams] = useState([]);
    const [roster, setRoster] = useState([]);
    let query;
    const { teamChoice, setTeamChoice } = useTeam(null);

    let get_roster_query = `select
    team.team_name,
    roster.player_name,
    roster.position,
    roster.year_playing,
    roster.bio,
    roster.picture_url
from
    roster
left outer join
    team
on
    roster.team_id = team.id
order by
    roster.player_name ASC;`

    let get_team_roster_query = `select
    team.team_name,
    roster.player_name,
    roster.position,
    roster.year_playing,
    roster.bio,
    roster.picture_url
from
    roster
left outer join
    team
on
    roster.team_id = team.id
where
    team.team_name = "${teamChoice}"
order by
    roster.player_name ASC;`

    async function get_roster() {
        try {
            console.log('teamChoice = ', teamChoice);
            if (teamChoice !== null && teamChoice !== 'All') {
                query = get_team_roster_query;
            } else { query = get_roster_query };
            console.log('query:', query)
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


            console.log('result.results:', result.results)
            setRoster(result.results);
        } catch (error) {
            console.log('Problem with data: ', roster)
            console.error('error:', error);
        }
    }
    

    useEffect(() => {
        get_roster()
    }, [teamChoice]);


    function render_roster() {
        return (
            <div>
                <h1><strong>Players</strong></h1>
                <table>

                    <tbody>
                        {roster && roster.length > 0 ? (
                            (() => {
                                let team = null; // Keep track of the current team
                                return roster
                                    .filter(item => item !== null && item !== undefined)
                                    .map((item, index) => {
                                        return (

                                            <tr key={`${item.player_name}-${index}`}>
                                                <td>{item.team_name}</td>
                                                <td>{item.player_name}</td>
                                                <td>{item.position}</td>
                                                <td>{item.year_playing}</td>
                                                <td>{item.bio}</td>
                                                <td>{item.picture_url}</td>
                                            </tr>

                                        );
                                    });
                            })()
                        ) : (
                            <tr>
                                <td colSpan="6">Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    };


    return (
        <div>
            <Navbar />
            {render_roster()}
        </div>

    )
}
