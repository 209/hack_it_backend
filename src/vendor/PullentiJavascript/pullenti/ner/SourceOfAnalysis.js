/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const SerializerHelper = require("./core/internal/SerializerHelper");

/**
 * Анализируемый текст
 */
class SourceOfAnalysis {
    
    /**
     * [Get] Исходный плоский текст
     */
    get text() {
        return this._text;
    }
    /**
     * [Set] Исходный плоский текст
     */
    set text(value) {
        this._text = value;
        return this._text;
    }
    
    /**
     * [Get] Используется произвольным образом
     */
    get tag() {
        return this._tag;
    }
    /**
     * [Set] Используется произвольным образом
     */
    set tag(value) {
        this._tag = value;
        return this._tag;
    }
    
    /**
     * Делать анализ переходов на новую строку, которые на самом деле таковыми не являются 
     *  (например, они форматируют абзац в PDF).
     * Создать контейнер на основе плоского текста. 
     *  При создании будут автоматически сделаны транслитеральные замены, если они будут найдены.
     * @param txt Текст
     */
    constructor(txt) {
        this._text = null;
        this._tag = null;
        this.clear_dust = false;
        this.crlf_corrected_count = 0;
        this.do_word_correction_by_morph = false;
        this.do_words_merging_by_morph = true;
        this.create_number_tokens = true;
        this.correction_dict = null;
        this.m_total_transliteral_substitutions = 0;
        if (Utils.isNullOrEmpty(txt)) {
            this.text = "";
            return;
        }
        this.text = txt;
    }
    
    /**
     * Это анализ случаев принудительно отформатированного текста
     * @param txt 
     */
    do_cr_lf_correction(txt) {
        let i = 0;
        let j = 0;
        let cou = 0;
        let total_len = 0;
        for (i = 0; i < txt.length; i++) {
            let ch = txt[i];
            if ((ch.charCodeAt(0)) !== 0xD && (ch.charCodeAt(0)) !== 0xA) 
                continue;
            let len = 0;
            let last_char = ch;
            for (j = i + 1; j < txt.length; j++) {
                ch = txt[j];
                if ((ch.charCodeAt(0)) === 0xD || (ch.charCodeAt(0)) === 0xA) 
                    break;
                else if ((ch.charCodeAt(0)) === 0x9) 
                    len += 5;
                else {
                    last_char = ch;
                    len++;
                }
            }
            if (j >= txt.length) 
                break;
            if (len < 30) 
                continue;
            if (last_char !== '.' && last_char !== ':' && last_char !== ';') {
                let next_is_dig = false;
                for (let k = j + 1; k < txt.length; k++) {
                    if (!Utils.isWhitespace(txt[k])) {
                        if (Utils.isDigit(txt[k])) 
                            next_is_dig = true;
                        break;
                    }
                }
                if (!next_is_dig) {
                    cou++;
                    total_len += len;
                }
            }
            i = j;
        }
        if (cou < 4) 
            return txt;
        total_len = Utils.intDiv(total_len, cou);
        if ((total_len < 50) || total_len > 100) 
            return txt;
        let tmp = new StringBuilder(txt);
        for (i = 0; i < tmp.length; i++) {
            let ch = tmp.charAt(i);
            let jj = 0;
            let len = 0;
            let last_char = ch;
            for (j = i + 1; j < tmp.length; j++) {
                ch = tmp.charAt(j);
                if ((ch.charCodeAt(0)) === 0xD || (ch.charCodeAt(0)) === 0xA) 
                    break;
                else if ((ch.charCodeAt(0)) === 0x9) 
                    len += 5;
                else {
                    last_char = ch;
                    len++;
                }
            }
            if (j >= tmp.length) 
                break;
            for (jj = j - 1; jj >= 0; jj--) {
                if (!Utils.isWhitespace((last_char = tmp.charAt(jj)))) 
                    break;
            }
            let not_single = false;
            jj = j + 1;
            if ((jj < tmp.length) && (tmp.charAt(j).charCodeAt(0)) === 0xD && (tmp.charAt(jj).charCodeAt(0)) === 0xA) 
                jj++;
            for (; jj < tmp.length; jj++) {
                ch = tmp.charAt(jj);
                if (!Utils.isWhitespace(ch)) 
                    break;
                if ((ch.charCodeAt(0)) === 0xD || (ch.charCodeAt(0)) === 0xA) {
                    not_single = true;
                    break;
                }
            }
            if (((!not_single && len > (total_len - 20) && (len < (total_len + 10))) && last_char !== '.' && last_char !== ':') && last_char !== ';') {
                tmp.setCharAt(j, ' ');
                this.crlf_corrected_count++;
                if ((j + 1) < tmp.length) {
                    ch = tmp.charAt(j + 1);
                    if ((ch.charCodeAt(0)) === 0xA) {
                        tmp.setCharAt(j + 1, ' ');
                        j++;
                    }
                }
            }
            i = j - 1;
        }
        return tmp.toString();
    }
    
