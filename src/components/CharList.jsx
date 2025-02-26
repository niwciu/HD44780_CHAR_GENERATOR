import PropTypes from 'prop-types';
import './CharList.css';

const CharList = ({
    title,
    chars,
    onSelectChar,
    selectedChar,
    onDeleteSelected,
    onDeleteAll,
    isBankSelected
}) => {
    return (
        <div className="char-list-containter">
            <h3>{title}</h3>
            <div className="char-list">
                {chars.length === 0 ? (
                    <div className="hint-message">
                        {isBankSelected !== undefined ? (
                            isBankSelected ? (
                                "The selected bank is empty."
                            ) : (
                                "No character bank selected, please select a character bank from the list above."
                            )
                        ) : (
                            "No characters created yet. Use Create New Char button to start character designing"
                        )}
                    </div>
                ) : (
                    <ul>
                        {chars.map((char, index) => (
                            <li
                                key={index}
                                className={selectedChar === index ? 'selected' : ''}
                                onClick={() => onSelectChar(index)}
                            >
                                {char.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="char-list-buttons-row">
                <button
                    className="char-list-button"
                    onClick={() => onDeleteSelected?.(selectedChar)}
                    disabled={selectedChar === null}
                >
                    {isBankSelected ? "Remove Selected" : "Delete selected"}
                </button>
            </div>
            <div className="char-list-buttons-row">
                <button
                    className="char-list-button"
                    onClick={onDeleteAll}
                    disabled={chars.length === 0}
                >
                    {isBankSelected ? "Remove All" : "Delete All"}
                </button>
            </div>
        </div>
    );
};

CharList.propTypes = {
    title: PropTypes.string.isRequired,
    chars: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    onSelectChar: PropTypes.func.isRequired,
    selectedChar: PropTypes.number,
    onDeleteSelected: PropTypes.func,
    onDeleteAll: PropTypes.func.isRequired,
    isBankSelected: PropTypes.bool
};

CharList.defaultProps = {
    selectedChar: null,
    onDeleteSelected: null,
    isBankSelected: undefined
};

export default CharList;