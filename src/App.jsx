import React, { useState } from 'react';
import './App.css';
import HD44780Character from './components/HD44780Character';
import CharNameModal from './components/CharNameModal';
import BankNameModal from './components/BankNameModal';
import CharList from './components/CharList'; // Nowy komponent
import CharBanksList from './components/CharBanksList'; // Nowy komponent

function App() {
  const [isCharModalOpen, setisCharModalOpen] = useState(false);
  const [chars, setChars] = useState([]); // Lista stworzonych znaków
  const [selectedChar, setSelectedChar] = useState(null); // Aktualnie wybrany znak

  const [isBankModalOpen, setisBankModalOpen] = useState(false);
  const [banks, setBanks] = useState([]); // Lista stworzonych bankow
  const [selectedBank, setSelectedBank] = useState(null); // Aktualnie wybrany znak

  const [selectedBankChar, setSelectedBankChar] = useState(null); // Aktualnie wybrany znak w banku

  const handleCreateNewChar = () => {
    setisCharModalOpen(true);
  };

  const handleCloseCharModal = () => {
    setisCharModalOpen(false);
  };

  const handleCreateNewBank = () => {
    setisBankModalOpen(true);
  };

  const handleCloseBankModal = () => {
    setisBankModalOpen(false);
  };

  const handleSaveChar = (charName) => {
    const trimmedName = charName.trim();

    // Sprawdzenie, czy nazwa już istnieje (ignorujemy wielkość liter)
    if (chars.some(char => char.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert('This character name already exists!'); // Można zmienić na inny sposób informowania
      return;
    }

    // Tworzymy nowy znak
    const newChar = {
      name: trimmedName,
      pixels: Array(8).fill().map(() => Array(5).fill(false)) // Domyślny stan pikseli
    };

    setChars([...chars, newChar]);
    handleCloseCharModal();
  };

  const handleSaveBank = (bankName) => {
    const trimmedName = bankName.trim();

    // Sprawdzenie, czy nazwa już istnieje (ignorujemy wielkość liter)
    if (banks.some(bank => bank.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert('This bank name already exists!'); // Można zmienić na inny sposób informowania
      return;
    }

    // Tworzymy nowy bank
    const newBank = {
      name: trimmedName,
      characters: [] 
    };

    setBanks([...banks, newBank]);
    handleCloseBankModal();
  };

  const handleAddCharToBank = () => {
    if (selectedChar === null || selectedBank === null) {
      alert("Please select both a character and a bank");
      return;
    }

    setBanks(prevBanks => {
      return prevBanks.map((bank, index) => {
        if (index === selectedBank) {
          // Najpierw sprawdź limit
          if (bank.characters.length >= 8) {
            alert("Bank is full! Maximum 8 characters allowed.");
            return bank;
          }

          // Następnie sprawdź duplikat
          if (bank.characters.includes(selectedChar)) {
            alert("This character already exists in the selected bank");
            return bank;
          }

          return {
            ...bank,
            characters: [...bank.characters, selectedChar]
          };
        }
        return bank;
      });
    });
  };

  const handleSelectChar = (index) => {
    setSelectedChar(index);
  };

  const handleSelectBank = (index) => {
    setSelectedBank(index);
    setSelectedBankChar(null); // Resetuj wybrany znak w banku przy zmianie banku
  };

  const handleSelectBankChar = (index) => {
    setSelectedBankChar(index);
  };

  const handleUpdateCharPixels = (updatedPixels) => {
    if (selectedChar !== null) {
      const updatedChars = [...chars];
      updatedChars[selectedChar].pixels = updatedPixels;
      setChars(updatedChars);
    }
  };

  const handleDeleteItem = (type, index) => {
    if (type === 'global') {
      const updatedChars = chars.filter((_, i) => i !== index);
      setChars(updatedChars);

      setBanks(prevBanks =>
        prevBanks.map(bank => ({
          ...bank,
          characters: bank.characters
            .filter(charIndex => charIndex !== index)
            .map(charIndex => charIndex > index ? charIndex - 1 : charIndex)
        }))
      );
      setSelectedChar(null);
    }
    else if (type === 'bank' && selectedBank !== null) {
      setBanks(prevBanks =>
        prevBanks.map((bank, i) => {
          if (i === selectedBank) {
            return {
              ...bank,
              characters: bank.characters.filter((_, idx) => idx !== index)
            };
          }
          return bank;
        })
      );
      setSelectedBankChar(null);
    }
  };

  // Usuwanie wszystkich elementów (dla obu list)
  const handleDeleteAll = (type) => {
    if (type === 'global') {
      setChars([]);
      setBanks(prevBanks => prevBanks.map(bank => ({
        ...bank,
        characters: []
      })));
      // Resetuj wszystkie powiązane stany
      setSelectedChar(null);
      setSelectedBankChar(null);
    }
    else if (type === 'bank' && selectedBank !== null) {
      setBanks(prevBanks => prevBanks.map((bank, i) => {
        if (i === selectedBank) {
          return { ...bank, characters: [] };
        }
        return bank;
      }));
      setSelectedBankChar(null);
    }
  };

  const handleDeleteBank = (index) => {
    if (index === null) return;

    setBanks(prev => prev.filter((_, i) => i !== index));

    // Reset selection if deleting currently selected bank
    if (selectedBank === index) {
      setSelectedBank(null);
      setSelectedBankChar(null);
    }
  };

  const handleDeleteAllBanks = () => {
    setBanks([]);
    setSelectedBank(null);
    setSelectedBankChar(null); // Dodaj resetowanie stanu
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <div className="left-column-row">
          <button className="create-new-char-button" onClick={handleCreateNewChar}>
            Create New Char
          </button>
          <button className="create-new-char-button" onClick={handleCreateNewBank}>
            Create New Char Bank
          </button>
        </div>
        <div className="left-column-row">
          <HD44780Character
            isActive={selectedChar !== null}
            pixels={selectedChar !== null ? chars[selectedChar].pixels : Array(8).fill().map(() => Array(5).fill(false))}
            onUpdatePixels={handleUpdateCharPixels}
          />
          <CharBanksList
            banks={banks}
            onSelectBank={handleSelectBank}
            selectedBank={selectedBank}
            onDeleteSelected={() => handleDeleteBank(selectedBank)}
            onDeleteAll={handleDeleteAllBanks}
          />
        </div>
        <div className="left-column-row">
          <CharList
            title={'Created Chars'}
            chars={chars}
            onSelectChar={handleSelectChar}
            selectedChar={selectedChar}
            onDeleteSelected={(index) => handleDeleteItem('global', index)}
            onDeleteAll={() => handleDeleteAll('global')}
          />
          {/* <button
            className="add-char-to-bank-button"
            onClick={handleAddCharToBank}
          >
            >
          </button> */}
          <div className="tooltip-container">
            <button
              className="add-char-to-bank-button"
              onClick={handleAddCharToBank}
              disabled={selectedChar === null || selectedBank === null}
            >
              >
            </button>
            {(selectedChar === null || selectedBank === null) && (
              <div className="tooltip-text">
                {selectedChar === null && "Select a character to add\n"}
                {selectedBank === null && "Select a target bank"}
              </div>
            )}
          </div>
          <CharList
            title={'Selected Bank Chars'}
            chars={
              selectedBank !== null && banks[selectedBank]
                ? banks[selectedBank].characters
                  .filter(charIndex => charIndex < chars.length) // Dodaj filtr
                  .map(charIndex => chars[charIndex])
                : []
            } 
            onSelectChar={handleSelectBankChar}
            selectedChar={selectedBankChar}
            onDeleteSelected={(index) => handleDeleteItem('bank', index)}
            onDeleteAll={() => handleDeleteAll('bank')}
            isBankSelected={selectedBank !== null} // Nowy prop
          />
        </div>
        <div className="left-column-row">
        </div>
        <div className="left-column-row">

        </div>
        
      </div>
      <div className="right-column">
        {/* Tutaj będzie prawa kolumna */}
      </div>

      <CharNameModal
        isOpen={isCharModalOpen}
        onClose={handleCloseCharModal}
        onSave={handleSaveChar}
        existingNames={chars.map(char => char.name)} // Przekazujemy listę istniejących nazw
      />
      <BankNameModal
        isOpen={isBankModalOpen}
        onClose={handleCloseBankModal}
        onSave={handleSaveBank}
        existingNames={banks.map(bank => bank.name)} // Przekazujemy listę istniejących nazw
      />
    </div>
  );
}

export default App;
