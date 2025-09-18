'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import { usePlayer } from '../playerChoice';
import { useTeam } from '../teamChoice';

import Navbar from "../Navbar";
import { useRouter } from 'next/navigation';




export default function Roster() {
    const [teams, setTeams] = useState([]);
    const [roster, setRoster] = useState([]);
    let query;
    const { teamChoice, setTeamChoice } = useTeam(null);
    const { player, setPlayer } = usePlayer(null);

    const [ loading, setLoading ] = useState();
    const router = useRouter();


    let get_roster_query = `select
    team.team_name,
    roster.player_name,
    roster.position,
    roster.year_playing,
    roster.bio,
    roster.picture,
    roster.sponsor_link
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
    roster.picture,
    roster.sponsor_link

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

    useEffect(()=> {
            if (roster.length === 0) {
                setLoading("No Players to Display");
            } 
        }, [roster]);


    useEffect(() => {
        setLoading("Loading...");
        get_roster()
    }, [teamChoice]);


    function render_roster() {
        return (
            
            <div className="rounded rounded-xl">
                <h1 className="inline-block font-bold text-white text-lg font-bold bg-myrtleGreen justify-center rounded-xl px-3 py-2 mt-2 mb-2"><strong>Roster - </strong>{teamChoice ? teamChoice : 'All'}</h1>
                <div className="md:w-4/5 w-full mx-auto rounded-xl px-4">
                <table className="table-fixed w-full text-left rounded-2xl px-2 py-2 gap-x-2 overflow-hidden">
                    <tbody className="md:w-4/5 w-full justify-end rounded-xl">
                        <tr className="w-full bg-myrtleGreen text-white rounded-xl"> 
                            <th className="w-[50%] pl-2 pr-2 pt-2 pb-2 text-center">Name</th>
                            <th className="w-[50%] text-center">Picture</th>

                        </tr>
                        {roster && roster.length > 0 ? (
                            (() => {
                                let team = null; // Keep track of the current team
                                return roster
                                    .filter(item => item !== null && item !== undefined)
                                    .map((item, index) => {
                                        return (
                                            
                                            <tr key={`${item.player_name}-${index}`} className="pt-2 pb-2 text-center md:text-lg shadow-lg bg-white text-myrtleGreen border-2 border-myrtleGreen border border-opacity-20 rounded-xl">
                                                <td 
                                                    className="w-[25%] pl-2 pr-2 pt-2 pb-2"
                                                    onClick={() => {
                                                        setPlayer(item);
                                                        router.push('/player');
                                                    }}
                                                    ><span className="hover:p-2 hover:bg-myrtleGreen hover:text-white rounded-xl hover:cursor-default">{item.player_name}</span></td>
                                                
                                                {item.picture && item.picture !== 'null' && item.picture !== 'NULL' ? (
                                                <td className="text-center">
                                                    <a className=" inline-block hover:bg-myrtleGreen hover:text-white hover:rounded-lg hover:cursor-default" 
                                                        onClick={() => {
                                                                    setPlayer(item);
                                                                    router.push('/player');
                                                                }}
                                                    >
                                                        <div className="flex justify-center items-center p-2 ">
                                                            <img
                                                                src={item.picture}
                                                                alt={`${item.player_name}`}
                                                                className="max-w-[100px] max-h-[100px] w-auto h-auto block hover:rounded-lg" 
                                                                
                                                            />
                                                        </div>
                                                        </a> 
                                                </td>) :  <td className="w-[20%]"></td>}
                                            </tr>

                                        );
                                    });
                            })()
                        ) : (
                            <tr className="pt-2 pb-2 text-center md:text-lg shadow-lg border-myrtleGreen border border-opacity-20 rounded-xl">
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen ">{loading}</td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                                <td className="pt-2 pb-2 text-center md:text-lg bg-white text-myrtleGreen "></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        )
    };


    return (
        <div>
            {render_roster()}
        </div>

    )
}
