import { MongoClient } from 'mongodb'
import type {} from "./types.ts";
import {} from "./utils.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if(!MONGO_URL){
  console.error("Mongo url is not set")
  Deno.exit(1);
}
const client = new MongoClient(MONGO_URL);
await client.connect();

// Database Name
const db = client.db("Ubicacion");

//const personasCollection = db.collection<personasModel>("personas");
//const friendsCollection = db.collection<friendsModel>("friends");

const handler = async (req:Request): Promise<Response> =>{
    const method = req.method;
    const url = new URL (req.url);
    const path = url.pathname;

    if(method === "GET"){
        if(path === "/ninos/buenos"){
        } else if(path  === "/ninos/malos"){

        } else if(path === "/entregas"){

        } else if(path === "/ruta"){

        }
    } else if(method === "POST"){
        if(path === "/ubicacion"){

        } else if (path === "/ninos"){

        }
    }
    return new Response ("endpoint not found", {status: 404});
}

Deno.serve({ port: 6768 }, handler);