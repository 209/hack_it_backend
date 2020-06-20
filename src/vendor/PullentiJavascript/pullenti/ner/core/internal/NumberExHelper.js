/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const EpNerCoreInternalResourceHelper = require("./EpNerCoreInternalResourceHelper");
const Token = require("./../../Token");
const MorphLang = require("./../../../morph/MorphLang");
const TextToken = require("./../../TextToken");
const NumberExToken = require("./../NumberExToken");
const NumberSpellingType = require("./../../NumberSpellingType");
const NumberToken = require("./../../NumberToken");
const NumberExType = require("./../NumberExType");
const TerminParseAttr = require("./../TerminParseAttr");
const Termin = require("./../Termin");
const TerminCollection = require("./../TerminCollection");
const NumberHelper = require("./../NumberHelper");
const BracketParseAttr = require("./../BracketParseAttr");
const BracketHelper = require("./../BracketHelper");

class NumberExHelper {
    
    /**
     * Выделение стандартных мер, типа: 10 кв.м.
     */
    static try_parse_number_with_postfix(t) {
        if (t === null) 
            return null;
        let t0 = t;
        let is_dollar = null;
        if (t.length_char === 1 && t.next !== null) {
            if ((((is_dollar = NumberHelper.is_money_char(t)))) !== null) 
                t = t.next;
        }
        let nt = Utils.as(t, NumberToken);
        if (nt === null) {
            if ((!((t.previous instanceof NumberToken)) && t.is_char('(') && (t.next instanceof NumberToken)) && t.next.next !== null && t.next.next.is_char(')')) {
                let toks1 = NumberExHelper.m_postfixes.try_parse(t.next.next.next, TerminParseAttr.NO);
                if (toks1 !== null && (NumberExType.of(toks1.termin.tag)) === NumberExType.MONEY) {
                    let nt0 = Utils.as(t.next, NumberToken);
                    let res = NumberExToken._new472(t, toks1.end_token, nt0.value, nt0.typ, NumberExType.MONEY, nt0.real_value, toks1.begin_token.morph);
                    return NumberExHelper._correct_money(res, toks1.begin_token);
                }
            }
            let tt = Utils.as(t, TextToken);
            if (tt === null || !tt.morph.class0.is_adjective) 
                return null;
            let val = tt.term;
            for (let i = 4; i < (val.length - 5); i++) {
                let v = val.substring(0, 0 + i);
                let li = NumberHelper.m_nums.try_attach_str(v, tt.morph.language);
                if (li === null) 
                    continue;
                let vv = val.substring(i);
                let lii = NumberExHelper.m_postfixes.try_attach_str(vv, tt.morph.language);
                if (lii !== null && lii.length > 0) {
                    let re = NumberExToken._new473(t, t, (li[0].tag).toString(), NumberSpellingType.WORDS, NumberExType.of(lii[0].tag), t.morph);
                    NumberExHelper._correct_ext_types(re);
                    return re;
                }
                break;
            }
            return null;
        }
        if (t.next === null && is_dollar === null) 
            return null;
        let f = nt.real_value;
        if (isNaN(f)) 
            return null;
        let t1 = nt.next;
        if (((t1 !== null && t1.is_char_of(",."))) || (((t1 instanceof NumberToken) && (t1.whitespaces_before_count < 3)))) {
            let d = 0;
            let tt11 = NumberHelper.try_parse_real_number(nt, false, false);
            if (tt11 !== null) {
                t1 = tt11.end_token.next;
                f = tt11.real_value;
            }
        }
        if (t1 === null) {
            if (is_dollar === null) 
                return null;
        }
        else if ((t1.next !== null && t1.next.is_value("С", "З") && t1.next.next !== null) && t1.next.next.is_value("ПОЛОВИНА", null)) {
            f += 0.5;
            t1 = t1.next.next;
        }
        if (t1 !== null && t1.is_hiphen && t1.next !== null) 
            t1 = t1.next;
        let det = false;
        let altf = f;
        if (((t1 instanceof NumberToken) && t1.previous !== null && t1.previous.is_hiphen) && (t1).int_value === 0 && t1.length_char === 2) 
            t1 = t1.next;
        if ((t1 !== null && t1.next !== null && t1.is_char('(')) && (((t1.next instanceof NumberToken) || t1.next.is_value("НОЛЬ", null))) && t1.next.next !== null) {
            let nt1 = Utils.as(t1.next, NumberToken);
            let val = 0;
            if (nt1 !== null) 
                val = nt1.real_value;
            if (Math.floor(f) === Math.floor(val)) {
                let ttt = t1.next.next;
                if (ttt.is_char(')')) {
                    t1 = ttt.next;
                    det = true;
                    if ((t1 instanceof NumberToken) && (t1).int_value !== null && (t1).int_value === 0) 
                        t1 = t1.next;
                }
                else if (((((ttt instanceof NumberToken) && ((ttt).real_value < 100) && ttt.next !== null) && ttt.next.is_char('/') && ttt.next.next !== null) && ttt.next.next.get_source_text() === "100" && ttt.next.next.next !== null) && ttt.next.next.next.is_char(')')) {
                    let rest = NumberExHelper.get_decimal_rest100(f);
                    if ((ttt).int_value !== null && rest === (ttt).int_value) {
                        t1 = ttt.next.next.next.next;
                        det = true;
                    }
                }
                else if ((ttt.is_value("ЦЕЛЫХ", null) && (ttt.next instanceof NumberToken) && ttt.next.next !== null) && ttt.next.next.next !== null && ttt.next.next.next.is_char(')')) {
                    let num2 = Utils.as(ttt.next, NumberToken);
                    altf = num2.real_value;
                    if (ttt.next.next.is_value("ДЕСЯТЫЙ", null)) 
                        altf /= (10);
                    else if (ttt.next.next.is_value("СОТЫЙ", null)) 
                        altf /= (100);
                    else if (ttt.next.next.is_value("ТЫСЯЧНЫЙ", null)) 
                        altf /= (1000);
                    else if (ttt.next.next.is_value("ДЕСЯТИТЫСЯЧНЫЙ", null)) 
                        altf /= (10000);
                    else if (ttt.next.next.is_value("СТОТЫСЯЧНЫЙ", null)) 
                        altf /= (100000);
                    else if (ttt.next.next.is_value("МИЛЛИОННЫЙ", null)) 
                        altf /= (1000000);
                    if (altf < 1) {
                        altf += val;
                        t1 = ttt.next.next.next.next;
                        det = true;
                    }
                }
                else {
                    let toks1 = NumberExHelper.m_postfixes.try_parse(ttt, TerminParseAttr.NO);
                    if (toks1 !== null) {
                        if ((NumberExType.of(toks1.termin.tag)) === NumberExType.MONEY) {
                            if (toks1.end_token.next !== null && toks1.end_token.next.is_char(')')) {
                                let res = NumberExToken._new474(t, toks1.end_token.next, nt.value, nt.typ, NumberExType.MONEY, f, altf, toks1.begin_token.morph);
                                return NumberExHelper._correct_money(res, toks1.begin_token);
                            }
                        }
                    }
                    let res2 = NumberExHelper.try_parse_number_with_postfix(t1.next);
                    if (res2 !== null && res2.end_token.next !== null && res2.end_token.next.is_char(')')) {
                        res2.begin_token = t;
                        res2.end_token = res2.end_token.next;
                        res2.alt_real_value = res2.real_value;
                        res2.real_value = f;
                        NumberExHelper._correct_ext_types(res2);
                        if (res2.whitespaces_after_count < 2) {
                            let toks2 = NumberExHelper.m_postfixes.try_parse(res2.end_token.next, TerminParseAttr.NO);
                            if (toks2 !== null) {
                                if ((NumberExType.of(toks2.termin.tag)) === NumberExType.MONEY) 
                                    res2.end_token = toks2.end_token;
                            }
                        }
                        return res2;
                    }
                }
            }
            else if (nt1 !== null && nt1.typ === NumberSpellingType.WORDS && nt.typ === NumberSpellingType.DIGIT) {
                altf = nt1.real_value;
                let ttt = t1.next.next;
                if (ttt.is_char(')')) {
                    t1 = ttt.next;
                    det = true;
                }
                if (!det) 
                    altf = f;
            }
        }
        if ((t1 !== null && t1.is_char('(') && t1.next !== null) && t1.next.is_value("СУММА", null)) {
            let br = BracketHelper.try_parse(t1, BracketParseAttr.NO, 100);
            if (br !== null) 
                t1 = br.end_token.next;
        }
        if (is_dollar !== null) {
            let te = null;
            if (t1 !== null) 
                te = t1.previous;
            else 
                for (t1 = t0; t1 !== null; t1 = t1.next) {
                    if (t1.next === null) 
                        te = t1;
                }
            if (te === null) 
                return null;
            if (te.is_hiphen && te.next !== null) {
                if (te.next.is_value("МИЛЛИОННЫЙ", null)) {
                    f *= (1000000);
                    altf *= (1000000);
                    te = te.next;
                }
                else if (te.next.is_value("МИЛЛИАРДНЫЙ", null)) {
                    f *= (1000000000);
                    altf *= (1000000000);
                    te = te.next;
                }
            }
            if (!te.is_whitespace_after && (te.next instanceof TextToken)) {
                if (te.next.is_value("M", null)) {
                    f *= (1000000);
                    altf *= (1000000);
                    te = te.next;
                }
                else if (te.next.is_value("BN", null)) {
                    f *= (1000000000);
                    altf *= (1000000000);
                    te = te.next;
                }
            }
            return NumberExToken._new475(t0, te, "", nt.typ, NumberExType.MONEY, f, altf, is_dollar);
        }
        if (t1 === null || ((t1.is_newline_before && !det))) 
            return null;
        let toks = NumberExHelper.m_postfixes.try_parse(t1, TerminParseAttr.NO);
        if ((toks === null && det && (t1 instanceof NumberToken)) && (t1).value === "0") 
            toks = NumberExHelper.m_postfixes.try_parse(t1.next, TerminParseAttr.NO);
        if (toks !== null) {
            t1 = toks.end_token;
            if (!t1.is_char('.') && t1.next !== null && t1.next.is_char('.')) {
                if ((t1 instanceof TextToken) && t1.is_value(toks.termin.terms[0].canonical_text, null)) {
                }
                else if (!t1.chars.is_letter) {
                }
                else 
                    t1 = t1.next;
            }
            if (toks.termin.canonic_text === "LTL") 
                return null;
            if (toks.begin_token === t1) {
                if (t1.morph.class0.is_preposition || t1.morph.class0.is_conjunction) {
                    if (t1.is_whitespace_before && t1.is_whitespace_after) 
                        return null;
                }
            }
            let ty = NumberExType.of(toks.termin.tag);
            let res = NumberExToken._new474(t, t1, nt.value, nt.typ, ty, f, altf, toks.begin_token.morph);
            if (ty !== NumberExType.MONEY) {
                NumberExHelper._correct_ext_types(res);
                return res;
            }
            return NumberExHelper._correct_money(res, toks.begin_token);
        }
        let pfx = NumberExHelper._attach_spec_postfix(t1);
        if (pfx !== null) {
            pfx.begin_token = t;
            pfx.value = nt.value;
            pfx.typ = nt.typ;
            pfx.real_value = f;
            pfx.alt_real_value = altf;
            return pfx;
        }
        if (t1.next !== null && ((t1.morph.class0.is_preposition || t1.morph.class0.is_conjunction))) {
            if (t1.is_value("НА", null)) {
            }
            else {
                let nn = NumberExHelper.try_parse_number_with_postfix(t1.next);
                if (nn !== null) 
                    return NumberExToken._new477(t, t, nt.value, nt.typ, nn.ex_typ, f, altf, nn.ex_typ2, nn.ex_typ_param);
            }
        }
        if (!t1.is_whitespace_after && (t1.next instanceof NumberToken) && (t1 instanceof TextToken)) {
            let term = (t1).term;
            let ty = NumberExType.UNDEFINED;
            if (term === "СМХ" || term === "CMX") 
                ty = NumberExType.SANTIMETER;
            else if (term === "MX" || term === "МХ") 
                ty = NumberExType.METER;
            else if (term === "MMX" || term === "ММХ") 
                ty = NumberExType.MILLIMETER;
            if (ty !== NumberExType.UNDEFINED) 
                return NumberExToken._new478(t, t1, nt.value, nt.typ, ty, f, altf, true);
        }
        return null;
    }
    
