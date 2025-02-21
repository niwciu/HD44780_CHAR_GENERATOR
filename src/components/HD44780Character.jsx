import React, { useState, useEffect } from 'react';
import './HD44780Character.css';

const HD44780Character = ({ isActive, pixels, onUpdatePixels }) => {
    const [localPixels, setLocalPixels] = useState(pixels);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastChangedPixel, setLastChangedPixel] = useState(null); // Ostatnio zmieniony piksel

    useEffect(() => {
        setLocalPixels(pixels);
    }, [pixels]);

    const togglePixel = (row, col) => {
        if (!isActive) return;
        const newPixels = localPixels.map((r, rIndex) =>
            r.map((pixel, cIndex) =>
                rIndex === row && cIndex === col ? !pixel : pixel
            )
        );
        setLocalPixels(newPixels);
        onUpdatePixels(newPixels);
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

    const clearAllPixels = () => {
        const clearedPixels = localPixels.map(row => row.map(() => false));
        setLocalPixels(clearedPixels);
        onUpdatePixels(clearedPixels);
    }

    return (
        <div className={`hd44780-character ${!isActive ? 'inactive' : ''}`}>
            <h3>HD44780 Char Designer</h3>
            <div className="pixel-grid">
                {localPixels.map((row, rowIndex) => (
                    <div key={rowIndex} className="pixel-row">
                        {row.map((pixel, colIndex) => (
                            <div
                                key={colIndex}
                                className={`pixel ${pixel ? 'active' : ''}`}
                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                onMouseUp={handleMouseUp}
                                onMouseMove={(event) => handleMouseMove(rowIndex, colIndex, event)}
                                onMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <button className="pixel-grid-button"  onClick={clearAllPixels}>
                Clear Pixel Matrix
            </button>
        </div>
    );
};

export default HD44780Character;