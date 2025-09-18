'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTeam } from '../teamChoice';
import { useRouter } from 'next/navigation';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Admin from "../loggedin/page.js"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'


export default function Edit() {
    const [data, setData] = useState([]);
    const [toEdit, setToEdit] = useState({
        id: '',
        team_id: '',
        player_name: '',
        position: '',
        grade: '',
        year_playing: '',
        bio: '',
        picture: '',
        picture_key: '',
        sponsor_link: ''
    });
    const [teams, setTeams] = useState([]);

    const [index, setIndex] = useState(0);
    const [newPhoto, setNewPhoto] = useState(false);
    let info_response;

    let newURL;
    let newKey;
    let years;
    const fileInputRef = useRef(null);
    const router = useRouter();

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
                    //console.log('teams data', data.results);
                    //console.log('attempting to access id', data.results?.[0]?.id);
                    setTeams(data.results);
                    //setToEdit({ ...toEdit, team_id: data.results?.[0]?.id})
                } catch (error) {
                    console.error('error loading teams', error)
                }
            };
            getTeams();
            
        }, []);

    async function editPlayer() {
        if (newPhoto === true) {
            const formData = new FormData();
            formData.append("folder", "rosters");
            formData.append("key", toEdit.picture_key);

            try {
                const response = await fetch("/api/deletePhotos", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                console.log('delete successful', data);



            } catch (error) {
                console.error("delete failed", error);
            }
            const formData2 = new FormData();
            formData2.append("folder", "sponsors");
            formData2.append("file", toEdit.picture);

            try {
                const response = await fetch("/api/uploadPhotos", {
                    method: "POST",
                    body: formData2,
                });
                const data = await response.json();
                //console.log('upload successful', data);
                //console.log('url', data.url);
                newURL = data.url;
                newKey = data.key;
                //data.url gives the url of the photo, need to send that to an 
                // API route with the other fields at api/sponsors and add the user
                // using the data.url as the url for the photo


            } catch (error) {
                console.error("upload failed", data.error);
            }

            if (newURL === undefined) {
                console.log("RETURNED UNDEFINED")
                newURL = '';
                newKey = '';
            }
        } else if (newPhoto === false) {
            newURL = toEdit.picture;
            newKey = toEdit.picture_key
        }
        if (toEdit.year_playing === '') {
            years = null;
        } else if (toEdit.year_playing !== '') {
            years = toEdit.year_playing

        }
        let query = `update roster set team_id = "${toEdit.team_id}", player_name = "${toEdit.player_name}", position = "${toEdit.position}", grade = "${toEdit.grade}", year_playing = "${years}", bio = "${toEdit.bio}", picture = "${newURL}", picture_key = "${newKey}", sponsor_link="${toEdit.sponsor_link}" where id = ${toEdit.id};`

        try {
            console.log('sending UPDATE API request to route', query)
            const response = await fetch('api/teams', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                console.log('response with error:', response)
                throw new Error("Error response not ok")
            }
            await response.json();

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching edit player1')
            console.log('data:', data)
        }
        query = 'select * from roster;';

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
            //console.log('results:', result.results)
            //console.log('current index', index)
            setData(result.results);
            setIndex(0);


            if (result.results.length > 0) {
                setToEdit({
                    id: '',
                    team_id: '',
                    player_name: '',
                    position: '',
                    grade: '',
                    year_playing: '',
                    bio: '',
                    picture: '',
                    picture_key: '',
                    sponsor_link: ''

                });
                console.log("roster after update:", toEdit)
                setNewPhoto(false);
            } else {
                console.log('roster data', result.results);
            }

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching edit player2')
            console.log('data:', data)
        }

    }


    useEffect(() => {
        let query = 'select * from roster;';
        async function db_query() {
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
                //console.log('result:', result)
                console.log('first load of edit player', result.results[index])
                setData(result.results);
                setIndex(0);
                if (result.results.length > 0) {
                    setToEdit({
                        id: result.results[index].id,
                        team_id: result.results[index].team_id,
                        player_name: result.results[index].player_name,
                        position: result.results[index].position,
                        grade: result.results[index].grade,
                        year_playing: result.results[index].year_playing,
                        bio: result.results[index].bio,
                        picture: result.results[index].picture,
                        picture_key: result.results[index].picture_key,
                        sponsor_link: result.results[index].sponsor_link
                    });

                    //console.log("Initial roster:", result.results)
                } else {
                    console.log('initial roster data', result.results);
                }
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching edit player3')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);


    const editSelect = (event) => {
        const selection = JSON.parse(event.target.value);
        setToEdit({
            id: selection.id,
            team_id: selection.team_id,
            player_name: selection.player_name,
            position: selection.position,
            grade: selection.grade,
            year_playing: selection.year_playing,
            bio: selection.bio,
            picture: selection.picture,
            picture_key: selection.picture_key,
            sponsor_link: selection.sponsor_link
        });
    }



    const addEdit = async (toEdit) => {
        window.alert(`Updating ${toEdit.player_name}`);
        await editPlayer();

    }

    useEffect(() => {
        console.log('new photo', newPhoto);
    }, [newPhoto]);

    useEffect(() => {
        console.log('index changed', index);
    }, [index]);

    useEffect(() => {
        console.log('DATA UPDATED', data)
    }, [data]);

    useEffect(() => {
        console.log('toEdit updated', toEdit);
    }, [toEdit]);


    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white  shadow-2xl block px-2 py-2 pt-4 justify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Edit Player</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Player to Edit</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={(e) => {
                            const selectedIndex = e.target.selectedIndex
                            console.log('INDEX CHOSEN', selectedIndex)
                            setIndex(selectedIndex);
                            editSelect(e)
                        }}
                    >
                        {data && data.length > 0 ? (
                            data
                                .filter(item => item !== null && item !== undefined)
                                .map((item, index) => (
                                    <option key={item.id} value={JSON.stringify(item.player_name)}>
                                        {item.player_name?.length > 30 
                                        ? item.player_name.slice(0,30) + "..."
                                    : item.player_name}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Player Name</Label>
                    <Input
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        name="title"
                        value={toEdit.player_name !== 'null' ? toEdit.player_name : ' '}
                        onChange={(e) => setToEdit({ ...toEdit, player_name: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Position</Label>
                    <Input
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        name="position"
                        value={toEdit.position !== 'null' ? toEdit.position : ' '}
                        placeholder="Position"
                        onChange={(e) => setToEdit({ ...toEdit, position: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Year Playing</Label>
                    <Input
                        name="year playing"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        value={toEdit.year_playing !== 'null'&& toEdit.year_playing !== null? toEdit.year_playing : ' '}

                        placeholder="Year playing"
                        onChange={(e) => setToEdit({ ...toEdit, year_playing: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Link</Label>
                    <Input
                        name="sponsor_link"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        value={toEdit.sponsor_link !== 'null' && toEdit.sponsor_link !== null ? toEdit.sponsor_link : ' '}

                        placeholder="Sponsor Link"
                        onChange={(e) => {
                            setToEdit({ ...toEdit, sponsor_link: e.target.value })}
                        }
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Bio</Label>
                    <Textarea
                        name="bio"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        value={toEdit.bio !== 'null' && toEdit.bio !== 'NULL' ? toEdit.bio : ' '}

                        placeholder="Bio..."
                        onChange={(e) => setToEdit({ ...toEdit, bio: e.target.value })}
                    />
                </Field>

                <Field>
                    <Label className="block flex justify-center px-2 py-3">Team</Label>
                    <Select
                        className="border border-myrtleGreen px-4 py-1 border-1"
                        onChange={(e) => setToEdit({ ...toEdit, team_id: e.target.value })}

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
                    {typeof toEdit.picture === 'string' && toEdit.picture.startsWith("https:") ?
                        <div><p>Current Image</p>
                            <Field className="flex justify-center items-center">
                                <Image

                                    src={toEdit.picture}
                                    alt={`${toEdit.picture} photo`}
                                    //alt={`${toEdit.sponsor_name} photo`}
                                    width={300}
                                    height={100}
                                />
                            </Field> </div> : <Label className="block flex justify-center px-2 py-3">Uploading new image: </Label>}

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

                            setToEdit({ ...toEdit, picture: e.target.files[0] });
                        }}
                    />
                </Field>

                <Field className="pt-4 pb-4">
                    <button
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"

                        onClick={() => {
                            addEdit(toEdit);
                            document.querySelector('select').value=''
                        }}
                    >UPDATE</button>
                </Field>
            </Fieldset>
        </div>
    )
}