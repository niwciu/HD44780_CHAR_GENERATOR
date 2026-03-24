import { useEffect, useMemo, useState } from 'react';
import {
    clearStoredConfig,
    createConfigSnapshot,
    loadConfigFromStorage,
    saveConfigToStorage,
} from '../utils/config';

const createInitialState = () => {
    try {
        const storedConfig = loadConfigFromStorage();

        if (storedConfig) {
            return {
                ...storedConfig,
                storageError: null,
            };
        }
    } catch (error) {
        return {
            chars: [],
            banks: [],
            storageError: error.message,
        };
    }

    return {
        chars: [],
        banks: [],
        storageError: null,
    };
};

export const usePersistentCharConfig = () => {
    const initialState = useMemo(() => createInitialState(), []);
    const [chars, setChars] = useState(initialState.chars);
    const [banks, setBanks] = useState(initialState.banks);
    const [storageError, setStorageError] = useState(initialState.storageError);

    useEffect(() => {
        saveConfigToStorage(chars, banks);
    }, [chars, banks]);

    const replaceConfig = (config) => {
        setChars(config.chars);
        setBanks(config.banks);
        setStorageError(null);
    };

    const resetConfig = () => {
        setChars([]);
        setBanks([]);
        setStorageError(null);
        clearStoredConfig();
    };

    return {
        chars,
        setChars,
        banks,
        setBanks,
        storageError,
        setStorageError,
        replaceConfig,
        resetConfig,
        createSnapshot: () => createConfigSnapshot(chars, banks),
    };
};
