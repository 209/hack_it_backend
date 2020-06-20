/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

/**
 * Ввели для оптимизации на Питоне.
 */
class UnicodeInfo {
    
    static initialize() {
        
    }
    
    constructor(v = 0) {
        this.m_value = 0;
        this.uni_char = null;
        this.code = 0;
        this.uni_char = String.fromCharCode(v);
        this.code = v;
        this.m_value = 0;
    }
    
    get_value(i) {
        return (((((this.m_value) >> i)) & 1)) !== 0;
    }
    
    set_value(i, val) {
        if (val) 
            this.m_value |= ((1 << i));
        else 
            this.m_value &= (~((1 << i)));
    }
    
    get is_whitespace() {
        return (((this.m_value) & 0x1)) !== 0;
    }
    set is_whitespace(value) {
        this.set_value(0, value);
        return value;
    }
    
    get is_digit() {
        return (((this.m_value) & 0x2)) !== 0;
    }
    set is_digit(value) {
        this.set_value(1, value);
        return value;
    }
    
    get is_letter() {
        return (((this.m_value) & 0x4)) !== 0;
    }
    set is_letter(value) {
        this.set_value(2, value);
        return value;
    }
    
    get is_upper() {
        return (((this.m_value) & 0x8)) !== 0;
    }
    set is_upper(value) {
        this.set_value(3, value);
        return value;
    }
    
    get is_lower() {
        return (((this.m_value) & 0x10)) !== 0;
    }
    set is_lower(value) {
        this.set_value(4, value);
        return value;
    }
    
    get is_latin() {
        return (((this.m_value) & 0x20)) !== 0;
    }
    set is_latin(value) {
        this.set_value(5, value);
        return value;
    }
    
    get is_cyrillic() {
        return (((this.m_value) & 0x40)) !== 0;
    }
    set is_cyrillic(value) {
        this.set_value(6, value);
        return value;
    }
    
    get is_hiphen() {
        return (((this.m_value) & 0x80)) !== 0;
    }
    set is_hiphen(value) {
        this.set_value(7, value);
        return value;
    }
    
    get is_vowel() {
        return (((this.m_value) & 0x100)) !== 0;
    }
    set is_vowel(value) {
        this.set_value(8, value);
        return value;
    }
    
    get is_quot() {
        return (((this.m_value) & 0x200)) !== 0;
    }
    set is_quot(value) {
        this.set_value(9, value);
        return value;
    }
    
    get is_apos() {
        return (((this.m_value) & 0x400)) !== 0;
    }
    set is_apos(value) {
        this.set_value(10, value);
        return value;
    }
    
    get is_udaren() {
        return (((this.m_value) & 0x800)) !== 0;
    }
    set is_udaren(value) {
        this.set_value(11, value);
        return value;
    }
    
    static static_constructor() {
        UnicodeInfo.ALL_CHARS = null;
        UnicodeInfo.ALL_CHARS = new Array();
        let cyrvowel = "АЕЁИОУЮЯЫЭЄІЇЎӘӨҰҮІ";
        cyrvowel += cyrvowel.toLowerCase();
        for (let i = 0; i < 0x10000; i++) {
            let ch = String.fromCharCode(i);
            let ui = new UnicodeInfo(i);
            if (Utils.isWhitespace(ch)) 
                ui.is_whitespace = true;
            else if (Utils.isDigit(ch)) 
                ui.is_digit = true;
            else if (ch === 'º' || ch === '°') {
            }
            else if (Utils.isLetter(ch)) {
                ui.is_letter = true;
                if (i >= 0x400 && (i < 0x500)) {
                    ui.is_cyrillic = true;
                    if (cyrvowel.indexOf(ch) >= 0) 
                        ui.is_vowel = true;
                }
                else if (i < 0x200) {
                    ui.is_latin = true;
                    if ("AEIOUYaeiouy".indexOf(ch) >= 0) 
                        ui.is_vowel = true;
                }
                if (Utils.isUpperCase(ch)) 
                    ui.is_upper = true;
                if (Utils.isLowerCase(ch)) 
                    ui.is_lower = true;
            }
            else {
                if (((((ch === '-' || ch === '–' || ch === '¬') || ch === '-' || ch === (String.fromCharCode(0x00AD))) || ch === (String.fromCharCode(0x2011)) || ch === '-') || ch === '—' || ch === '–') || ch === '−' || ch === '-') 
                    ui.is_hiphen = true;
                if ("\"'`“”’".indexOf(ch) >= 0) 
                    ui.is_quot = true;
                if ("'`’".indexOf(ch) >= 0) {
                    ui.is_apos = true;
                    ui.is_quot = true;
                }
            }
            if (i >= 0x300 && (i < 0x370)) 
                ui.is_udaren = true;
            UnicodeInfo.ALL_CHARS.push(ui);
        }
    }
}


UnicodeInfo.static_constructor();

module.exports = UnicodeInfo