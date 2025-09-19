'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';
import Navbar from "../Navbar";



export default function Announcements() {

    const [data, setData] = useState([]);

    let info_response;
    let query = 'select * from announcements order by id desc limit 15;';

    useEffect(() => {
        async function db_query() {
            try {
                console.log('sending API request to route')//, api_request)
                const response = await fetch('api/announcements', {
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
                setData(result.results);
                console.log('data:', data)
                console.log('result:', result)
            }

            catch {
                //console.error('error catch', Error)
                console.log('problem - need to clean up error catching2')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);
    return (
        <div>
            
            <h1 className="inline-block text-lg font-bold text-white bg-myrtleGreen justify-center rounded-xl px-3 py-2 mt-2 mb-2"><strong>Announcements</strong></h1>
            <div className="w-full flex justify-center rounded-2xl px-2 py-2 gap-x-2">
            <div className="md:w-4/5 justify-end rounded-xl mb-4 p-2">
                    {data && data.length > 0 ? (
                        data
                            .filter(item => item !== null && item !== undefined)
                            .map((item, index) => (
                                <div key={index}>
                                    <div className="block justify-center text-lg shadow-lg bg-white text-myrtleGreen border-2 border-myrtleGreen border border-opacity-20 rounded-xl mb-4 p-2">
                                        {item.announcement_title && item.announcement_title !== 'null' ?
                                            <h2 className="block mb-1 font-bold">{item.announcement_title} </h2>
                                            : <div> </div>}
                                        
                                        {item.announcement && item.announcement !== 'null' ?
                                            <div className= "block italic whitespace-pre-line">{item.announcement}</div>
                                            : <div> </div>}
                                        {item.announcement_link && item.announcement_link !== "null" && item.announcement_link !== null ?
                                        <div><a href={`${item.announcement_link}`} target="_blank"><p className="inline-block hover:bg-myrtleGreen hover:text-white text-blue-400 px-1 rounded-lg ">View Link</p></a></div>
                                        : null}

                                    </div>
                                </div>
                            ))
                    ) : (<div><div>Loading...</div></div>)}
                

            </div>
            </div>
        </div>
    )
}