import React from 'react';
import './CharList.css';

const CharList = ({ chars, onSelectChar, selectedChar }) => {
    return (
        <div className = "char-list-containter">
            <h3>Created Chars</h3>
            <div className="char-list">
                
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
            </div>
        </div>
    );
};

export default CharList;