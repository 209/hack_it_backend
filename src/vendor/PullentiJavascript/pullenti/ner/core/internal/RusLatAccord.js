/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const LanguageHelper = require("./../../../morph/LanguageHelper");

class RusLatAccord {
    
    constructor(ru, la, brus = true, blat = true) {
        this.rus = null;
        this.lat = null;
        this.rus_to_lat = false;
        this.lat_to_rus = false;
        this.on_tail = false;
        this.rus = ru.toUpperCase();
        this.lat = la.toUpperCase();
        this.rus_to_lat = brus;
        this.lat_to_rus = blat;
    }
    
    toString() {
        let tmp = new StringBuilder();
        tmp.append("'").append(this.rus).append("'");
        if (this.rus_to_lat && this.lat_to_rus) 
            tmp.append(" <-> ");
        else if (this.rus_to_lat) 
            tmp.append(" -> ");
        else if (this.lat_to_rus) 
            tmp.append(" <- ");
        tmp.append("'").append(this.lat).append("'");
        return tmp.toString();
    }
    
    static get_accords() {
        if (RusLatAccord.m_accords !== null) 
            return RusLatAccord.m_accords;
        RusLatAccord.m_accords = new Array();
        RusLatAccord.m_accords.push(new RusLatAccord("а", "a"));
        RusLatAccord.m_accords.push(new RusLatAccord("а", "aa"));
        RusLatAccord.m_accords.push(new RusLatAccord("б", "b"));
        RusLatAccord.m_accords.push(new RusLatAccord("в", "v"));
        RusLatAccord.m_accords.push(new RusLatAccord("в", "w"));
        RusLatAccord.m_accords.push(new RusLatAccord("г", "g"));
        RusLatAccord.m_accords.push(new RusLatAccord("д", "d"));
        RusLatAccord.m_accords.push(new RusLatAccord("е", "e"));
        RusLatAccord.m_accords.push(new RusLatAccord("е", "yo"));
        RusLatAccord.m_accords.push(new RusLatAccord("е", "io"));
        RusLatAccord.m_accords.push(new RusLatAccord("е", "jo"));
        RusLatAccord.m_accords.push(new RusLatAccord("ж", "j"));
        RusLatAccord.m_accords.push(new RusLatAccord("дж", "j"));
        RusLatAccord.m_accords.push(new RusLatAccord("з", "z"));
        RusLatAccord.m_accords.push(new RusLatAccord("и", "e"));
        RusLatAccord.m_accords.push(new RusLatAccord("и", "i"));
        RusLatAccord.m_accords.push(new RusLatAccord("и", "y"));
        RusLatAccord.m_accords.push(new RusLatAccord("и", "ea"));
        RusLatAccord.m_accords.push(new RusLatAccord("й", "i"));
        RusLatAccord.m_accords.push(new RusLatAccord("й", "y"));
        RusLatAccord.m_accords.push(new RusLatAccord("к", "c"));
        RusLatAccord.m_accords.push(new RusLatAccord("к", "k"));
        RusLatAccord.m_accords.push(new RusLatAccord("к", "ck"));
        RusLatAccord.m_accords.push(new RusLatAccord("кс", "x"));
        RusLatAccord.m_accords.push(new RusLatAccord("л", "l"));
        RusLatAccord.m_accords.push(new RusLatAccord("м", "m"));
        RusLatAccord.m_accords.push(new RusLatAccord("н", "n"));
        RusLatAccord.m_accords.push(new RusLatAccord("о", "a"));
        RusLatAccord.m_accords.push(new RusLatAccord("о", "o"));
        RusLatAccord.m_accords.push(new RusLatAccord("о", "ow"));
        RusLatAccord.m_accords.push(new RusLatAccord("о", "oh"));
        RusLatAccord.m_accords.push(new RusLatAccord("п", "p"));
        RusLatAccord.m_accords.push(new RusLatAccord("р", "r"));
        RusLatAccord.m_accords.push(new RusLatAccord("с", "s"));
        RusLatAccord.m_accords.push(new RusLatAccord("с", "c"));
        RusLatAccord.m_accords.push(new RusLatAccord("т", "t"));
        RusLatAccord.m_accords.push(new RusLatAccord("у", "u"));
        RusLatAccord.m_accords.push(new RusLatAccord("у", "w"));
        RusLatAccord.m_accords.push(new RusLatAccord("ф", "f"));
        RusLatAccord.m_accords.push(new RusLatAccord("ф", "ph"));
        RusLatAccord.m_accords.push(new RusLatAccord("х", "h"));
        RusLatAccord.m_accords.push(new RusLatAccord("х", "kh"));
        RusLatAccord.m_accords.push(new RusLatAccord("ц", "ts"));
        RusLatAccord.m_accords.push(new RusLatAccord("ц", "c"));
        RusLatAccord.m_accords.push(new RusLatAccord("ч", "ch"));
        RusLatAccord.m_accords.push(new RusLatAccord("ш", "sh"));
        RusLatAccord.m_accords.push(new RusLatAccord("щ", "shch"));
        RusLatAccord.m_accords.push(new RusLatAccord("ы", "i"));
        RusLatAccord.m_accords.push(new RusLatAccord("э", "e"));
        RusLatAccord.m_accords.push(new RusLatAccord("э", "a"));
        RusLatAccord.m_accords.push(new RusLatAccord("ю", "iu"));
        RusLatAccord.m_accords.push(new RusLatAccord("ю", "ju"));
        RusLatAccord.m_accords.push(new RusLatAccord("ю", "yu"));
        RusLatAccord.m_accords.push(new RusLatAccord("ю", "ew"));
        RusLatAccord.m_accords.push(new RusLatAccord("я", "ia"));
        RusLatAccord.m_accords.push(new RusLatAccord("я", "ja"));
        RusLatAccord.m_accords.push(new RusLatAccord("я", "ya"));
        RusLatAccord.m_accords.push(new RusLatAccord("ъ", ""));
        RusLatAccord.m_accords.push(new RusLatAccord("ь", ""));
        RusLatAccord.m_accords.push(new RusLatAccord("", "gh"));
        RusLatAccord.m_accords.push(new RusLatAccord("", "h"));
        RusLatAccord.m_accords.push(RusLatAccord._new530("", "e", true));
        RusLatAccord.m_accords.push(new RusLatAccord("еи", "ei"));
        RusLatAccord.m_accords.push(new RusLatAccord("аи", "ai"));
        RusLatAccord.m_accords.push(new RusLatAccord("ай", "i"));
        RusLatAccord.m_accords.push(new RusLatAccord("уи", "ui"));
        RusLatAccord.m_accords.push(new RusLatAccord("уи", "w"));
        RusLatAccord.m_accords.push(new RusLatAccord("ои", "oi"));
        RusLatAccord.m_accords.push(new RusLatAccord("ей", "ei"));
        RusLatAccord.m_accords.push(new RusLatAccord("ей", "ey"));
        RusLatAccord.m_accords.push(new RusLatAccord("ай", "ai"));
        RusLatAccord.m_accords.push(new RusLatAccord("ай", "ay"));
        RusLatAccord.m_accords.push(new RusLatAccord(" ", " "));
        RusLatAccord.m_accords.push(new RusLatAccord("-", "-"));
        return RusLatAccord.m_accords;
    }
    
