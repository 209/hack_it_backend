/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphNumber = require("./../../morph/MorphNumber");
const MetaToken = require("./../MetaToken");
const MorphLang = require("./../../morph/MorphLang");
const MorphCase = require("./../../morph/MorphCase");
const LanguageHelper = require("./../../morph/LanguageHelper");
const NumberExType = require("./NumberExType");
const MorphGender = require("./../../morph/MorphGender");
const NumberExToken = require("./NumberExToken");
const Token = require("./../Token");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const NumberSpellingType = require("./../NumberSpellingType");
const MorphCollection = require("./../MorphCollection");
const TerminParseAttr = require("./TerminParseAttr");
const MorphClass = require("./../../morph/MorphClass");
const MorphWordForm = require("./../../morph/MorphWordForm");
const Morphology = require("./../../morph/Morphology");
const TextToken = require("./../TextToken");
const NumberToken = require("./../NumberToken");
const Termin = require("./Termin");
const TerminCollection = require("./TerminCollection");

/**
 * Работа с числовыми значениями
 */
class NumberHelper {
    
    /**
     * Попробовать создать числительное (без знака, целочисленное). 
     *  Внимание! Этот метод всегда вызывается процессором при формировании цепочки токенов, 
     *  так что все NumberToken уже созданы.
     * @param token 
     * @return 
     */
    static try_parse_number(token) {
        return NumberHelper._try_parse(token, null);
    }
    
