export const CONFIG_VERSION = 1;
export const STORAGE_KEY = 'hd44780-char-generator-config';
export const DEFAULT_CONFIG_FILE_NAME = 'hd44780_config';

export const createEmptyPixels = () => (
    Array.from({ length: 8 }, () => Array(5).fill(false))
);

export const createEmptyChar = (name) => ({
    name: name.trim(),
    pixels: createEmptyPixels(),
});

export const createEmptyBank = (name) => ({
    name: name.trim(),
    characters: [],
});

export const createConfigSnapshot = (chars, banks) => ({
    version: CONFIG_VERSION,
    chars,
    banks,
});

export const validateConfig = (config) => {
    if (!config || typeof config !== 'object') {
        return false;
    }

    if (config.version !== CONFIG_VERSION || !Array.isArray(config.chars) || !Array.isArray(config.banks)) {
        return false;
    }

    const hasValidChars = config.chars.every((char) => (
        typeof char.name === 'string' &&
        char.name.trim().length > 0 &&
        Array.isArray(char.pixels) &&
        char.pixels.length === 8 &&
        char.pixels.every((row) => (
            Array.isArray(row) &&
            row.length === 5 &&
            row.every((pixel) => typeof pixel === 'boolean')
        ))
    ));

    if (!hasValidChars) {
        return false;
    }

    return config.banks.every((bank) => (
        typeof bank.name === 'string' &&
        bank.name.trim().length > 0 &&
        Array.isArray(bank.characters) &&
        bank.characters.length <= 8 &&
        bank.characters.every((index) => (
            Number.isInteger(index) &&
            index >= 0 &&
            index < config.chars.length
        ))
    ));
};

export const migrateConfig = (config) => {
    switch (config?.version) {
        case CONFIG_VERSION:
            return config;
        default:
            throw new Error('Unsupported config version');
    }
};

export const parseConfig = (rawConfig) => {
    const parsedConfig = typeof rawConfig === 'string'
        ? JSON.parse(rawConfig)
        : rawConfig;
    const migratedConfig = migrateConfig(parsedConfig);

    if (!validateConfig(migratedConfig)) {
        throw new Error('Invalid configuration structure');
    }

    return migratedConfig;
};

export const loadConfigFromStorage = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    const savedConfig = window.localStorage.getItem(STORAGE_KEY);
    if (!savedConfig) {
        return null;
    }

    return parseConfig(savedConfig);
};

export const saveConfigToStorage = (chars, banks) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(createConfigSnapshot(chars, banks)),
    );
};

export const clearStoredConfig = () => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
};
