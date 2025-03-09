'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTeam } from './teamChoice';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'


const pages = [
    { name: 'Teams', link: "/teams" },
    { name: 'Schedules', link: "/schedules" },
    { name: 'Info', link: "/info" },
    { name: 'Photos', link: "/photos" },
    { name: 'Sponsors', link: "/sponsors" },
    { name: 'Announcements', link: "/announcements" }
]


export default function Navbar() {
    const [teams, setTeams] = useState([]);
    const { teamChoice, setTeamChoice } = useTeam();
    const [showMenu, setShowMenu] = useState(false);
    let query;
    let get_teams_query = `select team_name from team;`
    const router = useRouter();


    async function getTeams() {
        try {
            let query = get_teams_query;
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

            console.log('result:', result)
            console.log('result.results:', result.results)
            setTeams([...result.results, { team_name: "All" }]);
            setShowMenu(true);
        } catch (error) {
            console.log('Problem with data: ', teams)
            console.error('error:', error);
        }
    };

    useEffect(() => {
        getTeams();
    }, []);

    const teamSelect = async (team) => {
        console.log('team selected', team)
        setTeamChoice(team);

    }

    return (
        <div className="w-full bg-myrtleGreen">
            <div className="flex flex-wrap flex-auto bg-myrtleGreen text-white justify-center space-x-4">
                <Menu>
                    <MenuButton className="rounded hover:bg-primroseYellow hover:text-myrtleGreen px-4 py-2 rounded-xl">
                        Rosters
                    </MenuButton>
                    <MenuItems anchor="bottom">
                        {teams
                            .map(team => (
                                <MenuItem
                                    key={team.team_name}
                                    className="block w-full bg-myrtleGreen text-white px-4 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
                                    as="button"
                                    onClick={() => {
                                        teamSelect(team.team_name);
                                        router.push('/teams')

                                    }}
                                >
                                    {team.team_name}
                                </MenuItem>

                            ))}
                    </MenuItems>
                </Menu>
                <Menu>
                    <MenuButton className="rounded hover:bg-primroseYellow hover:text-myrtleGreen px-4 py-2 rounded-xl">
                        Schedules
                    </MenuButton>
                    <MenuItems anchor="bottom" className="w-fit data-[focus]:bg-myrtleGreen bg-myrtleGreen text-white cursor-pointer hover:bg-primroseYellow hover:text-white">
                        {teams
                            .map(team => (
                                <MenuItem
                                    key={team.team_name}
                                    as="button"
                                    className="block w-full bg-myrtleGreen text-white px-4 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
                                    onClick={() => {
                                        teamSelect(team.team_name);
                                        router.push(`./schedules`);
                                    }}
                                >
                                    {team.team_name}
                                </MenuItem>

                            ))}
                    </MenuItems>
                </Menu>
                <div className="w-fit  text-white text-center bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen py-2 px-4 rounded-xl">
                    <Link href="./info" className="w-full block">
                        Info
                    </Link>
                </div>
                <Menu>
                    <MenuButton className="rounded-xl hover:bg-primroseYellow hover:text-myrtleGreen px-4 py-2">
                        Photos
                    </MenuButton>
                    <MenuItems anchor="bottom">
                        {teams
                            .map(team => (
                                <MenuItem
                                    key={team.team_name}
                                    className="block w-full bg-myrtleGreen text-white px-4 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
                                    as="button"
                                    onClick={() => {
                                        teamSelect(team.team_name);
                                        router.push(`./photos`);
                                    }}
                                >
                                    {team.team_name}
                                </MenuItem>

                            ))}
                    </MenuItems>
                </Menu>
                <div className="w-fit text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen py-2 px-4 rounded-xl">
                    <Link href="./sponsors" >
                        Sponsors
                    </Link>
                </div>
                <div className="w-fit text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen py-2 px-4 rounded-xl">
                    <Link href="./announcements" >
                        Announcements
                    </Link>
                </div>

            </div>
        </div>
    )
}