    static get_decimal_rest100(f) {
        let rest = Utils.intDiv((Math.floor(((((f - Utils.mathTruncate(f)) + 0.0001)) * (10000)))), 100);
        return rest;
    }
    
    /**
     * Это попробовать только тип (постфикс) без самого числа
     * @param t 
     * @return 
     */
    static try_attach_postfix_only(t) {
        if (t === null) 
            return null;
        let tok = NumberExHelper.m_postfixes.try_parse(t, TerminParseAttr.NO);
        let res = null;
        if (tok !== null) 
            res = NumberExToken._new479(t, tok.end_token, "", NumberSpellingType.DIGIT, NumberExType.of(tok.termin.tag), tok.termin);
        else 
            res = NumberExHelper._attach_spec_postfix(t);
        if (res !== null) 
            NumberExHelper._correct_ext_types(res);
        return res;
    }
    
    static _attach_spec_postfix(t) {
        if (t === null) 
            return null;
        if (t.is_char_of("%")) 
            return new NumberExToken(t, t, "", NumberSpellingType.DIGIT, NumberExType.PERCENT);
        let money = NumberHelper.is_money_char(t);
        if (money !== null) 
            return NumberExToken._new480(t, t, "", NumberSpellingType.DIGIT, NumberExType.MONEY, money);
        return null;
    }
    
