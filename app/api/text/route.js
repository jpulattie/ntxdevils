import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


const mysql2 = require('mysql2')

const db = mysql2.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBDATABASE
});

let responseMessage;

let current_time = Date.now();
/*
let loggedInTime;
let loggedIn = false;
let curr_status = 8;
//let curr_status;

let generate; // used to set to true and generate a sessionID for a guest user
let login_time;
let curr_time;
let new_announcement_title;
let new_announcement;
let new_player_name;
let new_position;
let new_year_playing;
let new_bio;
let new_picture;
let new_picture_key;
let new_info_title;
let new_info_description;
let new_info_link;
let new_sponsor_name;
let new_sponsor_level;
let new_sponsor_address;
let new_sponsor_website;
let new_sponsor_phone;
let new_sponsor_bio;
let new_sponsor_photo;
let new_event_name;
let new_event_type;
let new_event_date;
let new_event_time;
let new_event_description;
let new_event_address;
let new_opponent;
let new_team_score;
let new_opponent_score;
let new_result;
*/




function loginTime() {
    const now = Date.now();
    console.log('time of login:', now)
    console.log('time of login type:', typeof now)
    return now
}

function timeCheck(loggedInTime) {
    let timedOut = false;
    if (Date.now() - loggedInTime >= 30 * 60 * 1000) {
        timedOut = true;
        // query set loggedIn to false
    }
    return timedOut
}


