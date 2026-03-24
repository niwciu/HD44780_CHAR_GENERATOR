import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    clearStoredConfig,
    createConfigSnapshot,
    parseConfig,
    saveConfigToStorage,
    STORAGE_KEY,
    validateConfig,
} from './config';

const validConfig = {
    version: 1,
    chars: [
        {
            name: 'Heart',
            pixels: Array.from({ length: 8 }, () => Array(5).fill(false)),
        },
    ],
    banks: [
        {
            name: 'Main',
            characters: [0],
        },
    ],
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('config utils', () => {
    it('accepts a valid config snapshot', () => {
        expect(validateConfig(validConfig)).toBe(true);
    });

    it('rejects blank names and invalid bank indexes', () => {
        expect(validateConfig({
            ...validConfig,
            chars: [{ ...validConfig.chars[0], name: ' ' }],
        })).toBe(false);

        expect(validateConfig({
            ...validConfig,
            banks: [{ ...validConfig.banks[0], characters: [-1] }],
        })).toBe(false);
    });

    it('parses a valid JSON config and rejects malformed data', () => {
        expect(parseConfig(JSON.stringify(validConfig))).toEqual(validConfig);

        expect(() => parseConfig(JSON.stringify({
            ...validConfig,
            banks: [{ ...validConfig.banks[0], characters: [4] }],
        }))).toThrow('Invalid configuration structure');
    });

    it('saves and clears config in localStorage', () => {
        const localStorage = {
            setItem: vi.fn(),
            removeItem: vi.fn(),
        };

        vi.stubGlobal('window', { localStorage });

        const snapshot = createConfigSnapshot(validConfig.chars, validConfig.banks);
        saveConfigToStorage(snapshot.chars, snapshot.banks);
        clearStoredConfig();

        expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(snapshot));
        expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
});