    static _correct_ext_types(ex) {
        let t = ex.end_token.next;
        if (t === null) 
            return;
        let ty = ex.ex_typ;
        let wrapty482 = new RefOutArgWrapper(ty);
        let tt = NumberExHelper._corr_ex_typ2(t, wrapty482);
        ty = wrapty482.value;
        if (tt !== null) {
            ex.ex_typ = ty;
            ex.end_token = tt;
            t = tt.next;
        }
        if (t === null || t.next === null) 
            return;
        if (t.is_char_of("/\\") || t.is_value("НА", null)) {
        }
        else 
            return;
        let tok = NumberExHelper.m_postfixes.try_parse(t.next, TerminParseAttr.NO);
        if (tok !== null && (((NumberExType.of(tok.termin.tag)) !== NumberExType.MONEY))) {
            ex.ex_typ2 = NumberExType.of(tok.termin.tag);
            ex.end_token = tok.end_token;
            ty = ex.ex_typ2;
            let wrapty481 = new RefOutArgWrapper(ty);
            tt = NumberExHelper._corr_ex_typ2(ex.end_token.next, wrapty481);
            ty = wrapty481.value;
            if (tt !== null) {
                ex.ex_typ2 = ty;
                ex.end_token = tt;
                t = tt.next;
            }
        }
    }
    
