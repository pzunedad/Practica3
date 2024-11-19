import { Collection, ObjectId } from "mongodb";
import { NinoModel, LugarModel } from "./types.ts";
import { fromModelToNino, fromModelToLugar, validarCoordenadas, haversine } from "./utils.ts";

// Obtener niños buenos
export const getNinosBuenos = async (ninoCollection: Collection<NinoModel>, LugarCollection: Collection<LugarModel>) => {
    const ninos = await ninoCollection.find({ behavior: "bueno" }).toArray();
    return Promise.all(ninos.map(nino => fromModelToNino(nino, LugarCollection)));
};

// Obtener niños malos
export const getNinosMalos = async (ninoCollection: Collection<NinoModel>, LugarCollection: Collection<LugarModel>) => {
    const ninos = await ninoCollection.find({ behavior: "malos" }).toArray();
    return Promise.all(ninos.map(nino => fromModelToNino(nino, LugarCollection)));
};

// Entregas ordenadas de mayor a menor por cantidad de niños buenos
export const getEntregas = async (LugarCollection: Collection<LugarModel>) => {
    const entregas = await LugarCollection.find().sort({ninosBuenos: -1}).toArray();
    return entregas.map(fromModelToLugar);
}

// Distancia entre ubicaciones
export const getRuta = async (LugarCollection: Collection<LugarModel>) => {
    const rutas = await LugarCollection.find().sort({ninosBuenos: -1}).toArray();

    let distanciaTotal = 0;
    for(let i = 0; i < rutas.length -1;  i++){
        const { lat: lat1, lon: lon1 } = rutas[i].coordenadas;
        const { lat: lat2, lon: lon2 } = rutas[i + 1].coordenadas;
        distanciaTotal += haversine(lat1, lon1, lat2, lon2);
    }

    return distanciaTotal;
}
