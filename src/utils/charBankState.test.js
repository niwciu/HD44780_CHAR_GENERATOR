import { describe, expect, it } from 'vitest';
import {
    addCharToBank,
    clearBankChars,
    clearGlobalChars,
    deleteBank,
    deleteBankChar,
    deleteGlobalChar,
    getBankDisplayChars,
    updateCharPixels,
} from './charBankState';

const chars = [
    { name: 'A', pixels: Array.from({ length: 8 }, () => Array(5).fill(false)) },
    { name: 'B', pixels: Array.from({ length: 8 }, () => Array(5).fill(true)) },
];

const banks = [
    { name: 'Primary', characters: [0, 1] },
    { name: 'Secondary', characters: [1] },
];

describe('charBankState utils', () => {
    it('returns characters visible in the selected bank', () => {
        expect(getBankDisplayChars(banks, 0, chars).map((char) => char.name)).toEqual(['A', 'B']);
        expect(getBankDisplayChars(banks, null, chars)).toEqual([]);
    });

    it('adds and removes characters inside a bank', () => {
        expect(addCharToBank(banks, 1, 0)[1].characters).toEqual([1, 0]);
        expect(deleteBankChar(banks, 0, 1)[0].characters).toEqual([0]);
        expect(clearBankChars(banks, 0)[0].characters).toEqual([]);
    });

    it('updates character pixels and clears all global chars', () => {
        const nextPixels = Array.from({ length: 8 }, (_, rowIndex) =>
            Array.from({ length: 5 }, (_, colIndex) => rowIndex === colIndex),
        );

        expect(updateCharPixels(chars, 0, nextPixels)[0].pixels).toEqual(nextPixels);
        expect(clearGlobalChars(banks)).toEqual({
            chars: [],
            banks: [
                { name: 'Primary', characters: [] },
                { name: 'Secondary', characters: [] },
            ],
        });
    });

    it('reindexes banks and selection after deleting a global character', () => {
        expect(deleteGlobalChar(chars, banks, 1, 0)).toEqual({
            chars: [chars[1]],
            banks: [
                { name: 'Primary', characters: [0] },
                { name: 'Secondary', characters: [0] },
            ],
            selectedChar: 0,
        });
    });

    it('reindexes selected bank when deleting banks', () => {
        expect(deleteBank(banks, 1, 0)).toEqual({
            banks: [{ name: 'Secondary', characters: [1] }],
            selectedBank: 0,
        });
    });
});
