import type { Collection } from "mongodb";
import type { NinoModel, Nino, LugarModel,Lugar } from "./types.ts";

export const fromModelToNino = async (
  NinoDB: NinoModel,
  LugarCollection: Collection<LugarModel>
): Promise<Nino> => {
  const ubicacion = await LugarCollection.findOne({ _id: NinoDB.ubicacion });
  if (!ubicacion) {
      throw new Error("Location not found");
  }
  return {
      id: NinoDB._id!.toString(),
      nombre: NinoDB.nombre,
      comportamiento: NinoDB.comportamiento,
      ubicacion: fromModelToLugar(ubicacion),
  };
}

export const fromModelToLugar = (model: LugarModel): Lugar => ({
  id: model._id!.toString(),
  nombre: model.nombre,
  coordenadas: model.coordenadas,
  numero_ninos_buenos: model.numero_ninos_buenos,
});

export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radio de la Tierra en km
  const toRad = (deg: number) => (deg * Math.PI) / 180; // Conversión a radianes

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en km
};

export function validarCoordenadas(lat: number, lon: number): boolean {
  // Validar latitud: debe estar entre -90 y 90
  if (lat < -90 || lat > 90) {
    return false;
  }

  // Validar longitud: debe estar entre -180 y 180
  if (lon < -180 || lon > 180) {
    return false;
  }

  return true;
}