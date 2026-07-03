import { useState } from "react";
import API from "../services/api";

function ImportExcel({ onImported }) {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const importar = async () => {

        if (!file) {

            alert("Seleccione un archivo Excel.");

            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            setLoading(true);

            const response = await API.post(

                `/songs/import`,

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            alert(response.data);

            if (onImported) {

                onImported();

            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data ||
        error.message);

        } finally {

            setLoading(false);

        }

    };

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

            <br /><br />

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