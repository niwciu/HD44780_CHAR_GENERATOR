import React, { useState } from 'react';
import './App.css';
import HD44780Character from './components/HD44780Character';
import CharNameModal from './components/CharNameModal';
import CharList from './components/CharList'; // Nowy komponent

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chars, setChars] = useState([]); // Lista stworzonych znaków
  const [selectedChar, setSelectedChar] = useState(null); // Aktualnie wybrany znak

  const handleCreateNewChar = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChar = (charName) => {
    const newChar = {
      name: charName,
      pixels: Array(8).fill().map(() => Array(5).fill(false)) // Domyślny stan pikseli
    };
    setChars([...chars, newChar]);
    handleCloseModal();
  };

  const handleSelectChar = (index) => {
    setSelectedChar(index);
  };

  const handleUpdateCharPixels = (updatedPixels) => {
    if (selectedChar !== null) {
      const updatedChars = [...chars];
      updatedChars[selectedChar].pixels = updatedPixels;
      setChars(updatedChars);
    }
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <button className="create-new-char-button" onClick={handleCreateNewChar}>
          Create New Char
        </button>
        <HD44780Character
          isActive={selectedChar !== null}
          pixels={selectedChar !== null ? chars[selectedChar].pixels : Array(8).fill().map(() => Array(5).fill(false))}
          onUpdatePixels={handleUpdateCharPixels}
        />
        <CharList chars={chars} onSelectChar={handleSelectChar} selectedChar={selectedChar} />
      </div>
      <div className="right-column">
        {/* Tutaj będzie prawa kolumna */}
      </div>

      <CharNameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChar}
      />
    </div>
  );
}

export default App;