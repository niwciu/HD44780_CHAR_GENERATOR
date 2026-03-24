export const getBankDisplayChars = (banks, selectedBank, chars) => {
    if (selectedBank === null || !banks[selectedBank]) {
        return [];
    }

    return banks[selectedBank].characters
        .filter((charIndex) => charIndex >= 0 && charIndex < chars.length)
        .map((charIndex) => chars[charIndex])
        .filter(Boolean);
};

export const addCharToBank = (banks, selectedBank, selectedChar) => (
    banks.map((bank, index) => {
        if (index !== selectedBank) {
            return bank;
        }

        return {
            ...bank,
            characters: [...bank.characters, selectedChar],
        };
    })
);

export const updateCharPixels = (chars, selectedChar, updatedPixels) => (
    chars.map((char, index) => (
        index === selectedChar
            ? { ...char, pixels: updatedPixels }
            : char
    ))
);

export const deleteGlobalChar = (chars, banks, selectedChar, deleteIndex) => ({
    chars: chars.filter((_, index) => index !== deleteIndex),
    banks: banks.map((bank) => ({
        ...bank,
        characters: bank.characters
            .filter((charIndex) => charIndex !== deleteIndex)
            .map((charIndex) => (charIndex > deleteIndex ? charIndex - 1 : charIndex)),
    })),
    selectedChar: selectedChar === null
        ? null
        : selectedChar === deleteIndex
            ? null
            : selectedChar > deleteIndex
                ? selectedChar - 1
                : selectedChar,
});

export const deleteBankChar = (banks, selectedBank, deleteIndex) => (
    banks.map((bank, index) => {
        if (index !== selectedBank) {
            return bank;
        }

        return {
            ...bank,
            characters: bank.characters.filter((_, charIndex) => charIndex !== deleteIndex),
        };
    })
);

export const clearGlobalChars = (banks) => ({
    chars: [],
    banks: banks.map((bank) => ({
        ...bank,
        characters: [],
    })),
});

export const clearBankChars = (banks, selectedBank) => (
    banks.map((bank, index) => (
        index === selectedBank
            ? { ...bank, characters: [] }
            : bank
    ))
);

export const deleteBank = (banks, selectedBank, deleteIndex) => ({
    banks: banks.filter((_, index) => index !== deleteIndex),
    selectedBank: selectedBank === null
        ? null
        : selectedBank === deleteIndex
            ? null
            : selectedBank > deleteIndex
                ? selectedBank - 1
                : selectedBank,
});
