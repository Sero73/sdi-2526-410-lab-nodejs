import React from "react";
import "../assets/DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ isOpen, songName, onConfirm, onCancel }) => {
    if (!isOpen || !songName) return null;

    const isInvalid = !songName || songName.trim() === "";

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirmar eliminación</h3>
                <p>
                    ¿Estás seguro de que deseas eliminar la canción: <strong>{songName}</strong>?
                </p>
                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn-confirm"
                        onClick={onConfirm}
                        disabled={isInvalid}
                    >
                        Confirmar
                    </button>
                    <button className="btn-cancel" type="button" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;