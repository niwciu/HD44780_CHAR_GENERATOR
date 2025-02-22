import React, { useState } from 'react';
import { FaTimes as CancelIcon, FaCheck as OkIcon } from 'react-icons/fa'; // Import ikon
import './BankNameModal.css'; // Stylizacja modala

const BankNameModal = ({ isOpen, onClose, onSave, existingNames }) => {
    const [newBankName, setNewBankName] = useState('');

    // Obsługa zmiany nazwy
    const handleNameChange = (event) => {
        setNewBankName(event.target.value);
    };

    // Obsługa kliknięcia OK
    const handleOk = () => {
        const trimmedName = newBankName.trim();

        // Sprawdzamy, czy nazwa już istnieje (ignorujemy wielkość liter)
        if (existingNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
            alert('Bank with this name already exists!'); // Możesz zmienić na inną metodę obsługi
            return;
        }

        if (trimmedName.length > 0) {
            onSave(trimmedName); // Przekazujemy nazwę do funkcji onSave
            setNewBankName(''); // Resetujemy pole
        }
    };

    // Jeśli modal nie jest otwarty, nie renderujemy nic
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Bank name</h3>
                <input
                    type="text"
                    placeholder="Enter name"
                    value={newBankName}
                    onChange={handleNameChange}
                />
                <div className="modal-buttons">
                    <button onClick={onClose}>
                        <CancelIcon className="button-icon" />
                        Cancel
                    </button>
                    <button onClick={handleOk} disabled={newBankName.trim().length === 0}>
                        <OkIcon className="button-icon" />
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankNameModal;