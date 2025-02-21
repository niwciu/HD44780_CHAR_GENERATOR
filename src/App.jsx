import React, { useState } from 'react';
import './App.css';
import HD44780Character from './components/HD44780Character';
import CharNameModal from './components/CharNameModal'; // Import nowego komponentu

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obsługa otwarcia modala
  const handleCreateNewChar = () => {
    setIsModalOpen(true);
  };

  // Obsługa zamknięcia modala
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Obsługa zapisywania nowego znaku
  const handleSaveChar = (charName) => {
    console.log("Nowy znak:", charName); // Tymczasowo logujemy nazwę
    handleCloseModal();
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <button className="create-new-char-button" onClick={handleCreateNewChar}>
          Create New Char
        </button>
        <HD44780Character />
      </div>
      <div className="right-column">
        {/* Tutaj będzie prawa kolumna */}
      </div>

      {/* Użycie komponentu CharNameModal */}
      <CharNameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChar}
      />
    </div>
  );
}

export default App;