export async function POST(request) {
    console.log('request received')
    console.log('request raw', request)
    try {
        const formData = await request.formData();
        const message = formData.get('Body');
        const sender = formData.get('From');
       // const body = await request.json();
       // const message = body.message;
        console.log('body sent from text:', message)
        //const sender = body.from;
        console.log('sender', sender)
        const get_all = "select * from new_text";
        const [results, fields] = await db.promise().query(get_all);
        console.log('results', results)
        console.log('current state', results[0].curr_status)
        let curr_status = Number(results[0].curr_status);
        let id = Number(results[0].id);
        console.log('curr status variable', curr_status);
        console.log('body sent from text:', message)
        console.log('id', results[0].id)

        //make db query select * from new_text;
        //parse that response and set variables

        switch (curr_status) {
            case 8: // logged out, message received, check passcode
                console.log('initial login-', message)
                if (message === 74555 || message === "74555") {
                    console.log('correct passcode')
                    let login_time = loginTime();
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")
                    let query = `update new_text set curr_status = 0, login_time = ${login_time}, loggedIn = "true"; `
                    await db.promise().query(query);
                    let get_query = "select * from new_text; "
                    const [results, fields] = await db.promise().query(get_query)
                    console.log("end of login results", results[0])
                    break;
                } else if (timeCheck(results[0].login_time) === false && loggedIn === true) {
                    console.log("session timed out")
                    responseMessage = "Session timed out. Please enter 5 digit passcode"
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = "insert into new_text (curr_status) values (8); "
                    await db.promise().query(new_query);
                    break;
                } else {
                    console.log("not a valid passcode or a timed out situation")
                    responseMessage = "Please enter 5 digit passcode"
                    break;
                }
            case 0:

                if (message === 1 || message === "1" || message.toLowerCase() === "announcements" || message.toLowerCase() === "announcement") {
                    let query = `update new_text set curr_status = 10 where id= ${id}; `
                    await db.promise().query(query);
                    //curr_status = 10;
                    responseMessage = "Enter new announcement title\n Ex: 'Weather update'\n [enter 0 to return to menu or 'exit' to logout]"
                    break;
                } else if (message === 2 || message === "2" || message.toLowerCase() === "roster" || message.toLowerCase() === "rosters") {
                    let query = `update new_text set curr_status = 20 where id= ${id}; `
                    await db.promise().query(query);
                    //curr_status = 20;
                    responseMessage = "Enter new Player Name\n Ex: 'John Doe'\n or [enter 0 to return to menu or 'exit' to logout]"
                    break;
                } else if (message === 3 || message === "3" || message.toLowerCase() === "info" || message.toLowerCase() === "info") {
                    let query = `update new_text set curr_status = 30 where id= ${id}; `
                    await db.promise().query(query);
                    //curr_status = 30;
                    responseMessage = "Enter new Info Title\n Ex: 'Usafl Registration or Practice Location'\n or [enter 0 to return to menu or 'exit' to logout]"
                    break;
                } else if (message === 4 || message === "4" || message.toLowerCase() === "sponsor" || message.toLowerCase() === "sponsors") {
                    let query = `update new_text set curr_status = 40 where id= ${id}; `
                    await db.promise().query(query);
                    //curr_status = 40;
                    responseMessage = "Enter new Sponsor Name\n Ex: 'Bob Ross Painting'\n or [enter 0 to return to menu or 'exit' to logout]"
                    break;
                } else if (message === 5 || message === "5" || message.toLowerCase() === "event" || message.toLowerCase() === "events") {
                    let query = `update new_text set curr_status = 50 where id= ${id}; `
                    await db.promise().query(query);
                    //curr_status = 50;
                    responseMessage = "Enter new Event Type\n Ex: 'Game' or 'Social'\n or [enter 0 to return to menu or 'exit' to logout]"
                    break;
                } else {
                    responseMessage = "Invalid command.\n Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select"
                }
            case 9:
                if (message === 0 || message === '0') {
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")
                    let query = `update new_text set curr_status = 0 where id= ${id}; `
                    await db.promise().query(query);
                    //curr_status = 0;
                } else if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = "insert into new_text (curr_status) values (8); "
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"

                    //curr_status = 8;
                } else {
                    responseMessage = "Invalid Command.\n [enter 0 to return to menu or 'exit' to logout]"
                }


            case 10:
                if (message === 0 || message === '0') {
                    let query = `update new_text set curr_status = 0 where id= ${id}; `
                    await db.promise().query(query);
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")
                    break;
                } else if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = "insert into new_text (curr_status) values (8); "
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"

                    break;
                } else {
                    let insert = `update new_text set new_announcement_title = "${message}" where id= ${id};`
                    console.log('insert',insert)
                    await db.promise().query(insert);
                    responseMessage = "Please enter new announcement: \n[enter 0 to return to menu or 'exit' to logout]"
                    let query = `update new_text set curr_status = 11 where id= ${id}; `
                    await db.promise().query(query);
                    break;
                }

            case 11:
                console.log("at 11")
                if (message === 0 || message === '0') {
                    let query = `update new_text set curr_status = 0 where id= ${id}; `
                    await db.promise().query(query);
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")

                    break;
                } else if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = `update new_text set curr_status = 8 where id= ${id}; `
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"

                    break;
                } else {
                    console.log('here:');
                    console.log('message', message);

                    //console.log('results2', results)
                    //console.log('results[0]', results[0])
                    //console.log('id',id);
                    let insert = `update new_text set new_announcement = "${message}" where id= ${id};`
                    console.log("insert announcement-", insert)
                    await db.promise().query(insert);

                    let get_all = 'select * from new_text'
                    const [results, fields] = await db.promise().query(get_all)
                    console.log('results of new announce', results);
                    responseMessage = `New Announcement Title: ${results[0].new_announcement_title}\n New Announcement: ${results[0].new_announcement}\n to confirm enter 'CONFIRM' `
                    let query = `update new_text set curr_status = 12 where id= ${id}; `
                    await db.promise().query(query);
                    break;
                }
            case 12:
                console.log("RESULT PROBLEM", results[0].new_announcement)
                if (message === 0 || message === '0') {
                    let query = `update new_text set curr_status = 0 where id= ${id}; `
                    await db.promise().query(query);
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")

                    break;
                } else if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = "insert into new_text (curr_status) values (8); "
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"

                    break;
                } else if (message.toLowerCase() === 'confirm') {
                    let insert_to_main = `insert into announcements (program_id, announcement_title, announcement) values (1, "${results[0].new_announcement_title}", "${results[0].new_announcement}"); `
                    await db.promise().query(insert_to_main);
                    responseMessage = "Announcement Added.\n [enter 0 to return to menu or 'exit' to logout]"
                    let query = `update new_text set curr_status = 9 where id= ${id}; `
                    await db.promise().query(query);
                    break;
                }

            case 20:
                if (message === 0 || message === '0') {
                    let query = `update new_text set curr_status = 0 where id= ${id}; `
                    await db.promise().query(query);
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")

                    break;
                } else if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = `insert into new_text (curr_status) values (8); `
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"
                    break;
                } else {
                    let player_name = `update new_text set new_player_name= '${message}' where id = ${id}; `
                    await db.promise().query(player_name);
                    responseMessage = "Please enter Position for new player: \n[enter 0 to return to menu or 'exit' to logout]"
                    let query = `update new_text set curr_status = 21 where id= ${id}; `
                    await db.promise().query(query);
                    break;
                }
            case 21:
                if (message === 0 || message === '0') {
                    let query = `update new_text set curr_status = 0 where id= ${id}; `
                    await db.promise().query(query);
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")

                    break;
                } else if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = `insert into new_text (curr_status) values (8); `
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"

                    break;
                } else {
                    let player_pos = `update new_text set new_position= '${message}' where id = ${id}; `
                    await db.promise().query(player_pos);
                    responseMessage = "Please enter 'years playing' for new player: \n[enter 'exit' to logout]"
                    let query = `update new_text set curr_status = 22 where id= ${id}; `
                    await db.promise().query(query);
                    break;
                }
            case 22:
                let conversion = Number(message);
                console.log('conversion', conversion)
                console.log('type', typeof message);
                console.log('type conv', typeof conversion)
                console.log('conditional', !Number.isNaN(conversion))
                if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = `insert into new_text (curr_status) values (8); `
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"
                    break;
                } else if (Number.isNaN(conversion)){
                    responseMessage = "Please enter a NUMBER for years playing";
                    break;
                } else {
                    let year_playing = `update new_text set new_year_playing = '${message}' where id = ${id}; `
                    await db.promise().query(year_playing);
                    responseMessage = "Please enter Bio for new player: \n[enter 0 to return to menu or 'exit' to logout]"
                    let query = `update new_text set curr_status = 23 where id= ${id}; `
                    await db.promise().query(query);                    
                    break;
                }
            case 23:
                if (message === 0 || message === '0') {
                    let query = `update new_text set curr_status = 0 where id= ${id}; `
                    await db.promise().query(query);
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")

                    break;
                } else if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = `insert into new_text (curr_status) values (8; `
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"

                    break;
                } else {
                    let bio = `update new_text set new_bio = '${message}' where id = ${id}; `
                    await db.promise().query(bio);
                    responseMessage = `New player: ${results[0].new_player_name}\n Position: ${results[0].new_position}\nYear Playing: ${results[0].new_year_playing}\nBio: ${message}\n to confirm enter 'CONFIRM' `
                    let query = `update new_text set curr_status = 24 where id= ${id}; `
                    await db.promise().query(query);
                    break;
                }
            case 24:
                if (message === 0 || message === '0') {
                    let query = `update new_text set curr_status = 0 where id= ${id};  `
                    await db.promise().query(query);
                    responseMessage = ("Please select from the following menu:\n 1: Announcements \n 2: Players\n 3: Sponsors\n 4: Events\n Enter category name or number ex: '3' or 'sponsors' to select")

                    break;
                } else if (message.toLowerCase() === 'exit') {
                    let delete_query = "delete from new_text where id > 0; "
                    await db.promise().query(delete_query);
                    let new_query = `insert into new_text (curr_status) values (8); `
                    await db.promise().query(new_query);
                    responseMessage = "Logged out"

                    break;
                } else if (message.toLowerCase() === 'confirm') {
                    let insert_player_to_main = `insert into roster (team_id, player_name, position, year_playing, bio) values (1,"${results[0].new_player_name}", "${results[0].new_position}", ${results[0].new_year_playing}, "${results[0].new_bio}"); `                    
                    console.log('insert statement to main', insert_player_to_main);
                    await db.promise().query(insert_player_to_main);
                    responseMessage = "Player Added.\n [enter 0 to return to menu or 'exit' to logout]"

                    let query = `update new_text set curr_status = 9 where id= ${id}; `
                    await db.promise().query(query);
                    break;
                }
        }
        console.log('response message', responseMessage)

        if (senderNumber) {
            await twilioClient.messages.create({
                body: responseMessage,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: senderNumber 
            });
            console.log("Response sent to:", senderNumber);
        }
        return new Response(JSON.stringify({ responseMessage }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
