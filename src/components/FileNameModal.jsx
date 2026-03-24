import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes as CancelIcon, FaCheck as OkIcon } from 'react-icons/fa';
import './Dialog.css';

const FileNameModal = ({ isOpen, initialValue, onClose, onSave }) => {
    const [fileName, setFileName] = useState(initialValue);

    useEffect(() => {
        if (isOpen) {
            setFileName(initialValue);
        }
    }, [initialValue, isOpen]);

    if (!isOpen) {
        return null;
    }

    const trimmedName = fileName.trim();

    const handleSubmit = () => {
        if (!trimmedName) {
            return;
        }

        onSave(trimmedName);
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog-card">
                <h3>Save configuration</h3>
                <p className="dialog-description">
                    Enter the file name for the exported JSON configuration.
                </p>
                <input
                    type="text"
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={(event) => setFileName(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && trimmedName) {
                            handleSubmit();
                        }
                    }}
                />
                <div className="dialog-buttons">
                    <button type="button" onClick={onClose}>
                        <CancelIcon className="button-icon" />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!trimmedName}
                    >
                        <OkIcon className="button-icon" />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

FileNameModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    initialValue: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

FileNameModal.defaultProps = {
    initialValue: '',
};

export default FileNameModal;
