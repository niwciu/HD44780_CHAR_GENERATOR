import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes as CancelIcon, FaCheck as OkIcon } from 'react-icons/fa';
import './CharNameModal.css';

const CharNameModal = ({ isOpen, onClose, onSave, existingNames }) => {
    const [newCharName, setNewCharName] = useState('');

    const handleNameChange = (event) => {
        setNewCharName(event.target.value);
    };

    const handleOk = () => {
        const trimmedName = newCharName.trim();

        if (existingNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
            alert('Char with this name already exists!');
            return;
        }

        if (trimmedName.length > 0) {
            onSave(trimmedName);
            setNewCharName('');
        }
    };

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
                    <button
                        onClick={handleOk}
                        disabled={newCharName.trim().length === 0}
                    >
                        <OkIcon className="button-icon" />
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

CharNameModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    existingNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CharNameModal;