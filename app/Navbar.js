'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTeam } from './teamChoice';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import '@fortawesome/fontawesome-free/css/all.min.css';



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
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isRosterOpen, setIsRosterOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);



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
        <div className="w-full overflow-hidden">
            <div className="hidden md:flex flex-wrap flex-auto bg-myrtleGreen text-white justify-center space-x-4">
                <div className="relative">
                    <Menu>
                        <MenuButton className="text-center bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen px-4 py-2 rounded-xl">
                            Rosters
                        </MenuButton>
                        <MenuItems
                            modal={false}
                            anchor="bottom start"
                        className="origin-top-left absolute w-48 rounded-md shadow-lg bg-myrtleGreen ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
                            style={{
                                position: 'fixed',
                                transform: 'translateX(0)',
                                maxWidth: '12rem',
                                minWidth: '10rem'
                            }}
                        >
                            {teams
                                .map(team => (
                                    <MenuItem
                                        key={team.team_name}
                                        className="bottom w-full block bg-myrtleGreen text-white px-2 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
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
                </div>
                <Menu>
                    <MenuButton className="rounded bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen px-2 py-2 rounded-xl">
                        Schedules
                    </MenuButton>
                    <MenuItems
                        modal={false}
                        anchor="bottom start"
                        className="origin-top-left absolute w-48 rounded-md shadow-lg bg-myrtleGreen ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
                        style={{
                            position: 'fixed',
                            transform: 'translateX(0)',
                            maxWidth: '12rem',
                            minWidth: '10rem'
                        }}
                    >                        {teams
                        .map(team => (
                            <MenuItem
                                key={team.team_name}
                                as="button"
                                className=" w-full bg-myrtleGreen text-white px-2 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
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
                {/*}               <Menu>
                    <MenuButton className="rounded-xl hover:bg-primroseYellow hover:text-myrtleGreen px-2 py-2">
                        Photos
                    </MenuButton>
                    <MenuItems anchor="bottom">
                        {teams
                            .map(team => (
                                <MenuItem
                                    key={team.team_name}
                                    className=" w-full bg-myrtleGreen text-white px-2 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
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
    */}
                <div className="w-fit text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen py-2 px-2 rounded-xl">
                    <Link href="./sponsors" >
                        Sponsors
                    </Link>
                </div>
                <div className="w-fit text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen py-2 px-2 rounded-xl">
                    <Link href="./announcements" >
                        Announcements
                    </Link>
                </div>

            </div>
            <div className="flex flex-col space-y-2 p-1 md:hidden">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {isMobileOpen ?
                        <i
                            className="fa fa-times text-3xl z-50 md:hidden text-white"
                            aria-hidden="true"
                        ></i>
                        : <i
                            className="fa fa-bars text-3xl text-white md:hidden"
                            aria-hidden="true"
                        ></i>}
                </button>
            </div>
            {isMobileOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-myrtleGreen text-white z-40 flex flex-col items-center justify-center"
                    onClick={() => setIsMobileOpen(false)}
                >
                    <div
                        className="flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            aria-label="Close mobile menu"
                            className="absolute top-4 right-4 text-3xl"
                        >
                            <i className="fa fa-times text-white"></i>
                        </button>
                        <div className="flex flex-col items-center space-y-2 relative">

                            <button
                                className="flex items-center gap-x-2 rounded hover:bg-white hover:text-myrtleGreen px-4 py-2 rounded-xl"
                                onClick={() => setIsRosterOpen(!isRosterOpen)}
                                anchor="bottom">
                                Roster
                                <i className={`fa ${isRosterOpen ? "fa-chevron-up" : "fa-chevron-down"} float right `}></i>
                            </button>
                            {isRosterOpen && (
                                <div className="flex flex-col min-w-[40vw] items-center rounded-2xl bg-white px-4 py-2 space-y-1 shadow-md z-50">
                                    {teams
                                        .map(team => (
                                            <button
                                                key={team.team_name}
                                                className="block w-full bg-white text-myrtleGreen px-2 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
                                                as="button"
                                                onClick={() => {
                                                    setIsMobileOpen(false)
                                                    setIsRosterOpen(false)
                                                    teamSelect(team.team_name);
                                                    router.push('/teams')
                                                }}
                                            >
                                                {team.team_name}
                                            </button>

                                        ))}
                                </div>

                            )}
                        </div>
                        <div className="flex flex-col items-center space-y-2 relative">

                            <button
                                className="flex items-center gap-x-2 rounded hover:bg-white hover:text-myrtleGreen px-4 py-2 space-y-2 rounded-xl"
                                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                                anchor="bottom">
                                Schedules
                                <i className={`fa ${isScheduleOpen ? "fa-chevron-up" : "fa-chevron-down"} float right `}></i>
                            </button>

                            {isScheduleOpen && (
                                <div className="flex flex-col min-w-[40vw] items-center rounded-2xl bg-white px-4 py-2 space-y-1 shadow-md z-50">
                                    {teams
                                        .map(team => (
                                            <button
                                                key={team.team_name}
                                                className="block w-full bg-white text-myrtleGreen px-2 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
                                                as="button"
                                                onClick={() => {
                                                    setIsMobileOpen(false)
                                                    setIsScheduleOpen(false)
                                                    teamSelect(team.team_name);
                                                    router.push('/schedules')
                                                }}
                                            >
                                                {team.team_name}
                                            </button>

                                        ))}
                                </div>

                            )}
                        </div>
                        <div className="flex flex-col min-w-[40vw] items-center space-y-2 relative">

                            <button
                                className="flex items-center gap-x-2 rounded hover:bg-white hover:text-myrtleGreen space-y-2 px-4 py-2 rounded-xl"
                                onClick={() => setIsPhotoOpen(!isPhotoOpen)}
                                anchor="bottom">
                                Photos
                                <i className={`fa ${isPhotoOpen ? "fa-chevron-up" : "fa-chevron-down"} float right `}></i>
                            </button>

                            {isPhotoOpen && (
                                <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-2 space-y-1 shadow-md z-50">
                                    {teams
                                        .map(team => (
                                            <button
                                                key={team.team_name}
                                                className="block w-fit bg-white text-myrtleGreen px-2 py-2 data-[focus]:bg-primroseYellow data-[focus]:bg-primroseYellow cursor-pointer hover:bg-primroseYellow hover:text-myrtleGreen"
                                                as="button"
                                                onClick={() => {
                                                    setIsMobileOpen(false)
                                                    setIsPhotoOpen(false)
                                                    teamSelect(team.team_name);
                                                    router.push('/photos')
                                                }}
                                            >
                                                {team.team_name}
                                            </button>

                                        ))}
                                </div>

                            )}
                        </div>

                    </div>

                    <div className="w-fit  text-white text-center bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen py-2 px-4 rounded-xl">
                        <Link href="./info" className="w-full block">
                            Info
                        </Link>
                    </div>

                    <div className="w-fit text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen py-2 px-2 rounded-xl">
                        <Link href="./sponsors" >
                            Sponsors
                        </Link>
                    </div>
                    <div className="w-fit text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen py-2 px-2 rounded-xl">
                        <Link href="./announcements" >
                            Announcements
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
