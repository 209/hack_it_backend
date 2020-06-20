/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const MorphNumber = require("./MorphNumber");
const MorphLang = require("./MorphLang");
const LanguageHelper = require("./LanguageHelper");
const MorphClass = require("./MorphClass");

/**
 * Элементы, на которые разбивается исходный текст (токены)
 */
class MorphToken {
    
    /**
     * [Get] Число символов (нормализованного фрагмента = Term.Length)
     */
    get length() {
        return (this.term === null ? 0 : this.term.length);
    }
    
    /**
     * Извлечь фрагмент из исходного текста, соответствующий токену
     * @param text полный исходный текст
     * @return фрагмент
     */
    get_source_text(text) {
        return text.substring(this.begin_char, this.begin_char + (this.end_char + 1) - this.begin_char);
    }
    
    /**
     * [Get] Лемма (вариант морфологической нормализации)
     */
    get lemma() {
        if (this.m_lemma !== null) 
            return this.m_lemma;
        let res = null;
        if (this.word_forms !== null && this.word_forms.length > 0) {
            if (this.word_forms.length === 1) 
                res = (this.word_forms[0].normal_full != null ? this.word_forms[0].normal_full : this.word_forms[0].normal_case);
            if (res === null && !this.char_info.is_all_lower) {
                for (const m of this.word_forms) {
                    if (m.class0.is_proper_surname) {
                        let s = (m.normal_full != null ? m.normal_full : m.normal_case);
                        if (LanguageHelper.ends_with_ex(s, "ОВ", "ЕВ", null, null)) {
                            res = s;
                            break;
                        }
                    }
                    else if (m.class0.is_proper_name && m.is_in_dictionary) 
                        return m.normal_case;
                }
            }
            if (res === null) {
                let best = null;
                for (const m of this.word_forms) {
                    if (best === null) 
                        best = m;
                    else if (this.compare_forms(best, m) > 0) 
                        best = m;
                }
                res = (best.normal_full != null ? best.normal_full : best.normal_case);
            }
        }
        if (res !== null) {
            if (LanguageHelper.ends_with_ex(res, "АНЫЙ", "ЕНЫЙ", null, null)) 
                res = res.substring(0, 0 + res.length - 3) + "ННЫЙ";
            else if (LanguageHelper.ends_with(res, "ЙСЯ")) 
                res = res.substring(0, 0 + res.length - 2);
            else if (LanguageHelper.ends_with(res, "АНИЙ") && res === this.term) {
                for (const wf of this.word_forms) {
                    if (wf.is_in_dictionary) 
                        return res;
                }
                return res.substring(0, 0 + res.length - 1) + "Е";
            }
            return res;
        }
        return (this.term != null ? this.term : "?");
    }
    /**
     * [Set] Лемма (вариант морфологической нормализации)
     */
    set lemma(value) {
        this.m_lemma = value;
        return value;
    }
    
