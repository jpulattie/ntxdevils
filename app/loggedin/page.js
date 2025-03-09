'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTeam } from '../teamChoice';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useLogin } from '../loginProvider';


const pages = [
    { name: 'Teams & Rosters', link: "./adminTeams" },
    { name: 'Schedules', link: "./adminSchedules" },
    { name: 'Info', link: "./adminInfo" },
    { name: 'Photos', link: "./adminPhotos" },
    { name: 'Sponsors', link: "./adminSponsors" },
    { name: 'Announcements', link: "./adminAnnouncements" }
]


export default function Admin() {
    const [teams, setTeams] = useState([]);
    const { teamChoice, setTeamChoice } = useTeam();
    const [showMenu, setShowMenu] = useState(false);
    const [ category, setCategory ] = useState(false);
    const {login, setLogin} = useLogin();

    let query;
    let get_teams_query = `select team_name from team;`
    const router = useRouter();


    async function getTeams() {
        if (!login){
            router.push('/')
        } 
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
        
        <div className="w-full bg-primroseYellow bg-opacity-50">
            <div className="w-full flex flex-wrap flex-auto justify-center space-x-4">
                
                <Menu>
                    <MenuButton className="w-full bg-myrtleGreen text-white hover:bg-myrtleGreen hover:text-primroseYellow px-4 py-2">
                        Choose Edit Category...
                    </MenuButton>
                    <MenuItems anchor="bottom" className="bg-myrtleGreen text-white">
                        {pages
                            .map(pages => (
                                <MenuItem
                                    key={pages.name}
                                    className="block w-full text-primroseYellow px-4 py-2 cursor-pointer hover:bg-myrtleGreen hover:text-white hover:border hover:border-white "
                                    onClick={() => {
                                        setCategory(pages.name);
                                    }}
                                >
                                    <Link href={`/${pages.link}`} className="block w-full h-full">
                                    {pages.name}
                                    </Link>
                                    
                                </MenuItem>

                            ))}
                    </MenuItems>
                </Menu>
                
                

            </div>
        </div>
    )
}
