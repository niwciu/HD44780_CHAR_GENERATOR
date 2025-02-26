// codeGenerator.js
export const generateCode = (chars, banks, addComments, setCode) => {
    let generatedCode = '';
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const currentYear = currentDate.getFullYear();

    // Nag��wek pliku
    const FileDoxyMainContent =
        '/**\n' +
        ' * @file lcd_hd44780_def_char.h\n' +
        ' * @author LCD custom char code generator app written by niwciu (niwciu@gmail.com)\n' +
        ' * @brief Header file for defining custom characters for the HD44780 LCD.\n' +
        ' * @version <add version no>\n' +
        ' * @date ' + currentDateString + '\n' +
        ' * @addtogroup LCD_HD44780_lib_API\n' +
        ' * @copyright Copyright (c) ' + currentYear + '\n' +
        ' * \n' +
        ' */\n\n';

    let headerFileStartContent = 
        FileDoxyMainContent +
        '#ifndef _LCD_HD44780_DEF_CHAR_H_\n' +
        '#define _LCD_HD44780_DEF_CHAR_H_\n\n' +
        '#ifdef __cplusplus\n' +
        'extern "C" {\n' +
        '#endif /* __cplusplus */\n\n' +
        '#include <stdint.h>\n' +
        '#include \"lcd_hd44780_config.h\"\n'+
        '\n'+
        '#define LCD_CGRAM_BYTES_PER_CHAR 8\n'+
        '#define DEF_CHAR_ADR_MASK 7\n' +
        '#define CHAR_MAP_END \'\\0\' \n\n'

    let lcdDefCharTypes =
        '    /**\n' +
        '     * @brief Structure for mapping ASCII characters to LCD memory equivalents.\n' +
        '     *\n' +
        '     * This structure defines a mapping between an ASCII character and its corresponding\n' +
        '     * representation in the LCD memory, which could be an address or an enum value.\n' +
        '     */\n' +
        '    typedef struct\n' +
        '    {\n' +
        '        char ascii_char;   /**< The ASCII character to be mapped. */\n' +
        '        char lcd_def_char; /**< The corresponding representation in LCD memory (e.g., address or enum). */\n' +
        '    } lcd_char_mapping_struct_t;\n' +
        '    \n' +
        '    /**\n' +
        '     * @struct char_bank_struct\n' +
        '     * @brief Structure that contains pointers to 8 user predefined characters. Structure is used to define user character banks.\n' +
        '     * Each bank can contain a combination of a maximum of 8 user special characters.\n' +
        '     */\n' +
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
        '    } char_bank_struct_t;\n' + 
        '    \n' +
        '    /**\n' +
        '     * @struct lcd_def_char_load_struct_t\n' +
        '     * @brief Structure for loading custom character banks and their corresponding mapping tables.\n' +
        '     *\n' +
        '     * This structure is used to define a custom character bank along with its associated\n' +
        '     * character mapping table. It contains a pointer to the character bank and a pointer\n' +
        '     * to the mapping table that maps ASCII characters to their LCD memory equivalents.\n' +
        '     */\n' +
        '    typedef struct\n' +
        '    {\n' +
        '        char_bank_struct_t *char_bank;               /**< The pointer to the character bank to load. */\n' +
        '        lcd_char_mapping_struct_t *char_mapping_tab; /**< The pointer to the corresponding character mapping table. */\n' +
        '    } lcd_bank_load_struct_t;\n\n';
    let lcdDefCharTypesNoComments =
        '    typedef struct\n' +
        '    {\n' +
        '        char ascii_char;\n' +
        '        char lcd_def_char; \n' +
        '    } lcd_char_mapping_struct_t;\n' +
        '    \n' +
        '    typedef struct\n' +
        '    {\n' +
        '        const uint8_t *char_0;\n' +
        '        const uint8_t *char_1;\n' +
        '        const uint8_t *char_2;\n' +
        '        const uint8_t *char_3;\n' +
        '        const uint8_t *char_4;\n' +
        '        const uint8_t *char_5;\n' +
        '        const uint8_t *char_6;\n' +
        '        const uint8_t *char_7;\n' +
        '    } char_bank_struct_t;\n' +
        '    \n' +
        '    typedef struct\n' +
        '    {\n' +
        '        char_bank_struct_t *char_bank;\n' +
        '        lcd_char_mapping_struct_t *char_mapping_tab;\n' +
        '    } lcd_bank_load_struct_t;\n\n';

    let lcdDefCharDeclarationSectionHeader =
        '    /**********************USER CHAR DECLARATION SECTION*******************************/\n' +
        '    /**\n' +
        '     * @note To save flash when using defchar, comment out char definitions that are not used\n' +
        '     */\n';
    let lcdDefCharDeclarationSectionHeaderNoComments =
        '    /**********************USER CHAR DECLARATION SECTION*******************************/\n';

    let lcdDefCharDeclarationSectionFooter =
        '    \n' +
        '    // Add additional custom characters definitions here\n' +
        '    \n';
    let lcdDefCharDeclarationSectionFooterNoComments =
        '    \n\n';

    function lcdDefCharBanksDeclarationSectionHeader(bankName) {
        return '    /**********************USER CHAR CGRAM \''+bankName+'\' DECLARATION SECTION*******************/\n';
    }
    function generateLcdCgramBankStructDoxygenComment(bankName) {
        return  '    /**\n' +
                '     * @struct ' + bankName + '\n' +
                '     * @brief Structure that contains pointers to 8 user predefined characters. Structure is used to define user character banks.\n' +
                '     * Each bank can contain a combination of a maximum of 8 user special characters.\n' +
                '     */\n';
    }

    function generaateLcdCgramBankEnumDoxygenComment(bankName) {
        return  '    /**\n' +
                '     * @enum ' + bankName + '\n' +
                '     * @brief Labels representing specific user defined chars collected in ' + bankName + '.\n' +
                '     * Label values are equal to addresses in ' + bankName + ' and the address of LCD_CGRAM where all chars from ' + bankName + ' will be written\n' +
                '     * when using lcd_load_char_bank() or lcd_def_char() for defining single characters in LCD_CGRAM.\n' +
                '     */\n';
    }

    function lcdCharMapDoxygenComment(bankName) {
        return  '    /**\n' +
                '     * @brief Mapping of extended ASCII characters to their corresponding custom character addresses for ' + bankName +'.\n' +
                '     *\n' +
                '     * This array maps selected extended ASCII characters (which typically occupy 1 byte in modern encodings like UTF-8)\n' +
                '     * to custom character addresses defined in `lcd_cgram_bank_1`.\n' +
                '     * This allows the use of custom characters based on their extended ASCII representation.\n' +
                '     *\n' +
                '     * @warning This file and all files containing strings with Polish characters\n' +
                '     *          (e.g., \'\xEA\', \'\xF3\', etc.) **must** be saved using the Windows-1250 encoding.\n' +
                '     *          Failure to do so will result in incorrect character translation on the LCD.\n' +
                '     *\n' +
                '     * @warning A null terminator **must** be placed at the end of the mapping table.\n' +
                '     *          Without this, the mapping algorithm will cause a critical fault.\n' +
                '     */\n';
    }

    // Generowanie definicji znak�w
    const charDefinitions = chars.map(char => {
        const sanitizedName = char.name
            .replace(/[^a-zA-Z0-9]/g, '_') // Zamie� specjalne znaki na podkre�lenia
            .replace(/^[0-9]/, '_$&'); // Dodaj podkre�lenie je�li nazwa zaczyna si� od cyfry

        const bytes = char.pixels.map(row => {
            // Konwersja 5-bitowego wiersza na warto�� liczbow�
            return row.reduce((acc, pixel, idx) => {
                return acc | (pixel ? 1 << (4 - idx) : 0); // Lewy piksel = najstarszy bit
            }, 0);
        });

        return `    static const uint8_t ${sanitizedName}[8] = {${bytes.join(', ')}};`;
    }).join('\n');

    // Generowanie kodu dla bank�w
    let bankCode = '';
    if (banks.length > 0) {

        banks.forEach((bank, bankIndex) => {
            const sanitizedBankName = `bank_${bankIndex + 1}`;
            bankCode += lcdDefCharBanksDeclarationSectionHeader(sanitizedBankName);
            // Generowanie struktury banku
            if(addComments){
                bankCode += generateLcdCgramBankStructDoxygenComment(sanitizedBankName);
            }
            bankCode += `    static char_bank_struct_t ${sanitizedBankName} = {\n`;

            const bankChars = bank.characters
                .map((charIndex, index) => {
                    const charName = chars[charIndex]?.name.replace(/[^a-zA-Z0-9]/g, '_') || 'NULL'; // Nazwa znaku (zast�pienie niealfanumerycznych znak�w)
                    const hexIndex = index.toString(16).toUpperCase(); // Indeks w formacie hex
                    return {
                        name: charName,
                        hexIndex: `0x${hexIndex.padStart(2, '0')}`, // Formatowanie do 2 cyfr hex
                        index: index
                    };
                })
                .concat(Array(8).fill({ name: 'NULL', hexIndex: '0x00', index: -1 })) // Upewnij si�, �e zawsze 8 element�w
                .slice(0, 8) // Ogranicz do 8 element�w
                .map((char, index) => {
                    if (addComments) {
                        return `${char.name}, /**< @brief Label with value ${index} for custom character '${char.name}' at address ${char.hexIndex} in ${sanitizedBankName} and LCD_CGRAM. */`;
                    } else {
                        return `${char.name},`;
                    }
                })
                .join('\n        '); // włczenie elementów z odpowiednim formatowaniem
            bankCode += `        ${bankChars}\n    };\n\n`;
           
            // Generowanie enum�w dla banku
            if(addComments){
                bankCode += generaateLcdCgramBankEnumDoxygenComment(`LCD_CGRAM_BANK_${bankIndex + 1}_e`);
            }
            bankCode += `    enum LCD_CGRAM_BANK_${bankIndex + 1}_e {\n`;

            const enumValues = bank.characters
                .map((charIndex, idx) => {
                    const char = chars[charIndex];
                    if (!char) return null;
                    const sanitizedName = char.name.replace(/[^a-zA-Z0-9]/g, '_');
                    // const code_lin = '';
                    if(addComments){
                        return `        ${sanitizedBankName}_${sanitizedName}, /**< @brief Label with value ${idx} for custom character '${sanitizedName}' at address 0x0${idx} in ${sanitizedBankName} and LCD_CGRAM. */`;
                    }else{
                        return`        ${sanitizedBankName}_${sanitizedName},`
                    }
                })
                .filter(Boolean)
                .join('\n');

            bankCode += `${enumValues}\n    };\n\n`;

            if(addComments)
            {
                bankCode += lcdCharMapDoxygenComment(sanitizedBankName);
            }
            
            bankCode += '    static lcd_char_mapping_struct_t lcd_'+sanitizedBankName+'_def_chars_map[] = {\n';
            
            bankCode += '        // HERE YOU CAN DEFINE MAPPING OF YOUR DEF CHAR TO ANY U8 ASCII CHAR \n' +
                        '        // Defined ASCII U8 Char will be displayed on LCD as mapped def char\n' + 
                        '        // You can mapp more ASCI char to one def char. Look at the example bellow\n' +
                        '        // {\'ł\', bank_1_Pol_l}, /**< Extended ASCII \'ł\' mapped to the custom character under CGRAM address = bank_1_Pol_l) */\n' +
                        '        // {\'Ł\', bank_1_Pol_l}, /**< Extended ASCII \'Ł\' mapped to the custom character under CGRAM address = bank_1_Pol_l) */\n\n';

            const bankCharMapping = bank.characters
                .map((charIndex, idx) => {
                    const char = chars[charIndex];
                    if (!char) return null;
                    const sanitizedName = char.name.replace(/[^a-zA-Z0-9]/g, '_');
                    // const code_lin = '';
                    if(addComments){
                        return `        // {'<char2map>',${sanitizedBankName}_${sanitizedName}}, /**< Extended ASCII \'<char2map>\' mapped to the custom character under CGRAM address = ${sanitizedBankName}_${sanitizedName}) */`;
                    }else{
                        return`        // {'<char2map>',${sanitizedBankName}_${sanitizedName}},`
                    }
                })
                .filter(Boolean)
                .join('\n');

            bankCode += `${bankCharMapping}\n` + 
                        '        {CHAR_MAP_END, 0}     /**< !!! MANDATORY !!! - DO NOT REMOVE !!! */\n' +
                        '    };\n\n';

            if(addComments){
                bankCode +='    /**\n' +
                           '     * @brief Structure for loading a custom character bank and its associated character mapping table.\n' +
                           '     *\n' +
                           '     * This structure is used to define a custom character bank and its corresponding\n' +
                           '     * character mapping table. It is used to load custom characters into the LCD\'s\n' +
                           '     * CGRAM and map them to specific extended ASCII characters.\n' +
                           '     *\n' +
                           '     * @see '+sanitizedBankName+'\n' +
                           '     * @see lcd_'+sanitizedBankName+'_def_chars_map\n' +
                           '     */\n' +
                           '    static const lcd_bank_load_struct_t '+ sanitizedBankName +'_load_data = {\n' +
                           '        &'+sanitizedBankName+',                  /**< Pointer to the custom character bank containing user-defined characters. */\n' +
                           '        lcd_'+sanitizedBankName+'_def_chars_map, /**< Pointer to the mapping table that associates extended ASCII characters with custom character addresses. */\n' +
                           '    };\n\n';
            }else{
            bankCode += '    static const lcd_bank_load_struct_t '+ sanitizedBankName +'_load_data = {\n' +
                        '        &'+sanitizedBankName+',\n' +
                        '        lcd_'+sanitizedBankName+'_def_chars_map,\n' +
                        '    };\n\n';
            }
        });
    }

    // Stopka pliku
    let fileFooter = 
        '#ifdef __cplusplus\n' +
        '}\n' +
        '#endif /* __cplusplus */\n\n' +
        '#endif /* _LCD_HD44780_DEF_CHAR_H_ */\n';
    if(addComments){
        generatedCode = 
            headerFileStartContent + 
            lcdDefCharTypes;
        if(chars.length){ 
            generatedCode +=lcdDefCharDeclarationSectionHeader;
        };
        generatedCode += charDefinitions; 
        if(chars.length){ 
            generatedCode +=lcdDefCharDeclarationSectionFooter;
        };
        generatedCode +=      
            bankCode + // Dodaj kod bank�w
            fileFooter;
    }else{
        generatedCode = 
            headerFileStartContent + 
            lcdDefCharTypesNoComments; 
        if(chars.length){
            generatedCode +=lcdDefCharDeclarationSectionHeaderNoComments;
        }
        generatedCode += charDefinitions;
        if(chars.length){ 
            generatedCode += lcdDefCharDeclarationSectionFooterNoComments;
        }
        generatedCode += bankCode + // Dodaj kod bank�w
                         fileFooter;

    }

    setCode(generatedCode);
};