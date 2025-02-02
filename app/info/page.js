'use client'

import { useState, useEffect } from 'react'

export default function Info() {
    const [ data, setData ] = useState([]);
    
    let info_response; 
    let api_request = 'select * from info;';

    useEffect(()=>{
        async function db_query () {
            try {
                console.log('sending API request to route')//, api_request)
            const response = await fetch('api/info/', {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({api_request})
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
            console.log('problem - need to clean up error catching')
            console.log('data:', data)
        }
        }

        db_query();
    }, []);
    return(
        <div>
            <h1><strong>Info</strong></h1>
            <ul>
                {data && data.length > 0 ? (
                    data
                    .filter(item => item !== null && item !== undefined)
                    .map((item, index) => (
                        <li key={index}>
                            <p><strong>{item.info_title}</strong>: {item.info_description}</p>
                            {item.info_link ?
                            <p><a href={`https://${item.info_link}`} target="_blank">Link</a></p>
                            : null}
                        </li>
                    ))
                ) : (<li>Loading...</li>)}
                
                
            </ul>
        </div>
    )
}