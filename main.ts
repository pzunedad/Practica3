import { MongoClient } from 'mongodb'
import type {NinoModel, LugarModel} from "./types.ts";
import { getNinosBuenos, getNinosMalos, getEntregas, getRuta, postLugar, postNino } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if(!MONGO_URL){
  console.error("Mongo url is not set")
  Deno.exit(1);
}
const client = new MongoClient(MONGO_URL);
await client.connect();

// Database Name
const db = client.db("Ubicacion");

const ninosCollection = db.collection<NinoModel>("ninos");
const lugarCollection = db.collection<LugarModel>("lugares");

const handler = async (req:Request): Promise<Response> =>{
    const method = req.method;
    const url = new URL (req.url);
    const path = url.pathname;

    if(method === "GET"){
        if(path === "/ninos/buenos"){
            const ninos = await getNinosBuenos(ninosCollection, lugarCollection);
            return new Response(JSON.stringify(ninos), { status: 200 });
        } else if(path  === "/ninos/malos"){
            const ninos = await getNinosMalos(ninosCollection, lugarCollection);
            return new Response(JSON.stringify(ninos), { status: 200 });
        } else if(path === "/entregas"){
            const entregas = await getEntregas(lugarCollection);
            return new Response(JSON.stringify(entregas), { status: 200 });
        } else if(path === "/ruta"){
            const ruta = await getRuta(lugarCollection);
            return new Response(JSON.stringify(ruta), { status: 200});
        }
    } else if(method === "POST"){
        if(path === "/ubicacion"){
            const {nombre, coordenadas} = await req.json();
            const ubicacion = await postLugar(lugarCollection,nombre,coordenadas);
            return new Response(JSON.stringify(ubicacion), { status: 200});
        } else if (path === "/ninos"){
            const {nombre, estado, ubicacion} = await req.json();
            const nino = await postNino(ninosCollection,lugarCollection,nombre, estado, ubicacion);
            return new Response(JSON.stringify(nino), { status: 200});
        }
    }
    return new Response ("endpoint not found", {status: 404});
}

Deno.serve({ port: 6768 }, handler);