'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import { useTeam } from '../teamChoice'; 
import Navbar from "../Navbar";



export default function Photos() {
    const [teams, setTeams] = useState([]);
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);

    const [schedule, setSchedule] = useState([]);
    const { teamChoice, setTeamChoice } = useTeam(null);
    const [eventChoice, setEventChoice] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [ filteredPhotos, setFilteredPhotos] = useState([]);

    const [bucketName, setBucketName] = useState('');
    const [region, setRegion] = useState('');

    let query;
    let get_teams_query = `select team_name from team;`

    const imageClick = (index) => {
        setIsExpanded(!isExpanded);
        setExpandedImage(expandedImage === index ? null : index);
    }
    const imageExpand = (index) => {

    }
   

    
    useEffect(() => {
        console.log("team choice in photos", teamChoice)
        //setTeamChoice();
    }, [teamChoice]);

    async function getPhotos() {
        console.log('PHOTOS CALLED')
        try {
            const response = await fetch('api/photos');
            const data = await response.json();
            const validPhotos = data.photos.filter(photo => photo.Size > 0)
            setPhotos(validPhotos);
            
            setBucketName(data.bucketName);
            setRegion(data.region);
            console.log('data from photos2:', data);
            console.log("WTF IS GOING ON");

            console.log("Valid Photo:", data.photos[5].Key);
            data.photos.forEach((photo, index) => {
                console.log(`Photo ${index} Key:`, photo.Key);
            });
            //console.log('team choice when photos called', teamChoice);
        }
        catch (error) {
            console.error('Error getting photos:', error);
        }
    }
    
    useEffect(()=> {
        console.log('team choice in filtered photos', teamChoice);
        if (teamChoice === 'All') {
            setFilteredPhotos(photos.filter(photo => photo.Key.startsWith(`photos/`)));
        } else if (teamChoice != null) {
            setFilteredPhotos(photos.filter(photo => photo.Key.startsWith(`photos/${teamChoice}/`)));

        }
    }, [teamChoice, photos]);

    useEffect(()=> {
        console.log('filtered photos updated!! -', filteredPhotos);
    },[filteredPhotos]);

    useEffect(() => {
        console.log("useEffect for getPhotos running...");
        getPhotos();
    }, []);

    useEffect(() => {
        console.log('team choice on photos page', teamChoice)
    }, [teamChoice]);


    function render_photos() {
        console.log('render photos- filtered', filteredPhotos);
        if (!photos || teamChoice === null) {
            console.log('phtos:', photos);
            return <div><h1>Loading...</h1></div>
        } 
    
    else if (teamChoice != null) {
       
        return (
            <div className="w-full h-screen p-2 px-6 relative">
                <h1 className="inline-block text-lg font-bold text-white bg-myrtleGreen justify-center rounded-xl px-3 py-2 mb-4">{teamChoice ? teamChoice : "All2"}</h1>
                {filteredPhotos.length === 0 ? (
                    <h1>No photos to display</h1>
                   
                ) : (
                <div className="grid grid-cols-3 gap-4 relative bg-white p-4 rounded-xl">

                    {filteredPhotos.map((item, index) => (
                        <div key={index} >
                            <img 
                                src={`https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`}
                                alt={item.key}
                                className={`w-full h-auto transition-transform ${
                                    expandedImage === index
                                    ? 'absolute top-0 left-0 w-full h-full object-contain z-50 bg-myrtleGreen bg-opacity-90 p-4 rounded-xl overflow-hidden'
                                    : 'cursor-pointer'
                                    }`}
                                    onClick={() => imageClick(index)}
                            />

                        </div>
                    ))}

                </div>
                )}
            </div>
        );
    };
};


    return (
        <div>
            <Navbar />
            {render_photos()}
        </div>

    )
}
