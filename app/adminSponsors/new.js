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


export default function New() {
    const [data, setData] = useState([]);
    const [toAdd, setToAdd] = useState({
        sponsor_name: '',
        sponsor_level: '',
        sponsor_address: '',
        sponsor_website: '',
        sponsor_phone: '',
        sponsor_bio: '',
        sponsor_photo: '',
        sponsor_photo_key: ''
       
    });
    const [isAdded, setIsAdded ] = useState(false);
    const [folder, setFolder] = useState('sponsors')
    const [newPhoto, setNewPhoto] = useState(false);
    let newURL = null;
    let newKey = null;
    const fileInputRef = useRef(null);
    const router = useRouter();

    let info_response;


    async function addPhoto() {
        console.log('photo upload =', toAdd.sponsor_photo);
        const formData = new FormData();
        formData.append("folder", "sponsors");
        formData.append("file", toAdd.sponsor_photo);

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

            if (newURL === undefined){
                console.log("RETURNED UNDEFINED")
                newURL = '';
                newKey = '';
            }
                
            
            //data.url gives the url of the photo, need to send that to an 
            // API route with the other fields at api/sponsors and add the user
            // using the data.url as the url for the photo
            
            
            
        } catch (error) {
            console.error("upload failed", data.error);
        }

        let query = `insert into sponsor (program_id, sponsor_name, sponsor_level, sponsor_address, sponsor_website, sponsor_phone, sponsor_bio, sponsor_photo, sponsor_photo_key) values (1, "${toAdd.sponsor_name}", "${toAdd.sponsor_level}", "${toAdd.sponsor_address}", "${toAdd.sponsor_website}", "${toAdd.sponsor_phone}", "${toAdd.sponsor_bio}", "${newURL}", "${newKey}"); `
        
        console.log('photo url', newURL);
        console.log("query:", query)
        //console.log('sponsor name2', setToAdd.sponsor_name);
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
            //console.log('result:',result)
            setIsAdded(true);
            setToAdd({
                sponsor_name: '',
                sponsor_level: '',
                sponsor_address: '',
                sponsor_website: '',
                sponsor_phone: '',
                sponsor_bio: '',
                sponsor_photo: '',
                sponsor_photo_key: ''

            }); 
            if (fileInputRef.current) {
                fileInputRef.current.value='';
            }

        }

        catch {
            //console.error('error catch', Error)
            console.log('problem - need to clean up error catching in addSponsor')
            console.log('data:', data)
        }
    }

    async function addNew() {
        console.log('checking photo', (toAdd.sponsor_photo === undefined))
        console.log('to add...', toAdd)
        if (window.confirm(`Are you sure you wish to add...
            Name:${toAdd.sponsor_name} 
            Level:${toAdd.sponsor_level} 
            Address: ${toAdd.sponsor_address}
            Website: ${toAdd.sponsor_website}
            Phone: ${toAdd.sponsor_phone}
            Bio: ${toAdd.sponsor_bio}
            Photo:${toAdd.sponsor_photo.name}`)) {
                console.log('checker', toAdd.sponsor_photo); 
                console.log('checking conditional', typeof toAdd.sponsor_photo, toAdd.sponsor_photo);
                console.log('checking conditional .name', typeof toAdd.sponsor_photo?.name, toAdd.sponsor_photo?.name);
        
            await addPhoto();
            
        }
        else {console.log("canceled")}
    }

    useEffect(()=> {
        console.log('new photo effect',  newPhoto)
    }, [newPhoto]);

    useEffect(() => {
            if (isAdded){
                setIsAdded(false);
            }
        }, [isAdded])

    return (
        <div className="flex justify-center">
            
            <Fieldset className="w-4/5 flex-basis:80  bg-white pt-4 shadow-2xl block px-2 py-2 justify-center rounded-2xl">

                <Legend className="text-lg font-bold bg-primroseYellow text-myrtleGreen justify-center rounded-xl inline-block px-4">New Sponsor</Legend>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Name</Label>
                    <Input 
                        
                        name="title"
                        className="border border-myrtleGreen px-3 py-1 border-1" 
                        placeholder="New Sponsor name..."
                        value={toAdd.sponsor_name}
                        onChange={(e) => setToAdd({...toAdd, sponsor_name: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Level</Label>
                    <Input 
                        name="level" 
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="Sponsor level..."
                        value={toAdd.sponsor_level}
                        onChange={(e) => setToAdd({...toAdd, sponsor_level: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Address</Label>
                    <Input 
                        name="address" 
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="Sponsor address..."
                        value={toAdd.sponsor_address}
                        onChange={(e) => setToAdd({...toAdd, sponsor_address: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Website</Label>
                    <Input 
                        name="website" 
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="Sponsor website Link..."
                        value={toAdd.sponsor_website}
                        onChange={(e) => setToAdd({...toAdd, sponsor_website: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Phone</Label>
                    <Input 
                        name="phone" 
                        className="border border-myrtleGreen px-3 py-2 h-auto border-1"
                        placeholder="Sponsor phone number..."
                        value={toAdd.sponsor_phone}
                        onChange={(e) => setToAdd({...toAdd, sponsor_phone: e.target.value})}
                        />
                </Field>
                <Field>
                    <Label className="block flex justify-center px-2 py-3">Sponsor Bio</Label>
                    <Textarea 
                        name="bio" 
                        className="border border-myrtleGreen px-3 py-2 h-auto pb-10 border-1"
                        placeholder="Sponsor Bio..."
                        value={toAdd.sponsor_bio}
                        onChange={(e) => setToAdd({...toAdd, sponsor_bio: e.target.value})}
                        />
                </Field>
                <Field>
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
                            setToAdd({...toAdd, sponsor_photo: e.target.files[0]});}}
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