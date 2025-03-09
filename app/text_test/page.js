'use client'

import { useState } from 'react';
import Navbar from "../Navbar";

export default function TextTest() {
    const [send, setSend] = useState("");  // Store input value
    const [info, setInfo] = useState("");  // Store API response

    // Function to send the message to the API
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        try {
            console.log('Sending message to API:', send);

            const response = await fetch('/api/text', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: send }) // Send user input
            });


            const result = await response.json();
            console.log('result', result)
            console.log('API Response:', result.responseMessage);
            setInfo(result.responseMessage); // Update state with API response

        } catch (error) {
            console.error('Error in API request:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <h1 className="inline-block text-lg font-bold text-white bg-myrtleGreen justify-center rounded px-3 py-2">
                <strong>Text Test</strong>
            </h1>

            {/* Form to submit the message */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={send}
                    onChange={(e) => setSend(e.target.value)} // Update state as user types
                    placeholder="Enter message"
                    className="border p-2 rounded"
                />
                <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded">
                    Send
                </button>
            </form>

            {/* Display API response */}
            <h3>Text from website: {info}</h3>
        </div>
    );
}
