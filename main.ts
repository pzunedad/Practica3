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
/*
const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const toRad = (deg) => (deg * Math.PI) / 180; // Conversión a radianes

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
    
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) ** 2;
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distancia en km

}
*/

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