import {ObjectId, type OptionalId} from "mongodb";

export enum Estado{
    bueno = "bueno",
    malo = "malo"
}


export type Nino = {
    nombre: string; // Nombre del niño (unico y obligatorio)
    comportamiento: Estado; // Comportamiento del niño
    ubicacion: Lugar; // ID de la ubicación donde se encuentra el niño
  };
  
export type Lugar = {
    nombre: string; // Nombre del lugar (único y obligatorio)
    coordenadas: Estado; // Coordenadas del lugar
    numero_ninos_buenos: number; // Número de niños buenos asociados a este lugar
};

export type NinoModel = OptionalId<{
    nombre: string; 
    comportamiento: Estado; 
    ubicacion: ObjectId; 
  }>;
  
export type LugarModel = OptionalId<{
    nombre: string; 
    coordenadas: Estado; 
    numero_ninos_buenos: number; 
}>;
  
  