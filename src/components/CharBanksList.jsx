import PropTypes from 'prop-types';
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
                        No character banks created yet. Click &quot;Create New Char Bank&quot; to add one.
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

CharBanksList.propTypes = {
    banks: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            characters: PropTypes.arrayOf(PropTypes.number).isRequired
        })
    ).isRequired,
    onSelectBank: PropTypes.func.isRequired,
    selectedBank: PropTypes.number,
    onDeleteSelected: PropTypes.func.isRequired,
    onDeleteAll: PropTypes.func.isRequired
};

CharBanksList.defaultProps = {
    selectedBank: null
};

export default CharBanksList;