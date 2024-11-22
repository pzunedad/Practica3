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
    const ninos = await ninoCollection.find({ behavior: "malo" }).toArray();
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

//POST 

export const postNino = async (NinoCollection: Collection<NinoModel>, LugarCollection: Collection<LugarModel>, nombre: string, comportamiento: "bueno" | "malo", ubicacion: string) => {

    // Validación básica
    if (!nombre || !comportamiento || !ubicacion) {
      throw new Error( "Error: Todos los campos son obligatorios" );
    }

    // Verificar que la ubicación existe
    const lugar = await LugarCollection.findOne({ _id: new ObjectId(ubicacion) });
    if (!lugar) {
      throw new Error ("Error: Ubicación no encontrada");
    }

    // Crear el modelo del niño
    const nuevoNino = {
      nombre,
      comportamiento,
      ubicacion: new ObjectId(ubicacion),
    };

    // Insertar el niño en la colección
    const result = await NinoCollection.insertOne(nuevoNino);

    // Actualizar el contador si el niño es bueno
    if (comportamiento === "bueno") {
      await LugarCollection.updateOne(
        { _id: new ObjectId(ubicacion) },
        { $inc: { numero_ninos_buenos: 1 } }
      );
    }   

}


export const postLugar = async (LugarCollection: Collection<LugarModel>, nombre: string, coordenadas: {lat: number, lon: number}) =>{

    const { lat, lon } = coordenadas;
    // Validación básica
    if (!nombre || !coordenadas || !lat || !lon) {
      throw new Error ("Error: Todos los campos son obligatorios");
    }

    // Validar las coordenadas
    if (validarCoordenadas(lat,lon)) {
      throw new Error ("Error: Coordenadas inválidas");
    }

    // Crear el modelo de la ubicación
    const nuevaUbicacion = {
      nombre,
      coordenadas: { lat, lon },
      numero_ninos_buenos: 0, // Inicia con 0 niños buenos
    };

    // Insertar la ubicación en la colección
    const result = await LugarCollection.insertOne(nuevaUbicacion);

    return result;


}