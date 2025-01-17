const mysql2 =require('mysql2')

const db = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DBPASS,
    database: "team_database"
});



export async function POST (request) {
    try {
        const body = await request.json();
        console.log('body:', body)
        const request_body = body.api_request
        console.log('body.api_request:', request_body)
        const [results, fields] = await db.promise().query(request_body);
        console.log('results:', results);
        console.log('fields:', fields);

        let message = [1,2,3,4,5];
        console.log(message)
    
        return new Response(JSON.stringify({ results }, ), {
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









   /* console.log('api call made it to api/info/route')
    try {
        const body = await req.json();
        console.log('body:', body)

    } catch {

    }

    return '1';
}*/