'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';


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
            <h1><strong>Announcements</strong></h1>
            <tbody>
                    {data && data.length > 0 ? (
                        data
                            .filter(item => item !== null && item !== undefined)
                            .map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        {item.announcement_title ?
                                            <td>{item.announcement_title}-</td>
                                            : <td> </td>}

                                        {item.announcement ?
                                            <td>{item.announcement}</td>
                                            : <td> </td>}

                                    </tr>
                                </React.Fragment>
                            ))
                    ) : (<tr>Loading...</tr>)}
                

            </tbody>
        </div>
    )
}