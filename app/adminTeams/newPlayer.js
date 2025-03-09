'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';
import { useRef } from 'react';

import Link from 'next/link';
import { useTeam } from '../teamChoice';
import { useRouter } from 'next/navigation';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Admin from "../loggedin/page.js"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'
import { Lexend_Tera } from 'next/font/google';
import { RESPONSE_LIMIT_DEFAULT } from 'next/dist/server/api-utils';


export default function New() {
    const [data, setData] = useState([]);
    const [teams, setTeams] = useState([]);
    const [toAdd, setToAdd] = useState({
        team_id: '',
        player_name: '',
        position: '',
        grade: '',
        year_playing: '',
        bio: '',
        picture: '',
        picture_key: ''

    });
    const [isAdded, setIsAdded] = useState(false);
    const [folder, setFolder] = useState('rosters')
    const [newPhoto, setNewPhoto] = useState(false);
    let newURL = null;
    let newKey = null;
    let years = null;
    const fileInputRef = useRef(null);
    const router = useRouter();

    let info_response;

    useEffect(() => {
        let query = "select team_name, id from team;"
        const getTeams = async () => {
            try {
                const response = await fetch('api/teams/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query })
                });
                const data = await response.json();
                console.log('teams data', data.results);
                console.log('attempting to access id', data.results?.[0]?.id);
                setTeams(data.results);
                setToAdd({ ...toAdd, team_id: data.results?.[0]?.id})
            } catch (error) {
                console.error('error loading teams', error)
            }
        };
        getTeams();
        
    }, []);


    async function addPhoto() {
        console.log('photo upload =', toAdd.picture);
        const formData = new FormData();
        formData.append("folder", "rosters");
        formData.append("file", toAdd.picture);

        try {
            const response = await fetch("/api/uploadPhotos", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log('upload successful', data);
            console.log('url', data.url);

            newURL = data.url;
            console.log('newURL1', newURL)
            newKey = data.key;

            if (newURL === undefined) {
                console.log("RETURNED UNDEFINED")
                newURL = '';
                newKey = '';
            }
            if (toAdd.year_playing === ''){
                years = null;
            } else if (toAdd.year_playing !== '') {
                years = toAdd.year_playing

            }


            //data.url gives the url of the photo, need to send that to an 
            // API route with the other fields at api/sponsors and add the user
            // using the data.url as the url for the photo



        } catch (error) {
            console.error("upload failed", data.error);
        }
        console.log('toAdd right before query', toAdd);
        let query = `insert into roster (team_id, player_name, position, grade, year_playing, bio, picture, picture_key) values (${toAdd.team_id}, "${toAdd.player_name}", "${toAdd.position}", "${toAdd.grade}", ${years}, "${toAdd.bio}", "${newURL}", "${newKey}"); `
        console.log('query', query);

        console.log('photo url', newURL);
        console.log("query:", query)
        //console.log('sponsor name2', setToAdd.sponsor_name);
        try {
            console.log('sending API request to route')//, query)
            const response = await fetch('api/teams', {
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
            setIsAdded(true);
            setToAdd({
                team_id: '',
                player_name: '',
                position: '',
                grade: '',
                year_playing: '',
                bio: '',
                picture: '',
                picture_key: ''
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching in newPlayer')
            console.log('data:', data)
        }
    }

    async function addNew() {
        console.log('checking photo', (toAdd.picture === undefined))
        console.log('to add...', toAdd)
        if (window.confirm(`Are you sure you wish to add...
            Name:${toAdd.player_name} 
            Photo:${toAdd.picture.name}`)) {
            console.log('checker', toAdd.picture);
            //console.log('checking conditional', typeof toAdd.sponsor_photo, toAdd.sponsor_photo);
            //console.log('checking conditional .name', typeof toAdd.sponsor_photo?.name, toAdd.sponsor_photo?.name);

            await addPhoto();

        }
        else { console.log("canceled") }
    }

    useEffect(() => {
        console.log('new photo effect', newPhoto)
    }, [newPhoto]);

    useEffect(() => {
        if (isAdded) {
            setIsAdded(false);
        }
    }, [isAdded]);

    useEffect(() => {
        console.log('to add updated',toAdd);
    }, [toAdd]);
    

    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white pt-4 shadow-2xl block px-2 py-2 justify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">New Player</Legend>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Player Name</Label>
                    <Input

                        name="title"
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        placeholder="Name"
                        value={toAdd.player_name}
                        onChange={(e) => setToAdd({ ...toAdd, player_name: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Position</Label>
                    <Input
                        name="level"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="Position"
                        value={toAdd.position}
                        onChange={(e) => setToAdd({ ...toAdd, position: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Year Playing</Label>
                    <Input
                        name="address"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="Year Playing..."
                        value={toAdd.year_playing}
                        onChange={(e) => setToAdd({ ...toAdd, year_playing: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Bio</Label>
                    <Textarea
                        name="website"
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="Bio"
                        value={toAdd.bio}
                        onChange={(e) => setToAdd({ ...toAdd, bio: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Team</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={(e) => setToAdd({ ...toAdd, team_id: e.target.value })}
                        
                    >
                        {teams && teams.length > 0 ? (
                            teams
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id} value={item.id}>{item.team_name}</option>
                                ))) : null
                        };
                    </Select>
                </Field>

                <Field>
                    <Label className="block flex justify-center px-2 py-3">Player Photo</Label>
                    <input
                        name="file"
                        type="file"
                        //multiple  - for later use in photos, multiple allows for multiple file uploads, but doesn't apply here
                        //for multiple change e.target.files[0] to Awway.from(e.target.files)
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        ref={fileInputRef}

                        onChange={(e) => {
                            setNewPhoto(true);
                            setToAdd({ ...toAdd, picture: e.target.files[0] });
                        }}
                    />
                </Field>

                <Field className="pt-4 pb-4">
                    <button
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"
                        onClick={() => {
                            addNew(toAdd);
                        }}
                    >ADD</button>
                </Field>
            </Fieldset>
        </div>
    )
}