// =========================
// IMPORTS
// =========================
import { useState } from "react";
import Swal from "sweetalert2";
import API from "../../services/api";

// =========================
// COMPONENTE
// =========================
function ImportExcel({ onImported }) {

// =========================
// STATES
// =========================

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

// =========================
// IMPORTAR EXCEL
// =========================

    const importar = async () => {

        if (!file) {

            Swal.fire({

                icon: "warning",
                title: "Archivo requerido",
                text: "Selecciona un archivo Excel."

            });

            return;

        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            setLoading(true);

            const response = await API.post(

                "/songs/import",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            Swal.fire({

                icon: "success",
                title: "Importación exitosa",
                text: response.data,

                timer: 1800,
                showConfirmButton: false

            });

            setFile(null);

            if (onImported) {

                onImported();

            }

        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",
                title: "Error",

                text:

                    error.response?.data ||

                    "No fue posible importar el archivo."

            });

        } finally {

            setLoading(false);

        }

    };

    // =========================
    // HTML
    // =========================

    return (

        <div className="import-card">

            <h3>📥 Importar canciones</h3>

            <input

                type="file"

                accept=".xlsx,.xlsm"

                onChange={(e) =>

                    setFile(e.target.files[0])

                }

            />

            <br />
            <br />

            <button

                onClick={importar}

                disabled={loading}

            >

                {

                    loading

                        ? "Importando..."

                        : "Importar"

                }

            </button>

        </div>

    );

}

export default ImportExcel;