    static _is_pref(str, i, pref) {
        if ((pref.length + i) > str.length) 
            return false;
        for (let j = 0; j < pref.length; j++) {
            if (pref[j] !== str[i + j]) 
                return false;
        }
        return true;
    }
    
    static _get_vars_pref(_rus, ri, _lat, li) {
        let res = null;
        for (const a of RusLatAccord.get_accords()) {
            if (RusLatAccord._is_pref(_rus, ri, a.rus) && RusLatAccord._is_pref(_lat, li, a.lat) && a.rus_to_lat) {
                if (a.on_tail) {
                    if ((ri + a.rus.length) < _rus.length) 
                        continue;
                    if ((li + a.lat.length) < _lat.length) 
                        continue;
                }
                if (res === null) 
                    res = new Array();
                res.push(a);
            }
        }
        return res;
    }
    
    /**
     * Сформировать всевозможные варианты написаний на другой раскладке
     * @param rus_or_lat слово на кириллице или латинице
     * @return 
     */
    static get_variants(rus_or_lat) {
        let res = new Array();
        if (Utils.isNullOrEmpty(rus_or_lat)) 
            return res;
        rus_or_lat = rus_or_lat.toUpperCase();
        let is_rus = LanguageHelper.is_cyrillic_char(rus_or_lat[0]);
        let stack = new Array();
        let i = 0;
        for (i = 0; i < rus_or_lat.length; i++) {
            let li = new Array();
            let maxlen = 0;
            for (const a of RusLatAccord.get_accords()) {
                let pref = null;
                if (is_rus && a.rus.length > 0) 
                    pref = a.rus;
                else if (!is_rus && a.lat.length > 0) 
                    pref = a.lat;
                else 
                    continue;
                if (pref.length < maxlen) 
                    continue;
                if (!RusLatAccord._is_pref(rus_or_lat, i, pref)) 
                    continue;
                if (a.on_tail) {
                    if ((pref.length + i) < rus_or_lat.length) 
                        continue;
                }
                if (pref.length > maxlen) {
                    maxlen = pref.length;
                    li.splice(0, li.length);
                }
                li.push(a);
            }
            if (li.length === 0 || maxlen === 0) 
                return res;
            stack.push(li);
            i += (maxlen - 1);
        }
        if (stack.length === 0) 
            return res;
        let ind = new Array();
        for (i = 0; i < stack.length; i++) {
            ind.push(0);
        }
        let tmp = new StringBuilder();
        while (true) {
            tmp.length = 0;
            for (i = 0; i < ind.length; i++) {
                let a = stack[i][ind[i]];
                tmp.append((is_rus ? a.lat : a.rus));
            }
            let ok = true;
            if (!is_rus) {
                for (i = 0; i < tmp.length; i++) {
                    if (tmp.charAt(i) === 'Й') {
                        if (i === 0) {
                            ok = false;
                            break;
                        }
                        if (!LanguageHelper.is_cyrillic_vowel(tmp.charAt(i - 1))) {
                            ok = false;
                            break;
                        }
                    }
                }
            }
            if (ok) 
                res.push(tmp.toString());
            for (i = ind.length - 1; i >= 0; i--) {
                if ((++ind[i]) < stack[i].length) 
                    break;
                else 
                    ind[i] = 0;
            }
            if (i < 0) 
                break;
        }
        return res;
    }
    
