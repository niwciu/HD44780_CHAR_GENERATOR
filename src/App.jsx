import { useEffect, useRef, useState } from 'react';
import './App.css';
import HD44780Character from './components/HD44780Character';
import CharNameModal from './components/CharNameModal';
import BankNameModal from './components/BankNameModal';
import CharList from './components/CharList';
import CharBanksList from './components/CharBanksList';
import CodePreview from './components/CodePreview';
import FileNameModal from './components/FileNameModal';
import ToastViewport from './components/ToastViewport';
import { generateCode } from './components/CodeGenerator';
import { usePersistentCharConfig } from './hooks/usePersistentCharConfig';
import {
  addCharToBank,
  clearBankChars,
  clearGlobalChars,
  deleteBank,
  deleteBankChar,
  deleteGlobalChar,
  getBankDisplayChars,
  updateCharPixels,
} from './utils/charBankState';
import {
  createEmptyBank,
  createEmptyChar,
  createEmptyPixels,
  DEFAULT_CONFIG_FILE_NAME,
  parseConfig,
} from './utils/config';

function App() {
  const {
    chars,
    setChars,
    banks,
    setBanks,
    storageError,
    setStorageError,
    replaceConfig,
    resetConfig,
    createSnapshot,
  } = usePersistentCharConfig();

  const emptyPixels = createEmptyPixels();
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [selectedChar, setSelectedChar] = useState(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedBankChar, setSelectedBankChar] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [addComments, setAddComments] = useState(true);
  const [isFileNameModalOpen, setIsFileNameModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  useEffect(() => {
    generateCode(chars, banks, addComments, setGeneratedCode);
  }, [chars, banks, addComments]);

  useEffect(() => {
    if (!storageError) {
      return;
    }

    showToast('warning', 'Saved draft could not be restored.', storageError);
    setStorageError(null);
  }, [setStorageError, storageError]);

  const showToast = (type, title, message = '') => {
    const id = toastIdRef.current + 1;
    toastIdRef.current = id;

    setToasts((prevToasts) => [...prevToasts, { id, type, title, message }]);
    window.setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const handleAddCommentsChange = (newValue) => {
    setAddComments(newValue);
  };

  const handleSaveChar = (charName) => {
    const trimmedName = charName.trim();

    if (!trimmedName) {
      showToast('warning', 'Character name is required.');
      return;
    }

    if (chars.some((char) => char.name.toLowerCase() === trimmedName.toLowerCase())) {
      showToast('warning', 'Character name already exists.', 'Choose a different name.');
      return;
    }

    setChars((prevChars) => [...prevChars, createEmptyChar(trimmedName)]);
    setIsCharModalOpen(false);
    showToast('success', 'Character created.', `"${trimmedName}" is ready to edit.`);
  };

  const handleSaveBank = (bankName) => {
    const trimmedName = bankName.trim();

    if (!trimmedName) {
      showToast('warning', 'Bank name is required.');
      return;
    }

    if (banks.some((bank) => bank.name.toLowerCase() === trimmedName.toLowerCase())) {
      showToast('warning', 'Bank name already exists.', 'Choose a different name.');
      return;
    }

    setBanks((prevBanks) => [...prevBanks, createEmptyBank(trimmedName)]);
    setIsBankModalOpen(false);
    showToast('success', 'Character bank created.', `"${trimmedName}" is ready to use.`);
  };

  const handleAddCharToBank = () => {
    if (selectedChar === null || selectedBank === null) {
      showToast('warning', 'Select both a character and a bank first.');
      return;
    }

    const bank = banks[selectedBank];
    if (!bank) {
      showToast('error', 'Selected bank is no longer available.');
      return;
    }

    if (bank.characters.length >= 8) {
      showToast('warning', 'Bank is full.', 'Each bank can store up to 8 characters.');
      return;
    }

    if (bank.characters.includes(selectedChar)) {
      showToast('warning', 'Character already exists in the selected bank.');
      return;
    }

    setBanks((prevBanks) => addCharToBank(prevBanks, selectedBank, selectedChar));
    showToast('success', 'Character added to bank.');
  };

  const handleUpdateCharPixels = (updatedPixels) => {
    if (selectedChar === null) {
      return;
    }

    setChars((prevChars) => updateCharPixels(prevChars, selectedChar, updatedPixels));
  };

  const handleDeleteItem = (type, index) => {
    if (type === 'global') {
      const nextState = deleteGlobalChar(chars, banks, selectedChar, index);
      setChars(nextState.chars);
      setBanks(nextState.banks);
      setSelectedChar(nextState.selectedChar);
      setSelectedBankChar(null);
      showToast('info', 'Character deleted.');
      return;
    }

    if (type === 'bank' && selectedBank !== null) {
      setBanks((prevBanks) => deleteBankChar(prevBanks, selectedBank, index));
      setSelectedBankChar(null);
      showToast('info', 'Character removed from bank.');
    }
  };

  const handleDeleteAll = (type) => {
    if (type === 'global') {
      const nextState = clearGlobalChars(banks);
      setChars(nextState.chars);
      setBanks(nextState.banks);
      setSelectedChar(null);
      setSelectedBankChar(null);
      showToast('info', 'All characters deleted.');
      return;
    }

    if (type === 'bank' && selectedBank !== null) {
      setBanks((prevBanks) => clearBankChars(prevBanks, selectedBank));
      setSelectedBankChar(null);
      showToast('info', 'Selected bank cleared.');
    }
  };

  const handleDeleteBank = (index) => {
    if (index === null) {
      return;
    }

    const nextState = deleteBank(banks, selectedBank, index);
    setBanks(nextState.banks);
    setSelectedBank(nextState.selectedBank);
    setSelectedBankChar(null);
    showToast('info', 'Character bank deleted.');
  };

  const handleDeleteAllBanks = () => {
    setBanks([]);
    setSelectedBank(null);
    setSelectedBankChar(null);
    showToast('info', 'All character banks deleted.');
  };

  const handleResetAll = () => {
    resetConfig();
    setSelectedChar(null);
    setSelectedBank(null);
    setSelectedBankChar(null);
    showToast('info', 'Workspace reset.', 'All characters and banks were cleared.');
  };

  const downloadTextFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleSaveConfigToFile = () => {
    setIsFileNameModalOpen(true);
  };

  const handleDownloadConfigFile = (fileName) => {
    const normalizedFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
    const snapshot = createSnapshot();
    downloadTextFile(
      JSON.stringify(snapshot, null, 2),
      normalizedFileName,
      'application/json',
    );
    setIsFileNameModalOpen(false);
    showToast('success', 'Configuration exported.', `Saved as ${normalizedFileName}.`);
  };

  const handleReadConfigFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        try {
          const nextConfig = parseConfig(loadEvent.target?.result ?? '');
          replaceConfig(nextConfig);
          setSelectedChar(null);
          setSelectedBank(null);
          setSelectedBankChar(null);
          showToast('success', 'Configuration imported.', `${file.name} loaded successfully.`);
        } catch (error) {
          showToast('error', 'Import failed.', error.message);
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const handleFutureFuncInfo = () => {
    showToast(
      'info',
      'Feature not available yet.',
      'The special character base will be implemented in a future update.',
    );
  };

  const bankDisplayChars = getBankDisplayChars(banks, selectedBank, chars);

  return (
    <div className="app-shell">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      <div className="app-container">
        <div className="left-column">
          <div className="left-column-row">
            <button className="create-new-char-button" onClick={() => setIsCharModalOpen(true)}>
              Create New Char
            </button>
            <button className="create-new-char-button" onClick={() => setIsBankModalOpen(true)}>
              Create New Char Bank
            </button>
          </div>
          <div className="left-column-row">
            <HD44780Character
              isActive={selectedChar !== null}
              pixels={selectedChar !== null ? chars[selectedChar].pixels : emptyPixels}
              onUpdatePixels={handleUpdateCharPixels}
            />
            <CharBanksList
              banks={banks}
              onSelectBank={(index) => {
                setSelectedBank(index);
                setSelectedBankChar(null);
              }}
              selectedBank={selectedBank}
              onDeleteSelected={() => handleDeleteBank(selectedBank)}
              onDeleteAll={handleDeleteAllBanks}
            />
          </div>
          <div className="left-column-row">
            <CharList
              title="Created Chars"
              chars={chars}
              onSelectChar={(index) => {
                setSelectedChar(index);
                setSelectedBankChar(null);
              }}
              selectedChar={selectedChar}
              onDeleteSelected={(index) => handleDeleteItem('global', index)}
              onDeleteAll={() => handleDeleteAll('global')}
            />
            <div className="add-char-to-bank-button-container">
              <button
                className="add-char-to-bank-button"
                onClick={handleAddCharToBank}
                disabled={selectedChar === null || selectedBank === null}
              >
                &gt;
              </button>
              {(selectedChar === null || selectedBank === null) && (
                <div className="tooltip-text">
                  {selectedChar === null && 'Select a character to add\n'}
                  {selectedBank === null && 'Select a target bank'}
                </div>
              )}
            </div>
            <CharList
              title="Selected Bank Chars"
              chars={bankDisplayChars}
              onSelectChar={setSelectedBankChar}
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
            onCopySuccess={() => showToast('success', 'Code copied to clipboard.')}
            onCopyError={(message) => showToast('error', 'Copy failed.', message)}
            onDownloadSuccess={(fileName) => showToast('success', 'Code file downloaded.', fileName)}
          />
        </div>
      </div>

      <CharNameModal
        isOpen={isCharModalOpen}
        onClose={() => setIsCharModalOpen(false)}
        onSave={handleSaveChar}
        existingNames={chars.map((char) => char.name)}
      />
      <BankNameModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onSave={handleSaveBank}
        existingNames={banks.map((bank) => bank.name)}
      />
      <FileNameModal
        isOpen={isFileNameModalOpen}
        initialValue={DEFAULT_CONFIG_FILE_NAME}
        onClose={() => setIsFileNameModalOpen(false)}
        onSave={handleDownloadConfigFile}
      />
    </div>
  );
}

export default App;
