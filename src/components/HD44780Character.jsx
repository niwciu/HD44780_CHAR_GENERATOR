import React, { useState, useEffect } from 'react';
import './HD44780Character.css';

const HD44780Character = ({ isActive, pixels, onUpdatePixels }) => {
    const isValidPixelArray = (arr) => {
        return Array.isArray(arr) &&
            arr.length === 8 &&
            arr.every(row => Array.isArray(row) && row.length === 5);
    };

    const [localPixels, setLocalPixels] = useState(() => {
        if (isValidPixelArray(pixels)) {
            return pixels.map(row => [...row]);
        }
        return Array(8).fill().map(() => Array(5).fill(false));
    });

    const [isDrawing, setIsDrawing] = useState(false);
    const [lastChangedPixel, setLastChangedPixel] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isValidPixelArray(pixels)) {
            setLocalPixels(pixels.map(row => [...row]));
            setError(null);
        } else {
            setError("Invalid pixel data format");
        }
    }, [pixels]);

    const togglePixel = (row, col) => {
        if (!isActive || error) return;

        const newPixels = localPixels.map((r, rIndex) =>
            r.map((pixel, cIndex) =>
                rIndex === row && cIndex === col ? !pixel : pixel
            )
        );
        setLocalPixels(newPixels);
        onUpdatePixels(newPixels);
    };

    // Dodaj brakujące funkcje
    const handleMouseDown = (row, col) => {
        setIsDrawing(true);
        togglePixel(row, col);
        setLastChangedPixel({ row, col });
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setLastChangedPixel(null);
    };

    const handleMouseMove = (row, col, event) => {
        if (isDrawing && event.buttons === 1) {
            if (!lastChangedPixel || lastChangedPixel.row !== row || lastChangedPixel.col !== col) {
                togglePixel(row, col);
                setLastChangedPixel({ row, col });
            }
        }
    };

    const handleMouseLeave = () => {
        setLastChangedPixel(null);
    };

    const clearAllPixels = () => {
        const clearedPixels = localPixels.map(row => row.map(() => false));
        setLocalPixels(clearedPixels);
        onUpdatePixels(clearedPixels);
    };

    const invertAllPixels = () => {
        const invertedPixels = localPixels.map(row => row.map(pixel => !pixel));
        setLocalPixels(invertedPixels);
        onUpdatePixels(invertedPixels);
    };

    if (error) {
        return (
            <div className="hd44780-character error">
                <h3>Error</h3>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className={`hd44780-character ${!isActive ? 'inactive' : ''}`}>
            <div className="pixel-grid">
                {localPixels.map((row, rowIndex) => (
                    <div key={rowIndex} className="pixel-row">
                        {row.map((pixel, colIndex) => (
                            <div
                                key={colIndex}
                                className={`pixel ${pixel ? 'active' : ''}`}
                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                onMouseUp={handleMouseUp}
                                onMouseMove={(e) => handleMouseMove(rowIndex, colIndex, e)}
                                onMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="pixel-grid-func-buttons">
                <button
                    className="pixel-grid-button"
                    onClick={clearAllPixels}
                    disabled={!isActive || error}
                >
                    Clear
                </button>
                <button
                    className="pixel-grid-button"
                    onClick={invertAllPixels}
                    disabled={!isActive || error}
                >
                    Invert
                </button>
            </div>
        </div>
    );
};

export default HD44780Character;