    /**
     * Произвести транслитеральную коррекцию
     * @param txt корректируемый текст
     * @param info информация о замене (может быть null)
     * @return количество замен
     */
    static do_transliteral_correction(txt, info) {
        let i = 0;
        let j = 0;
        let k = 0;
        let stat = 0;
        let pref_rus_word = false;
        for (i = 0; i < txt.length; i++) {
            if (Utils.isLetter(txt.charAt(i))) {
                let rus = 0;
                let pure_lat = 0;
                let unknown = 0;
                for (j = i; j < txt.length; j++) {
                    let ch = txt.charAt(j);
                    if (!Utils.isLetter(ch)) 
                        break;
                    let code = ch.charCodeAt(0);
                    if (code >= 0x400 && (code < 0x500)) 
                        rus++;
                    else if (SourceOfAnalysis.m_lat_chars.indexOf(ch) >= 0) 
                        unknown++;
                    else 
                        pure_lat++;
                }
                if (((unknown > 0 && rus > 0)) || ((unknown > 0 && pure_lat === 0 && pref_rus_word))) {
                    if (info !== null) {
                        if (info.length > 0) 
                            info.append("\r\n");
                        for (k = i; k < j; k++) {
                            info.append(txt.charAt(k));
                        }
                        info.append(": ");
                    }
                    for (k = i; k < j; k++) {
                        let ii = SourceOfAnalysis.m_lat_chars.indexOf(txt.charAt(k));
                        if (ii >= 0) {
                            if (info !== null) 
                                info.append(txt.charAt(k)).append("->").append(SourceOfAnalysis.m_rus_chars[ii]).append(" ");
                            txt.setCharAt(k, SourceOfAnalysis.m_rus_chars[ii]);
                        }
                    }
                    stat += unknown;
                    pref_rus_word = true;
                }
                else 
                    pref_rus_word = rus > 0;
                i = j;
            }
        }
        return stat;
    }
    
    static calc_transliteral_statistics(txt, info) {
        if (txt === null) 
            return 0;
        let tmp = new StringBuilder(txt);
        return SourceOfAnalysis.do_transliteral_correction(tmp, info);
    }
    
    get total_transliteral_substitutions() {
        return this.m_total_transliteral_substitutions;
    }
    
    /**
     * Извлечь фрагмент из исходного текста
     * @param position 
     * @param length 
     * @return 
     */
    substring(position, length) {
        if (length < 0) 
            length = this.text.length - position;
        if ((position + length) <= this.text.length && length > 0) {
            let res = this.text.substring(position, position + length);
            if (res.indexOf("\r\n") >= 0) 
                res = Utils.replaceString(res, "\r\n", " ");
            if (res.indexOf('\n') >= 0) 
                res = Utils.replaceString(res, "\n", " ");
            return res;
        }
        return "Position + Length > Text.Length";
    }
    
    /**
     * Вычислить расстояние в символах между соседними элементами
     * @param indFrom 
     * @param indTo 
     * @return 
     */
    calc_whitespace_distance_between_positions(pos_from, pos_to) {
        if (pos_from === (pos_to + 1)) 
            return 0;
        if (pos_from > pos_to || (pos_from < 0) || pos_to >= this.text.length) 
            return -1;
        let res = 0;
        for (let i = pos_from; i <= pos_to; i++) {
            let ch = this.text[i];
            if (!Utils.isWhitespace(ch)) 
                return -1;
            if (ch === '\r' || ch === '\n') 
                res += 10;
            else if (ch === '\t') 
                res += 5;
            else 
                res++;
        }
        return res;
    }
    
    serialize(stream) {
        SerializerHelper.serialize_string(stream, this.text);
    }
    
    deserialize(stream) {
        this.text = SerializerHelper.deserialize_string(stream);
    }
    
    static _new566(_arg1, _arg2) {
        let res = new SourceOfAnalysis(_arg1);
        res.create_number_tokens = _arg2;
        return res;
    }
    
    static static_constructor() {
        SourceOfAnalysis.m_lat_chars = "ABEKMHOPCTYXaekmopctyx";
        SourceOfAnalysis.m_rus_chars = "АВЕКМНОРСТУХаекморстух";
    }
}


SourceOfAnalysis.static_constructor();

module.exports = SourceOfAnalysis