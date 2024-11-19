import type { Collection } from "mongodb";
import type { NinoModel, Nino, LugarModel,Lugar } from "./types.ts";

export const fromModelToNino = async (
  NinoDB: NinoModel,
  LugarCollection: Collection<LugarModel>
): Promise<Nino> => {
    const ubicacion = await LugarCollection
    .findOne({ _id: NinoDB.ubicacion }); // Buscar un solo ID de ubicación

  // Si no se encuentra la ubicación, retornamos null o manejamos el error
  if (!ubicacion) {
    throw new Error(`Ubicación con ID ${NinoDB.ubicacion} no encontrada`);
  }

  return {
    id: NinoDB._id!.toString(),
    nombre: NinoDB.nombre,
    comportamiento: NinoDB.comportamiento,
    ubicacion: ubicacion.map((b) => fromModelToLugar(b)),
  };
};

export const fromModelToLugar = (model: LugarModel): Lugar => ({
  id: model._id!.toString(),
  nombre: model.nombre,
  coordenadas: model.coordenadas,
  numero_ninos_buenos: model.numero_ninos_buenos,
});