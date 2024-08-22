"use client";
import { useRef, useState } from "react";
import { addConsumo } from "../../utils/consumoAction";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fecha, setFecha] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [monto, setMonto] = useState<string>("");
  const [fechaError, setFechaError] = useState<string | null>(null);
  const [montoError, setMontoError] = useState<string | null>(null);
  const [descripcionError, setDescripcionError] = useState<string | null>(null);

  const resetForm = () => {
    setFecha("");
    setDescripcion("");
    setMonto("");
    setFechaError(null);
    setMontoError(null);
    setDescripcionError(null);
  };

  const handleSubmit = async (formData: FormData) => {
    const fechaValue = formData.get("fecha") as string;
    const descripcionValue = formData.get("descripcion") as string;
    const montoValue = formData.get("monto") as string;

    // Validate fecha
    if (!fechaValue || fechaValue.length === 0) {
      setFechaError("Fecha es requerida");
      return; // Prevent form submission
    }

    // Validate monto
    if (!montoValue || isNaN(parseFloat(montoValue))) {
      setMontoError("Monto debe ser un número válido");
      return; // Prevent form submission
    }

    // Validate descripcion
    if (!descripcionValue || descripcionValue.length === 0) {
      setDescripcionError("Descripción es requerida");
      return; // Prevent form submission
    }

    setFechaError(null);
    setMontoError(null);
    setDescripcionError(null);

    const result = await addConsumo(formData);
    if (result.success) {
      resetForm();
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <form ref={formRef} action={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value);
              setFechaError(null);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {fechaError && (
            <p className="mt-2 text-sm text-red-600">{fechaError}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
              setDescripcionError(null);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {descripcionError && (
            <p className="mt-2 text-sm text-red-600">{descripcionError}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="monto"
            className="block text-sm font-medium text-gray-700"
          >
            Monto
          </label>
          <input
            id="monto"
            name="monto"
            type="number"
            value={monto}
            onChange={(e) => {
              setMonto(e.target.value);
              setMontoError(null);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {montoError && (
            <p className="mt-2 text-sm text-red-600">{montoError}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar gasto
        </button>
      </form>
    </div>
  );
}
