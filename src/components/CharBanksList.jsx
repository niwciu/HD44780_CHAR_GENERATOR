import React from 'react';
import './CharBanksList.css';

const CharBanksList = ({
    banks,
    onSelectBank,
    selectedBank,
    onDeleteSelected,
    onDeleteAll
}) => {
    return (
        <div className="bank-list-containter">
            <div className="bank-list">
                {banks.length === 0 ? (
                    <div className="hint-message">
                        No character banks created yet. Click "Create New Char Bank" to add one.
                    </div>
                ) : (
                    <ul>
                        {banks.map((bank, index) => (
                            <li
                                key={`bank-${index}`}
                                className={selectedBank === index ? 'selected' : ''}
                                onClick={() => onSelectBank(index)}
                            >
                                {bank.name} ({bank.characters.length}/8)
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="bank-list-buttons-row">
                <button
                    className="bank-list-button"
                    onClick={onDeleteSelected}
                    disabled={selectedBank === null || banks.length === 0}
                >
                    Delete sel.
                </button>
                <button
                    className="bank-list-button"
                    onClick={onDeleteAll}
                    disabled={banks.length === 0}
                >
                    Delete All
                </button>
            </div>
        </div>
    );
};

export default CharBanksList;