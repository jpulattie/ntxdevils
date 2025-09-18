'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
//import { useTeam } from '../teamChoice';
import { usePlayer } from '../playerChoice';
import { useRouter } from 'next/navigation';
import Navbar from "../Navbar";

//example of searching google maps for 4502 pershing ave ft worth tx
//https://www.google.com/maps/search/?api=1&query=4502+Pershing+Ave+Fort+Worth+TX
//need to conver address to a string where spaces are + signs, input into that search, and display it on the page
//example commented out at bottom of page

export default function Player() {
    const [teams, setTeams] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const { player, setPlayer } = usePlayer();
    //const { teamChoice, setTeamChoice } = useTeam(null);
    const [loading, setLoading] = useState();
    let query;
    let get_teams_query = `select team_name from team;`
    const router = useRouter();

    console.log('player', player);


    useEffect(() => {
        if (!player) {
            router.replace('/teams');
        }
    }, [player]);

    if (!player) {
        return <p>Redirecting to team selection...</p>;
    }

    function render_player() {
        //// RUN THE IF THAN FOR NO TEAM CHOICE ON RENDER IN THE JSX?????????

        return (

            <div className="rounded rounded-xl">
                {player.player_name ? <h1 className="inline-block text-lg font-bold text-white bg-myrtleGreen  justify-center rounded-xl px-3 py-2 mt-2 mb-2"><strong>{player.player_name} </strong> </h1> : <h1>Nothing yet...</h1>}
                <div className="w-full flex mx-auto justify-center items-center rounded-xl">

                    <div className="w-[90%] md:w-4/5 justify-center items-center">
                        <div className="justify-center items-center">


                            <div className="w-full justify-center bg-white rounded-xl">
                                <div className=" justify-center items-center rounded-xl text-myrtleGreen p-2">
                                    <div className="items-center">
                                        {player.team_name ? <h1 className="text-2xl pb-2"><strong>{player.team_name}</strong></h1> : <p></p>}
                                    </div>
                                    <div className="pb-2">
                                        {player.position ? <p><strong>Position: {player.position}</strong></p> : <p></p>}
                                    </div>


                                    <div className="pt-2 pb-2">
                                        {player.year_playing && player.year_playing !== 'null' && player.year_playing !== null ? <p><strong>Year Playing: {player.year_playing}</strong></p> : <p></p>}
                                    </div>

                                    {player.picture && (player.picture !== "null" && player.picture != "NULL" && player.picture != "Null") ?
                                        <div className="flex justify-center items-center pb-2 pt-2">
                                            <img
                                            src={player.picture}
                                            className="max-w-[200px] max-h-[200px] w-auto h-auto block"
                                            />
                                        </div>
                                        : <p></p>
                                    }
                                    {player.sponsor_link && player.player_name ? 
                                        <div>
                                            <a href={`${player.sponsor_link}`} target="_blank">
                                            <p className="inline-block hover:text-roseRed text-lg font-bold hover:bg-myrtleGreen hover:text-white rounded-2xl text-myrtleGreen p-2 rounded italic">Sponsor {player.player_name} </p></a></div>
                                    : null}

                                    {player.bio ?
                                        <div className="flex justify-center p-10 whitespace-pre-line">{player.bio}</div>
                                        : <p> </p>
                                    }
                                    <button
                                        onClick={() => router.back()}
                                        className="px-4 py-2 bg-myrtleGreen text-white rounded hover:bg-white hover:text-myrtleGreen"
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        )
    };



    return (
        <div>

            {render_player()}
        </div>

    )
}
