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
        sponsor_name: '',
        sponsor_level: '',
        sponsor_address: '',
        sponsor_website: '',
        sponsor_phone: '',
        sponsor_bio: '',
        sponsor_photo: '',
        sponsor_photo_key: ''
    });
    const [index, setIndex] = useState(0);
    const [newPhoto, setNewPhoto] = useState(false);
    let info_response;

    let newURL;
    let newKey;
    const fileInputRef = useRef(null);
    const router = useRouter();

    async function editSponsor() {
        if (newPhoto === true){
        const formData = new FormData();
        formData.append("folder", "sponsors");
        formData.append("key", toEdit.sponsor_photo_key);

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
        formData2.append("file", toEdit.sponsor_photo);

        try {
            const response = await fetch("/api/uploadPhotos", {
                method: "POST",
                body: formData2,
            });
            const data = await response.json();
            console.log('upload successful', data);
            console.log('url', data.url);
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
        }} else if (newPhoto === false) {
            newURL = toEdit.sponsor_photo;
            newKey = toEdit.sponsor_photo_key
        }
        let query = `update sponsor set sponsor_name = "${toEdit.sponsor_name}", sponsor_level = "${toEdit.sponsor_level}", sponsor_address = "${toEdit.sponsor_address}", sponsor_website = "${toEdit.sponsor_website}", sponsor_phone = "${toEdit.sponsor_phone}", sponsor_bio = "${toEdit.sponsor_bio}", sponsor_photo = "${newURL}", sponsor_photo_key = "${newKey}" where id = ${toEdit.id};`

        try {
            console.log('sending API request to route')//, query)
            const response = await fetch('api/sponsor', {
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
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }
        query = 'select * from sponsor;';

        try {
            console.log('sending API request to route')//, query)
            const response = await fetch('api/sponsor', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                console.log('response with error:', response)
                throw new Error("Error response not ok")
            }
            const result = await response.json();
            console.log('results:', result.results)
            console.log('current index', index)
            setData(result.results);
            //ßsetIndex(0);
            
            
            if (result.results.length > 0) {
                setToEdit({
                    id: result.results[index].id,
                    sponsor_name: result.results[index].sponsor_name,
                    sponsor_level: result.results[index].sponsor_level,
                    sponsor_address: result.results[index].sponsor_address,
                    sponsor_website: result.results[index].sponsor_website,
                    sponsor_phone: result.results[index].sponsor_phone,
                    sponsor_bio: result.results[index].sponsor_bio,
                    sponsor_photo: result.results[index].sponsor_photo,
                    sponsor_photo_key: result.results[index].sponsor_photo_key,

                });
                console.log("Initial sponsors after update:", toEdit)
                setNewPhoto(false);
            } else {
                console.log('initial sponsors data', result.results);
            }

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching2')
            console.log('data:', data)
        }

    }


    useEffect(() => {
        let query = 'select * from sponsor;';
        async function db_query() {
            try {
                console.log('sending API request to route')//, query)
                const response = await fetch('api/sponsor', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    console.log('response with error:', response)
                    throw new Error("Error response not ok")
                }
                const result = await response.json();
                console.log('result:', result)
                console.log('result.results[0]', result.results[index])
                setData(result.results);
                if (result.results.length > 0) {
                    setToEdit({
                        id: result.results[index].id,
                        sponsor_name: result.results[index].sponsor_name,
                        sponsor_level: result.results[index].sponsor_level,
                        sponsor_address: result.results[index].sponsor_address,
                        sponsor_website: result.results[index].sponsor_website,
                        sponsor_phone: result.results[index].sponsor_phone,
                        sponsor_bio: result.results[index].sponsor_bio,
                        sponsor_photo: result.results[index].sponsor_photo,
                        sponsor_photo_key: result.results[index].sponsor_photo_key,
                    });

                    console.log("Initial sponsors:", toEdit)
                } else {
                    console.log('initial sponsor data', result.results);
                }
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching7')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);


    const editSelect = (event) => {
        const selection = JSON.parse(event.target.value);
        console.log('selection', selection);
        setToEdit({
            id: selection.id,
            sponsor_name: selection.sponsor_name,
            sponsor_level: selection.sponsor_level,
            sponsor_address: selection.sponsor_address,
            sponsor_website: selection.sponsor_website,
            sponsor_phone: selection.sponsor_phone,
            sponsor_bio: selection.sponsor_bio,
            sponsor_photo: selection.sponsor_photo,
            sponsor_photo_key: selection.sponsor_photo_key,
        });
    }


    const addEdit = async (toEdit) => {
        window.alert(`Updating 
            ${toEdit.sponsor_name}
            ${toEdit.sponsor_level}
            ${toEdit.sponsor_address}
            ${toEdit.sponsor_website}
            ${toEdit.sponsor_phone}
            ${toEdit.$sponsor_bio}
            ${toEdit.sponsor_photo}
            ${toEdit.sponsor_photo_key}`);
        await editSponsor();
        setToEdit({
        id: '',
        sponsor_name: '',
        sponsor_level: '',
        sponsor_address: '',
        sponsor_website: '',
        sponsor_phone: '',
        sponsor_bio: '',
        sponsor_photo: '',
        sponsor_photo_key: ''
    })

    }

    useEffect(()=> {
        console.log('new photo', newPhoto);
    },[newPhoto]);

    useEffect(()=> {
        console.log('index changed', index);
    },[index]);

    useEffect(()=> {
        console.log('DATA UPDATED', data)
    }, [data]);

    useEffect(() => {
        console.log('toEdit updated', toEdit);
    }, [toEdit]);


    return (
        <div className="flex justify-center">

            <Fieldset className="w-4/5 flex-basis:80  bg-white  shadow-2xl block px-2 py-2 pt-4 ssjustify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">Edit Sponsor</Legend>
                <Field>
                    <Label className="block flex justify-center py-2">Choose Sponsor to Edit</Label>
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
                                    <option key={item.id} value={JSON.stringify(item)}>
                                        {item.sponsor_name?.length > 30 
                                        ? item.sponsor_name.slice(0,30) + "..."
                                    : item.sponsor_name}</option>
                                ))) : null
                        };
                    </Select>
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Name</Label>
                    <Input
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        name="title"
                        value={toEdit.sponsor_name !== 'null' ? toEdit.sponsor_name : ' '}
                        onChange={(e) => setToEdit({ ...toEdit, sponsor_name: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Level</Label>
                    <Input
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        name="announcement"
                        value={toEdit.sponsor_level !== 'null' ? toEdit.sponsor_level : ' '}
                        placeholder="Announcement"
                        onChange={(e) => setToEdit({ ...toEdit, sponsor_level: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Address</Label>
                    <Input
                        name="announcement"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        value={toEdit.sponsor_address !== 'null' ? toEdit.sponsor_address : ' '}

                        placeholder="New Announcement..."
                        onChange={(e) => setToEdit({ ...toEdit, sponsor_address: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Website</Label>
                    <Input
                        name="announcement"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        value={toEdit.sponsor_website !== 'null' ? toEdit.sponsor_website : ' '}

                        placeholder="New Announcement..."
                        onChange={(e) => setToEdit({ ...toEdit, sponsor_website: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Phone</Label>
                    <Input
                        name="announcement"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        value={toEdit.sponsor_phone !== 'null' ? toEdit.sponsor_phone : ' '}

                        placeholder="New Announcement..."
                        onChange={(e) => setToEdit({ ...toEdit, sponsor_phone: e.target.value })}
                    />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Bio</Label>
                    <Textarea
                        name="announcement"
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        value={toEdit.sponsor_bio !== 'null' ? toEdit.sponsor_bio : ' '}

                        placeholder="New Announcement..."
                        onChange={(e) => setToEdit({ ...toEdit, sponsor_bio: e.target.value })}
                    />
                </Field>

                <Field>
                    {typeof toEdit.sponsor_photo === 'string' && toEdit.sponsor_photo.startsWith("https:") ?
                        <div><p>Current Image</p>
                        <Field className="flex justify-center items-center">
                            <Image

                                src={toEdit.sponsor_photo}
                                alt={`${toEdit.sponsor_name} photo`}
                                //alt={`${toEdit.sponsor_name} photo`}
                                width={300}
                                height={100}
                            />
                        </Field> </div>: <Label className="block flex justify-center px-2 py-3">Uploading new image: {toEdit.sponsor_photo.name}</Label>}

                    <Label className="block flex justify-center px-2 py-3">Sponsor Photo</Label>
                    <input
                        name="file"
                        type="file"
                        //multiple  - for later use in photos, multiple allows for multiple file uploads, but doesn't apply here
                        //for multiple change e.target.files[0] to Awway.from(e.target.files)
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        ref={fileInputRef}

                        onChange={(e) => {
                            setNewPhoto(true);
                            
                            setToEdit({ ...toEdit, sponsor_photo: e.target.files[0] });
                        }}
                    />
                </Field>

                <Field className="pt-4 pb-4">
                    <button
                        type="submit"
                        className="text-lg font-bold bg-primroseYellow text-myrtleGreen px-4 py-2 justify-center rounded-2xl"

                        onClick={() => {
                            addEdit(toEdit)
                            document.querySelector('select').value=''
                        }}
                    >UPDATE</button>
                </Field>
            </Fieldset>
        </div>
    )
}