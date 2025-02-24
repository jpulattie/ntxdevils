'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import { useTeam } from '../teamChoice'; 


export default function Photos() {
    const [teams, setTeams] = useState([]);
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const { teamChoice, setTeamChoice } = useTeam(null);
    const [eventChoice, setEventChoice] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [ filteredPhotos, setFilteredPhotos] = useState([]);

    const [bucketName, setBucketName] = useState('');
    const [region, setRegion] = useState('');

    let query;
    let get_teams_query = `select team_name from team;`

    const imageClick = () => {
        setIsExpanded(!isExpanded);
    }
   

    console.log('team choice', teamChoice);
    useEffect(() => {
        console.log("team choice in photos", teamChoice)
        //setTeamChoice();
        console.log("team choice in photos", teamChoice)

    }, []);

    async function getPhotos() {
        console.log('PHOTOS CALLED')
        try {
            const response = await fetch('api/photos');
            const data = await response.json();
            const validPhotos = data.photos.filter(photo => photo.Size > 0)
            setPhotos(validPhotos);
            console.log("Valid Photos:", validPhotos);
            setBucketName(data.bucketName);
            setRegion(data.region);
            console.log('data from photos:', data);
        }
        catch (error) {
            console.error('Error getting photos:', error);
        }
    }

    async function teamPhotos() {
        console.log('team choice:', teamChoice)
    }
    
    useEffect(()=> {

        if (teamChoice != null) {
            setFilteredPhotos(photos.filter(photo => photo.Key.startsWith(`photos/${teamChoice}/`)));
        } else {
            setFilteredPhotos(photos.filter(photo => photo.Size > 0));
        }
    }, [teamChoice, photos]);

    useEffect(() => {
        console.log("useEffect for getPhotos running...");
        getPhotos();
    }, []);

    useEffect(() => {
        teamPhotos();
    }, [teamChoice]);

    useEffect(() => {
        async function get_teams() {
            try {
                let query = get_teams_query;
                //console.log('query:', query)
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
            } catch (error) {
                console.log('Problem with data: ', teams)
                console.error('error:', error);
            }
        }
        get_teams()
    }, []);


    function render_photos() {

        if (!photos || teamChoice === null) {
            console.log('phtos:', photos);
            return <div><h1>Loading...</h1></div>
        } else if (teamChoice === "All") {
            
            return (
                <div>
                    <h1>{teamChoice}</h1>

                    <div className="grid grid-cols-3 gap-4 relative">

                        {photos.map((item, index) => (
                            <div key={index} >
                                <img 
                                    src={`https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`}
                                    alt={item.key}
                                    className={`w-full h-auto transition-transform ${
                                    isExpanded
                                    ? 'fixed top-0 left-0 w-full h-full object-contain z-50'
                                    : 'cursor-pointer'
                                    }`}
                                    onClick={imageClick}
                                />

                            </div>
                        ))}

                    </div>
                </div>
            );
        }
    
    else if (teamChoice != null) {
       
        return (
            <div>
                <h1>{teamChoice ? teamChoice : "All2"}</h1>
                {filteredPhotos.length === 0 ? (
                    <h1>No photos to display</h1>
                ) : (
                <div className="grid grid-cols-3 gap-4 relative">
                    {filteredPhotos.map((item, index) => (
                        <div key={index} >
                            <img 
                                src={`https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`}
                                alt={item.key}
                                className={`w-full h-auto transition-transform ${
                                    isExpanded
                                    ? 'fixed top-0 left-0 w-full h-full object-contain z-50'
                                    : 'cursor-pointer'
                                    }`}
                                    onClick={imageClick}
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
            
            {render_photos()}
        </div>

    )
}
