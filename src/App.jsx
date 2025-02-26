import { useState, useEffect, useCallback } from 'react'; 
import PropTypes from 'prop-types';
import './App.css';
import HD44780Character from './components/HD44780Character';
import CharNameModal from './components/CharNameModal';
import BankNameModal from './components/BankNameModal';
import CharList from './components/CharList';
import CharBanksList from './components/CharBanksList';
import CodePreview from './components/CodePreview';
import { generateCode } from './components/CodeGenerator';

function App() {
  const [isCharModalOpen, setisCharModalOpen] = useState(false);
  const [chars, setChars] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);
  const [isBankModalOpen, setisBankModalOpen] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedBankChar, setSelectedBankChar] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [addComments, setAddComments] = useState(true);

  const handleCodeGeneration = useCallback(() => {
    if (addComments) {
      console.log("Generating code with comments...");
    } else {
      console.log("Generating code without comments...");
    }
    generateCode(chars, banks, addComments, setGeneratedCode);
  }, [chars, banks, addComments, setGeneratedCode]); 

  useEffect(() => {
    handleCodeGeneration();
  }, [handleCodeGeneration]);

  const handleAddCommentsChange = (newValue) => {
    setAddComments(newValue);
  };

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

    if (chars.some(char => char.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert('This character name already exists!');
      return;
    }

    const newChar = {
      name: trimmedName,
      pixels: Array(8).fill().map(() => Array(5).fill(false))
    };

    setChars([...chars, newChar]);
    handleCloseCharModal();
  };

  const handleSaveBank = (bankName) => {
    const trimmedName = bankName.trim();

    if (banks.some(bank => bank.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert('This bank name already exists!');
      return;
    }

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
          if (bank.characters.length >= 8) {
            alert("Bank is full! Maximum 8 characters allowed.");
            return bank;
          }

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
    setSelectedBankChar(null);
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

  const handleDeleteAll = (type) => {
    if (type === 'global') {
      setChars([]);
      setBanks(prevBanks => prevBanks.map(bank => ({
        ...bank,
        characters: []
      })));
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

    if (selectedBank === index) {
      setSelectedBank(null);
      setSelectedBankChar(null);
    }
  };

  const handleDeleteAllBanks = () => {
    setBanks([]);
    setSelectedBank(null);
    setSelectedBankChar(null);
  };

  const handleResetAll = () => {
    handleDeleteAllBanks();
    handleDeleteAll('global');
    handleDeleteAll('bank');
  };

  const handleSaveConfigToFile = () => {
    const config = {
      version: 1,
      chars: chars,
      banks: banks
    };

    const fileName = prompt("Enter configuration file name:", "hd44780_config");
    if (!fileName) return;

    const fullFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;

    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fullFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateConfig = (config) => {
    return (
      config.version === 1 &&
      Array.isArray(config.chars) &&
      config.chars.every(char =>
        typeof char.name === 'string' &&
        Array.isArray(char.pixels) &&
        char.pixels.length === 8 &&
        char.pixels.every(row =>
          Array.isArray(row) &&
          row.length === 5 &&
          row.every(p => typeof p === 'boolean')
        )
      ) &&
      Array.isArray(config.banks) &&
      config.banks.every(bank =>
        typeof bank.name === 'string' &&
        Array.isArray(bank.characters) &&
        bank.characters.every(index => Number.isInteger(index))
      )
    );
  };

  const migrateConfig = (config) => {
    switch (config.version) {
      case 1:
        return config;
      default:
        throw new Error("Unsupported config version");
    }
  };

  const handleReadConfigFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target.result);
          const migratedConfig = migrateConfig(config);

          if (!validateConfig(migratedConfig)) {
            throw new Error("Invalid configuration structure");
          }

          setSelectedChar(null);
          setSelectedBank(null);
          setSelectedBankChar(null);

          setChars(migratedConfig.chars);
          setBanks(migratedConfig.banks);

        } catch (error) {
          alert("Error loading configuration: " + error.message);
        }
      };

      reader.readAsText(file);
    };
    input.click();
  };

  const handleFutureFuncInfo = () => {
     alert("This functionality is not avaliable. \n\n Will be implemented in the future");
  }

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
          <div className="add-char-to-bank-button-container ">
            <button
              className="add-char-to-bank-button"
              onClick={handleAddCharToBank}
              disabled={selectedChar === null || selectedBank === null}
            >
              &gt;
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
                  .filter(charIndex => charIndex < chars.length)
                  .map(charIndex => chars[charIndex])
                : []
            }
            onSelectChar={handleSelectBankChar}
            selectedChar={selectedBankChar}
            onDeleteSelected={(index) => handleDeleteItem('bank', index)}
            onDeleteAll={() => handleDeleteAll('bank')}
            isBankSelected={selectedBank !== null}
          />
        </div>
        <div className="left-column-row">
          <button className="create-new-char-button" onClick={handleSaveConfigToFile}>
            Save conf
          </button>
          <button className="create-new-char-button" onClick={handleReadConfigFromFile}>
            Load conf
          </button>
          <button className="create-new-char-button" onClick={handleResetAll}>
            Reset all
          </button>
        </div>
        <div className="left-column-row">
          <button className="create-new-char-button" onClick={handleFutureFuncInfo}>
            Copy char from application special characters base
          </button>
        </div>
      </div>
      <div className="right-column">
        <CodePreview
          code={generatedCode}
          fileName="lcd_hd44780_def_char.h"
          onAddCommentsChange={handleAddCommentsChange}
        />
      </div>

      <CharNameModal
        isOpen={isCharModalOpen}
        onClose={handleCloseCharModal}
        onSave={handleSaveChar}
        existingNames={chars.map(char => char.name)}
      />
      <BankNameModal
        isOpen={isBankModalOpen}
        onClose={handleCloseBankModal}
        onSave={handleSaveBank}
        existingNames={banks.map(bank => bank.name)}
      />
    </div>
  );
}


App.propTypes = {

  CodePreview: PropTypes.shape({
    code: PropTypes.string,
    fileName: PropTypes.string,
    onAddCommentsChange: PropTypes.func
  }),

  CharNameModal: PropTypes.shape({
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    existingNames: PropTypes.arrayOf(PropTypes.string)
  }),

  BankNameModal: PropTypes.shape({
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    existingNames: PropTypes.arrayOf(PropTypes.string)
  }),

  CharList: PropTypes.shape({
    title: PropTypes.string,
    chars: PropTypes.arrayOf(PropTypes.object),
    onSelectChar: PropTypes.func,
    selectedChar: PropTypes.number,
    onDeleteSelected: PropTypes.func,
    onDeleteAll: PropTypes.func,
    isBankSelected: PropTypes.bool
  }),

  CharBanksList: PropTypes.shape({
    banks: PropTypes.arrayOf(PropTypes.object),
    onSelectBank: PropTypes.func,
    selectedBank: PropTypes.number,
    onDeleteSelected: PropTypes.func,
    onDeleteAll: PropTypes.func
  }),

  HD44780Character: PropTypes.shape({
    isActive: PropTypes.bool,
    pixels: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.bool)),
    onUpdatePixels: PropTypes.func
  })
};

export default App;