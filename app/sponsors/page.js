'use client'

import { useState, useEffect } from 'react'
import React, { Fragment } from 'react';
import Navbar from "../Navbar";


export default function Sponsors() {

    const [data, setData] = useState([]);

    let info_response;
    let query = 'select * from sponsor;';

    useEffect(() => {
        async function db_query() {
            try {
                console.log('sending API request to route')//, api_request)
                const response = await fetch('api/sponsor/', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
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
                console.log('problem - need to clean up error catching5')
                console.log('data:', data)
            }
        }

        db_query();
    }, []);
    return (
        <div>
            <Navbar />
            <h1><strong>Sponsors</strong></h1>
            <table>
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Sponsor</th>
                        <th>Level</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Website</th>
                        <th>Bio</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data
                            .filter(item => item !== null && item !== undefined)
                            .map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        {item.sponsor_photo ?
                                            <td><img src={item.sponsor_photo} alt={`$[item.sponsor_name} photo`} /></td>
                                            : <td> </td>}

                                        {item.sponsor_name ?
                                            <td>{item.sponsor_name}</td>
                                            : <td> </td>}

                                        {item.sponsor_level ?
                                            <td>Level: {item.sponsor_level}</td>
                                            : <td> </td>}
                                    </tr>
                                    <tr>

                                        {item.sponsor_address ?
                                            <td>{item.sponsor_address}</td>
                                            : <td> </td>}

                                        {item.sponsor_phone ?
                                            <td>{item.sponsor_phone}</td>
                                            : <td> </td>}

                                        {item.sponsor_website ?
                                            <td><a href={`${item.sponsor_website}`} target="_blank">Link</a></td>
                                            : <td> </td>}

                                        {item.sponsor_bio ?
                                            <td>{item.sponsor_bio}</td>
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

/*

sponsor_name VARCHAR(225),
sponsor_level VARCHAR(225),
sponsor_address VARCHAR(225),
sponsor_website VARCHAR(225),
sponsor_phone VARCHAR(225),
sponsor_bio TEXT,

<table>
<tr>
<th>Company</th>
<th>Contact</th>
<th>Country</th>
</tr>
<tr>
<td>Alfreds Futterkiste</td>
<td>Maria Anders</td>
<td>Germany</td>
</tr>
<tr>
<td>Centro comercial Moctezuma</td>
<td>Francisco Chang</td>
<td>Mexico</td>
</tr>
</table>
*/