    static _corr_ex_typ2(t, typ) {
        if (t === null) 
            return null;
        let num = 0;
        let tt = t;
        if (t.is_char('³')) 
            num = 3;
        else if (t.is_char('²')) 
            num = 2;
        else if (!t.is_whitespace_before && (t instanceof NumberToken) && (((t).value === "3" || (t).value === "2"))) 
            num = (t).int_value;
        else if ((t.is_char('<') && (t.next instanceof NumberToken) && t.next.next !== null) && t.next.next.is_char('>') && (t.next).int_value !== null) {
            num = (t.next).int_value;
            tt = t.next.next;
        }
        if (num === 3) {
            if (typ.value === NumberExType.METER) {
                typ.value = NumberExType.METER3;
                return tt;
            }
            if (typ.value === NumberExType.SANTIMETER) {
                typ.value = NumberExType.SANTIMETER3;
                return tt;
            }
        }
        if (num === 2) {
            if (typ.value === NumberExType.METER) {
                typ.value = NumberExType.METER2;
                return tt;
            }
            if (typ.value === NumberExType.SANTIMETER) {
                typ.value = NumberExType.SANTIMETER2;
                return tt;
            }
        }
        return null;
    }
    
    static _correct_money(res, t1) {
        if (t1 === null) 
            return null;
        let toks = NumberExHelper.m_postfixes.try_parse_all(t1, TerminParseAttr.NO, 0);
        if (toks === null || toks.length === 0) 
            return null;
        let tt = toks[0].end_token.next;
        let r = (tt === null ? null : tt.get_referent());
        let alpha2 = null;
        if (r !== null && r.type_name === "GEO") 
            alpha2 = r.get_string_value("ALPHA2");
        if (alpha2 !== null && toks.length > 0) {
            for (let i = toks.length - 1; i >= 0; i--) {
                if (!toks[i].termin.canonic_text.startsWith(alpha2)) 
                    toks.splice(i, 1);
            }
            if (toks.length === 0) 
                toks = NumberExHelper.m_postfixes.try_parse_all(t1, TerminParseAttr.NO, 0);
        }
        if (toks.length > 1) {
            alpha2 = null;
            let str = toks[0].termin.terms[0].canonical_text;
            if (str === "РУБЛЬ" || str === "RUBLE") 
                alpha2 = "RU";
            else if (str === "ДОЛЛАР" || str === "ДОЛАР" || str === "DOLLAR") 
                alpha2 = "US";
            else if (str === "ФУНТ" || str === "POUND") 
                alpha2 = "UK";
            if (alpha2 !== null) {
                for (let i = toks.length - 1; i >= 0; i--) {
                    if (!toks[i].termin.canonic_text.startsWith(alpha2)) 
                        toks.splice(i, 1);
                }
            }
            alpha2 = null;
        }
        if (toks.length < 1) 
            return null;
        res.ex_typ_param = toks[0].termin.canonic_text;
        if (alpha2 !== null && tt !== null) 
            res.end_token = tt;
        tt = res.end_token.next;
        if (tt !== null && tt.is_comma_and) 
            tt = tt.next;
        if ((tt instanceof NumberToken) && tt.next !== null && (tt.whitespaces_after_count < 4)) {
            let tt1 = tt.next;
            if ((tt1 !== null && tt1.is_char('(') && (tt1.next instanceof NumberToken)) && tt1.next.next !== null && tt1.next.next.is_char(')')) {
                if ((tt).value === (tt1.next).value) 
                    tt1 = tt1.next.next.next;
            }
            let tok = NumberExHelper.m_small_money.try_parse(tt1, TerminParseAttr.NO);
            if (tok === null && tt1 !== null && tt1.is_char(')')) 
                tok = NumberExHelper.m_small_money.try_parse(tt1.next, TerminParseAttr.NO);
            if (tok !== null && (tt).int_value !== null) {
                let max = tok.termin.tag;
                let val = (tt).int_value;
                if (val < max) {
                    let f = val;
                    f /= (max);
                    let f0 = res.real_value - (Math.floor(res.real_value));
                    let re0 = Math.floor(((f0 * (100)) + 0.0001));
                    if (re0 > 0 && val !== re0) 
                        res.alt_rest_money = val;
                    else if (f0 === 0) 
                        res.real_value = res.real_value + f;
                    f0 = res.alt_real_value - (Math.floor(res.alt_real_value));
                    re0 = Math.floor(((f0 * (100)) + 0.0001));
                    if (re0 > 0 && val !== re0) 
                        res.alt_rest_money = val;
                    else if (f0 === 0) 
                        res.alt_real_value += f;
                    res.end_token = tok.end_token;
                }
            }
        }
        else if ((tt instanceof TextToken) && tt.is_value("НОЛЬ", null)) {
            let tok = NumberExHelper.m_small_money.try_parse(tt.next, TerminParseAttr.NO);
            if (tok !== null) 
                res.end_token = tok.end_token;
        }
        return res;
    }
    
