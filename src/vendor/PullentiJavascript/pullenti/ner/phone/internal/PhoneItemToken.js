/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../../unisharp/StringBuilder");

const TerminParseAttr = require("./../../core/TerminParseAttr");
const NumberSpellingType = require("./../../NumberSpellingType");
const MetaToken = require("./../../MetaToken");
const MorphLang = require("./../../../morph/MorphLang");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const TerminCollection = require("./../../core/TerminCollection");
const PhoneItemTokenPhoneItemType = require("./PhoneItemTokenPhoneItemType");
const Termin = require("./../../core/Termin");
const PhoneKind = require("./../PhoneKind");
const NumberHelper = require("./../../core/NumberHelper");
const PhoneHelper = require("./PhoneHelper");
const NumberToken = require("./../../NumberToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const TextToken = require("./../../TextToken");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");

/**
 * Примитив, из которых состоит телефонный номер
 */
class PhoneItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.item_type = PhoneItemTokenPhoneItemType.NUMBER;
        this.value = null;
        this.kind = PhoneKind.UNDEFINED;
        this.is_in_brackets = false;
    }
    
    get can_be_country_prefix() {
        if (this.value !== null && PhoneHelper.get_country_prefix(this.value) === this.value) 
            return true;
        else 
            return false;
    }
    
    toString() {
        return (this.item_type.toString() + ": " + this.value) + (((this.kind === PhoneKind.UNDEFINED ? "" : (" (" + String(this.kind) + ")"))));
    }
    
    /**
     * Привязать с указанной позиции один примитив
     * @param cnt 
     * @param indFrom 
     * @return 
     */
    static try_attach(t0) {
        let res = PhoneItemToken._try_attach(t0);
        if (res === null) 
            return null;
        if (res.item_type !== PhoneItemTokenPhoneItemType.PREFIX) 
            return res;
        for (let t = res.end_token.next; t !== null; t = t.next) {
            if (t.is_table_control_char) 
                break;
            if (t.is_newline_before) 
                break;
            let res2 = PhoneItemToken._try_attach(t);
            if (res2 !== null) {
                if (res2.item_type === PhoneItemTokenPhoneItemType.PREFIX) {
                    if (res.kind === PhoneKind.UNDEFINED) 
                        res.kind = res2.kind;
                    t = res.end_token = res2.end_token;
                    continue;
                }
                break;
            }
            if (t.is_char(':')) {
                res.end_token = t;
                break;
            }
            if (!((t instanceof TextToken))) 
                break;
            if (t0.length_char === 1) 
                break;
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                t = npt.end_token;
                if (t.is_value("ПОСЕЛЕНИЕ", null)) 
                    return null;
                res.end_token = t;
                continue;
            }
            if (t.get_morph_class_in_dictionary().is_proper) {
                res.end_token = t;
                continue;
            }
            if (t.morph.class0.is_preposition) 
                continue;
            break;
        }
        return res;
    }
    
    static _try_attach(t0) {
        if (t0 === null) 
            return null;
        if (t0 instanceof NumberToken) {
            if (NumberHelper.try_parse_number_with_postfix(t0) !== null && !t0.is_whitespace_after) {
                let rt = t0.kit.process_referent("PHONE", t0.next);
                if (rt === null) 
                    return null;
            }
            if ((t0).typ === NumberSpellingType.DIGIT && !t0.morph.class0.is_adjective) 
                return PhoneItemToken._new2613(t0, t0, PhoneItemTokenPhoneItemType.NUMBER, t0.get_source_text());
            return null;
        }
        if (t0.is_char('.')) 
            return PhoneItemToken._new2613(t0, t0, PhoneItemTokenPhoneItemType.DELIM, ".");
        if (t0.is_hiphen) 
            return PhoneItemToken._new2613(t0, t0, PhoneItemTokenPhoneItemType.DELIM, "-");
        if (t0.is_char('+')) {
            if (!((t0.next instanceof NumberToken)) || (t0.next).typ !== NumberSpellingType.DIGIT) 
                return null;
            else {
                let val = t0.next.get_source_text();
                let i = 0;
                for (i = 0; i < val.length; i++) {
                    if (val[i] !== '0') 
                        break;
                }
                if (i >= val.length) 
                    return null;
                if (i > 0) 
                    val = val.substring(i);
                return PhoneItemToken._new2613(t0, t0.next, PhoneItemTokenPhoneItemType.COUNTRYCODE, val);
            }
        }
        if (t0.is_char(String.fromCharCode(0x2011)) && (t0.next instanceof NumberToken) && t0.next.length_char === 2) 
            return PhoneItemToken._new2613(t0, t0, PhoneItemTokenPhoneItemType.DELIM, "-");
        if (t0.is_char_of("(")) {
            if (t0.next instanceof NumberToken) {
                let et = t0.next;
                let val = new StringBuilder();
                for (; et !== null; et = et.next) {
                    if (et.is_char(')')) 
                        break;
                    if (((et instanceof NumberToken)) && (et).typ === NumberSpellingType.DIGIT) 
                        val.append(et.get_source_text());
                    else if (!et.is_hiphen && !et.is_char('.')) 
                        return null;
                }
                if (et === null || val.length === 0) 
                    return null;
                else 
                    return PhoneItemToken._new2618(t0, et, PhoneItemTokenPhoneItemType.CITYCODE, val.toString(), true);
            }
            else {
                let tt1 = PhoneItemToken.m_phone_termins.try_parse(t0.next, TerminParseAttr.NO);
                if (tt1 === null || tt1.termin.tag !== null) {
                }
                else if (tt1.end_token.next === null || !tt1.end_token.next.is_char(')')) {
                }
                else 
                    return PhoneItemToken._new2619(t0, tt1.end_token.next, PhoneItemTokenPhoneItemType.PREFIX, true, "");
                return null;
            }
        }
        if ((t0.is_char('/') && (t0.next instanceof NumberToken) && t0.next.next !== null) && t0.next.next.is_char('/') && t0.next.length_char === 3) 
            return PhoneItemToken._new2618(t0, t0.next.next, PhoneItemTokenPhoneItemType.CITYCODE, (t0.next).value.toString(), true);
        let t1 = null;
        let ki = PhoneKind.UNDEFINED;
        if ((t0.is_value("Т", null) && t0.next !== null && t0.next.is_char_of("\\/")) && t0.next.next !== null && ((t0.next.next.is_value("Р", null) || t0.next.next.is_value("М", null)))) {
            t1 = t0.next.next;
            ki = (t1.is_value("Р", null) ? PhoneKind.WORK : PhoneKind.MOBILE);
        }
        else {
            let tt = PhoneItemToken.m_phone_termins.try_parse(t0, TerminParseAttr.NO);
            if (tt === null || tt.termin.tag !== null) {
                if (t0.is_value("НОМЕР", null)) {
                    let rr = PhoneItemToken._try_attach(t0.next);
                    if (rr !== null && rr.item_type === PhoneItemTokenPhoneItemType.PREFIX) {
                        rr.begin_token = t0;
                        return rr;
                    }
                }
                return null;
            }
            if (tt.termin.tag2 instanceof PhoneKind) 
                ki = PhoneKind.of(tt.termin.tag2);
            t1 = tt.end_token;
        }
        let res = PhoneItemToken._new2621(t0, t1, PhoneItemTokenPhoneItemType.PREFIX, "", ki);
        while (true) {
            if (t1.next !== null && t1.next.is_char_of(".:")) 
                res.end_token = (t1 = t1.next);
            else if (t1.next !== null && t1.next.is_table_control_char) 
                t1 = t1.next;
            else 
                break;
        }
        if (t0 === t1 && ((t0.begin_char === t0.end_char || t0.chars.is_all_upper))) {
            if (!t0.is_whitespace_after) 
                return null;
        }
        return res;
    }
    
    static try_attach_additional(t0) {
        let t = t0;
        if (t === null) 
            return null;
        if (t.is_char(',')) 
            t = t.next;
        else if (t.is_char_of("*#") && (t.next instanceof NumberToken)) {
            let val0 = (t.next).get_source_text();
            let t1 = t.next;
            if ((t1.next !== null && t1.next.is_hiphen && !t1.is_whitespace_after) && (t1.next.next instanceof NumberToken) && !t1.next.is_whitespace_after) {
                t1 = t1.next.next;
                val0 += t1.get_source_text();
            }
            if (val0.length >= 3 && (val0.length < 7)) 
                return PhoneItemToken._new2613(t, t1, PhoneItemTokenPhoneItemType.ADDNUMBER, val0);
        }
        let br = false;
        if (t !== null && t.is_char('(')) {
            br = true;
            t = t.next;
        }
        let to = PhoneItemToken.m_phone_termins.try_parse(t, TerminParseAttr.NO);
        if (to === null) {
            if (!br) 
                return null;
            if (t0.whitespaces_before_count > 1) 
                return null;
        }
        else if (to.termin.tag === null) 
            return null;
        else 
            t = to.end_token.next;
        if (t === null) 
            return null;
        if (((t.is_value("НОМЕР", null) || t.is_value("N", null) || t.is_value("#", null)) || t.is_value("№", null) || t.is_value("NUMBER", null)) || ((t.is_char('+') && br))) 
            t = t.next;
        else if (to === null && !br) 
            return null;
        else if (t.is_value("НОМ", null) || t.is_value("ТЕЛ", null)) {
            t = t.next;
            if (t !== null && t.is_char('.')) 
                t = t.next;
        }
        if (t !== null && t.is_char_of(":,") && !t.is_newline_after) 
            t = t.next;
        if (!((t instanceof NumberToken))) 
            return null;
        let val = (t).get_source_text();
        if ((t.next !== null && t.next.is_hiphen && !t.is_whitespace_after) && (t.next.next instanceof NumberToken)) {
            val += t.next.next.get_source_text();
            t = t.next.next;
        }
        if ((val.length < 2) || val.length > 7) 
            return null;
        if (br) {
            if (t.next === null || !t.next.is_char(')')) 
                return null;
            t = t.next;
        }
        let res = PhoneItemToken._new2613(t0, t, PhoneItemTokenPhoneItemType.ADDNUMBER, val);
        return res;
    }
    
    /**
     * Привязать примитивы в контейнере с указанной позиции
     * @param cnt 
     * @param indFrom 
     * @return Список примитивов
     */
    static try_attach_all(t0) {
        if (t0 === null) 
            return null;
        let p = PhoneItemToken.try_attach(t0);
        let br = false;
        if (p === null && t0.is_char('(')) {
            br = true;
            p = PhoneItemToken.try_attach(t0.next);
            if (p !== null) {
                p.begin_token = t0;
                p.is_in_brackets = true;
                if (p.item_type === PhoneItemTokenPhoneItemType.PREFIX) 
                    br = false;
            }
        }
        if (p === null || p.item_type === PhoneItemTokenPhoneItemType.DELIM) 
            return null;
        let res = new Array();
        res.push(p);
        let t = null;
        for (t = p.end_token.next; t !== null; t = t.next) {
            if (t.is_table_control_char) {
                if (res.length === 1 && res[0].item_type === PhoneItemTokenPhoneItemType.PREFIX) 
                    continue;
                else 
                    break;
            }
            if (br && t.is_char(')')) {
                br = false;
                continue;
            }
            let p0 = PhoneItemToken.try_attach(t);
            if (p0 === null) {
                if (t.is_newline_before) 
                    break;
                if (p.item_type === PhoneItemTokenPhoneItemType.PREFIX && ((t.is_char_of("\\/") || t.is_hiphen))) {
                    p0 = PhoneItemToken.try_attach(t.next);
                    if (p0 !== null && p0.item_type === PhoneItemTokenPhoneItemType.PREFIX) {
                        p.end_token = p0.end_token;
                        t = p.end_token;
                        continue;
                    }
                }
                if ((res[0].item_type === PhoneItemTokenPhoneItemType.PREFIX && t.is_char_of("\\/") && !t.is_whitespace_after) && !t.is_whitespace_before && (t.next instanceof NumberToken)) {
                    let sum_num = 0;
                    for (const pp of res) {
                        if (pp.item_type === PhoneItemTokenPhoneItemType.CITYCODE || pp.item_type === PhoneItemTokenPhoneItemType.COUNTRYCODE || pp.item_type === PhoneItemTokenPhoneItemType.NUMBER) 
                            sum_num += pp.value.length;
                    }
                    if (sum_num < 7) {
                        for (let tt = t.next; tt !== null; tt = tt.next) {
                            if (tt.is_whitespace_before) 
                                break;
                            else if (tt instanceof NumberToken) 
                                sum_num += tt.length_char;
                            else if ((tt instanceof TextToken) && !tt.chars.is_letter) {
                            }
                            else 
                                break;
                        }
                        if (sum_num === 10 || sum_num === 11) 
                            continue;
                    }
                }
                if (p0 === null) 
                    break;
            }
            if (t.is_newline_before) {
                if (p.item_type === PhoneItemTokenPhoneItemType.PREFIX) {
                }
                else 
                    break;
            }
            if (t.whitespaces_before_count > 1) {
                let ok = false;
                for (const pp of res) {
                    if (pp.item_type === PhoneItemTokenPhoneItemType.PREFIX || pp.item_type === PhoneItemTokenPhoneItemType.COUNTRYCODE) {
                        ok = true;
                        break;
                    }
                }
                if (!ok) 
                    break;
            }
            if (br && p.item_type === PhoneItemTokenPhoneItemType.NUMBER) 
                p.item_type = PhoneItemTokenPhoneItemType.CITYCODE;
            p = p0;
            if (p.item_type === PhoneItemTokenPhoneItemType.NUMBER && res[res.length - 1].item_type === PhoneItemTokenPhoneItemType.NUMBER) 
                res.push(PhoneItemToken._new2613(t, t, PhoneItemTokenPhoneItemType.DELIM, " "));
            if (br) 
                p.is_in_brackets = true;
            res.push(p);
            t = p.end_token;
        }
        if ((((p = PhoneItemToken.try_attach_additional(t)))) !== null) 
            res.push(p);
        for (let i = 1; i < (res.length - 1); i++) {
            if (res[i].item_type === PhoneItemTokenPhoneItemType.DELIM && res[i + 1].is_in_brackets) {
                res.splice(i, 1);
                break;
            }
            else if (res[i].item_type === PhoneItemTokenPhoneItemType.DELIM && res[i + 1].item_type === PhoneItemTokenPhoneItemType.DELIM) {
                res[i].end_token = res[i + 1].end_token;
                res.splice(i + 1, 1);
                i--;
            }
        }
        if ((res.length > 1 && res[0].is_in_brackets && res[0].item_type === PhoneItemTokenPhoneItemType.PREFIX) && res[res.length - 1].end_token.next !== null && res[res.length - 1].end_token.next.is_char(')')) 
            res[res.length - 1].end_token = res[res.length - 1].end_token.next;
        if (res[0].item_type === PhoneItemTokenPhoneItemType.PREFIX) {
            for (let i = 2; i < (res.length - 1); i++) {
                if (res[i].item_type === PhoneItemTokenPhoneItemType.PREFIX && res[i + 1].item_type !== PhoneItemTokenPhoneItemType.PREFIX) {
                    res.splice(i, res.length - i);
                    break;
                }
            }
        }
        while (res.length > 0) {
            if (res[res.length - 1].item_type === PhoneItemTokenPhoneItemType.DELIM) 
                res.splice(res.length - 1, 1);
            else 
                break;
        }
        return res;
    }
    
    static try_attach_alternate(t0, ph0, pli) {
        if (t0 === null) 
            return null;
        if (t0.is_char_of("\\/") && (t0.next instanceof NumberToken) && (t0.next.end_char - t0.next.begin_char) <= 1) {
            let pli1 = PhoneItemToken.try_attach_all(t0.next);
            if (pli1 !== null && pli1.length > 1) {
                if (pli1[pli1.length - 1].item_type === PhoneItemTokenPhoneItemType.DELIM) 
                    pli1.splice(pli1.length - 1, 1);
                if (pli1.length <= pli.length) {
                    let ii = 0;
                    let num = "";
                    for (ii = 0; ii < pli1.length; ii++) {
                        let p1 = pli1[ii];
                        let p0 = pli[(pli.length - pli1.length) + ii];
                        if (p1.item_type !== p0.item_type) 
                            break;
                        if (p1.item_type !== PhoneItemTokenPhoneItemType.NUMBER && p1.item_type !== PhoneItemTokenPhoneItemType.DELIM) 
                            break;
                        if (p1.item_type === PhoneItemTokenPhoneItemType.NUMBER) {
                            if (p1.length_char !== p0.length_char) 
                                break;
                            num += p1.value;
                        }
                    }
                    if (ii >= pli1.length) 
                        return PhoneItemToken._new2613(t0, pli1[pli1.length - 1].end_token, PhoneItemTokenPhoneItemType.ALT, num);
                }
            }
            return PhoneItemToken._new2613(t0, t0.next, PhoneItemTokenPhoneItemType.ALT, t0.next.get_source_text());
        }
        if (t0.is_hiphen && (t0.next instanceof NumberToken) && (t0.next.end_char - t0.next.begin_char) <= 1) {
            let t1 = t0.next.next;
            let ok = false;
            if (t1 === null) 
                ok = true;
            else if (t1.is_newline_before || t1.is_char_of(",.")) 
                ok = true;
            if (ok) 
                return PhoneItemToken._new2613(t0, t0.next, PhoneItemTokenPhoneItemType.ALT, t0.next.get_source_text());
        }
        if ((t0.is_char('(') && (t0.next instanceof NumberToken) && (t0.next.end_char - t0.next.begin_char) === 1) && t0.next.next !== null && t0.next.next.is_char(')')) 
            return PhoneItemToken._new2613(t0, t0.next.next, PhoneItemTokenPhoneItemType.ALT, t0.next.get_source_text());
        if ((t0.is_char_of("/-") && (t0.next instanceof NumberToken) && ph0.m_template !== null) && LanguageHelper.ends_with(ph0.m_template, ((t0.next.end_char - t0.next.begin_char) + 1).toString())) 
            return PhoneItemToken._new2613(t0, t0.next, PhoneItemTokenPhoneItemType.ALT, t0.next.get_source_text());
        return null;
    }
    
    static initialize() {
        if (PhoneItemToken.m_phone_termins !== null) 
            return;
        PhoneItemToken.m_phone_termins = new TerminCollection();
        let t = null;
        t = new Termin("ТЕЛЕФОН", MorphLang.RU, true);
        t.add_abridge("ТЕЛ.");
        t.add_abridge("TEL.");
        t.add_abridge("Т-Н");
        t.add_abridge("Т.");
        t.add_abridge("T.");
        t.add_abridge("TEL.EXT.");
        t.add_variant("ТЛФ", false);
        t.add_variant("ТЛФН", false);
        t.add_abridge("Т/Ф");
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("МОБИЛЬНЫЙ", MorphLang.RU, true, PhoneKind.MOBILE);
        t.add_abridge("МОБ.");
        t.add_abridge("Т.М.");
        t.add_abridge("М.Т.");
        t.add_abridge("М.");
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("СОТОВЫЙ", MorphLang.RU, true, PhoneKind.MOBILE);
        t.add_abridge("СОТ.");
        t.add_abridge("CELL.");
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("РАБОЧИЙ", MorphLang.RU, true, PhoneKind.WORK);
        t.add_abridge("РАБ.");
        t.add_abridge("Т.Р.");
        t.add_abridge("Р.Т.");
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("ГОРОДСКОЙ", MorphLang.RU, true);
        t.add_abridge("ГОР.");
        t.add_abridge("Г.Т.");
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("ДОМАШНИЙ", MorphLang.RU, true, PhoneKind.HOME);
        t.add_abridge("ДОМ.");
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("КОНТАКТНЫЙ", MorphLang.RU, true);
        t.add_variant("КОНТАКТНЫЕ ДАННЫЕ", false);
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("МНОГОКАНАЛЬНЫЙ", MorphLang.RU, true);
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("ФАКС", MorphLang.RU, true, PhoneKind.FAX);
        t.add_abridge("Ф.");
        t.add_abridge("Т/ФАКС");
        t.add_abridge("ТЕЛ/ФАКС");
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("ЗВОНИТЬ", MorphLang.RU, true);
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("ПРИЕМНАЯ", MorphLang.RU, true, PhoneKind.WORK);
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("PHONE", MorphLang.EN, true);
        t.add_abridge("PH.");
        t.add_variant("TELEFON", true);
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("DIRECT LINE", MorphLang.EN, true, PhoneKind.WORK);
        t.add_variant("DIRECT LINES", true);
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("MOBILE", MorphLang.EN, true, PhoneKind.MOBILE);
        t.add_abridge("MOB.");
        t.add_variant("MOBIL", true);
        t.add_abridge("M.");
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("FAX", MorphLang.EN, true, PhoneKind.FAX);
        t.add_abridge("F.");
        PhoneItemToken.m_phone_termins.add(t);
        t = Termin._new2630("HOME", MorphLang.EN, true, PhoneKind.HOME);
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("CALL", MorphLang.EN, true);
        t.add_variant("SEDIU", true);
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("ДОПОЛНИТЕЛЬНЫЙ", MorphLang.RU, true);
        t.tag = t;
        t.add_abridge("ДОП.");
        t.add_abridge("EXT.");
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("ДОБАВОЧНЫЙ", MorphLang.RU, true);
        t.tag = t;
        t.add_abridge("ДОБ.");
        t.add_abridge("Д.");
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("ВНУТРЕННИЙ", MorphLang.RU, true);
        t.tag = t;
        t.add_abridge("ВНУТР.");
        t.add_abridge("ВН.");
        t.add_abridge("ВНТ.");
        t.add_abridge("Т.ВН.");
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("TONE MODE", MorphLang.EN, true);
        t.tag = t;
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("TONE", MorphLang.EN, true);
        t.tag = t;
        PhoneItemToken.m_phone_termins.add(t);
        t = new Termin("ADDITIONAL", MorphLang.EN, true);
        t.add_abridge("ADD.");
        t.tag = t;
        t.add_variant("INTERNAL", true);
        t.add_abridge("INT.");
        PhoneItemToken.m_phone_termins.add(t);
    }
    
    static _new2613(_arg1, _arg2, _arg3, _arg4) {
        let res = new PhoneItemToken(_arg1, _arg2);
        res.item_type = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new2618(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PhoneItemToken(_arg1, _arg2);
        res.item_type = _arg3;
        res.value = _arg4;
        res.is_in_brackets = _arg5;
        return res;
    }
    
    static _new2619(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PhoneItemToken(_arg1, _arg2);
        res.item_type = _arg3;
        res.is_in_brackets = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static _new2621(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PhoneItemToken(_arg1, _arg2);
        res.item_type = _arg3;
        res.value = _arg4;
        res.kind = _arg5;
        return res;
    }
    
    static static_constructor() {
        PhoneItemToken.m_phone_termins = null;
    }
}


PhoneItemToken.static_constructor();

module.exports = PhoneItemToken