    static _try_parse(token, prev_val = null) {
        if (token instanceof NumberToken) 
            return Utils.as(token, NumberToken);
        let tt = Utils.as(token, TextToken);
        if (tt === null) 
            return null;
        let et = tt;
        let val = null;
        let typ = NumberSpellingType.DIGIT;
        let term = tt.term;
        let i = 0;
        let j = 0;
        if (Utils.isDigit(term[0])) 
            val = term;
        if (val !== null) {
            let hiph = false;
            if ((et.next instanceof TextToken) && et.next.is_hiphen) {
                if ((et.whitespaces_after_count < 2) && (et.next.whitespaces_after_count < 2)) {
                    et = Utils.as(et.next, TextToken);
                    hiph = true;
                }
            }
            let mc = null;
            if (hiph || !et.is_whitespace_after) {
                let rr = NumberHelper.analize_number_tail(Utils.as(et.next, TextToken), val);
                if (rr === null) 
                    et = tt;
                else {
                    mc = rr.morph;
                    et = Utils.as(rr.end_token, TextToken);
                }
            }
            else 
                et = tt;
            if (et.next !== null && et.next.is_char('(')) {
                let num2 = NumberHelper.try_parse_number(et.next.next);
                if ((num2 !== null && num2.value === val && num2.end_token.next !== null) && num2.end_token.next.is_char(')')) 
                    et = Utils.as(num2.end_token.next, TextToken);
            }
            while ((et.next instanceof TextToken) && !((et.previous instanceof NumberToken)) && et.is_whitespace_before) {
                if (et.whitespaces_after_count !== 1) 
                    break;
                let sss = (et.next).term;
                if (sss === "000") {
                    val = val + "000";
                    et = Utils.as(et.next, TextToken);
                    continue;
                }
                if (Utils.isDigit(sss[0]) && sss.length === 3) {
                    let val2 = val;
                    for (let ttt = et.next; ttt !== null; ttt = ttt.next) {
                        let ss = ttt.get_source_text();
                        if (ttt.whitespaces_before_count === 1 && ttt.length_char === 3 && Utils.isDigit(ss[0])) {
                            let ii = 0;
                            let wrapii574 = new RefOutArgWrapper();
                            let inoutres575 = Utils.tryParseInt(ss, wrapii574);
                            ii = wrapii574.value;
                            if (!inoutres575) 
                                break;
                            val2 += ss;
                            continue;
                        }
                        if ((ttt.is_char_of(".,") && !ttt.is_whitespace_before && !ttt.is_whitespace_after) && ttt.next !== null && Utils.isDigit(ttt.next.get_source_text()[0])) {
                            if (ttt.next.is_whitespace_after && (ttt.previous instanceof TextToken)) {
                                et = Utils.as(ttt.previous, TextToken);
                                val = val2;
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
            for (let k = 0; k < 3; k++) {
                if ((et.next instanceof TextToken) && et.next.chars.is_letter) {
                    tt = Utils.as(et.next, TextToken);
                    let t0 = et;
                    let coef = null;
                    if (k === 0) {
                        coef = "000000000";
                        if (tt.is_value("МИЛЛИАРД", "МІЛЬЯРД") || tt.is_value("BILLION", null) || tt.is_value("BN", null)) {
                            et = tt;
                            val += coef;
                        }
                        else if (tt.is_value("МЛРД", null)) {
                            et = tt;
                            val += coef;
                            if ((et.next instanceof TextToken) && et.next.is_char('.')) 
                                et = Utils.as(et.next, TextToken);
                        }
                        else 
                            continue;
                    }
                    else if (k === 1) {
                        coef = "000000";
                        if (tt.is_value("МИЛЛИОН", "МІЛЬЙОН") || tt.is_value("MILLION", null)) {
                            et = tt;
                            val += coef;
                        }
                        else if (tt.is_value("МЛН", null)) {
                            et = tt;
                            val += coef;
                            if ((et.next instanceof TextToken) && et.next.is_char('.')) 
                                et = Utils.as(et.next, TextToken);
                        }
                        else if ((tt instanceof TextToken) && (tt).term === "M") {
                            if (NumberHelper.is_money_char(et.previous) !== null) {
                                et = tt;
                                val += coef;
                            }
                            else 
                                break;
                        }
                        else 
                            continue;
                    }
                    else {
                        coef = "000";
                        if (tt.is_value("ТЫСЯЧА", "ТИСЯЧА") || tt.is_value("THOUSAND", null)) {
                            et = tt;
                            val += coef;
                        }
                        else if (tt.is_value("ТЫС", null) || tt.is_value("ТИС", null)) {
                            et = tt;
                            val += coef;
                            if ((et.next instanceof TextToken) && et.next.is_char('.')) 
                                et = Utils.as(et.next, TextToken);
                        }
                        else 
                            break;
                    }
                    if (((t0 === token && t0.length_char <= 3 && t0.previous !== null) && !t0.is_whitespace_before && t0.previous.is_char_of(",.")) && !t0.previous.is_whitespace_before && (((t0.previous.previous instanceof NumberToken) || prev_val !== null))) {
                        if (t0.length_char === 1) 
                            val = val.substring(0, 0 + val.length - 1);
                        else if (t0.length_char === 2) 
                            val = val.substring(0, 0 + val.length - 2);
                        else 
                            val = val.substring(0, 0 + val.length - 3);
                        let hi = (t0.previous.previous instanceof NumberToken ? (t0.previous.previous).value : prev_val.value);
                        let cou = coef.length - val.length;
                        for (; cou > 0; cou--) {
                            hi = hi + "0";
                        }
                        val = hi + val;
                        token = t0.previous.previous;
                    }
                    let next = NumberHelper._try_parse(et.next, null);
                    if (next === null || next.value.length > coef.length) 
                        break;
                    let tt1 = next.end_token;
                    if (((tt1.next instanceof TextToken) && !tt1.is_whitespace_after && tt1.next.is_char_of(".,")) && !tt1.next.is_whitespace_after) {
                        let re1 = NumberHelper._try_parse(tt1.next.next, next);
                        if (re1 !== null && re1.begin_token === next.begin_token) 
                            next = re1;
                    }
                    if (val.length > next.value.length) 
                        val = val.substring(0, 0 + val.length - next.value.length);
                    val += next.value;
                    et = Utils.as(next.end_token, TextToken);
                    break;
                }
            }
            let res = NumberToken._new576(token, et, val, typ, mc);
            if (et.next !== null && (res.value.length < 4) && ((et.next.is_hiphen || et.next.is_value("ДО", null)))) {
                for (let tt1 = et.next.next; tt1 !== null; tt1 = tt1.next) {
                    if (!((tt1 instanceof TextToken))) 
                        break;
                    if (Utils.isDigit((tt1).term[0])) 
                        continue;
                    if (tt1.is_char_of(",.") || NumberHelper.is_money_char(tt1) !== null) 
                        continue;
                    if (tt1.is_value("МИЛЛИОН", "МІЛЬЙОН") || tt1.is_value("МЛН", null) || tt1.is_value("MILLION", null)) 
                        res.value = res.value + "000000";
                    else if ((tt1.is_value("МИЛЛИАРД", "МІЛЬЯРД") || tt1.is_value("МЛРД", null) || tt1.is_value("BILLION", null)) || tt1.is_value("BN", null)) 
                        res.value = res.value + "000000000";
                    else if (tt1.is_value("ТЫСЯЧА", "ТИСЯЧА") || tt1.is_value("ТЫС", "ТИС") || tt1.is_value("THOUSAND", null)) 
                        res.value = res.value + "1000";
                    break;
                }
            }
            return res;
        }
        let int_val = 0;
        et = null;
        let loc_value = 0;
        let is_adj = false;
        let jprev = -1;
        for (let t = tt; t !== null; t = Utils.as(t.next, TextToken)) {
            if (t !== tt && t.newlines_before_count > 1) 
                break;
            term = t.term;
            if (!Utils.isLetter(term[0])) 
                break;
            let num = NumberHelper.m_nums.try_parse(t, TerminParseAttr.FULLWORDSONLY);
            if (num === null) 
                break;
            j = num.termin.tag;
            if (jprev > 0 && (jprev < 20) && (j < 20)) 
                break;
            is_adj = ((j & NumberHelper.pril_num_tag_bit)) !== 0;
            j &= (~NumberHelper.pril_num_tag_bit);
            if (is_adj && t !== tt) {
                if ((t.is_value("ДЕСЯТЫЙ", null) || t.is_value("СОТЫЙ", null) || t.is_value("ТЫСЯЧНЫЙ", null)) || t.is_value("ДЕСЯТИТЫСЯЧНЫЙ", null) || t.is_value("МИЛЛИОННЫЙ", null)) 
                    break;
            }
            if (j >= 1000) {
                if (loc_value === 0) 
                    loc_value = 1;
                int_val += (loc_value * j);
                loc_value = 0;
            }
            else {
                if (loc_value > 0 && loc_value <= j) 
                    break;
                loc_value += j;
            }
            et = t;
            if (j === 1000 || j === 1000000) {
                if ((et.next instanceof TextToken) && et.next.is_char('.')) 
                    t = (et = Utils.as(et.next, TextToken));
            }
            jprev = j;
        }
        if (loc_value > 0) 
            int_val += loc_value;
        if (int_val === 0 || et === null) 
            return null;
        let nt = new NumberToken(tt, et, int_val.toString(), NumberSpellingType.WORDS);
        if (et.morph !== null) {
            nt.morph = new MorphCollection(et.morph);
            for (const wff of et.morph.items) {
                let wf = Utils.as(wff, MorphWordForm);
                if (wf !== null && wf.misc !== null && wf.misc.attrs.includes("собир.")) {
                    nt.morph.class0 = MorphClass.NOUN;
                    break;
                }
            }
            if (!is_adj) {
                nt.morph.remove_items(MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.NOUN), false);
                if (nt.morph.class0.is_undefined) 
                    nt.morph.class0 = MorphClass.NOUN;
            }
            if (et.chars.is_latin_letter && is_adj) 
                nt.morph.class0 = MorphClass.ADJECTIVE;
        }
        return nt;
    }
    
    /**
     * Попробовать выделить римскую цифру
     * @param t 
     * @return 
     */
    static try_parse_roman(t) {
        if (t instanceof NumberToken) 
            return Utils.as(t, NumberToken);
        let tt = Utils.as(t, TextToken);
        if (tt === null || !t.chars.is_letter) 
            return null;
        let term = tt.term;
        if (!NumberHelper._is_rom_val(term)) 
            return null;
        if (tt.morph.class0.is_preposition) {
            if (tt.chars.is_all_lower) 
                return null;
        }
        let res = new NumberToken(t, t, "", NumberSpellingType.ROMAN);
        let nums = new Array();
        let val = 0;
        for (; t !== null; t = t.next) {
            if (t !== res.begin_token && t.is_whitespace_before) 
                break;
            if (!((t instanceof TextToken))) 
                break;
            term = (t).term;
            if (!NumberHelper._is_rom_val(term)) 
                break;
            for (const s of term) {
                let i = NumberHelper._rom_val(s);
                if (i > 0) 
                    nums.push(i);
            }
            res.end_token = t;
        }
        if (nums.length === 0) 
            return null;
        for (let i = 0; i < nums.length; i++) {
            if ((i + 1) < nums.length) {
                if (nums[i] === 1 && nums[i + 1] === 5) {
                    val += 4;
                    i++;
                }
                else if (nums[i] === 1 && nums[i + 1] === 10) {
                    val += 9;
                    i++;
                }
                else if (nums[i] === 10 && nums[i + 1] === 50) {
                    val += 40;
                    i++;
                }
                else if (nums[i] === 10 && nums[i + 1] === 100) {
                    val += 90;
                    i++;
                }
                else 
                    val += nums[i];
            }
            else 
                val += nums[i];
        }
        res.int_value = val;
        let hiph = false;
        let et = res.end_token.next;
        if (et === null) 
            return res;
        if (et.next !== null && et.next.is_hiphen) {
            et = et.next;
            hiph = true;
        }
        if (hiph || !et.is_whitespace_after) {
            let mc = NumberHelper.analize_number_tail(Utils.as(et.next, TextToken), res.value);
            if (mc !== null) {
                res.end_token = mc.end_token;
                res.morph = mc.morph;
            }
        }
        if ((res.begin_token === res.end_token && val === 1 && res.begin_token.chars.is_all_lower) && res.begin_token.morph.language.is_ua) 
            return null;
        return res;
    }
    
    static _rom_val(ch) {
        if (ch === 'Х' || ch === 'X') 
            return 10;
        if (ch === 'І' || ch === 'I') 
            return 1;
        if (ch === 'V') 
            return 5;
        if (ch === 'L') 
            return 50;
        if (ch === 'C' || ch === 'С') 
            return 100;
        return 0;
    }
    
    static _is_rom_val(str) {
        for (const ch of str) {
            if (NumberHelper._rom_val(ch) < 1) 
                return false;
        }
        return true;
    }
    
    /**
     * Выделить римскую цифру с token в обратном порядке
     * @param token 
     * @return 
     */
    static try_parse_roman_back(token) {
        let t = token;
        if (t === null) 
            return null;
        if ((t.chars.is_all_lower && t.previous !== null && t.previous.is_hiphen) && t.previous.previous !== null) 
            t = token.previous.previous;
        let res = null;
        for (; t !== null; t = t.previous) {
            let nt = NumberHelper.try_parse_roman(t);
            if (nt !== null) {
                if (nt.end_token === token) 
                    res = nt;
                else 
                    break;
            }
            if (t.is_whitespace_after) 
                break;
        }
        return res;
    }
    
    /**
     * Это выделение числительных типа 16-летие, 50-летний
     * @param t 
     * @return 
     */
    static try_parse_age(t) {
        if (t === null) 
            return null;
        let nt = Utils.as(t, NumberToken);
        let nt_next = null;
        if (nt !== null) 
            nt_next = nt.next;
        else {
            if (t.is_value("AGED", null) && (t.next instanceof NumberToken)) 
                return new NumberToken(t, t.next, (t.next).value, NumberSpellingType.AGE);
            if ((((nt = NumberHelper.try_parse_roman(t)))) !== null) 
                nt_next = nt.end_token.next;
        }
        if (nt !== null) {
            if (nt_next !== null) {
                let t1 = nt_next;
                if (t1.is_hiphen) 
                    t1 = t1.next;
                if (t1 instanceof TextToken) {
                    let v = (t1).term;
                    if ((v === "ЛЕТ" || v === "ЛЕТИЯ" || v === "ЛЕТИЕ") || v === "РІЧЧЯ") 
                        return NumberToken._new576(t, t1, nt.value, NumberSpellingType.AGE, t1.morph);
                    if (t1.is_value("ЛЕТНИЙ", "РІЧНИЙ")) 
                        return NumberToken._new576(t, t1, nt.value, NumberSpellingType.AGE, t1.morph);
                    if (v === "Л" || ((v === "Р" && nt.morph.language.is_ua))) 
                        return new NumberToken(t, (t1.next !== null && t1.next.is_char('.') ? t1.next : t1), nt.value, NumberSpellingType.AGE);
                }
            }
            return null;
        }
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return null;
        let s = tt.term;
        if (LanguageHelper.ends_with_ex(s, "ЛЕТИЕ", "ЛЕТИЯ", "РІЧЧЯ", null)) {
            let term = NumberHelper.m_nums.find(s.substring(0, 0 + s.length - 5));
            if (term !== null) 
                return NumberToken._new576(tt, tt, term.tag.toString(), NumberSpellingType.AGE, tt.morph);
        }
        s = tt.lemma;
        if (LanguageHelper.ends_with_ex(s, "ЛЕТНИЙ", "РІЧНИЙ", null, null)) {
            let term = NumberHelper.m_nums.find(s.substring(0, 0 + s.length - 6));
            if (term !== null) 
                return NumberToken._new576(tt, tt, term.tag.toString(), NumberSpellingType.AGE, tt.morph);
        }
        return null;
    }
    
    /**
     * Выделение годовщин и летий (XX-летие) ...
     */
    static try_parse_anniversary(t) {
        let nt = Utils.as(t, NumberToken);
        let t1 = null;
        if (nt !== null) 
            t1 = nt.next;
        else {
            if ((((nt = NumberHelper.try_parse_roman(t)))) === null) {
                if (t instanceof TextToken) {
                    let v = (t).term;
                    let num = 0;
                    if (v.endsWith("ЛЕТИЯ") || v.endsWith("ЛЕТИЕ")) {
                        if (v.startsWith("ВОСЕМЬСОТ") || v.startsWith("ВОСЬМИСОТ")) 
                            num = 800;
                    }
                    if (num > 0) 
                        return new NumberToken(t, t, num.toString(), NumberSpellingType.AGE);
                }
                return null;
            }
            t1 = nt.end_token.next;
        }
        if (t1 === null) 
            return null;
        if (t1.is_hiphen) 
            t1 = t1.next;
        if (t1 instanceof TextToken) {
            let v = (t1).term;
            if ((v === "ЛЕТ" || v === "ЛЕТИЯ" || v === "ЛЕТИЕ") || t1.is_value("ГОДОВЩИНА", null)) 
                return new NumberToken(t, t1, nt.value, NumberSpellingType.AGE);
            if (t1.morph.language.is_ua) {
                if (v === "РОКІВ" || v === "РІЧЧЯ" || t1.is_value("РІЧНИЦЯ", null)) 
                    return new NumberToken(t, t1, nt.value, NumberSpellingType.AGE);
            }
        }
        return null;
    }
    
    static analize_number_tail(tt, val) {
        if (!((tt instanceof TextToken))) 
            return null;
        let s = tt.term;
        let mc = null;
        if (!tt.chars.is_letter) {
            if (((s === "<" || s === "(")) && (tt.next instanceof TextToken)) {
                s = (tt.next).term;
                if ((s === "TH" || s === "ST" || s === "RD") || s === "ND") {
                    if (tt.next.next !== null && tt.next.next.is_char_of(">)")) {
                        mc = new MorphCollection();
                        mc.class0 = MorphClass.ADJECTIVE;
                        mc.language = MorphLang.EN;
                        return MetaToken._new581(tt, tt.next.next, mc);
                    }
                }
            }
            return null;
        }
        if ((s === "TH" || s === "ST" || s === "RD") || s === "ND") {
            mc = new MorphCollection();
            mc.class0 = MorphClass.ADJECTIVE;
            mc.language = MorphLang.EN;
            return MetaToken._new581(tt, tt, mc);
        }
        if (!tt.chars.is_cyrillic_letter) 
            return null;
        if (!tt.is_whitespace_after) {
            if (tt.next !== null && tt.next.chars.is_letter) 
                return null;
            if (tt.length_char === 1 && ((tt.is_value("X", null) || tt.is_value("Х", null)))) 
                return null;
        }
        if (!tt.chars.is_all_lower) {
            let ss = (tt).term;
            if (ss === "Я" || ss === "Й" || ss === "Е") {
            }
            else if (ss.length === 2 && ((ss[1] === 'Я' || ss[1] === 'Й' || ss[1] === 'Е'))) {
            }
            else 
                return null;
        }
        if ((tt).term === "М") {
            if (tt.previous === null || !tt.previous.is_hiphen) 
                return null;
        }
        if (Utils.isNullOrEmpty(val)) 
            return null;
        let dig = ((val.charCodeAt(val.length - 1)) - ('0'.charCodeAt(0)));
        if ((dig < 0) || dig >= 10) 
            return null;
        let vars = Morphology.get_all_wordforms(NumberHelper.m_samples[dig], null);
        if (vars === null || vars.length === 0) 
            return null;
        for (const v of vars) {
            if (v.class0.is_adjective && LanguageHelper.ends_with(v.normal_case, s) && v.number !== MorphNumber.UNDEFINED) {
                if (mc === null) 
                    mc = new MorphCollection();
                let ok = false;
                for (const it of mc.items) {
                    if (MorphClass.ooEq(it.class0, v.class0) && it.number === v.number && ((it.gender === v.gender || v.number === MorphNumber.PLURAL))) {
                        it._case = MorphCase.ooBitor(it._case, v._case);
                        ok = true;
                        break;
                    }
                }
                if (!ok) 
                    mc.add_item(new MorphBaseInfo(v));
            }
        }
        if (tt.morph.language.is_ua && mc === null && s === "Ї") {
            mc = new MorphCollection();
            mc.add_item(MorphBaseInfo._new583(MorphClass.ADJECTIVE));
        }
        if (mc !== null) 
            return MetaToken._new581(tt, tt, mc);
        if ((((s.length < 3) && !tt.is_whitespace_before && tt.previous !== null) && tt.previous.is_hiphen && !tt.previous.is_whitespace_before) && tt.whitespaces_after_count === 1 && s !== "А") 
            return MetaToken._new581(tt, tt, MorphCollection._new585(MorphClass.ADJECTIVE));
        return null;
    }
    
    static _try_parse_float(t, d, no_ws) {
        const NumberExHelper = require("./internal/NumberExHelper");
        d.value = 0;
        if (t === null || t.next === null || t.typ !== NumberSpellingType.DIGIT) 
            return null;
        for (let tt = t.begin_token; tt !== null && tt.end_char <= t.end_char; tt = tt.next) {
            if ((tt instanceof TextToken) && tt.chars.is_letter) 
                return null;
        }
        let kit = t.kit;
        let ns = null;
        let sps = null;
        for (let t1 = t; t1 !== null; t1 = t1.next) {
            if (t1.next === null) 
                break;
            if (((t1.next instanceof NumberToken) && (t1.whitespaces_after_count < 3) && (t1.next).typ === NumberSpellingType.DIGIT) && t1.next.length_char === 3) {
                if (ns === null) {
                    ns = new Array();
                    ns.push(t);
                    sps = new Array();
                }
                else if (sps[0] !== ' ') 
                    return null;
                ns.push(Utils.as(t1.next, NumberToken));
                sps.push(' ');
                continue;
            }
            if ((t1.next.is_char_of(",.") && (t1.next.next instanceof NumberToken) && (t1.next.next).typ === NumberSpellingType.DIGIT) && (t1.whitespaces_after_count < 2) && (t1.next.whitespaces_after_count < 2)) {
                if (no_ws) {
                    if (t1.is_whitespace_after || t1.next.is_whitespace_after) 
                        break;
                }
                if (ns === null) {
                    ns = new Array();
                    ns.push(t);
                    sps = new Array();
                }
                else if (t1.next.is_whitespace_after && t1.next.next.length_char !== 3 && (((t1.next.is_char('.') ? '.' : ','))) === sps[sps.length - 1]) 
                    break;
                ns.push(Utils.as(t1.next.next, NumberToken));
                sps.push((t1.next.is_char('.') ? '.' : ','));
                t1 = t1.next;
                continue;
            }
            break;
        }
        if (sps === null) 
            return null;
        let is_last_drob = false;
        let not_set_drob = false;
        let merge = false;
        let m_prev_point_char = '.';
        if (sps.length === 1) {
            if (sps[0] === ' ') 
                is_last_drob = false;
            else if (ns[1].length_char !== 3) {
                is_last_drob = true;
                if (ns.length === 2) {
                    if (ns[1].end_token.chars.is_letter) 
                        merge = true;
                    else if (ns[1].end_token.is_char('.') && ns[1].end_token.previous !== null && ns[1].end_token.previous.chars.is_letter) 
                        merge = true;
                    if (ns[1].is_whitespace_before) {
                        if ((ns[1].end_token instanceof TextToken) && (ns[1].end_token).term.endsWith("000")) 
                            return null;
                    }
                }
            }
            else if (ns[0].length_char > 3 || ns[0].real_value === 0) 
                is_last_drob = true;
            else {
                let ok = true;
                if (ns.length === 2 && ns[1].length_char === 3) {
                    let ttt = NumberExHelper.m_postfixes.try_parse(ns[1].end_token.next, TerminParseAttr.NO);
                    if (ttt !== null && (NumberExType.of(ttt.termin.tag)) === NumberExType.MONEY) {
                        is_last_drob = false;
                        ok = false;
                        not_set_drob = false;
                    }
                    else if (ns[1].end_token.next !== null && ns[1].end_token.next.is_char('(') && (ns[1].end_token.next.next instanceof NumberToken)) {
                        let nt1 = (Utils.as(ns[1].end_token.next.next, NumberToken));
                        if (nt1.real_value === (((ns[0].real_value * (1000)) + ns[1].real_value))) {
                            is_last_drob = false;
                            ok = false;
                            not_set_drob = false;
                        }
                    }
                }
                if (ok) {
                    if (t.kit.misc_data.containsKey("pt")) 
                        m_prev_point_char = String(t.kit.misc_data.get("pt"));
                    if (m_prev_point_char === sps[0]) {
                        is_last_drob = true;
                        not_set_drob = true;
                    }
                    else {
                        is_last_drob = false;
                        not_set_drob = true;
                    }
                }
            }
        }
        else {
            let last = sps[sps.length - 1];
            if (last === ' ' && sps[0] !== last) 
                return null;
            for (let i = 0; i < (sps.length - 1); i++) {
                if (sps[i] !== sps[0]) 
                    return null;
                else if (ns[i + 1].length_char !== 3) 
                    return null;
            }
            if (sps[0] !== last) 
                is_last_drob = true;
            else if (ns[ns.length - 1].length_char !== 3) 
                return null;
            if (ns[0].length_char > 3) 
                return null;
        }
        for (let i = 0; i < ns.length; i++) {
            if ((i < (ns.length - 1)) || !is_last_drob) {
                if (i === 0) 
                    d.value = ns[i].real_value;
                else 
                    d.value = (d.value * (1000)) + ns[i].real_value;
                if (i === (ns.length - 1) && !not_set_drob) {
                    if (sps[sps.length - 1] === ',') 
                        m_prev_point_char = '.';
                    else if (sps[sps.length - 1] === '.') 
                        m_prev_point_char = ',';
                }
            }
            else {
                if (!not_set_drob) {
                    m_prev_point_char = sps[sps.length - 1];
                    if (m_prev_point_char === ',') {
                    }
                }
                let f2 = 0;
                if (merge) {
                    let sss = ns[i].value.toString();
                    let kkk = 0;
                    for (kkk = 0; kkk < (sss.length - ns[i].begin_token.length_char); kkk++) {
                        d.value *= (10);
                    }
                    f2 = ns[i].real_value;
                    for (kkk = 0; kkk < ns[i].begin_token.length_char; kkk++) {
                        f2 /= (10);
                    }
                    d.value += f2;
                }
                else {
                    f2 = ns[i].real_value;
                    for (let kkk = 0; kkk < ns[i].length_char; kkk++) {
                        f2 /= (10);
                    }
                    d.value += f2;
                }
            }
        }
        if (kit.misc_data.containsKey("pt")) 
            kit.misc_data.put("pt", m_prev_point_char);
        else 
            kit.misc_data.put("pt", m_prev_point_char);
        return ns[ns.length - 1];
    }
    
    /**
     * Это разделитель дроби по-умолчанию, используется для случаев, когда невозможно принять однозначного решения. 
     *  Устанавливается на основе последнего успешного анализа.
     * Выделить действительное число, знак также выделяется, 
     *  разделители дроби могут быть точка или запятая, разделителями тысячных 
     *  могут быть точки, пробелы и запятые.
     * @param t начальный токен
     * @param can_be_integer число должно быть целым
     * @param no_whitespace не должно быть пробелов
     * @return результат или null
     */
    static try_parse_real_number(t, can_be_integer = false, no_whitespace = false) {
        let is_not = false;
        let t0 = t;
        if (t !== null) {
            if (t.is_hiphen || t.is_value("МИНУС", null)) {
                t = t.next;
                is_not = true;
            }
            else if (t.is_char('+') || t.is_value("ПЛЮС", null)) 
                t = t.next;
        }
        if ((t instanceof TextToken) && ((t.is_value("НОЛЬ", null) || t.is_value("НУЛЬ", null)))) {
            if (t.next === null) 
                return new NumberToken(t, t, "0", NumberSpellingType.WORDS);
            if (t.next.is_value("ЦЕЛЫЙ", null)) 
                t = t.next;
            let res0 = new NumberToken(t, t.next, "0", NumberSpellingType.WORDS);
            t = t.next;
            if ((t instanceof NumberToken) && (t).int_value !== null) {
                let val = (t).int_value;
                if (t.next !== null && val > 0) {
                    if (t.next.is_value("ДЕСЯТЫЙ", null)) {
                        res0.end_token = t.next;
                        res0.real_value = ((val)) / (10);
                    }
                    else if (t.next.is_value("СОТЫЙ", null)) {
                        res0.end_token = t.next;
                        res0.real_value = ((val)) / (100);
                    }
                    else if (t.next.is_value("ТЫСЯЧНЫЙ", null)) {
                        res0.end_token = t.next;
                        res0.real_value = ((val)) / (1000);
                    }
                }
                if (res0.real_value === 0) {
                    res0.end_token = t;
                    res0.value = ("0." + val);
                }
            }
            return res0;
        }
        if (t instanceof TextToken) {
            let tok = NumberHelper.m_after_points.try_parse(t, TerminParseAttr.NO);
            if (tok !== null) {
                let res0 = new NumberExToken(t, tok.end_token, null, NumberSpellingType.WORDS, NumberExType.UNDEFINED);
                res0.real_value = (tok.termin.tag);
                return res0;
            }
        }
        if (t === null) 
            return null;
        if (!((t instanceof NumberToken))) {
            if (t.is_value("СОТНЯ", null)) 
                return new NumberToken(t, t, "100", NumberSpellingType.WORDS);
            if (t.is_value("ТЫЩА", null) || t.is_value("ТЫСЯЧА", null)) 
                return new NumberToken(t, t, "1000", NumberSpellingType.WORDS);
            return null;
        }
        if (t.next !== null && t.next.is_value("ЦЕЛЫЙ", null) && (((t.next.next instanceof NumberToken) || (((t.next.next instanceof TextToken) && t.next.next.is_value("НОЛЬ", null)))))) {
            let res0 = new NumberExToken(t, t.next, (t).value, NumberSpellingType.WORDS, NumberExType.UNDEFINED);
            t = t.next.next;
            let val = 0;
            if (t instanceof TextToken) {
                res0.end_token = t;
                t = t.next;
            }
            if (t instanceof NumberToken) {
                res0.end_token = t;
                val = (t).real_value;
                t = t.next;
            }
            if (t !== null) {
                if (t.is_value("ДЕСЯТЫЙ", null)) {
                    res0.end_token = t;
                    res0.real_value = (((val) / (10))) + res0.real_value;
                }
                else if (t.is_value("СОТЫЙ", null)) {
                    res0.end_token = t;
                    res0.real_value = (((val) / (100))) + res0.real_value;
                }
                else if (t.is_value("ТЫСЯЧНЫЙ", null)) {
                    res0.end_token = t;
                    res0.real_value = (((val) / (1000))) + res0.real_value;
                }
            }
            if (res0.real_value === 0) {
                let str = ("0." + val);
                let dd = 0;
                let wrapdd589 = new RefOutArgWrapper();
                let inoutres590 = Utils.tryParseFloat(str, wrapdd589);
                dd = wrapdd589.value;
                if (inoutres590) {
                }
                else {
                    let wrapdd587 = new RefOutArgWrapper();
                    let inoutres588 = Utils.tryParseFloat(Utils.replaceString(str, '.', ','), wrapdd587);
                    dd = wrapdd587.value;
                    if (inoutres588) {
                    }
                    else 
                        return null;
                }
                res0.real_value = dd + res0.real_value;
            }
            return res0;
        }
        let d = 0;
        let wrapd592 = new RefOutArgWrapper();
        let tt = NumberHelper._try_parse_float(Utils.as(t, NumberToken), wrapd592, no_whitespace);
        d = wrapd592.value;
        if (tt === null) {
            if ((t.next === null || t.is_whitespace_after || t.next.chars.is_letter) || can_be_integer) {
                tt = t;
                d = (t).real_value;
            }
            else 
                return null;
        }
        if (is_not) 
            d = -d;
        if (tt.next !== null && tt.next.is_value("ДЕСЯТОК", null)) {
            d *= (10);
            tt = tt.next;
        }
        return NumberExToken._new591(t0, tt, "", NumberSpellingType.DIGIT, NumberExType.UNDEFINED, d);
    }
    
    /**
     * Преобразовать число в числительное, записанное буквами, в соотв. роде и числе. 
     *  Например, 5 жен.ед. - ПЯТАЯ,  26 мн. - ДВАДЦАТЬ ШЕСТЫЕ
     * @param value значение
     * @param gender род
     * @param num число
     * @return 
     */
    static get_number_adjective(value, gender, num) {
        if ((value < 1) || value >= 100) 
            return null;
        let words = null;
        if (num === MorphNumber.PLURAL) 
            words = NumberHelper.m_plural_number_words;
        else if (gender === MorphGender.FEMINIE) 
            words = NumberHelper.m_woman_number_words;
        else if (gender === MorphGender.NEUTER) 
            words = NumberHelper.m_neutral_number_words;
        else 
            words = NumberHelper.m_man_number_words;
        if (value < 20) 
            return words[value - 1];
        let i = Utils.intDiv(value, 10);
        let j = value % 10;
        i -= 2;
        if (i >= NumberHelper.m_dec_dumber_words.length) 
            return null;
        if (j > 0) 
            return (NumberHelper.m_dec_dumber_words[i] + " " + words[j - 1]);
        let decs = null;
        if (num === MorphNumber.PLURAL) 
            decs = NumberHelper.m_plural_dec_dumber_words;
        else if (gender === MorphGender.FEMINIE) 
            decs = NumberHelper.m_woman_dec_dumber_words;
        else if (gender === MorphGender.NEUTER) 
            decs = NumberHelper.m_neutral_dec_dumber_words;
        else 
            decs = NumberHelper.m_man_dec_dumber_words;
        return decs[i];
    }
    
    /**
     * Получить для числа римскую запись
     * @param val 
     * @return 
     */
    static get_number_roman(val) {
        if (val > 0 && val <= NumberHelper.m_romans.length) 
            return NumberHelper.m_romans[val - 1];
        return val.toString();
    }
    
    /**
     * Получить строковое представление целого числа
     * @param val значение
     * @param units единицы измерения (они тоже будут преобразовываться в нужное число)
     * @return строковое представление (пока на русском языке)
     */
    static get_number_string(val, units = null) {
        const MiscHelper = require("./MiscHelper");
        if (val < 0) 
            return "минус " + NumberHelper.get_number_string(-val, units);
        let res = null;
        if (val >= 1000000000) {
            let vv = Utils.intDiv(val, 1000000000);
            res = NumberHelper.get_number_string(vv, "миллиард");
            vv = val % 1000000000;
            if (vv !== 0) 
                res = (res + " " + NumberHelper.get_number_string(vv, units));
            else if (units !== null) 
                res = (res + " " + MiscHelper.get_text_morph_var_by_case_and_number_ex(units, MorphCase.GENITIVE, MorphNumber.PLURAL, null));
            return res.toLowerCase();
        }
        if (val >= 1000000) {
            let vv = Utils.intDiv(val, 1000000);
            res = NumberHelper.get_number_string(vv, "миллион");
            vv = val % 1000000;
            if (vv !== 0) 
                res = (res + " " + NumberHelper.get_number_string(vv, units));
            else if (units !== null) 
                res = (res + " " + MiscHelper.get_text_morph_var_by_case_and_number_ex(units, MorphCase.GENITIVE, MorphNumber.PLURAL, null));
            return res.toLowerCase();
        }
        if (val >= 1000) {
            let vv = Utils.intDiv(val, 1000);
            res = NumberHelper.get_number_string(vv, "тысяча");
            vv = val % 1000;
            if (vv !== 0) 
                res = (res + " " + NumberHelper.get_number_string(vv, units));
            else if (units !== null) 
                res = (res + " " + MiscHelper.get_text_morph_var_by_case_and_number_ex(units, MorphCase.GENITIVE, MorphNumber.PLURAL, null));
            return res.toLowerCase();
        }
        if (val >= 100) {
            let vv = Utils.intDiv(val, 100);
            res = NumberHelper.m_100words[vv - 1];
            vv = val % 100;
            if (vv !== 0) 
                res = (res + " " + NumberHelper.get_number_string(vv, units));
            else if (units !== null) 
                res = (res + " " + MiscHelper.get_text_morph_var_by_case_and_number_ex(units, MorphCase.GENITIVE, MorphNumber.PLURAL, null));
            return res.toLowerCase();
        }
        if (val >= 20) {
            let vv = Utils.intDiv(val, 10);
            res = NumberHelper.m_10words[vv - 1];
            vv = val % 10;
            if (vv !== 0) 
                res = (res + " " + NumberHelper.get_number_string(vv, units));
            else if (units !== null) 
                res = (res + " " + MiscHelper.get_text_morph_var_by_case_and_number_ex(units, MorphCase.GENITIVE, MorphNumber.PLURAL, null));
            return res.toLowerCase();
        }
        if (units !== null) {
            if (val === 1) {
                let bi = Morphology.get_word_base_info(units.toUpperCase(), null, false, false);
                if ((((bi.gender.value()) & (MorphGender.FEMINIE.value()))) === (MorphGender.FEMINIE.value())) 
                    return "одна " + units;
                if ((((bi.gender.value()) & (MorphGender.NEUTER.value()))) === (MorphGender.NEUTER.value())) 
                    return "одно " + units;
                return "один " + units;
            }
            if (val === 2) {
                let bi = Morphology.get_word_base_info(units.toUpperCase(), null, false, false);
                if ((((bi.gender.value()) & (MorphGender.FEMINIE.value()))) === (MorphGender.FEMINIE.value())) 
                    return "две " + MiscHelper.get_text_morph_var_by_case_and_number_ex(units, null, MorphNumber.PLURAL, null);
            }
            return (NumberHelper.m_1words[val].toLowerCase() + " " + MiscHelper.get_text_morph_var_by_case_and_number_ex(units, MorphCase.GENITIVE, MorphNumber.UNDEFINED, val.toString()));
        }
        return NumberHelper.m_1words[val].toLowerCase();
    }
    
    /**
     * Выделение стандартных мер, типа: 10 кв.м.
     * @param t начальный токен
     * @return 
     */
    static try_parse_number_with_postfix(t) {
        const NumberExHelper = require("./internal/NumberExHelper");
        return NumberExHelper.try_parse_number_with_postfix(t);
    }
    
    /**
     * Это попробовать только тип (постфикс) без самого числа. 
     *  Например, куб.м.
     * @param t 
     * @return 
     */
    static try_parse_postfix_only(t) {
        const NumberExHelper = require("./internal/NumberExHelper");
        return NumberExHelper.try_attach_postfix_only(t);
    }
    
    /**
     * Если этообозначение денежной единицы (н-р, $), то возвращает код валюты
     * @param t 
     * @return 
     */
    static is_money_char(t) {
        if (!((t instanceof TextToken)) || t.length_char !== 1) 
            return null;
        let ch = (t).term[0];
        if (ch === '$') 
            return "USD";
        if (ch === '£' || ch === (String.fromCharCode(0xA3)) || ch === (String.fromCharCode(0x20A4))) 
            return "GBP";
        if (ch === '€') 
            return "EUR";
        if (ch === '¥' || ch === (String.fromCharCode(0xA5))) 
            return "JPY";
        if (ch === (String.fromCharCode(0x20A9))) 
            return "KRW";
        if (ch === (String.fromCharCode(0xFFE5)) || ch === 'Ұ' || ch === 'Ұ') 
            return "CNY";
        if (ch === (String.fromCharCode(0x20BD))) 
            return "RUB";
        if (ch === (String.fromCharCode(0x20B4))) 
            return "UAH";
        if (ch === (String.fromCharCode(0x20AB))) 
            return "VND";
        if (ch === (String.fromCharCode(0x20AD))) 
            return "LAK";
        if (ch === (String.fromCharCode(0x20BA))) 
            return "TRY";
        if (ch === (String.fromCharCode(0x20B1))) 
            return "PHP";
        if (ch === (String.fromCharCode(0x17DB))) 
            return "KHR";
        if (ch === (String.fromCharCode(0x20B9))) 
            return "INR";
        if (ch === (String.fromCharCode(0x20A8))) 
            return "IDR";
        if (ch === (String.fromCharCode(0x20B5))) 
            return "GHS";
        if (ch === (String.fromCharCode(0x09F3))) 
            return "BDT";
        if (ch === (String.fromCharCode(0x20B8))) 
            return "KZT";
        if (ch === (String.fromCharCode(0x20AE))) 
            return "MNT";
        if (ch === (String.fromCharCode(0x0192))) 
            return "HUF";
        if (ch === (String.fromCharCode(0x20AA))) 
            return "ILS";
        return null;
    }
    
    /**
     * Для парсинга действительного числа из строки используйте эту функцию, 
     *  которая работает назависимо от локализьных настроек и на всех языках программирования
     * @param str строка
     * @return число
     */
    static string_to_double(str) {
        let res = 0;
        if (str === "NaN") 
            return Number.NaN;
        let wrapres595 = new RefOutArgWrapper();
        let inoutres596 = Utils.tryParseFloat(str, wrapres595);
        res = wrapres595.value;
        if (inoutres596) 
            return res;
        let wrapres593 = new RefOutArgWrapper();
        let inoutres594 = Utils.tryParseFloat(Utils.replaceString(str, '.', ','), wrapres593);
        res = wrapres593.value;
        if (inoutres594) 
            return res;
        return null;
    }
    
    /**
     * Независимо от языка и настроек выводит действиельное число в строку, 
     *  разделитель - точка. Ситуация типа 1.0000000001 или 23.7299999999999, 
     *  случающиеся на разных языках, округляются куда надо.
     * @param d число
     * @return результат
     */
    static double_to_string(d) {
        if (isNaN(d)) 
            return "NaN";
        let res = null;
        if (Utils.mathTruncate(d) === 0.0) 
            res = Utils.replaceString(d.toString(), ",", ".");
        else {
            let rest = Math.abs(d - Utils.mathTruncate(d));
            if ((rest < 0.000000001) && rest > 0) {
                res = Utils.mathTruncate(d).toString();
                if ((res.indexOf('E') < 0) && (res.indexOf('e') < 0)) {
                    let ii = res.indexOf('.');
                    if (ii < 0) 
                        ii = res.indexOf(',');
                    if (ii > 0) 
                        return res.substring(0, 0 + ii);
                    else 
                        return res;
                }
            }
            else 
                res = Utils.replaceString(d.toString(), ",", ".");
        }
        if (res.endsWith(".0")) 
            res = res.substring(0, 0 + res.length - 2);
        let i = res.indexOf('e');
        if (i < 0) 
            i = res.indexOf('E');
        if (i > 0) {
            let exp = 0;
            let neg = false;
            for (let jj = i + 1; jj < res.length; jj++) {
                if (res[jj] === '+') {
                }
                else if (res[jj] === '-') 
                    neg = true;
                else 
                    exp = (exp * 10) + (((res.charCodeAt(jj)) - ('0'.charCodeAt(0))));
            }
            res = res.substring(0, 0 + i);
            if (res.endsWith(".0")) 
                res = res.substring(0, 0 + res.length - 2);
            let nneg = false;
            if (res[0] === '-') {
                nneg = true;
                res = res.substring(1);
            }
            let v1 = new StringBuilder();
            let v2 = new StringBuilder();
            i = res.indexOf('.');
            if (i < 0) 
                v1.append(res);
            else {
                v1.append(res.substring(0, 0 + i));
                v2.append(res.substring(i + 1));
            }
            for (; exp > 0; exp--) {
                if (neg) {
                    if (v1.length > 0) {
                        v2.insert(0, v1.charAt(v1.length - 1));
                        v1.length = v1.length - 1;
                    }
                    else 
                        v2.insert(0, '0');
                }
                else if (v2.length > 0) {
                    v1.append(v2.charAt(0));
                    v2.remove(0, 1);
                }
                else 
                    v1.append('0');
            }
            if (v2.length === 0) 
                res = v1.toString();
            else if (v1.length === 0) 
                res = "0." + v2.toString();
            else 
                res = (v1.toString() + "." + v2.toString());
            if (nneg) 
                res = "-" + res;
        }
        i = res.indexOf('.');
        if (i < 0) 
            return res;
        i++;
        let j = 0;
        for (j = i + 1; j < res.length; j++) {
            if (res[j] === '9') {
                let k = 0;
                let jj = 0;
                for (jj = j; jj < res.length; jj++) {
                    if (res[jj] !== '9') 
                        break;
                    else 
                        k++;
                }
                if (jj >= res.length || ((jj === (res.length - 1) && res[jj] === '8'))) {
                    if (k > 5) {
                        for (; j > i; j--) {
                            if (res[j] !== '9') {
                                if (res[j] !== '.') 
                                    return (res.substring(0, 0 + j) + (((((res.charCodeAt(j)) - ('0'.charCodeAt(0))))) + 1));
                            }
                        }
                        break;
                    }
                }
            }
        }
        return res;
    }
    
    static initialize() {
        if (NumberHelper.m_nums !== null) 
            return;
        NumberHelper.m_nums = new TerminCollection();
        NumberHelper.m_nums.all_add_strs_normalized = true;
        NumberHelper.m_nums.add_str("ОДИН", 1, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ПЕРВЫЙ", 1 | NumberHelper.pril_num_tag_bit, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ОДИН", 1, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ПЕРШИЙ", 1 | NumberHelper.pril_num_tag_bit, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ОДНА", 1, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ОДНО", 1, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("FIRST", 1 | NumberHelper.pril_num_tag_bit, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("SEMEL", 1, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("ONE", 1, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("ДВА", 2, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ВТОРОЙ", 2 | NumberHelper.pril_num_tag_bit, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ДВОЕ", 2, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ДВЕ", 2, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ДВУХ", 2, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ОБА", 2, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ОБЕ", 2, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ДВА", 2, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ДРУГИЙ", 2 | NumberHelper.pril_num_tag_bit, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ДВОЄ", 2, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ДВІ", 2, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ДВОХ", 2, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ОБОЄ", 2, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ОБИДВА", 2, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("SECOND", 2 | NumberHelper.pril_num_tag_bit, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("BIS", 2, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("TWO", 2, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("ТРИ", 3, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ТРЕТИЙ", 3 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ТРЕХ", 3, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ТРОЕ", 3, MorphLang.RU, true);
        NumberHelper.m_nums.add_str("ТРИ", 3, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ТРЕТІЙ", 3 | NumberHelper.pril_num_tag_bit, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ТРЬОХ", 3, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("ТРОЄ", 3, MorphLang.UA, true);
        NumberHelper.m_nums.add_str("THIRD", 3 | NumberHelper.pril_num_tag_bit, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("TER", 3, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("THREE", 3, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("ЧЕТЫРЕ", 4, null, false);
        NumberHelper.m_nums.add_str("ЧЕТВЕРТЫЙ", 4 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ЧЕТЫРЕХ", 4, null, false);
        NumberHelper.m_nums.add_str("ЧЕТВЕРО", 4, null, false);
        NumberHelper.m_nums.add_str("ЧОТИРИ", 4, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ЧЕТВЕРТИЙ", 4 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ЧОТИРЬОХ", 4, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("FORTH", 4 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("QUATER", 4, null, false);
        NumberHelper.m_nums.add_str("FOUR", 4, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("ПЯТЬ", 5, null, false);
        NumberHelper.m_nums.add_str("ПЯТЫЙ", 5 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ПЯТИ", 5, null, false);
        NumberHelper.m_nums.add_str("ПЯТЕРО", 5, null, false);
        NumberHelper.m_nums.add_str("ПЯТЬ", 5, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ПЯТИЙ", 5 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("FIFTH", 5 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("QUINQUIES", 5, null, false);
        NumberHelper.m_nums.add_str("FIVE", 5, MorphLang.EN, true);
        NumberHelper.m_nums.add_str("ШЕСТЬ", 6, null, false);
        NumberHelper.m_nums.add_str("ШЕСТОЙ", 6 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ШЕСТИ", 6, null, false);
        NumberHelper.m_nums.add_str("ШЕСТЕРО", 6, null, false);
        NumberHelper.m_nums.add_str("ШІСТЬ", 6, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ШОСТИЙ", 6 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("SIX", 6, MorphLang.EN, false);
        NumberHelper.m_nums.add_str("SIXTH", 6 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("SEXIES ", 6, null, false);
        NumberHelper.m_nums.add_str("СЕМЬ", 7, null, false);
        NumberHelper.m_nums.add_str("СЕДЬМОЙ", 7 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СЕМИ", 7, null, false);
        NumberHelper.m_nums.add_str("СЕМЕРО", 7, null, false);
        NumberHelper.m_nums.add_str("СІМ", 7, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СЬОМИЙ", 7 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("SEVEN", 7, null, false);
        NumberHelper.m_nums.add_str("SEVENTH", 7 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("SEPTIES", 7, null, false);
        NumberHelper.m_nums.add_str("ВОСЕМЬ", 8, null, false);
        NumberHelper.m_nums.add_str("ВОСЬМОЙ", 8 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ВОСЬМИ", 8, null, false);
        NumberHelper.m_nums.add_str("ВОСЬМЕРО", 8, null, false);
        NumberHelper.m_nums.add_str("ВІСІМ", 8, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ВОСЬМИЙ", 8 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("EIGHT", 8, null, false);
        NumberHelper.m_nums.add_str("EIGHTH", 8 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("OCTIES", 8, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТЬ", 9, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТЫЙ", 9 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТИ", 9, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТЕРО", 9, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТЬ", 9, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДЕВЯТИЙ", 9 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("NINE", 9, null, false);
        NumberHelper.m_nums.add_str("NINTH", 9 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("NOVIES", 9, null, false);
        NumberHelper.m_nums.add_str("ДЕСЯТЬ", 10, null, false);
        NumberHelper.m_nums.add_str("ДЕСЯТЫЙ", 10 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕСЯТИ", 10, null, false);
        NumberHelper.m_nums.add_str("ДЕСЯТИРО", 10, null, false);
        NumberHelper.m_nums.add_str("ДЕСЯТЬ", 10, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДЕСЯТИЙ", 10 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("TEN", 10, null, false);
        NumberHelper.m_nums.add_str("TENTH", 10 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("DECIES", 10, null, false);
        NumberHelper.m_nums.add_str("ОДИННАДЦАТЬ", 11, null, false);
        NumberHelper.m_nums.add_str("ОДИНАДЦАТЬ", 11, null, false);
        NumberHelper.m_nums.add_str("ОДИННАДЦАТЫЙ", 11 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ОДИННАДЦАТИ", 11, null, false);
        NumberHelper.m_nums.add_str("ОДИННАДЦАТИРО", 11, null, false);
        NumberHelper.m_nums.add_str("ОДИНАДЦЯТЬ", 11, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ОДИНАДЦЯТИЙ", 11 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ОДИНАДЦЯТИ", 11, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ELEVEN", 11, null, false);
        NumberHelper.m_nums.add_str("ELEVENTH", 11 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДВЕНАДЦАТЬ", 12, null, false);
        NumberHelper.m_nums.add_str("ДВЕНАДЦАТЫЙ", 12 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДВЕНАДЦАТИ", 12, null, false);
        NumberHelper.m_nums.add_str("ДВАНАДЦЯТЬ", 12, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДВАНАДЦЯТИЙ", 12 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДВАНАДЦЯТИ", 12, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("TWELVE", 12, null, false);
        NumberHelper.m_nums.add_str("TWELFTH", 12 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ТРИНАДЦАТЬ", 13, null, false);
        NumberHelper.m_nums.add_str("ТРИНАДЦАТЫЙ", 13 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ТРИНАДЦАТИ", 13, null, false);
        NumberHelper.m_nums.add_str("ТРИНАДЦЯТЬ", 13, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТРИНАДЦЯТИЙ", 13 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТРИНАДЦЯТИ", 13, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("THIRTEEN", 13, null, false);
        NumberHelper.m_nums.add_str("THIRTEENTH", 13 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ЧЕТЫРНАДЦАТЬ", 14, null, false);
        NumberHelper.m_nums.add_str("ЧЕТЫРНАДЦАТЫЙ", 14 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ЧЕТЫРНАДЦАТИ", 14, null, false);
        NumberHelper.m_nums.add_str("ЧОТИРНАДЦЯТЬ", 14, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ЧОТИРНАДЦЯТИЙ", 14 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ЧОТИРНАДЦЯТИ", 14, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("FOURTEEN", 14, null, false);
        NumberHelper.m_nums.add_str("FOURTEENTH", 14 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ПЯТНАДЦАТЬ", 15, null, false);
        NumberHelper.m_nums.add_str("ПЯТНАДЦАТЫЙ", 15 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ПЯТНАДЦАТИ", 15, null, false);
        NumberHelper.m_nums.add_str("ПЯТНАДЦЯТЬ", 15, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ПЯТНАДЦЯТИЙ", 15 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ПЯТНАДЦЯТИ", 15, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("FIFTEEN", 15, null, false);
        NumberHelper.m_nums.add_str("FIFTEENTH", 15 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ШЕСТНАДЦАТЬ", 16, null, false);
        NumberHelper.m_nums.add_str("ШЕСТНАДЦАТЫЙ", 16 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ШЕСТНАДЦАТИ", 16, null, false);
        NumberHelper.m_nums.add_str("ШІСТНАДЦЯТЬ", 16, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ШІСТНАДЦЯТИЙ", 16 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ШІСТНАДЦЯТИ", 16, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("SIXTEEN", 16, null, false);
        NumberHelper.m_nums.add_str("SIXTEENTH", 16 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СЕМНАДЦАТЬ", 17, null, false);
        NumberHelper.m_nums.add_str("СЕМНАДЦАТЫЙ", 17 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СЕМНАДЦАТИ", 17, null, false);
        NumberHelper.m_nums.add_str("СІМНАДЦЯТЬ", 17, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СІМНАДЦЯТИЙ", 17 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СІМНАДЦЯТИ", 17, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("SEVENTEEN", 17, null, false);
        NumberHelper.m_nums.add_str("SEVENTEENTH", 17 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ВОСЕМНАДЦАТЬ", 18, null, false);
        NumberHelper.m_nums.add_str("ВОСЕМНАДЦАТЫЙ", 18 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ВОСЕМНАДЦАТИ", 18, null, false);
        NumberHelper.m_nums.add_str("ВІСІМНАДЦЯТЬ", 18, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ВІСІМНАДЦЯТИЙ", 18 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ВІСІМНАДЦЯТИ", 18, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("EIGHTEEN", 18, null, false);
        NumberHelper.m_nums.add_str("EIGHTEENTH", 18 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТНАДЦАТЬ", 19, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТНАДЦАТЫЙ", 19 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТНАДЦАТИ", 19, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТНАДЦЯТЬ", 19, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДЕВЯТНАДЦЯТИЙ", 19 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДЕВЯТНАДЦЯТИ", 19, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("NINETEEN", 19, null, false);
        NumberHelper.m_nums.add_str("NINETEENTH", 19 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДВАДЦАТЬ", 20, null, false);
        NumberHelper.m_nums.add_str("ДВАДЦАТЫЙ", 20 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДВАДЦАТИ", 20, null, false);
        NumberHelper.m_nums.add_str("ДВАДЦЯТЬ", 20, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДВАДЦЯТИЙ", 20 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДВАДЦЯТИ", 20, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("TWENTY", 20, null, false);
        NumberHelper.m_nums.add_str("TWENTIETH", 20 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ТРИДЦАТЬ", 30, null, false);
        NumberHelper.m_nums.add_str("ТРИДЦАТЫЙ", 30 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ТРИДЦАТИ", 30, null, false);
        NumberHelper.m_nums.add_str("ТРИДЦЯТЬ", 30, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТРИДЦЯТИЙ", 30 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТРИДЦЯТИ", 30, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("THIRTY", 30, null, false);
        NumberHelper.m_nums.add_str("THIRTIETH", 30 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СОРОК", 40, null, false);
        NumberHelper.m_nums.add_str("СОРОКОВОЙ", 40 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СОРОКА", 40, null, false);
        NumberHelper.m_nums.add_str("СОРОК", 40, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СОРОКОВИЙ", 40 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("FORTY", 40, null, false);
        NumberHelper.m_nums.add_str("FORTIETH", 40 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ПЯТЬДЕСЯТ", 50, null, false);
        NumberHelper.m_nums.add_str("ПЯТИДЕСЯТЫЙ", 50 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ПЯТИДЕСЯТИ", 50, null, false);
        NumberHelper.m_nums.add_str("ПЯТДЕСЯТ", 50, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ПЯТДЕСЯТИЙ", 50 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ПЯТДЕСЯТИ", 50, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("FIFTY", 50, null, false);
        NumberHelper.m_nums.add_str("FIFTIETH", 50 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ШЕСТЬДЕСЯТ", 60, null, false);
        NumberHelper.m_nums.add_str("ШЕСТИДЕСЯТЫЙ", 60 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ШЕСТИДЕСЯТИ", 60, null, false);
        NumberHelper.m_nums.add_str("ШІСТДЕСЯТ", 60, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ШЕСИДЕСЯТЫЙ", 60 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ШІСТДЕСЯТИ", 60, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("SIXTY", 60, null, false);
        NumberHelper.m_nums.add_str("SIXTIETH", 60 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СЕМЬДЕСЯТ", 70, null, false);
        NumberHelper.m_nums.add_str("СЕМИДЕСЯТЫЙ", 70 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СЕМИДЕСЯТИ", 70, null, false);
        NumberHelper.m_nums.add_str("СІМДЕСЯТ", 70, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СІМДЕСЯТИЙ", 70 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СІМДЕСЯТИ", 70, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("SEVENTY", 70, null, false);
        NumberHelper.m_nums.add_str("SEVENTIETH", 70 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("SEVENTIES", 70 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ВОСЕМЬДЕСЯТ", 80, null, false);
        NumberHelper.m_nums.add_str("ВОСЬМИДЕСЯТЫЙ", 80 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ВОСЬМИДЕСЯТИ", 80, null, false);
        NumberHelper.m_nums.add_str("ВІСІМДЕСЯТ", 80, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ВОСЬМИДЕСЯТИЙ", 80 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ВІСІМДЕСЯТИ", 80, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("EIGHTY", 80, null, false);
        NumberHelper.m_nums.add_str("EIGHTIETH", 80 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("EIGHTIES", 80 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯНОСТО", 90, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯНОСТЫЙ", 90 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯНОСТО", 90, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДЕВЯНОСТИЙ", 90 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("NINETY", 90, null, false);
        NumberHelper.m_nums.add_str("NINETIETH", 90 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("NINETIES", 90 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СТО", 100, null, false);
        NumberHelper.m_nums.add_str("СОТЫЙ", 100 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СТА", 100, null, false);
        NumberHelper.m_nums.add_str("СТО", 100, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СОТИЙ", 100 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("HUNDRED", 100, null, false);
        NumberHelper.m_nums.add_str("HUNDREDTH", 100 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДВЕСТИ", 200, null, false);
        NumberHelper.m_nums.add_str("ДВУХСОТЫЙ", 200 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДВУХСОТ", 200, null, false);
        NumberHelper.m_nums.add_str("ДВІСТІ", 200, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДВОХСОТИЙ", 200 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДВОХСОТ", 200, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТРИСТА", 300, null, false);
        NumberHelper.m_nums.add_str("ТРЕХСОТЫЙ", 300 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ТРЕХСОТ", 300, null, false);
        NumberHelper.m_nums.add_str("ТРИСТА", 300, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТРЬОХСОТИЙ", 300 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТРЬОХСОТ", 300, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ЧЕТЫРЕСТА", 400, null, false);
        NumberHelper.m_nums.add_str("ЧЕТЫРЕХСОТЫЙ", 400 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ЧОТИРИСТА", 400, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ЧОТИРЬОХСОТИЙ", 400 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ПЯТЬСОТ", 500, null, false);
        NumberHelper.m_nums.add_str("ПЯТИСОТЫЙ", 500 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ПЯТСОТ", 500, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ПЯТИСОТИЙ", 500 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ШЕСТЬСОТ", 600, null, false);
        NumberHelper.m_nums.add_str("ШЕСТИСОТЫЙ", 600 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ШІСТСОТ", 600, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ШЕСТИСОТИЙ", 600 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СЕМЬСОТ", 700, null, false);
        NumberHelper.m_nums.add_str("СЕМИСОТЫЙ", 700 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("СІМСОТ", 700, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("СЕМИСОТИЙ", 700 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ВОСЕМЬСОТ", 800, null, false);
        NumberHelper.m_nums.add_str("ВОСЕМЬСОТЫЙ", 800 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ВОСЬМИСОТЫЙ", 800 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ВІСІМСОТ", 800, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ВОСЬМИСОТЫЙ", 800 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДЕВЯТЬСОТ", 900, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТЬСОТЫЙ", 900 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТИСОТЫЙ", 900 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТСОТ", 900, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДЕВЯТЬСОТЫЙ", 900 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДЕВЯТИСОТИЙ", 900 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТЫС", 1000, null, false);
        NumberHelper.m_nums.add_str("ТЫСЯЧА", 1000, null, false);
        NumberHelper.m_nums.add_str("ТЫСЯЧНЫЙ", 1000 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ТИС", 1000, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТИСЯЧА", 1000, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ТИСЯЧНИЙ", 1000 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("ДВУХТЫСЯЧНЫЙ", 2000 | NumberHelper.pril_num_tag_bit, null, false);
        NumberHelper.m_nums.add_str("ДВОХТИСЯЧНИЙ", 2000 | NumberHelper.pril_num_tag_bit, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("МИЛЛИОН", 1000000, null, false);
        NumberHelper.m_nums.add_str("МЛН", 1000000, null, false);
        NumberHelper.m_nums.add_str("МІЛЬЙОН", 1000000, MorphLang.UA, false);
        NumberHelper.m_nums.add_str("МИЛЛИАРД", 1000000000, null, false);
        NumberHelper.m_nums.add_str("МІЛЬЯРД", 1000000000, MorphLang.UA, false);
        NumberHelper.m_after_points = new TerminCollection();
        let t = Termin._new119("ПОЛОВИНА", 0.5);
        t.add_variant("ОДНА ВТОРАЯ", false);
        t.add_variant("ПОЛ", false);
        NumberHelper.m_after_points.add(t);
        t = Termin._new119("ТРЕТЬ", 0.33);
        t.add_variant("ОДНА ТРЕТЬ", false);
        NumberHelper.m_after_points.add(t);
        t = Termin._new119("ЧЕТВЕРТЬ", 0.25);
        t.add_variant("ОДНА ЧЕТВЕРТАЯ", false);
        NumberHelper.m_after_points.add(t);
        t = Termin._new119("ПЯТАЯ ЧАСТЬ", 0.2);
        t.add_variant("ОДНА ПЯТАЯ", false);
        NumberHelper.m_after_points.add(t);
    }
    
    static static_constructor() {
        NumberHelper.m_samples = ["ДЕСЯТЫЙ", "ПЕРВЫЙ", "ВТОРОЙ", "ТРЕТИЙ", "ЧЕТВЕРТЫЙ", "ПЯТЫЙ", "ШЕСТОЙ", "СЕДЬМОЙ", "ВОСЬМОЙ", "ДЕВЯТЫЙ"];
        NumberHelper.m_man_number_words = ["ПЕРВЫЙ", "ВТОРОЙ", "ТРЕТИЙ", "ЧЕТВЕРТЫЙ", "ПЯТЫЙ", "ШЕСТОЙ", "СЕДЬМОЙ", "ВОСЬМОЙ", "ДЕВЯТЫЙ", "ДЕСЯТЫЙ", "ОДИННАДЦАТЫЙ", "ДВЕНАДЦАТЫЙ", "ТРИНАДЦАТЫЙ", "ЧЕТЫРНАДЦАТЫЙ", "ПЯТНАДЦАТЫЙ", "ШЕСТНАДЦАТЫЙ", "СЕМНАДЦАТЫЙ", "ВОСЕМНАДЦАТЫЙ", "ДЕВЯТНАДЦАТЫЙ"];
        NumberHelper.m_neutral_number_words = ["ПЕРВОЕ", "ВТОРОЕ", "ТРЕТЬЕ", "ЧЕТВЕРТОЕ", "ПЯТОЕ", "ШЕСТОЕ", "СЕДЬМОЕ", "ВОСЬМОЕ", "ДЕВЯТОЕ", "ДЕСЯТОЕ", "ОДИННАДЦАТОЕ", "ДВЕНАДЦАТОЕ", "ТРИНАДЦАТОЕ", "ЧЕТЫРНАДЦАТОЕ", "ПЯТНАДЦАТОЕ", "ШЕСТНАДЦАТОЕ", "СЕМНАДЦАТОЕ", "ВОСЕМНАДЦАТОЕ", "ДЕВЯТНАДЦАТОЕ"];
        NumberHelper.m_woman_number_words = ["ПЕРВАЯ", "ВТОРАЯ", "ТРЕТЬЯ", "ЧЕТВЕРТАЯ", "ПЯТАЯ", "ШЕСТАЯ", "СЕДЬМАЯ", "ВОСЬМАЯ", "ДЕВЯТАЯ", "ДЕСЯТАЯ", "ОДИННАДЦАТАЯ", "ДВЕНАДЦАТАЯ", "ТРИНАДЦАТАЯ", "ЧЕТЫРНАДЦАТАЯ", "ПЯТНАДЦАТАЯ", "ШЕСТНАДЦАТАЯ", "СЕМНАДЦАТАЯ", "ВОСЕМНАДЦАТАЯ", "ДЕВЯТНАДЦАТАЯ"];
        NumberHelper.m_plural_number_words = ["ПЕРВЫЕ", "ВТОРЫЕ", "ТРЕТЬИ", "ЧЕТВЕРТЫЕ", "ПЯТЫЕ", "ШЕСТЫЕ", "СЕДЬМЫЕ", "ВОСЬМЫЕ", "ДЕВЯТЫЕ", "ДЕСЯТЫЕ", "ОДИННАДЦАТЫЕ", "ДВЕНАДЦАТЫЕ", "ТРИНАДЦАТЫЕ", "ЧЕТЫРНАДЦАТЫЕ", "ПЯТНАДЦАТЫЕ", "ШЕСТНАДЦАТЫЕ", "СЕМНАДЦАТЫЕ", "ВОСЕМНАДЦАТЫЕ", "ДЕВЯТНАДЦАТЫЕ"];
        NumberHelper.m_dec_dumber_words = ["ДВАДЦАТЬ", "ТРИДЦАТЬ", "СОРОК", "ПЯТЬДЕСЯТ", "ШЕСТЬДЕСЯТ", "СЕМЬДЕСЯТ", "ВОСЕМЬДЕСЯТ", "ДЕВЯНОСТО"];
        NumberHelper.m_man_dec_dumber_words = ["ДВАДЦАТЫЙ", "ТРИДЦАТЫЙ", "СОРОКОВОЙ", "ПЯТЬДЕСЯТЫЙ", "ШЕСТЬДЕСЯТЫЙ", "СЕМЬДЕСЯТЫЙ", "ВОСЕМЬДЕСЯТЫЙ", "ДЕВЯНОСТЫЙ"];
        NumberHelper.m_woman_dec_dumber_words = ["ДВАДЦАТАЯ", "ТРИДЦАТАЯ", "СОРОКОВАЯ", "ПЯТЬДЕСЯТАЯ", "ШЕСТЬДЕСЯТАЯ", "СЕМЬДЕСЯТАЯ", "ВОСЕМЬДЕСЯТАЯ", "ДЕВЯНОСТАЯ"];
        NumberHelper.m_neutral_dec_dumber_words = ["ДВАДЦАТОЕ", "ТРИДЦАТОЕ", "СОРОКОВОЕ", "ПЯТЬДЕСЯТОЕ", "ШЕСТЬДЕСЯТОЕ", "СЕМЬДЕСЯТОЕ", "ВОСЕМЬДЕСЯТОЕ", "ДЕВЯНОСТОЕ"];
        NumberHelper.m_plural_dec_dumber_words = ["ДВАДЦАТЫЕ", "ТРИДЦАТЫЕ", "СОРОКОВЫЕ", "ПЯТЬДЕСЯТЫЕ", "ШЕСТЬДЕСЯТЫЕ", "СЕМЬДЕСЯТЫЕ", "ВОСЕМЬДЕСЯТЫЕ", "ДЕВЯНОСТЫЕ"];
        NumberHelper.m_100words = ["СТО", "ДВЕСТИ", "ТРИСТА", "ЧЕТЫРЕСТА", "ПЯТЬСОТ", "ШЕСТЬСОТ", "СЕМЬСОТ", "ВОСЕМЬСОТ", "ДЕВЯТЬСОТ"];
        NumberHelper.m_10words = ["ДЕСЯТЬ", "ДВАДЦАТЬ", "ТРИДЦАТЬ", "СОРОК", "ПЯТЬДЕСЯТ", "ШЕСТЬДЕСЯТ", "СЕМЬДЕСЯТ", "ВОСЕМЬДЕСЯТ", "ДЕВЯНОСТО"];
        NumberHelper.m_1words = ["НОЛЬ", "ОДИН", "ДВА", "ТРИ", "ЧЕТЫРЕ", "ПЯТЬ", "ШЕСТЬ", "СЕМЬ", "ВОСЕМЬ", "ДЕВЯТЬ", "ДЕСЯТЬ", "ОДИННАДЦАТЬ", "ДВЕНАДЦАТЬ", "ТРИНАДЦАТЬ", "ЧЕТЫРНАДЦАТЬ", "ПЯТНАДЦАТЬ", "ШЕСТНАДЦАТЬ", "СЕМНАДЦАТЬ", "ВОСЕМНАДЦАТЬ", "ДЕВЯТНАДЦАТЬ"];
        NumberHelper.m_romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX"];
        NumberHelper.pril_num_tag_bit = 0x40000000;
        NumberHelper.m_nums = null;
        NumberHelper.m_after_points = null;
    }
}


NumberHelper.static_constructor();

module.exports = NumberHelper