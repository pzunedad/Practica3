import {ObjectId, type OptionalId} from "mongodb";

export type Nino = {
    id: string;
    nombre: string; // Nombre del niño (unico y obligatorio)
    comportamiento: "bueno" | "malo"; // Comportamiento del niño
    ubicacion: Lugar; // ID de la ubicación donde se encuentra el niño
  };
  
export type Lugar = {
    id: string;
    nombre: string; // Nombre del lugar (único y obligatorio)
    coordenadas: {
      lat:number,
      lon:number,
  }, // Coordenadas del lugar
    numero_ninos_buenos: number; // Número de niños buenos asociados a este lugar
};

export type NinoModel = OptionalId<{
    nombre: string; 
    comportamiento: "bueno" | "malo"; 
    ubicacion: ObjectId; 
  }>;
  
export type LugarModel = OptionalId<{
    nombre: string; 
    coordenadas: {
        lat:number,
        lon:number,
    },
    numero_ninos_buenos: number; 
}>;
  
  