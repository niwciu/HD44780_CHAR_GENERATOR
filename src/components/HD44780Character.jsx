import React, { useState } from 'react';
import './HD44780Character.css';

const HD44780Character = () => {
    const [pixels, setPixels] = useState(
        Array(8).fill().map(() => Array(5).fill(false))
    );
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastChangedPixel, setLastChangedPixel] = useState(null); // Ostatnio zmieniony piksel

    // Funkcja do przełączania stanu piksela (niemutująca)
    const togglePixel = (row, col) => {
        setPixels((prevPixels) => {
            const newPixels = prevPixels.map((r) => [...r]); // Tworzymy nową tablicę
            newPixels[row][col] = !newPixels[row][col]; // Przełączamy stan piksela
            return newPixels;
        });
    };

    // Obsługa rozpoczęcia "malowania"
    const handleMouseDown = (row, col) => {
        setIsDrawing(true);
        togglePixel(row, col);
        setLastChangedPixel({ row, col }); // Zapamiętujemy ostatnio zmieniony piksel
    };

    // Obsługa zakończenia "malowania"
    const handleMouseUp = () => {
        setIsDrawing(false);
        setLastChangedPixel(null); // Resetujemy ostatnio zmieniony piksel
    };

    // Obsługa ruchu myszy z wciśniętym przyciskiem
    const handleMouseMove = (row, col, event) => {
        if (isDrawing && event.buttons === 1) {
            // Sprawdzamy, czy piksel był już zmieniony
            if (!lastChangedPixel || lastChangedPixel.row !== row || lastChangedPixel.col !== col) {
                togglePixel(row, col);
                setLastChangedPixel({ row, col }); // Zapamiętujemy ostatnio zmieniony piksel
            }
        }
    };

    // Obsługa opuszczenia piksela
    const handleMouseLeave = () => {
        setLastChangedPixel(null); // Resetujemy ostatnio zmieniony piksel
    };

    return (
        <div className="hd44780-character">
            <h3>Projektowanie znaku HD44780</h3>
            <div className="pixel-grid">
                {pixels.map((row, rowIndex) => (
                    <div key={rowIndex} className="pixel-row">
                        {row.map((pixel, colIndex) => (
                            <div
                                key={colIndex}
                                className={`pixel ${pixel ? 'active' : ''}`}
                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                onMouseUp={handleMouseUp}
                                onMouseMove={(event) => handleMouseMove(rowIndex, colIndex, event)}
                                onMouseLeave={handleMouseLeave} // Obsługa opuszczenia piksela
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HD44780Character;