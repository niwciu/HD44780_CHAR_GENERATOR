import React, { useState } from 'react';
import { FaTimes as CancelIcon, FaCheck as OkIcon } from 'react-icons/fa'; // Import ikon
import './CharNameModal.css'; // Stylizacja modala

const CharNameModal = ({ isOpen, onClose, onSave, existingNames }) => {
    const [newCharName, setNewCharName] = useState('');

    // Obsługa zmiany nazwy
    const handleNameChange = (event) => {
        setNewCharName(event.target.value);
    };

    // Obsługa kliknięcia OK
    const handleOk = () => {
        const trimmedName = newCharName.trim();

        // Sprawdzamy, czy nazwa już istnieje (ignorujemy wielkość liter)
        if (existingNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
            alert('Char with this name already exists!'); // Możesz zmienić na inną metodę obsługi
            return;
        }

        if (trimmedName.length > 0) {
            onSave(trimmedName); // Przekazujemy nazwę do funkcji onSave
            setNewCharName(''); // Resetujemy pole
        }
    };

    // Jeśli modal nie jest otwarty, nie renderujemy nic
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Char name</h3>
                <input
                    type="text"
                    placeholder="Enter name"
                    value={newCharName}
                    onChange={handleNameChange}
                />
                <div className="modal-buttons">
                    <button onClick={onClose}>
                        <CancelIcon className="button-icon" />
                        Cancel
                    </button>
                    <button onClick={handleOk} disabled={newCharName.trim().length === 0}>
                        <OkIcon className="button-icon" />
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharNameModal;