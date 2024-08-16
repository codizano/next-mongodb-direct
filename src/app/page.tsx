"use client";
import { useRef, useState } from "react";
import { addConsumo } from "../../utils/consumoAction";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fechaError, setFechaError] = useState<string | null>(null);
  const [montoError, setMontoError] = useState<string | null>(null);
  const [descripcionError, setDescripcionError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const fecha = formData.get("fecha") as string;
    const descripcion = formData.get("descripcion") as string;
    const monto = formData.get("monto") as string;

    // Validate fecha
    if (!fecha || fecha.length === 0) {
      setFechaError("Fecha es requerida");
      return; // Prevent form submission
    }

    // Validate monto
    if (!monto || isNaN(parseFloat(monto))) {
      setMontoError("Monto debe ser un número válido");
      return; // Prevent form submission
    }

    // Validate descripcion
    if (!descripcion || descripcion.length === 0) {
      setDescripcionError("Descripción es requerida");
      return; // Prevent form submission
    }

    setFechaError(null); // Clear any previous error
    setMontoError(null); // Clear any previous error
    setDescripcionError(null); // Clear any previous error

    const result = await addConsumo(formData);
    if (result.success) {
      formRef.current?.reset();
    } else {
      console.error(result.error);
    }
  };

  return (
    <>
      <form ref={formRef} action={handleSubmit}>
        <div>
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            onChange={() => setFechaError(null)} // Clear error on input change
          />
          {fechaError && <p style={{ color: "red" }}>{fechaError}</p>}
        </div>
        <div>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            onChange={() => setDescripcionError(null)} // Clear error on input change
          />
          {descripcionError && (
            <p style={{ color: "red" }}>{descripcionError}</p>
          )}
        </div>
        <div>
          <label htmlFor="monto">Monto</label>
          <input
            id="monto"
            name="monto"
            type="number"
            onChange={() => setMontoError(null)} // Clear error on input change
          />
          {montoError && <p style={{ color: "red" }}>{montoError}</p>}
        </div>
        <button type="submit">Guardar gasto</button>
      </form>
    </>
  );
}
