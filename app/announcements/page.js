'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';
import Navbar from "../Navbar";



export default function Announcements() {

    const [data, setData] = useState([]);

    let info_response;
    let query = 'select * from announcements order by id desc limit 3;';

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
            <Navbar />
            <h1 className="inline-block text-lg font-bold text-white bg-myrtleGreen justify-center rounded px-3 py-2 "><strong>Announcements</strong></h1>
            <table className="w-4/5 flex justify-center rounded-2xl px-2 py-2 gap-x-2">
            <tbody className="shadow-lg justify-center bg-white rounded-xl px-4 py-4">
                    {data && data.length > 0 ? (
                        data
                            .filter(item => item !== null && item !== undefined)
                            .map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr className="text-lg font-bold text-myrtleGreen">
                                        {item.announcement_title ?
                                            <td>{item.announcement_title}-</td>
                                            : <td> </td>}

                                        {item.announcement ?
                                            <td>{item.announcement}</td>
                                            : <td> </td>}

                                    </tr>
                                </React.Fragment>
                            ))
                    ) : (<tr><td>Loading...</td></tr>)}
                

            </tbody>
            </table>
        </div>
    )
}