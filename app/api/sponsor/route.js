const mysql2 =require('mysql2')

const db = mysql2.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBDATABASE
});



export async function POST (request) {
    try {
        const body = await request.json();
        console.log('body:', body)
        const request_body = body.query
        console.log('body.api_request:', request_body)
        const [results, fields] = await db.promise().query(request_body);
        console.log('results:', results);
        console.log('fields:', fields);

        
      
    
        return new Response(JSON.stringify({ results }), {
          status: 201,
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
