/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");

const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MorphLang = require("./../../../morph/MorphLang");
const DatePointerType = require("./../DatePointerType");
const NumberExType = require("./../../core/NumberExType");
const MetaToken = require("./../../MetaToken");
const DateRangeReferent = require("./../DateRangeReferent");
const MorphClass = require("./../../../morph/MorphClass");
const NumbersWithUnitToken = require("./../../measure/internal/NumbersWithUnitToken");
const Token = require("./../../Token");
const TextToken = require("./../../TextToken");
const DateItemTokenDateItemType = require("./DateItemTokenDateItemType");
const NumberSpellingType = require("./../../NumberSpellingType");
const NumberToken = require("./../../NumberToken");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const Termin = require("./../../core/Termin");
const TerminCollection = require("./../../core/TerminCollection");
const NumberHelper = require("./../../core/NumberHelper");
const BracketHelper = require("./../../core/BracketHelper");

/**
 * Примитив, из которых состоит дата
 */
class DateItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = DateItemTokenDateItemType.NUMBER;
        this.string_value = null;
        this.int_value = 0;
        this.lang = null;
        this.new_age = 0;
        this.m_year = -1;
        this.m_can_by_month = -1;
    }
    
    toString() {
        return (this.typ.toString() + " " + (this.int_value === 0 ? this.string_value : this.int_value.toString()));
    }
    
    get year() {
        if (this.m_year > 0) 
            return this.m_year;
        if (this.int_value === 0) 
            return 0;
        if (this.new_age === 0) {
            if (this.int_value < 16) 
                return 2000 + this.int_value;
            if (this.int_value <= ((Utils.getDate(Utils.now()).getFullYear() - 2000) + 5)) 
                return 2000 + this.int_value;
            if (this.int_value < 100) 
                return 1900 + this.int_value;
        }
        return this.int_value;
    }
    set year(value) {
        this.m_year = value;
        return value;
    }
    
    get year0() {
        if (this.new_age < 0) 
            return -this.year;
        return this.year;
    }
    
    get can_be_year() {
        if (this.typ === DateItemTokenDateItemType.YEAR) 
            return true;
        if (this.typ === DateItemTokenDateItemType.MONTH || this.typ === DateItemTokenDateItemType.QUARTAL || this.typ === DateItemTokenDateItemType.HALFYEAR) 
            return false;
        if (this.int_value >= 50 && (this.int_value < 100)) 
            return true;
        if ((this.int_value < 1000) || this.int_value > 2100) 
            return false;
        return true;
    }
    
    get can_by_month() {
        if (this.m_can_by_month >= 0) 
            return this.m_can_by_month === 1;
        if (this.typ === DateItemTokenDateItemType.MONTH) 
            return true;
        if (this.typ === DateItemTokenDateItemType.QUARTAL || this.typ === DateItemTokenDateItemType.HALFYEAR || this.typ === DateItemTokenDateItemType.POINTER) 
            return false;
        return this.int_value > 0 && this.int_value <= 12;
    }
    set can_by_month(value) {
        this.m_can_by_month = (value ? 1 : 0);
        return value;
    }
    
    get can_be_day() {
        if ((this.typ === DateItemTokenDateItemType.MONTH || this.typ === DateItemTokenDateItemType.QUARTAL || this.typ === DateItemTokenDateItemType.HALFYEAR) || this.typ === DateItemTokenDateItemType.POINTER) 
            return false;
        return this.int_value > 0 && this.int_value <= 31;
    }
    
    get can_be_hour() {
        if (this.typ !== DateItemTokenDateItemType.NUMBER) 
            return this.typ === DateItemTokenDateItemType.HOUR;
        if (this.length_char !== 2) {
            if (this.length_char === 1 && this.int_value === 0) 
                return true;
            return false;
        }
        return this.int_value >= 0 && (this.int_value < 24);
    }
    
    get can_be_minute() {
        if (this.typ !== DateItemTokenDateItemType.NUMBER) 
            return this.typ === DateItemTokenDateItemType.MINUTE;
        if (this.length_char !== 2) 
            return false;
        return this.int_value >= 0 && (this.int_value < 60);
    }
    
    get is_zero_headed() {
        return this.kit.sofa.text[this.begin_char] === '0';
    }
    
    /**
     * Привязать с указанной позиции один примитив
     * @param cnt 
     * @param indFrom 
     * @return 
     */
    static try_attach(t, prev, detail_regime = false) {
        if (t === null) 
            return null;
        let t0 = t;
        if (t0.is_char('_')) {
            for (t = t.next; t !== null; t = t.next) {
                if (t.is_newline_before) 
                    return null;
                if (!t.is_char('_')) 
                    break;
            }
        }
        else if (BracketHelper.can_be_start_of_sequence(t0, true, false)) {
            let ok = false;
            for (t = t.next; t !== null; t = t.next) {
                if (BracketHelper.can_be_end_of_sequence(t, true, t0, false)) {
                    ok = true;
                    break;
                }
                else if (!t.is_char('_')) 
                    break;
            }
            if (!ok) 
                t = t0;
            else 
                for (t = t.next; t !== null; t = t.next) {
                    if (!t.is_char('_')) 
                        break;
                }
        }
        else if ((t0 instanceof TextToken) && t0.is_value("THE", null)) {
            let res0 = DateItemToken._try_attach(t.next, prev, detail_regime);
            if (res0 !== null) {
                res0.begin_token = t;
                return res0;
            }
        }
        let res = DateItemToken._try_attach(t, prev, detail_regime);
        if (res === null) 
            return null;
        res.begin_token = t0;
        if (!res.is_whitespace_after && res.end_token.next !== null && res.end_token.next.is_char('_')) {
            for (t = res.end_token.next; t !== null; t = t.next) {
                if (!t.is_char('_')) 
                    break;
                else 
                    res.end_token = t;
            }
        }
        if (res.typ === DateItemTokenDateItemType.YEAR || res.typ === DateItemTokenDateItemType.CENTURY || res.typ === DateItemTokenDateItemType.NUMBER) {
            let tok = null;
            let ii = 0;
            t = res.end_token.next;
            if (t !== null && t.is_value("ДО", null)) {
                tok = DateItemToken.m_new_age.try_parse(t.next, TerminParseAttr.NO);
                ii = -1;
            }
            else if (t !== null && t.is_value("ОТ", "ВІД")) {
                tok = DateItemToken.m_new_age.try_parse(t.next, TerminParseAttr.NO);
                ii = 1;
            }
            else {
                tok = DateItemToken.m_new_age.try_parse(t, TerminParseAttr.NO);
                ii = 1;
            }
            if (tok !== null) {
                res.new_age = (ii < 0 ? -1 : 1);
                res.end_token = tok.end_token;
                if (res.typ === DateItemTokenDateItemType.NUMBER) 
                    res.typ = DateItemTokenDateItemType.YEAR;
            }
        }
        return res;
    }
    
    static _is_new_age(t) {
        if (t === null) 
            return false;
        if (t.is_value("ДО", null)) 
            return DateItemToken.m_new_age.try_parse(t.next, TerminParseAttr.NO) !== null;
        else if (t.is_value("ОТ", "ВІД")) 
            return DateItemToken.m_new_age.try_parse(t.next, TerminParseAttr.NO) !== null;
        return DateItemToken.m_new_age.try_parse(t, TerminParseAttr.NO) !== null;
    }
    
    static _try_attach(t, prev, detail_regime) {
        const MeasureToken = require("./../../measure/internal/MeasureToken");
        if (t === null) 
            return null;
        let nt = Utils.as(t, NumberToken);
        let begin = t;
        let end = t;
        let is_in_brack = false;
        if ((BracketHelper.can_be_start_of_sequence(t, false, false) && t.next !== null && (t.next instanceof NumberToken)) && BracketHelper.can_be_end_of_sequence(t.next.next, false, null, false)) {
            nt = Utils.as(t.next, NumberToken);
            end = t.next.next;
            is_in_brack = true;
        }
        if ((t.is_newline_before && BracketHelper.is_bracket(t, false) && (t.next instanceof NumberToken)) && BracketHelper.is_bracket(t.next.next, false)) {
            nt = Utils.as(t.next, NumberToken);
            end = t.next.next;
            is_in_brack = true;
        }
        if (nt !== null) {
            if (nt.int_value === null) 
                return null;
            if (nt.typ === NumberSpellingType.WORDS) {
                if (nt.morph.class0.is_noun && !nt.morph.class0.is_adjective) {
                    if (t.next !== null && ((t.next.is_value("КВАРТАЛ", null) || t.next.is_value("ПОЛУГОДИЕ", null) || t.next.is_value("ПІВРІЧЧЯ", null)))) {
                    }
                    else 
                        return null;
                }
            }
            if (NumberHelper.try_parse_age(nt) !== null) 
                return null;
            let tt = null;
            let res = DateItemToken._new673(begin, end, DateItemTokenDateItemType.NUMBER, nt.int_value, nt.morph);
            if ((res.int_value === 20 && (nt.next instanceof NumberToken) && (nt.next).int_value !== null) && nt.next.length_char === 2 && prev !== null) {
                let num = 2000 + (nt.next).int_value;
                if ((num < 2030) && prev.length > 0 && prev[prev.length - 1].typ === DateItemTokenDateItemType.MONTH) {
                    let ok = false;
                    if (nt.whitespaces_after_count === 1) 
                        ok = true;
                    else if (nt.is_newline_after && nt.is_newline_after) 
                        ok = true;
                    if (ok) {
                        nt = Utils.as(nt.next, NumberToken);
                        res.end_token = nt;
                        res.int_value = num;
                    }
                }
            }
            if (res.int_value === 20 || res.int_value === 201) {
                tt = t.next;
                if (tt !== null && tt.is_char('_')) {
                    for (; tt !== null; tt = tt.next) {
                        if (!tt.is_char('_')) 
                            break;
                    }
                    tt = DateItemToken.test_year_rus_word(tt, false);
                    if (tt !== null) {
                        res.int_value = 0;
                        res.end_token = tt;
                        res.typ = DateItemTokenDateItemType.YEAR;
                        return res;
                    }
                }
            }
            if (res.int_value <= 12 && t.next !== null && (t.whitespaces_after_count < 3)) {
                tt = t.next;
                if (tt.is_value("ЧАС", null)) {
                    if (((t.previous instanceof TextToken) && !t.previous.chars.is_letter && !t.is_whitespace_before) && (t.previous.previous instanceof NumberToken) && !t.previous.is_whitespace_before) {
                    }
                    else {
                        res.typ = DateItemTokenDateItemType.HOUR;
                        res.end_token = tt;
                        tt = tt.next;
                        if (tt !== null && tt.is_char('.')) {
                            res.end_token = tt;
                            tt = tt.next;
                        }
                    }
                }
                for (; tt !== null; tt = tt.next) {
                    if (tt.is_value("УТРО", "РАНОК")) {
                        res.end_token = tt;
                        res.typ = DateItemTokenDateItemType.HOUR;
                        return res;
                    }
                    if (tt.is_value("ВЕЧЕР", "ВЕЧІР")) {
                        res.end_token = tt;
                        res.int_value += 12;
                        res.typ = DateItemTokenDateItemType.HOUR;
                        return res;
                    }
                    if (tt.is_value("ДЕНЬ", null)) {
                        res.end_token = tt;
                        if (res.int_value < 10) 
                            res.int_value += 12;
                        res.typ = DateItemTokenDateItemType.HOUR;
                        return res;
                    }
                    if (tt.is_value("НОЧЬ", "НІЧ")) {
                        res.end_token = tt;
                        if (res.int_value === 12) 
                            res.int_value = 0;
                        else if (res.int_value > 9) 
                            res.int_value += 12;
                        res.typ = DateItemTokenDateItemType.HOUR;
                        return res;
                    }
                    if (tt.is_comma || tt.morph.class0.is_adverb) 
                        continue;
                    break;
                }
                if (res.typ === DateItemTokenDateItemType.HOUR) 
                    return res;
            }
            let _can_be_year = true;
            if (prev !== null && prev.length > 0 && prev[prev.length - 1].typ === DateItemTokenDateItemType.MONTH) {
            }
            else if ((prev !== null && prev.length >= 4 && prev[prev.length - 1].typ === DateItemTokenDateItemType.DELIM) && prev[prev.length - 2].can_by_month) {
            }
            else if (nt.next !== null && ((nt.next.is_value("ГОД", null) || nt.next.is_value("РІК", null)))) {
                if (res.int_value < 1000) 
                    _can_be_year = false;
            }
            tt = DateItemToken.test_year_rus_word(nt.next, false);
            if (tt !== null && DateItemToken._is_new_age(tt.next)) {
                res.typ = DateItemTokenDateItemType.YEAR;
                res.end_token = tt;
            }
            else if (_can_be_year) {
                if (res.can_be_year || res.typ === DateItemTokenDateItemType.NUMBER) {
                    if ((((tt = DateItemToken.test_year_rus_word(nt.next, res.is_newline_before)))) !== null) {
                        if ((tt.is_value("Г", null) && !tt.is_whitespace_before && t.previous !== null) && ((t.previous.is_value("КОРПУС", null) || t.previous.is_value("КОРП", null)))) {
                        }
                        else if ((((nt.next.is_value("Г", null) && (t.whitespaces_before_count < 3) && t.previous !== null) && t.previous.is_value("Я", null) && t.previous.previous !== null) && t.previous.previous.is_char_of("\\/") && t.previous.previous.previous !== null) && t.previous.previous.previous.is_value("А", null)) 
                            return null;
                        else if (nt.next.length_char === 1 && !res.can_be_year && ((prev === null || ((prev.length > 0 && prev[prev.length - 1].typ !== DateItemTokenDateItemType.DELIM))))) {
                        }
                        else {
                            res.end_token = tt;
                            res.typ = DateItemTokenDateItemType.YEAR;
                            res.lang = tt.morph.language;
                        }
                    }
                }
                else if (tt !== null && (nt.whitespaces_after_count < 2) && (nt.end_char - nt.begin_char) === 1) {
                    res.end_token = tt;
                    res.typ = DateItemTokenDateItemType.YEAR;
                    res.lang = tt.morph.language;
                }
            }
            if (nt.previous !== null) {
                if (nt.previous.is_value("В", "У") || nt.previous.is_value("К", null) || nt.previous.is_value("ДО", null)) {
                    if ((((tt = DateItemToken.test_year_rus_word(nt.next, false)))) !== null) {
                        let ok = false;
                        if ((res.int_value < 100) && (tt instanceof TextToken) && (((tt).term === "ГОДА" || (tt).term === "РОКИ"))) {
                        }
                        else {
                            ok = true;
                            if (nt.previous.is_value("ДО", null) && nt.next.is_value("Г", null)) {
                                let cou = 0;
                                for (let ttt = nt.previous.previous; ttt !== null && (cou < 10); ttt = ttt.previous,cou++) {
                                    let mt = MeasureToken.try_parse(ttt, null, false, false, false, false);
                                    if (mt !== null && mt.end_char > nt.end_char) {
                                        ok = false;
                                        break;
                                    }
                                }
                            }
                        }
                        if (ok) {
                            res.end_token = tt;
                            res.typ = DateItemTokenDateItemType.YEAR;
                            res.lang = tt.morph.language;
                            res.begin_token = nt.previous;
                        }
                    }
                }
                else if (((nt.previous.is_value("IN", null) || nt.previous.is_value("SINCE", null))) && res.can_be_year) {
                    let uu = (nt.previous.is_value("IN", null) ? NumbersWithUnitToken.try_parse(nt, null, false, false, false, false) : null);
                    if (uu !== null) {
                    }
                    else {
                        res.typ = DateItemTokenDateItemType.YEAR;
                        res.begin_token = nt.previous;
                    }
                }
                else if (nt.previous.is_value("NEL", null) || nt.previous.is_value("DEL", null)) {
                    if (res.can_be_year) {
                        res.typ = DateItemTokenDateItemType.YEAR;
                        res.lang = MorphLang.IT;
                        res.begin_token = nt.previous;
                    }
                }
                else if (nt.previous.is_value("IL", null) && res.can_be_day) {
                    res.lang = MorphLang.IT;
                    res.begin_token = nt.previous;
                }
            }
            let t1 = res.end_token.next;
            if (t1 !== null) {
                if (t1.is_value("ЧАС", "ГОДИНА") || t1.is_value("HOUR", null)) {
                    if ((((prev !== null && prev.length === 2 && prev[0].can_be_hour) && prev[1].typ === DateItemTokenDateItemType.DELIM && !prev[1].is_whitespace_after) && !prev[1].is_whitespace_after && res.int_value >= 0) && (res.int_value < 59)) {
                        prev[0].typ = DateItemTokenDateItemType.HOUR;
                        res.typ = DateItemTokenDateItemType.MINUTE;
                        res.end_token = t1;
                    }
                    else if (res.int_value < 24) {
                        if (t1.next !== null && t1.next.is_char('.')) 
                            t1 = t1.next;
                        res.typ = DateItemTokenDateItemType.HOUR;
                        res.end_token = t1;
                    }
                }
                else if ((res.int_value < 60) && ((t1.is_value("МИНУТА", "ХВИЛИНА") || t1.is_value("МИН", null) || t.is_value("MINUTE", null)))) {
                    if (t1.next !== null && t1.next.is_char('.')) 
                        t1 = t1.next;
                    res.typ = DateItemTokenDateItemType.MINUTE;
                    res.end_token = t1;
                }
                else if ((res.int_value < 60) && ((t1.is_value("СЕКУНДА", null) || t1.is_value("СЕК", null) || t1.is_value("SECOND", null)))) {
                    if (t1.next !== null && t1.next.is_char('.')) 
                        t1 = t1.next;
                    res.typ = DateItemTokenDateItemType.SECOND;
                    res.end_token = t1;
                }
                else if ((res.int_value < 30) && ((t1.is_value("ВЕК", "ВІК") || t1.is_value("СТОЛЕТИЕ", "СТОЛІТТЯ")))) {
                    res.typ = DateItemTokenDateItemType.CENTURY;
                    res.end_token = t1;
                }
                else if (res.int_value <= 4 && t1.is_value("КВАРТАЛ", null)) {
                    res.typ = DateItemTokenDateItemType.QUARTAL;
                    res.end_token = t1;
                }
                else if (res.int_value <= 2 && ((t1.is_value("ПОЛУГОДИЕ", null) || t1.is_value("ПІВРІЧЧЯ", null)))) {
                    res.typ = DateItemTokenDateItemType.HALFYEAR;
                    res.end_token = t1;
                }
            }
            return res;
        }
        let t0 = Utils.as(t, TextToken);
        if (t0 === null) 
            return null;
        let txt = t0.get_source_text();
        if ((txt[0] === 'I' || txt[0] === 'X' || txt[0] === 'Х') || txt[0] === 'V') {
            let lat = NumberHelper.try_parse_roman(t);
            if (lat !== null && lat.end_token.next !== null && lat.int_value !== null) {
                let val = lat.int_value;
                let tt = lat.end_token.next;
                if (tt.is_value("КВАРТАЛ", null) && val > 0 && val <= 4) 
                    return DateItemToken._new674(t, tt, DateItemTokenDateItemType.QUARTAL, val);
                if (tt.is_value("ПОЛУГОДИЕ", "ПІВРІЧЧЯ") && val > 0 && val <= 2) 
                    return DateItemToken._new674(t, lat.end_token.next, DateItemTokenDateItemType.HALFYEAR, val);
                if (tt.is_value("ВЕК", "ВІК") || tt.is_value("СТОЛЕТИЕ", "СТОЛІТТЯ")) 
                    return DateItemToken._new674(t, lat.end_token.next, DateItemTokenDateItemType.CENTURY, val);
                if (tt.is_value("В", null) && tt.next !== null && tt.next.is_char('.')) {
                    if (prev !== null && prev.length > 0 && prev[prev.length - 1].typ === DateItemTokenDateItemType.POINTER) 
                        return DateItemToken._new674(t, tt.next, DateItemTokenDateItemType.CENTURY, val);
                    if (DateItemToken._is_new_age(tt.next.next)) 
                        return DateItemToken._new674(t, tt.next, DateItemTokenDateItemType.CENTURY, val);
                }
                if (tt.is_hiphen) {
                    let lat2 = NumberHelper.try_parse_roman(tt.next);
                    if (lat2 !== null && lat2.int_value !== null && lat2.end_token.next !== null) {
                        if (lat2.end_token.next.is_value("ВЕК", "ВІК") || lat2.end_token.next.is_value("СТОЛЕТИЕ", "СТОЛІТТЯ")) {
                            let ddd = DateItemToken.try_attach(tt.next, null, false);
                            return DateItemToken._new679(t, lat.end_token, DateItemTokenDateItemType.CENTURY, val, ((ddd !== null ? ddd.new_age : 0)));
                        }
                    }
                }
            }
        }
        if (t !== null && t.is_value("НАПРИКІНЦІ", null)) 
            return DateItemToken._new680(t, t, DateItemTokenDateItemType.POINTER, "конец");
        if (t !== null && t.is_value("ДОНЕДАВНА", null)) 
            return DateItemToken._new680(t, t, DateItemTokenDateItemType.POINTER, "сегодня");
        if (prev === null) {
            if (t !== null) {
                if (t.is_value("ОКОЛО", "БІЛЯ") || t.is_value("ПРИМЕРНО", "ПРИБЛИЗНО") || t.is_value("ABOUT", null)) 
                    return DateItemToken._new680(t, t, DateItemTokenDateItemType.POINTER, "около");
            }
            if (t.is_value("ОК", null) || t.is_value("OK", null)) {
                if (t.next !== null && t.next.is_char('.')) 
                    return DateItemToken._new680(t, t.next, DateItemTokenDateItemType.POINTER, "около");
                return DateItemToken._new680(t, t, DateItemTokenDateItemType.POINTER, "около");
            }
        }
        let tok = DateItemToken.m_seasons.try_parse(t, TerminParseAttr.NO);
        if ((tok !== null && (DatePointerType.of(tok.termin.tag)) === DatePointerType.SUMMER && t.morph.language.is_ru) && (t instanceof TextToken)) {
            let str = (t).term;
            if (str !== "ЛЕТОМ" && str !== "ЛЕТА" && str !== "ЛЕТО") 
                tok = null;
        }
        if (tok !== null) 
            return DateItemToken._new674(t, tok.end_token, DateItemTokenDateItemType.POINTER, DatePointerType.of(tok.termin.tag).value());
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null) {
            tok = DateItemToken.m_seasons.try_parse(npt.end_token, TerminParseAttr.NO);
            if ((tok !== null && (DatePointerType.of(tok.termin.tag)) === DatePointerType.SUMMER && t.morph.language.is_ru) && (t instanceof TextToken)) {
                let str = (t).term;
                if (str !== "ЛЕТОМ" && str !== "ЛЕТА" && str !== "ЛЕТО") 
                    tok = null;
            }
            if (tok !== null) 
                return DateItemToken._new674(t, tok.end_token, DateItemTokenDateItemType.POINTER, DatePointerType.of(tok.termin.tag).value());
            let _typ = DateItemTokenDateItemType.NUMBER;
            if (npt.noun.is_value("КВАРТАЛ", null)) 
                _typ = DateItemTokenDateItemType.QUARTAL;
            else if (npt.end_token.is_value("ПОЛУГОДИЕ", null) || npt.end_token.is_value("ПІВРІЧЧЯ", null)) 
                _typ = DateItemTokenDateItemType.HALFYEAR;
            else if (npt.end_token.is_value("НАЧАЛО", null) || npt.end_token.is_value("ПОЧАТОК", null)) 
                return DateItemToken._new680(t, npt.end_token, DateItemTokenDateItemType.POINTER, "начало");
            else if (npt.end_token.is_value("СЕРЕДИНА", null)) 
                return DateItemToken._new680(t, npt.end_token, DateItemTokenDateItemType.POINTER, "середина");
            else if (npt.end_token.is_value("КОНЕЦ", null) || npt.end_token.is_value("КІНЕЦЬ", null) || npt.end_token.is_value("НАПРИКІНЕЦЬ", null)) 
                return DateItemToken._new680(t, npt.end_token, DateItemTokenDateItemType.POINTER, "конец");
            else if (npt.end_token.is_value("ВРЕМЯ", null) && npt.adjectives.length > 0 && npt.end_token.previous.is_value("НАСТОЯЩЕЕ", null)) 
                return DateItemToken._new680(t, npt.end_token, DateItemTokenDateItemType.POINTER, "сегодня");
            else if (npt.end_token.is_value("ЧАС", null) && npt.adjectives.length > 0 && npt.end_token.previous.is_value("ДАНИЙ", null)) 
                return DateItemToken._new680(t, npt.end_token, DateItemTokenDateItemType.POINTER, "сегодня");
            if (_typ !== DateItemTokenDateItemType.NUMBER || detail_regime) {
                let delta = 0;
                if (npt.adjectives.length > 0) {
                    if (npt.adjectives[0].is_value("ПОСЛЕДНИЙ", "ОСТАННІЙ")) 
                        return DateItemToken._new674(t0, npt.end_token, _typ, (_typ === DateItemTokenDateItemType.QUARTAL ? 4 : 2));
                    if (npt.adjectives[0].is_value("ПРЕДЫДУЩИЙ", "ПОПЕРЕДНІЙ") || npt.adjectives[0].is_value("ПРОШЛЫЙ", null)) 
                        delta = -1;
                    else if (npt.adjectives[0].is_value("СЛЕДУЮЩИЙ", null) || npt.adjectives[0].is_value("ПОСЛЕДУЮЩИЙ", null) || npt.adjectives[0].is_value("НАСТУПНИЙ", null)) 
                        delta = 1;
                    else 
                        return null;
                }
                let cou = 0;
                for (let tt = t.previous; tt !== null; tt = tt.previous) {
                    if (cou > 200) 
                        break;
                    let dr = Utils.as(tt.get_referent(), DateRangeReferent);
                    if (dr === null) 
                        continue;
                    if (_typ === DateItemTokenDateItemType.QUARTAL) {
                        let ii = dr.quarter_number;
                        if (ii < 1) 
                            continue;
                        ii += delta;
                        if ((ii < 1) || ii > 4) 
                            continue;
                        return DateItemToken._new674(t0, npt.end_token, _typ, ii);
                    }
                    if (_typ === DateItemTokenDateItemType.HALFYEAR) {
                        let ii = dr.halfyear_number;
                        if (ii < 1) 
                            continue;
                        ii += delta;
                        if ((ii < 1) || ii > 2) 
                            continue;
                        return DateItemToken._new674(t0, npt.end_token, _typ, ii);
                    }
                }
            }
        }
        let term = t0.term;
        if (!Utils.isLetterOrDigit(term[0])) {
            if (t0.is_char_of(".\\/:") || t0.is_hiphen) 
                return DateItemToken._new680(t0, t0, DateItemTokenDateItemType.DELIM, term);
            else if (t0.is_char(',')) 
                return DateItemToken._new680(t0, t0, DateItemTokenDateItemType.DELIM, term);
            else 
                return null;
        }
        if (term === "O" || term === "О") {
            if ((t.next instanceof NumberToken) && !t.is_whitespace_after && (t.next).value.length === 1) 
                return DateItemToken._new674(t, t.next, DateItemTokenDateItemType.NUMBER, (t.next).int_value);
        }
        if (Utils.isLetter(term[0])) {
            let inf = DateItemToken.m_monthes.try_parse(t, TerminParseAttr.NO);
            if (inf !== null && inf.termin.tag === null) 
                inf = DateItemToken.m_monthes.try_parse(inf.end_token.next, TerminParseAttr.NO);
            if (inf !== null && ((typeof inf.termin.tag === 'number' || inf.termin.tag instanceof Number))) 
                return DateItemToken._new698(inf.begin_token, inf.end_token, DateItemTokenDateItemType.MONTH, inf.termin.tag, inf.termin.lang);
        }
        return null;
    }
    
    static initialize() {
        if (DateItemToken.m_new_age !== null) 
            return;
        DateItemToken.m_new_age = new TerminCollection();
        let tt = Termin._new699("НОВАЯ ЭРА", MorphLang.RU, true, "НОВОЙ ЭРЫ");
        tt.add_variant("НАША ЭРА", true);
        tt.add_abridge("Н.Э.");
        DateItemToken.m_new_age.add(tt);
        tt = Termin._new699("НОВА ЕРА", MorphLang.UA, true, "НОВОЇ ЕРИ");
        tt.add_variant("НАША ЕРА", true);
        tt.add_abridge("Н.Е.");
        DateItemToken.m_new_age.add(tt);
        tt = new Termin("РОЖДЕСТВО ХРИСТОВО", MorphLang.RU, true);
        tt.add_abridge("Р.Х.");
        DateItemToken.m_new_age.add(tt);
        tt = new Termin("РІЗДВА ХРИСТОВОГО", MorphLang.UA, true);
        tt.add_abridge("Р.Х.");
        DateItemToken.m_new_age.add(tt);
        DateItemToken.m_seasons = new TerminCollection();
        DateItemToken.m_seasons.add(Termin._new602("ЗИМА", MorphLang.RU, true, DatePointerType.WINTER));
        DateItemToken.m_seasons.add(Termin._new602("WINTER", MorphLang.EN, true, DatePointerType.WINTER));
        let t = Termin._new602("ВЕСНА", MorphLang.RU, true, DatePointerType.SPRING);
        t.add_variant("ПРОВЕСНА", true);
        DateItemToken.m_seasons.add(t);
        DateItemToken.m_seasons.add(Termin._new602("SPRING", MorphLang.EN, true, DatePointerType.SPRING));
        t = Termin._new602("ЛЕТО", MorphLang.RU, true, DatePointerType.SUMMER);
        DateItemToken.m_seasons.add(t);
        t = Termin._new602("ЛІТО", MorphLang.UA, true, DatePointerType.SUMMER);
        DateItemToken.m_seasons.add(t);
        t = Termin._new602("ОСЕНЬ", MorphLang.RU, true, DatePointerType.AUTUMN);
        DateItemToken.m_seasons.add(t);
        t = Termin._new602("AUTUMN", MorphLang.EN, true, DatePointerType.AUTUMN);
        DateItemToken.m_seasons.add(t);
        t = Termin._new602("ОСІНЬ", MorphLang.UA, true, DatePointerType.AUTUMN);
        DateItemToken.m_seasons.add(t);
        DateItemToken.m_monthes = new TerminCollection();
        let months = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ", "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"];
        for (let i = 0; i < months.length; i++) {
            t = Termin._new602(months[i], MorphLang.RU, true, i + 1);
            DateItemToken.m_monthes.add(t);
        }
        months = ["СІЧЕНЬ", "ЛЮТИЙ", "БЕРЕЗЕНЬ", "КВІТЕНЬ", "ТРАВЕНЬ", "ЧЕРВЕНЬ", "ЛИПЕНЬ", "СЕРПЕНЬ", "ВЕРЕСЕНЬ", "ЖОВТЕНЬ", "ЛИСТОПАД", "ГРУДЕНЬ"];
        for (let i = 0; i < months.length; i++) {
            t = Termin._new602(months[i], MorphLang.UA, true, i + 1);
            DateItemToken.m_monthes.add(t);
        }
        months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        for (let i = 0; i < months.length; i++) {
            t = Termin._new602(months[i], MorphLang.EN, true, i + 1);
            DateItemToken.m_monthes.add(t);
        }
        months = ["GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GUINGO", "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE"];
        for (let i = 0; i < months.length; i++) {
            t = Termin._new602(months[i], MorphLang.IT, true, i + 1);
            DateItemToken.m_monthes.add(t);
        }
        for (const m of ["ЯНВ", "ФЕВ", "ФЕВР", "МАР", "АПР", "ИЮН", "ИЮЛ", "АВГ", "СЕН", "СЕНТ", "ОКТ", "НОЯ", "НОЯБ", "ДЕК", "JAN", "FEB", "MAR", "APR", "JUN", "JUL", "AUG", "SEP", "SEPT", "OCT", "NOV", "DEC"]) {
            for (const ttt of DateItemToken.m_monthes.termins) {
                if (ttt.terms[0].canonical_text.startsWith(m)) {
                    ttt.add_abridge(m);
                    DateItemToken.m_monthes.reindex(ttt);
                    break;
                }
            }
        }
        for (const m of ["OF"]) {
            DateItemToken.m_monthes.add(new Termin(m, MorphLang.EN, true));
        }
        DateItemToken.m_empty_words = new Hashtable();
        DateItemToken.m_empty_words.put("IN", MorphLang.EN);
        DateItemToken.m_empty_words.put("SINCE", MorphLang.EN);
        DateItemToken.m_empty_words.put("THE", MorphLang.EN);
        DateItemToken.m_empty_words.put("NEL", MorphLang.IT);
        DateItemToken.m_empty_words.put("DEL", MorphLang.IT);
        DateItemToken.m_empty_words.put("IL", MorphLang.IT);
        DateItemToken.DAYS_OF_WEEK = new TerminCollection();
        let te = Termin._new602("SUNDAY", MorphLang.EN, true, 7);
        te.add_abridge("SUN");
        te.add_variant("ВОСКРЕСЕНЬЕ", true);
        te.add_variant("ВОСКРЕСЕНИЕ", true);
        te.add_abridge("ВС");
        te.add_variant("НЕДІЛЯ", true);
        DateItemToken.DAYS_OF_WEEK.add(te);
        te = Termin._new602("MONDAY", MorphLang.EN, true, 1);
        te.add_abridge("MON");
        te.add_variant("ПОНЕДЕЛЬНИК", true);
        te.add_abridge("ПОН");
        te.add_variant("ПОНЕДІЛОК", true);
        DateItemToken.DAYS_OF_WEEK.add(te);
        te = Termin._new602("TUESDAY", MorphLang.EN, true, 2);
        te.add_abridge("TUE");
        te.add_variant("ВТОРНИК", true);
        te.add_abridge("ВТ");
        te.add_variant("ВІВТОРОК", true);
        DateItemToken.DAYS_OF_WEEK.add(te);
        te = Termin._new602("WEDNESDAY", MorphLang.EN, true, 3);
        te.add_abridge("WED");
        te.add_variant("СРЕДА", true);
        te.add_abridge("СР");
        te.add_variant("СЕРЕДА", true);
        DateItemToken.DAYS_OF_WEEK.add(te);
        te = Termin._new602("THURSDAY", MorphLang.EN, true, 4);
        te.add_abridge("THU");
        te.add_variant("ЧЕТВЕРГ", true);
        te.add_abridge("ЧТ");
        te.add_variant("ЧЕТВЕР", true);
        DateItemToken.DAYS_OF_WEEK.add(te);
        te = Termin._new602("FRIDAY", MorphLang.EN, true, 5);
        te.add_abridge("FRI");
        te.add_variant("ПЯТНИЦА", true);
        te.add_abridge("ПТ");
        te.add_variant("ПЯТНИЦЯ", true);
        DateItemToken.DAYS_OF_WEEK.add(te);
        te = Termin._new602("SATURDAY", MorphLang.EN, true, 6);
        te.add_abridge("SAT");
        te.add_variant("СУББОТА", true);
        te.add_abridge("СБ");
        te.add_variant("СУБОТА", true);
        DateItemToken.DAYS_OF_WEEK.add(te);
    }
    
    static test_year_rus_word(t0, ignore_newline = false) {
        let tt = t0;
        if (tt === null) 
            return null;
        if (!ignore_newline && tt.previous !== null && tt.is_newline_before) 
            return null;
        if (tt.is_value("ГОД", null) || tt.is_value("РІК", null)) 
            return tt;
        if ((tt.is_value("Г", null) && tt.next !== null && tt.next.is_char_of("\\/.")) && tt.next.next !== null && tt.next.next.is_value("Б", null)) 
            return null;
        if (((tt.morph.language.is_ru && ((tt.is_value("ГГ", null) || tt.is_value("Г", null))))) || ((tt.morph.language.is_ua && ((tt.is_value("Р", null) || tt.is_value("РР", null)))))) {
            if (tt.next !== null && tt.next.is_char('.')) {
                tt = tt.next;
                if ((tt.next !== null && (tt.whitespaces_after_count < 4) && ((((tt.next.is_value("Г", null) && tt.next.morph.language.is_ru)) || ((tt.next.morph.language.is_ua && tt.next.is_value("Р", null)))))) && tt.next.next !== null && tt.next.next.is_char('.')) 
                    tt = tt.next.next;
                return tt;
            }
            else 
                return tt;
        }
        return null;
    }
    
    /**
     * Привязать примитивы в контейнере с указанной позиции
     * @param cnt 
     * @param indFrom 
     * @return Список примитивов
     */
    static try_attach_list(t, max_count = 20) {
        let p = DateItemToken.try_attach(t, null, false);
        if (p === null) 
            return null;
        if (p.typ === DateItemTokenDateItemType.DELIM) 
            return null;
        let res = new Array();
        res.push(p);
        let tt = p.end_token.next;
        while (tt !== null) {
            if (tt instanceof TextToken) {
                if ((tt).check_value(DateItemToken.m_empty_words) !== null) {
                    tt = tt.next;
                    continue;
                }
            }
            let p0 = DateItemToken.try_attach(tt, res, false);
            if (p0 === null) {
                if (tt.is_newline_before) 
                    break;
                if (tt.chars.is_latin_letter) 
                    break;
                if (tt.morph !== null && tt.morph.check(MorphClass.ooBitor(MorphClass.ADJECTIVE, MorphClass.PRONOUN))) {
                    tt = tt.next;
                    continue;
                }
                break;
            }
            if (tt.is_newline_before) {
                if (p.typ === DateItemTokenDateItemType.MONTH && p0.can_be_year) {
                }
                else if (p.typ === DateItemTokenDateItemType.NUMBER && p.can_be_day && p0.typ === DateItemTokenDateItemType.MONTH) {
                }
                else 
                    break;
            }
            if (p0.can_be_year && p0.typ === DateItemTokenDateItemType.NUMBER) {
                if (p.typ === DateItemTokenDateItemType.HALFYEAR || p.typ === DateItemTokenDateItemType.QUARTAL) 
                    p0.typ = DateItemTokenDateItemType.YEAR;
                else if (p.typ === DateItemTokenDateItemType.POINTER && p0.int_value > 1990) 
                    p0.typ = DateItemTokenDateItemType.YEAR;
            }
            p = p0;
            res.push(p);
            if (max_count > 0 && res.length >= max_count) 
                break;
            tt = p.end_token.next;
        }
        for (let i = res.length - 1; i >= 0; i--) {
            if (res[i].typ === DateItemTokenDateItemType.DELIM) 
                res.splice(i, 1);
            else 
                break;
        }
        if (res.length > 0 && res[res.length - 1].typ === DateItemTokenDateItemType.NUMBER) {
            let nex = NumberHelper.try_parse_number_with_postfix(res[res.length - 1].begin_token);
            if (nex !== null && nex.ex_typ !== NumberExType.HOUR) {
                if (res.length > 3 && res[res.length - 2].typ === DateItemTokenDateItemType.DELIM && res[res.length - 2].string_value === ":") {
                }
                else 
                    res.splice(res.length - 1, 1);
            }
        }
        if (res.length === 0) 
            return null;
        for (let i = 1; i < (res.length - 1); i++) {
            if (res[i].typ === DateItemTokenDateItemType.DELIM && res[i].begin_token.is_comma) {
                if ((i === 1 && res[i - 1].typ === DateItemTokenDateItemType.MONTH && res[i + 1].can_be_year) && (i + 1) === (res.length - 1)) 
                    res.splice(i, 1);
            }
        }
        if (res[res.length - 1].typ === DateItemTokenDateItemType.NUMBER) {
            let rr = res[res.length - 1];
            let npt = NounPhraseHelper.try_parse(rr.begin_token, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_char > rr.end_char) {
                res.splice(res.length - 1, 1);
                if (res.length > 0 && res[res.length - 1].typ === DateItemTokenDateItemType.DELIM) 
                    res.splice(res.length - 1, 1);
            }
        }
        if (res.length === 0) 
            return null;
        if (res.length === 2 && !res[0].is_whitespace_after) {
            if (!res[0].is_whitespace_before && !res[1].is_whitespace_after) 
                return null;
        }
        return res;
    }
    
    static _new673(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new DateItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.int_value = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new674(_arg1, _arg2, _arg3, _arg4) {
        let res = new DateItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.int_value = _arg4;
        return res;
    }
    
    static _new679(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new DateItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.int_value = _arg4;
        res.new_age = _arg5;
        return res;
    }
    
    static _new680(_arg1, _arg2, _arg3, _arg4) {
        let res = new DateItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.string_value = _arg4;
        return res;
    }
    
    static _new698(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new DateItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.int_value = _arg4;
        res.lang = _arg5;
        return res;
    }
    
    static static_constructor() {
        DateItemToken.DAYS_OF_WEEK = null;
        DateItemToken.m_new_age = null;
        DateItemToken.m_monthes = null;
        DateItemToken.m_seasons = null;
        DateItemToken.m_empty_words = null;
    }
}


DateItemToken.static_constructor();

module.exports = DateItemToken