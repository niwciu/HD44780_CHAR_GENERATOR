// codeGenerator.js
export const generateCode = (chars, setCode) => {
    let generatedCode = '';
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const currentYear = currentDate.getFullYear();

    // Nag³ówek pliku
    const FileDoxyMainContent =
        '/**\n' +
        ' * @file lcd_hd44780_def_char.h\n' +
        ' * @author LCD custom char code generator app written by niwciu (niwciu@gmail.com)\n' +
        ' * @brief\n' +
        ' * @date ' + currentDateString + '\n' +
        ' *\n' +
        ' * @copyright Copyright (c) ' + currentYear + '\n' +
        ' *\n' +
        ' */\n';

    let headerFileStartContent = 
        FileDoxyMainContent +
        '#ifndef _LCD_HD44780_DEF_CHAR_H_\n' +
        '#define _LCD_HD44780_DEF_CHAR_H_\n\n' +
        '#ifdef __cplusplus\n' +
        'extern "C" {\n' +
        '#endif /* __cplusplus */\n\n' +
        '#include <stdint.h>\n\n';
        

    let lcdDefCharTypes =
    '    /**\n' +
    '    * @brief Structure for mapping ASCII characters to LCD memory equivalents.\n' +
    '    *\n' +
    '    * This structure defines a mapping between an ASCII character and its corresponding\n' +
    '    * representation in the LCD memory, which could be an address or an enum value.\n' +
    '    */\n' +
    '    typedef struct\n' +
    '    {\n' +
    '        char ascii_char;   /**< The ASCII character to be mapped. */\n' +
    '        char lcd_def_char; /**< The corresponding representation in LCD memory (e.g., address or enum). */\n' +
    '    } LCD_char_mapping_struct_t;\n' +
    '    \n' +
    '    /**\n' +
    '    * @struct char_bank_struct\n' +
    '    * @brief Structure that contains pointers to 8 user predefined characters. Structure is used to define user character banks.\n' +
    '    * Each bank can contain a combination of a maximum of 8 user special characters.\n' +
    '    */\n' +
    '    typedef struct\n' +
    '    {\n' +
    '        const uint8_t *char_0; /**< Pointer to the first custom character. */\n' +
    '        const uint8_t *char_1; /**< Pointer to the second custom character. */\n' +
    '        const uint8_t *char_2; /**< Pointer to the third custom character. */\n' +
    '        const uint8_t *char_3; /**< Pointer to the fourth custom character. */\n' +
    '        const uint8_t *char_4; /**< Pointer to the fifth custom character. */\n' +
    '        const uint8_t *char_5; /**< Pointer to the sixth custom character. */\n' +
    '        const uint8_t *char_6; /**< Pointer to the seventh custom character. */\n' +
    '        const uint8_t *char_7; /**< Pointer to the eighth custom character. */\n' +
    '    } char_bank_struct_t;\n\n';

    let lcdDefCharDeclarationSectionHeader =
    '    /**********************USER CHAR DECLARATION SECTION*******************************/\n' +
    '    /**\n' +
    '    * @note To save flash when using defchar, comment out char definitions that are not used\n' +
    '    */\n';
    let lcdDefCharDeclarationSectionFooter =
    '    \n' +
    '    // Add additional custom characters definitions here\n' +
    '    \n';
    
    let lcdDefCharBanksDeclarationSectionHeader = 
    '    /**********************USER CHAR CGRAM BANKS DECLARATION SECTION*******************/\n';
    
    function generateLcdCgramBankStructDoxygenComment(bankName) {
    return  '    /**\n' +
            '    * @struct '+ bankName+'\n' +
            '    * @brief Structure that contains pointers to 8 user predefined characters. Structure is used to define user character banks.\n' +
            '    * Each bank can contain a combination of a maximum of 8 user special characters.\n' +
            '    */\n';
    }

    function generaateLcdCgramBankEnumDoxygenComment (bankName) {
    return  '    /**\n' +
            '    * @enum ' + bankName + '\n' +
            '    * @brief Labels representing specific user defined chars collected in lcd_cgram_bank_1.\n' +
            '    * Label values are equal to addresses in lcd_cgram_bank_1 and the address of LCD_CGRAM where all chars from lcd_cgram_bank_1 will be written\n' +
            '    * when using lcd_load_char_bank() or lcd_def_char() for defining single characters in LCD_CGRAM.\n' +
            '    */\n';
    }
    
    let lcdCharMapDoxygenComment =
    '    /**\n' +
    '    * @brief Mapping of extended ASCII characters to their corresponding custom character addresses.\n' +
    '    *\n' +
    '    * This array maps selected extended ASCII characters (which typically occupy 1 byte in modern encodings like UTF-8)\n' +
    '    * to custom character addresses defined in `lcd_cgram_bank_1`.\n' +
    '    * This allows the use of custom characters based on their extended ASCII representation.\n' +
    '    *\n' +
    '    * @warning This file and all files containing strings with Polish characters\n' +
    '    *          (e.g., \'\xEA\', \'\xF3\', etc.) **must** be saved using the Windows-1250 encoding.\n' +
    '    *          Failure to do so will result in incorrect character translation on the LCD.\n' +
    '    *\n' +
    '    * @warning A null terminator **must** be placed at the end of the mapping table.\n' +
    '    *          Without this, the mapping algorithm will cause a critical fault.\n' +
    '    */\n';

    // Generowanie definicji znaków
    const charDefinitions = chars.map(char => {
        const sanitizedName = char.name
            .replace(/[^a-zA-Z0-9]/g, '_') // Zamieñ specjalne znaki na podkreœlenia
            .replace(/^[0-9]/, '_$&'); // Dodaj podkreœlenie jeœli nazwa zaczyna siê od cyfry

        const bytes = char.pixels.map(row => {
            // Konwersja 5-bitowego wiersza na wartoœæ liczbow¹
            return row.reduce((acc, pixel, idx) => {
                return acc | (pixel ? 1 << (4 - idx) : 0); // Lewy piksel = najstarszy bit
            }, 0);
        });

        return `    static const uint8_t ${sanitizedName}[8] = {${bytes.join(', ')}};`;
    }).join('\n');

    let charMappingBasicStruct = 
    '    static const LCD_char_mapping_struct_t lcd_special_chars_map[] = {\n' +
    '        {\'\xF3\', pol_o}, /**< Extended ASCII \'\xF3\' mapped to the custom character \'\xF3\' (address 0x01) */\n' +
    '        {\'\\0\', 0}     /**< MANDATORY!!! - Null terminator to mark the end of the mapping table */\n' +
    '    };\n';

    // Stopka pliku
    let fileFooter = 
        '\n#ifdef __cplusplus\n' +
        '}\n' +
        '#endif /* __cplusplus */\n\n' +
        '#endif /* _LCD_HD44780_DEF_CHAR_H_ */\n';

    generatedCode = 
        headerFileStartContent + 
        lcdDefCharTypes + 
        lcdDefCharDeclarationSectionHeader+
        charDefinitions + 
        lcdDefCharDeclarationSectionFooter +
        lcdDefCharBanksDeclarationSectionHeader +
        // generateLcdCgramBankStructDoxygenComment('test') +
        
        // generaateLcdCgramBankEnumDoxygenComment('test2') +
        lcdCharMapDoxygenComment +
        charMappingBasicStruct +
        fileFooter;
    setCode(generatedCode);
};