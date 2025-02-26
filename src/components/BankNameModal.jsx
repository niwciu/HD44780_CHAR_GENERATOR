import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes as CancelIcon, FaCheck as OkIcon } from 'react-icons/fa';
import './BankNameModal.css';

const BankNameModal = ({ isOpen, onClose, onSave, existingNames }) => {
    const [newBankName, setNewBankName] = useState('');

    const handleNameChange = (event) => {
        setNewBankName(event.target.value);
    };

    const handleOk = () => {
        const trimmedName = newBankName.trim();

        if (existingNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
            alert('Bank with this name already exists!');
            return;
        }

        if (trimmedName.length > 0) {
            onSave(trimmedName);
            setNewBankName('');
        }
    };

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
                    <button
                        onClick={handleOk}
                        disabled={newBankName.trim().length === 0}
                    >
                        <OkIcon className="button-icon" />
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

BankNameModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    existingNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BankNameModal;