    static can_be_equals(_rus, _lat) {
        if (Utils.isNullOrEmpty(_rus) || Utils.isNullOrEmpty(_lat)) 
            return false;
        _rus = _rus.toUpperCase();
        _lat = _lat.toUpperCase();
        let vs = RusLatAccord._get_vars_pref(_rus, 0, _lat, 0);
        if (vs === null) 
            return false;
        let stack = new Array();
        stack.push(vs);
        while (stack.length > 0) {
            if (stack.length === 0) 
                break;
            let ri = 0;
            let li = 0;
            for (const s of stack) {
                ri += s[0].rus.length;
                li += s[0].lat.length;
            }
            if (ri >= _rus.length && li >= _lat.length) 
                return true;
            vs = RusLatAccord._get_vars_pref(_rus, ri, _lat, li);
            if (vs !== null) {
                stack.splice(0, 0, vs);
                continue;
            }
            while (stack.length > 0) {
                stack[0].splice(0, 1);
                if (stack[0].length > 0) 
                    break;
                stack.splice(0, 1);
            }
        }
        return false;
    }
    
    /**
     * Вернёт длину привязки
     * @param txt 
     * @param pos 
     * @param res 
     * @return 
     */
    static find_accords_rus_to_lat(txt, pos, res) {
        if (pos >= txt.length) 
            return 0;
        let ch0 = txt[pos];
        let ok = false;
        if ((pos + 1) < txt.length) {
            let ch1 = txt[pos + 1];
            for (const a of RusLatAccord.get_accords()) {
                if ((a.rus_to_lat && a.rus.length === 2 && a.rus[0] === ch0) && a.rus[1] === ch1) {
                    res.push(a.lat);
                    ok = true;
                }
            }
            if (ok) 
                return 2;
        }
        for (const a of RusLatAccord.get_accords()) {
            if (a.rus_to_lat && a.rus.length === 1 && a.rus[0] === ch0) {
                res.push(a.lat);
                ok = true;
            }
        }
        if (ok) 
            return 1;
        return 0;
    }
    
    static find_accords_lat_to_rus(txt, pos, res) {
        if (pos >= txt.length) 
            return 0;
        let i = 0;
        let j = 0;
        let max_len = 0;
        for (const a of RusLatAccord.get_accords()) {
            if (a.lat_to_rus && a.lat.length >= max_len) {
                for (i = 0; i < a.lat.length; i++) {
                    if ((pos + i) >= txt.length) 
                        break;
                    if (txt[pos + i] !== a.lat[i]) 
                        break;
                }
                if ((i < a.lat.length) || (a.lat.length < 1)) 
                    continue;
                if (a.lat.length > max_len) {
                    res.splice(0, res.length);
                    max_len = a.lat.length;
                }
                res.push(a.rus);
            }
        }
        return max_len;
    }
    
    static _new530(_arg1, _arg2, _arg3) {
        let res = new RusLatAccord(_arg1, _arg2);
        res.on_tail = _arg3;
        return res;
    }
    
    static static_constructor() {
        RusLatAccord.m_accords = null;
    }
}


RusLatAccord.static_constructor();

module.exports = RusLatAccord