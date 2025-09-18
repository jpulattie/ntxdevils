'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTeam } from '../teamChoice';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'
import { useLogin } from '../loginProvider.js'



const pages = [
    { name: 'Teams', link: "./adminTeams" },
    { name: 'Schedules', link: "./adminSchedules" },
    { name: 'Info', link: "./adminInfo" },
    { name: 'Photos', link: "./adminPhotos" },
    { name: 'Sponsors', link: "./adminSponsors" },
    { name: 'Announcements', link: "./adminAnnouncements" }
]


export default function Admin() {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const {login, setLogin} = useLogin();
    let query;
    const router = useRouter();
    const message = "Incorrect Username & Password Combination. Please try again"


    function loginScreen() {
        console.log(username);
        console.log(password)
        console.log(process.env.NEXT_PUBLIC_USERNAME)
        console.log(process.env.NEXT_PUBLIC_PASSWORD)
        console.log('login check', (username === process.env.NEXT_PUBLIC_USERNAME && password === process.env.NEXT_PUBLIC_PASSWORD))
        if (username === process.env.NEXT_PUBLIC_USERNAME && password === process.env.NEXT_PUBLIC_PASSWORD) {
            console.log('LOGGING IN');
            setLogin(true)
            router.push('/loggedin')
        } else {
            alert(message);
        }
        ;
    };

    



    return (
        <div className="w-full min-h-screen">
            <div className="w-full">

                <Field>
                    <Label className="font-bold flex justify-center px-2 py-3">Username</Label>

                    <Input
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        name="username"
                        label="Username"
                        placeholder='username'
                        onChange={(e) => setUsername(e.target.value)}
                    /></Field>
                <Field>
                    <Label className="font-bold flex justify-center px-2 py-3">Password</Label>

                    <Input
                        className="border border-myrtleGreen px-3 py-1 border-1"
                        name="password"
                        placeholder='password'
                        onChange={(e) => setPassword(e.target.value)}
                    /></Field>
                    <Field>
                <button
                    type="submit"
                    className="text-lg font-bold bg-myrtleGreen text-white px-4 py-2 mt-4 justify-center rounded-2xl"

                    onClick={() => {
                        console.log('clicked')
                        loginScreen();
                    }}
                >Login</button></Field>

            </div>
        </div >
    )
}
