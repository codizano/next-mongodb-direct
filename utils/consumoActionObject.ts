//Este ejemplo acepta obeto directamente
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

    let consumoData: ConsumoData;
    if (data instanceof FormData) {
      const fecha = data.get("fecha") as string;
      const descripcion = data.get("descripcion") as string;
      const monto = Number(data.get("monto"));

      if (!fecha || !descripcion || isNaN(monto)) {
        throw new Error("Fecha, descripcion y monto son requeridos");
      }

      consumoData = { fecha, descripcion, monto };
    } else {
      consumoData = data;
    }

    const newConsumo = new Consumo(consumoData);
    const savedConsumo = await newConsumo.save();

    // Convert the Mongoose document to a plain JavaScript object
    // and only include the fields we want
    const plainGasto: ConsumoData = {
      fecha: savedConsumo.fecha,
      descripcion: savedConsumo.descripcion,
      monto: savedConsumo.monto,
    };

    return { success: true, gasto: plainGasto };
  } catch (error: any) {
    console.error("Error al añadir gasto:", error);
    return { success: false, error: error.message };
  }
};

export { addConsumo };
