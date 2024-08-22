"use server";

import dbConnect from "../lib/dbConnect";
import Consumo from "../model/Consumo";

interface ConsumoData {
  fecha: string;
  descripcion: string;
  monto: number;
}

const addConsumo = async (
  data: ConsumoData | FormData
): Promise<{ success: boolean; gasto?: ConsumoData; error?: string }> => {
  try {
    await dbConnect();

    let fecha: string, descripcion: string, monto: number;
    if (data instanceof FormData) {
      fecha = data.get("fecha") as string;
      descripcion = data.get("descripcion") as string;
      monto = Number(data.get("monto"));
    } else {
      ({ fecha, descripcion, monto } = data);
    }

    if (!fecha || !descripcion || !monto) {
      throw new Error("Fecha, descripcion y monto son requeridos");
    }

    const newConsumo = new Consumo({ fecha, descripcion, monto });
    const savedConsumo = await newConsumo.save();

    // Convertir a un objeto plano y seleccionar solo los campos que necesitamos
    const plainConsumo: ConsumoData = {
      fecha: savedConsumo.fecha,
      descripcion: savedConsumo.descripcion,
      monto: savedConsumo.monto,
      // Agrega aquí cualquier otro campo que necesites
    };

    return { success: true, gasto: plainConsumo };
  } catch (error: any) {
    console.error("Error al añadir gasto:", error);
    return { success: false, error: error.message };
  }
};

export { addConsumo };
