import { useState } from "react";
import { apiFetch } from "../services/ApiService.js";
import SongToast from "./SongToast";
import "../assets/SongForm.css";

const SongForm = ({ onSongAdded }) => {
    const [title, setTitle] = useState("");
    const [kind, setKind] = useState("");
    const [price, setPrice] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("error");

    const validateTitle = (value) => {
        if (!value || value.trim().length < 3) {
            return "El título debe tener al menos 3 caracteres";
        }
        if(value.trim().length >50){
            return "El titulo no puede tener más de 50 caracteres";
        }
        return "";
    };

    const validateKind = (value) => {
        if (!value || value.trim().length < 3) {
           return "El género debe tener al menos 3 caracteres";
        }

        if (value.trim().length > 40) {
            return "El género no puede tener más de 40 caracteres";
        }
        return "";
    };

    const validatePrice = (value) => {
        const priceNum = parseFloat(value);
        if (isNaN(priceNum) || priceNum <= 0 || !value) {
            return "El precio debe ser un número positivo";
        }
        if(priceNum > 9999){
            return "El precio no puede ser mayor a 9999"
        }
        return "";
    }


    const handleSubmit =  (e) => {
        e.preventDefault();
        setToastMessage("");

        const titleError = validateTitle(title);
        const kindError = validateKind(kind);
        const priceError = validatePrice(price);

        if (titleError || kindError || priceError) {
            setToastMessage(titleError || kindError || priceError);
            return;
        }

        apiFetch("http://localhost:8081/api/v1.0/songs", {
            method: "POST",
            body: JSON.stringify({
                title: title.trim(),
                kind: kind.trim(),
                price : parseFloat(price)
            })
        })
            .then(() => {
                setTitle("");
                setKind("");
                setPrice("");
                setToastMessage("Canción añadida correctamente");
                setToastType("success");

                if (onSongAdded) {
                    setTimeout(() => {
                        onSongAdded();
                    },2000);
                }
            })
            .catch((err) => {
                setToastType("error")
                setToastMessage(err.message);
            });
    };

    return (
        <div className="song-container">
            <h2>Añadir canción</h2>
            <SongToast
                message={toastMessage}
                type = {toastType}
                onClose={() => setToastMessage("")} />
            <form onSubmit={handleSubmit} className="song-form">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Género"
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <button type="submit">Añadir</button>
            </form>
        </div>
    );
};

export default SongForm;