    static initialize() {
        if (NumberExHelper.m_postfixes !== null) 
            return;
        let t = null;
        NumberExHelper.m_postfixes = new TerminCollection();
        t = Termin._new483("КВАДРАТНЫЙ МЕТР", MorphLang.RU, true, "кв.м.", NumberExType.METER2);
        t.add_abridge("КВ.МЕТР");
        t.add_abridge("КВ.МЕТРА");
        t.add_abridge("КВ.М.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КВАДРАТНИЙ МЕТР", MorphLang.UA, true, "КВ.М.", NumberExType.METER2);
        t.add_abridge("КВ.МЕТР");
        t.add_abridge("КВ.МЕТРА");
        t.add_abridge("КВ.М.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КВАДРАТНЫЙ КИЛОМЕТР", MorphLang.RU, true, "кв.км.", NumberExType.KILOMETER2);
        t.add_variant("КВАДРАТНИЙ КІЛОМЕТР", true);
        t.add_abridge("КВ.КМ.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ГЕКТАР", MorphLang.RU, true, "га", NumberExType.GEKTAR);
        t.add_abridge("ГА");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("АР", MorphLang.RU, true, "ар", NumberExType.AR);
        t.add_variant("СОТКА", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КУБИЧЕСКИЙ МЕТР", MorphLang.RU, true, "куб.м.", NumberExType.METER3);
        t.add_variant("КУБІЧНИЙ МЕТР", true);
        t.add_abridge("КУБ.МЕТР");
        t.add_abridge("КУБ.М.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МЕТР", MorphLang.RU, true, "м.", NumberExType.METER);
        t.add_abridge("М.");
        t.add_abridge("M.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МЕТРОВЫЙ", MorphLang.RU, true, "м.", NumberExType.METER);
        t.add_variant("МЕТРОВИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МИЛЛИМЕТР", MorphLang.RU, true, "мм.", NumberExType.MILLIMETER);
        t.add_abridge("ММ");
        t.add_abridge("MM");
        t.add_variant("МІЛІМЕТР", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МИЛЛИМЕТРОВЫЙ", MorphLang.RU, true, "мм.", NumberExType.MILLIMETER);
        t.add_variant("МІЛІМЕТРОВИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("САНТИМЕТР", MorphLang.RU, true, "см.", NumberExType.SANTIMETER);
        t.add_abridge("СМ");
        t.add_abridge("CM");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("САНТИМЕТРОВЫЙ", MorphLang.RU, true, "см.", NumberExType.SANTIMETER);
        t.add_variant("САНТИМЕТРОВИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КВАДРАТНЫЙ САНТИМЕТР", MorphLang.RU, true, "кв.см.", NumberExType.SANTIMETER2);
        t.add_variant("КВАДРАТНИЙ САНТИМЕТР", true);
        t.add_abridge("КВ.СМ.");
        t.add_abridge("СМ.КВ.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КУБИЧЕСКИЙ САНТИМЕТР", MorphLang.RU, true, "куб.см.", NumberExType.SANTIMETER3);
        t.add_variant("КУБІЧНИЙ САНТИМЕТР", true);
        t.add_abridge("КУБ.САНТИМЕТР");
        t.add_abridge("КУБ.СМ.");
        t.add_abridge("СМ.КУБ.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КИЛОМЕТР", MorphLang.RU, true, "км.", NumberExType.KILOMETER);
        t.add_abridge("КМ");
        t.add_abridge("KM");
        t.add_variant("КІЛОМЕТР", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КИЛОМЕТРОВЫЙ", MorphLang.RU, true, "км.", NumberExType.KILOMETER);
        t.add_variant("КІЛОМЕТРОВИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МИЛЯ", MorphLang.RU, true, "миль", NumberExType.KILOMETER);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ГРАММ", MorphLang.RU, true, "гр.", NumberExType.GRAMM);
        t.add_abridge("ГР");
        t.add_abridge("Г");
        t.add_variant("ГРАМ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ГРАММОВЫЙ", MorphLang.RU, true, "гр.", NumberExType.GRAMM);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КИЛОГРАММ", MorphLang.RU, true, "кг.", NumberExType.KILOGRAM);
        t.add_abridge("КГ");
        t.add_variant("КІЛОГРАМ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КИЛОГРАММОВЫЙ", MorphLang.RU, true, "кг.", NumberExType.KILOGRAM);
        t.add_variant("КІЛОГРАМОВИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МИЛЛИГРАММ", MorphLang.RU, true, "мг.", NumberExType.MILLIGRAM);
        t.add_abridge("МГ");
        t.add_variant("МІЛІГРАМ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МИЛЛИГРАММОВЫЙ", MorphLang.RU, true, "мг.", NumberExType.MILLIGRAM);
        t.add_variant("МИЛЛИГРАМОВЫЙ", true);
        t.add_variant("МІЛІГРАМОВИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ТОННА", MorphLang.RU, true, "т.", NumberExType.TONNA);
        t.add_abridge("Т");
        t.add_abridge("T");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ТОННЫЙ", MorphLang.RU, true, "т.", NumberExType.TONNA);
        t.add_variant("ТОННИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ЛИТР", MorphLang.RU, true, "л.", NumberExType.LITR);
        t.add_abridge("Л");
        t.add_variant("ЛІТР", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ЛИТРОВЫЙ", MorphLang.RU, true, "л.", NumberExType.LITR);
        t.add_variant("ЛІТРОВИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МИЛЛИЛИТР", MorphLang.RU, true, "мл.", NumberExType.MILLILITR);
        t.add_abridge("МЛ");
        t.add_variant("МІЛІЛІТР", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МИЛЛИЛИТРОВЫЙ", MorphLang.RU, true, "мл.", NumberExType.MILLILITR);
        t.add_variant("МІЛІЛІТРОВИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ЧАС", MorphLang.RU, true, "ч.", NumberExType.HOUR);
        t.add_abridge("Ч.");
        t.add_variant("ГОДИНА", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МИНУТА", MorphLang.RU, true, "мин.", NumberExType.MINUTE);
        t.add_abridge("МИН.");
        t.add_variant("ХВИЛИНА", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("СЕКУНДА", MorphLang.RU, true, "сек.", NumberExType.SECOND);
        t.add_abridge("СЕК.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ГОД", MorphLang.RU, true, "г.", NumberExType.YEAR);
        t.add_abridge("Г.");
        t.add_abridge("ЛЕТ");
        t.add_variant("ЛЕТНИЙ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("МЕСЯЦ", MorphLang.RU, true, "мес.", NumberExType.MONTH);
        t.add_abridge("МЕС.");
        t.add_variant("МЕСЯЧНЫЙ", true);
        t.add_variant("КАЛЕНДАРНЫЙ МЕСЯЦ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ДЕНЬ", MorphLang.RU, true, "дн.", NumberExType.DAY);
        t.add_abridge("ДН.");
        t.add_variant("ДНЕВНЫЙ", true);
        t.add_variant("СУТКИ", true);
        t.add_variant("СУТОЧНЫЙ", true);
        t.add_variant("КАЛЕНДАРНЫЙ ДЕНЬ", true);
        t.add_variant("РАБОЧИЙ ДЕНЬ", true);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("НЕДЕЛЯ", MorphLang.RU, true, "нед.", NumberExType.WEEK);
        t.add_variant("НЕДЕЛЬНЫЙ", true);
        t.add_variant("КАЛЕНДАРНАЯ НЕДЕЛЯ", false);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ПРОЦЕНТ", MorphLang.RU, true, "%", NumberExType.PERCENT);
        t.add_variant("%", false);
        t.add_variant("ПРОЦ", true);
        t.add_abridge("ПРОЦ.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ШТУКА", MorphLang.RU, true, "шт.", NumberExType.SHUK);
        t.add_variant("ШТ", false);
        t.add_abridge("ШТ.");
        t.add_abridge("ШТ-К");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("УПАКОВКА", MorphLang.RU, true, "уп.", NumberExType.UPAK);
        t.add_variant("УПАК", true);
        t.add_variant("УП", true);
        t.add_abridge("УПАК.");
        t.add_abridge("УП.");
        t.add_abridge("УП-КА");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("РУЛОН", MorphLang.RU, true, "рулон", NumberExType.RULON);
        t.add_variant("РУЛ", true);
        t.add_abridge("РУЛ.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("НАБОР", MorphLang.RU, true, "набор", NumberExType.NABOR);
        t.add_variant("НАБ", true);
        t.add_abridge("НАБ.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("КОМПЛЕКТ", MorphLang.RU, true, "компл.", NumberExType.KOMPLEKT);
        t.add_variant("КОМПЛ", true);
        t.add_abridge("КОМПЛ.");
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ПАРА", MorphLang.RU, true, "пар", NumberExType.PARA);
        NumberExHelper.m_postfixes.add(t);
        t = Termin._new483("ФЛАКОН", MorphLang.RU, true, "флак.", NumberExType.FLAKON);
        t.add_variant("ФЛ", true);
        t.add_abridge("ФЛ.");
        t.add_variant("ФЛАК", true);
        t.add_abridge("ФЛАК.");
        NumberExHelper.m_postfixes.add(t);
        for (const te of NumberExHelper.m_postfixes.termins) {
            let ty = NumberExType.of(te.tag);
            if (!NumberExHelper.m_normals_typs.containsKey(ty)) 
                NumberExHelper.m_normals_typs.put(ty, te.canonic_text);
        }
        NumberExHelper.m_small_money = new TerminCollection();
        t = Termin._new143("УСЛОВНАЯ ЕДИНИЦА", "УЕ", NumberExType.MONEY);
        t.add_abridge("У.Е.");
        t.add_abridge("У.E.");
        t.add_abridge("Y.Е.");
        t.add_abridge("Y.E.");
        NumberExHelper.m_postfixes.add(t);
        for (let k = 0; k < 3; k++) {
            let str = EpNerCoreInternalResourceHelper.get_string((k === 0 ? "Money.csv" : (k === 1 ? "MoneyUA.csv" : "MoneyEN.csv")));
            if (str === null) 
                continue;
            let lang = (k === 0 ? MorphLang.RU : (k === 1 ? MorphLang.UA : MorphLang.EN));
            if (str === null) 
                continue;
            for (const line0 of Utils.splitString(str, '\n', false)) {
                let line = line0.trim();
                if (Utils.isNullOrEmpty(line)) 
                    continue;
                let parts = Utils.splitString(line.toUpperCase(), ';', false);
                if (parts === null || parts.length !== 5) 
                    continue;
                if (Utils.isNullOrEmpty(parts[1]) || Utils.isNullOrEmpty(parts[2])) 
                    continue;
                t = new Termin();
                t.init_by_normal_text(parts[1], lang);
                t.canonic_text = parts[2];
                t.tag = NumberExType.MONEY;
                for (const p of Utils.splitString(parts[0], ',', false)) {
                    if (p !== parts[1]) {
                        let t0 = new Termin();
                        t0.init_by_normal_text(p, null);
                        t.add_variant_term(t0);
                    }
                }
                if (parts[1] === "РУБЛЬ") 
                    t.add_abridge("РУБ.");
                else if (parts[1] === "ГРИВНЯ" || parts[1] === "ГРИВНА") 
                    t.add_abridge("ГРН.");
                else if (parts[1] === "ДОЛЛАР") {
                    t.add_abridge("ДОЛ.");
                    t.add_abridge("ДОЛЛ.");
                }
                else if (parts[1] === "ДОЛАР") 
                    t.add_abridge("ДОЛ.");
                else if (parts[1] === "ИЕНА") 
                    t.add_variant("ЙЕНА", false);
                NumberExHelper.m_postfixes.add(t);
                if (Utils.isNullOrEmpty(parts[3])) 
                    continue;
                let num = 0;
                let i = parts[3].indexOf(' ');
                if (i < 2) 
                    continue;
                let wrapnum528 = new RefOutArgWrapper();
                let inoutres529 = Utils.tryParseInt(parts[3].substring(0, 0 + i), wrapnum528);
                num = wrapnum528.value;
                if (!inoutres529) 
                    continue;
                let vv = parts[3].substring(i).trim();
                t = new Termin();
                t.init_by_normal_text(parts[4], lang);
                t.tag = num;
                if (vv !== parts[4]) {
                    let t0 = new Termin();
                    t0.init_by_normal_text(vv, null);
                    t.add_variant_term(t0);
                }
                if (parts[4] === "КОПЕЙКА" || parts[4] === "КОПІЙКА") 
                    t.add_abridge("КОП.");
                NumberExHelper.m_small_money.add(t);
            }
        }
    }
    
    static static_constructor() {
        NumberExHelper.m_postfixes = null;
        NumberExHelper.m_normals_typs = new Hashtable();
        NumberExHelper.m_small_money = null;
    }
}


NumberExHelper.static_constructor();

module.exports = NumberExHelper