    compare_forms(x, y) {
        let vx = (x.normal_full != null ? x.normal_full : x.normal_case);
        let vy = (y.normal_full != null ? y.normal_full : y.normal_case);
        if (vx === vy) 
            return 0;
        if (Utils.isNullOrEmpty(vx)) 
            return 1;
        if (Utils.isNullOrEmpty(vy)) 
            return -1;
        let lastx = vx[vx.length - 1];
        let lasty = vy[vy.length - 1];
        if (x.class0.is_proper_surname && !this.char_info.is_all_lower) {
            if (LanguageHelper.ends_with_ex(vx, "ОВ", "ЕВ", "ИН", null)) {
                if (!y.class0.is_proper_surname) 
                    return -1;
            }
        }
        if (y.class0.is_proper_surname && !this.char_info.is_all_lower) {
            if (LanguageHelper.ends_with_ex(vy, "ОВ", "ЕВ", "ИН", null)) {
                if (!x.class0.is_proper_surname) 
                    return 1;
                if (vx.length > vy.length) 
                    return -1;
                if (vx.length < vy.length) 
                    return 1;
                return 0;
            }
        }
        if (MorphClass.ooEq(x.class0, y.class0)) {
            if (x.class0.is_adjective) {
                if (lastx === 'Й' && lasty !== 'Й') 
                    return -1;
                if (lastx !== 'Й' && lasty === 'Й') 
                    return 1;
                if (!LanguageHelper.ends_with(vx, "ОЙ") && LanguageHelper.ends_with(vy, "ОЙ")) 
                    return -1;
                if (LanguageHelper.ends_with(vx, "ОЙ") && !LanguageHelper.ends_with(vy, "ОЙ")) 
                    return 1;
            }
            if (x.class0.is_noun) {
                if (x.number === MorphNumber.SINGULAR && y.number === MorphNumber.PLURAL && vx.length <= (vy.length + 1)) 
                    return -1;
                if (x.number === MorphNumber.PLURAL && y.number === MorphNumber.SINGULAR && vx.length >= (vy.length - 1)) 
                    return 1;
            }
            if (vx.length < vy.length) 
                return -1;
            if (vx.length > vy.length) 
                return 1;
            return 0;
        }
        if (x.class0.is_adverb) 
            return 1;
        if (x.class0.is_noun && x.is_in_dictionary) {
            if (y.class0.is_adjective && y.is_in_dictionary) {
                if (!y.misc.attrs.includes("к.ф.")) 
                    return 1;
            }
            return -1;
        }
        if (x.class0.is_adjective) {
            if (!x.is_in_dictionary && y.class0.is_noun && y.is_in_dictionary) 
                return 1;
            return -1;
        }
        if (x.class0.is_verb) {
            if (y.class0.is_noun || y.class0.is_adjective || y.class0.is_preposition) 
                return 1;
            return -1;
        }
        if (y.class0.is_adverb) 
            return -1;
        if (y.class0.is_noun && y.is_in_dictionary) 
            return 1;
        if (y.class0.is_adjective) {
            if (((x.class0.is_noun || x.class0.is_proper_secname)) && x.is_in_dictionary) 
                return -1;
            if (x.class0.is_noun && !y.is_in_dictionary) {
                if (vx.length < vy.length) 
                    return -1;
            }
            return 1;
        }
        if (y.class0.is_verb) {
            if (x.class0.is_noun || x.class0.is_adjective || x.class0.is_preposition) 
                return -1;
            if (x.class0.is_proper) 
                return -1;
            return 1;
        }
        if (vx.length < vy.length) 
            return -1;
        if (vx.length > vy.length) 
            return 1;
        return 0;
    }
    
    /**
     * [Get] Язык(и)
     */
    get language() {
        if (this.m_language !== null && MorphLang.ooNoteq(this.m_language, MorphLang.UNKNOWN)) 
            return this.m_language;
        let lang = new MorphLang();
        if (this.word_forms !== null) {
            for (const wf of this.word_forms) {
                if (MorphLang.ooNoteq(wf.language, MorphLang.UNKNOWN)) 
                    lang = MorphLang.ooBitor(lang, wf.language);
            }
        }
        return lang;
    }
    /**
     * [Set] Язык(и)
     */
    set language(value) {
        this.m_language = value;
        return value;
    }
    
    constructor() {
        this.begin_char = 0;
        this.end_char = 0;
        this.term = null;
        this.m_lemma = null;
        this.tag = null;
        this.m_language = null;
        this.word_forms = null;
        this.char_info = null;
    }
    
    toString() {
        if (Utils.isNullOrEmpty(this.term)) 
            return "Null";
        let str = this.term;
        if (this.char_info.is_all_lower) 
            str = str.toLowerCase();
        else if (this.char_info.is_capital_upper && str.length > 0) 
            str = (this.term[0] + this.term.substring(1).toLowerCase());
        else if (this.char_info.is_last_lower) 
            str = (this.term.substring(0, 0 + this.term.length - 1) + this.term.substring(this.term.length - 1).toLowerCase());
        if (this.word_forms === null) 
            return str;
        let res = new StringBuilder(str);
        for (const l_ of this.word_forms) {
            res.append(", ").append(l_.toString());
        }
        return res.toString();
    }
}


module.exports = MorphToken