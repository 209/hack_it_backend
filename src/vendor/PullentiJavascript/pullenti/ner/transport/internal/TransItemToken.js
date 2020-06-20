/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MorphGender = require("./../../../morph/MorphGender");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const MorphClass = require("./../../../morph/MorphClass");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const MorphNumber = require("./../../../morph/MorphNumber");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const CharsInfo = require("./../../../morph/CharsInfo");
const MorphLang = require("./../../../morph/MorphLang");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const Token = require("./../../Token");
const NumberSpellingType = require("./../../NumberSpellingType");
const DateReferent = require("./../../date/DateReferent");
const TextToken = require("./../../TextToken");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const ReferentToken = require("./../../ReferentToken");
const TransItemTokenTyps = require("./TransItemTokenTyps");
const TransportKind = require("./../TransportKind");
const GeoReferent = require("./../../geo/GeoReferent");
const GetTextAttr = require("./../../core/GetTextAttr");
const MetaToken = require("./../../MetaToken");
const NumberToken = require("./../../NumberToken");
const Termin = require("./../../core/Termin");
const MiscHelper = require("./../../core/MiscHelper");
const BracketHelper = require("./../../core/BracketHelper");
const TerminCollection = require("./../../core/TerminCollection");

class TransItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = TransItemTokenTyps.NOUN;
        this.value = null;
        this.alt_value = null;
        this.kind = TransportKind.UNDEFINED;
        this.is_doubt = false;
        this.is_after_conjunction = false;
        this.state = null;
        this.ref = null;
        this.route_items = null;
    }
    
    toString() {
        return (this.typ.toString() + ": " + ((this.value != null ? this.value : (((this.ref === null ? "" : this.ref.toString()))))) + " " + ((this.alt_value != null ? this.alt_value : "")));
    }
    
    static try_parse_list(t, max_count = 10) {
        let tr = TransItemToken.try_parse(t, null, false, false);
        if (tr === null) 
            return null;
        if ((tr.typ === TransItemTokenTyps.ORG || tr.typ === TransItemTokenTyps.NUMBER || tr.typ === TransItemTokenTyps.CLASS) || tr.typ === TransItemTokenTyps.DATE) 
            return null;
        let tr0 = tr;
        let res = new Array();
        res.push(tr);
        t = tr.end_token.next;
        if (tr.typ === TransItemTokenTyps.NOUN) {
            for (; t !== null; t = t.next) {
                if (t.is_char(':') || t.is_hiphen) {
                }
                else 
                    break;
            }
        }
        let and_conj = false;
        let brareg = false;
        for (; t !== null; t = t.next) {
            if (max_count > 0 && res.length >= max_count) 
                break;
            if (tr0.typ === TransItemTokenTyps.NOUN || tr0.typ === TransItemTokenTyps.ORG) {
                if (t.is_hiphen && t.next !== null) 
                    t = t.next;
            }
            tr = TransItemToken.try_parse(t, tr0, false, false);
            if (tr === null) {
                if (BracketHelper.can_be_end_of_sequence(t, true, null, false) && t.next !== null) {
                    if (tr0.typ === TransItemTokenTyps.MODEL || tr0.typ === TransItemTokenTyps.BRAND) {
                        let tt1 = t.next;
                        if (tt1 !== null && tt1.is_comma) 
                            tt1 = tt1.next;
                        tr = TransItemToken.try_parse(tt1, tr0, false, false);
                    }
                }
            }
            if (tr === null && (t instanceof ReferentToken)) {
                let rt = Utils.as(t, ReferentToken);
                if (rt.begin_token === rt.end_token && (rt.begin_token instanceof TextToken)) {
                    tr = TransItemToken.try_parse(rt.begin_token, tr0, false, false);
                    if (tr !== null && tr.begin_token === tr.end_token) 
                        tr.begin_token = tr.end_token = t;
                }
            }
            if (tr === null && t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    brareg = true;
                    tr = TransItemToken.try_parse(t.next, tr0, false, false);
                    if (tr !== null) {
                        if (tr.typ !== TransItemTokenTyps.NUMBER && tr.typ !== TransItemTokenTyps.GEO) 
                            tr = null;
                        else if (tr.end_token.next !== null) {
                            tr.begin_token = t;
                            if (tr.end_token.next.is_char(')')) {
                                tr.end_token = tr.end_token.next;
                                brareg = false;
                            }
                        }
                    }
                    if (tr === null) {
                        let tt = br.end_token.next;
                        if (tt !== null && tt.is_comma) 
                            tt = tt.next;
                        tr = TransItemToken.try_parse(tt, tr0, false, false);
                        if (tr !== null && tr.typ === TransItemTokenTyps.NUMBER) {
                        }
                        else 
                            tr = null;
                    }
                }
            }
            if (tr === null && t.is_hiphen) {
                if (tr0.typ === TransItemTokenTyps.BRAND || tr0.typ === TransItemTokenTyps.MODEL) 
                    tr = TransItemToken.try_parse(t.next, tr0, false, false);
            }
            if (tr === null && t.is_comma) {
                if (((tr0.typ === TransItemTokenTyps.NAME || tr0.typ === TransItemTokenTyps.BRAND || tr0.typ === TransItemTokenTyps.MODEL) || tr0.typ === TransItemTokenTyps.CLASS || tr0.typ === TransItemTokenTyps.DATE) || tr0.typ === TransItemTokenTyps.GEO) {
                    tr = TransItemToken.try_parse(t.next, tr0, true, false);
                    if (tr !== null) {
                        if (tr.typ === TransItemTokenTyps.NUMBER) {
                        }
                        else 
                            tr = null;
                    }
                }
            }
            if (tr === null) {
                if (tr0.typ === TransItemTokenTyps.NAME) {
                    if (t.is_char(',')) 
                        tr = TransItemToken.try_parse(t.next, tr0, true, false);
                    else if (t.morph.class0.is_conjunction && t.is_and) {
                        tr = TransItemToken.try_parse(t.next, tr0, true, false);
                        and_conj = true;
                    }
                }
                if (tr !== null) {
                    if (tr.typ !== TransItemTokenTyps.NAME) 
                        break;
                    tr.is_after_conjunction = true;
                }
            }
            if (t.is_comma_and && tr === null) {
                let ne = TransItemToken.try_parse(t.next, tr0, true, false);
                if (ne !== null && ne.typ === TransItemTokenTyps.NUMBER) {
                    let exi = false;
                    for (const v of res) {
                        if (v.typ === ne.typ) {
                            exi = true;
                            break;
                        }
                    }
                    if (!exi) 
                        tr = ne;
                }
            }
            if (tr === null && brareg && t.is_char(')')) {
                brareg = false;
                tr0.end_token = t;
                continue;
            }
            if (tr === null && BracketHelper.can_be_end_of_sequence(t, true, null, false)) {
                tr0.end_token = t;
                continue;
            }
            if (tr === null) 
                break;
            if (t.is_newline_before) {
                if (tr.typ !== TransItemTokenTyps.NUMBER) 
                    break;
            }
            res.push(tr);
            if (tr.typ === TransItemTokenTyps.ORG && tr0.typ === TransItemTokenTyps.NOUN) {
            }
            else 
                tr0 = tr;
            t = tr.end_token;
            if (and_conj) 
                break;
        }
        for (let i = 0; i < (res.length - 1); i++) {
            if (res[i].typ === TransItemTokenTyps.MODEL && res[i + 1].typ === TransItemTokenTyps.MODEL) {
                res[i].end_token = res[i + 1].end_token;
                res[i].value = (res[i].value + (res[i].end_token.next !== null && res[i].end_token.next.is_hiphen ? '-' : ' ') + res[i + 1].value);
                res.splice(i + 1, 1);
                i--;
            }
        }
        if ((res.length > 1 && res[0].typ === TransItemTokenTyps.BRAND && res[1].typ === TransItemTokenTyps.MODEL) && res[1].length_char === 1 && !((res[1].begin_token instanceof NumberToken))) 
            return null;
        return res;
    }
    
    static try_parse(t, prev, after_conj, attach_high = false) {
        let res = TransItemToken._try_parse(t, prev, after_conj, attach_high);
        if (res === null) 
            return null;
        if (res.typ === TransItemTokenTyps.NAME) {
            let br = BracketHelper.try_parse(res.end_token.next, BracketParseAttr.NO, 100);
            if (br !== null && br.begin_token.is_char('(')) {
                let alt = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                if (MiscHelper.can_be_equal_cyr_and_latss(res.value, alt)) {
                    res.alt_value = alt;
                    res.end_token = br.end_token;
                }
            }
        }
        return res;
    }
    
    static _try_parse(t, prev, after_conj, attach_high = false) {
        if (t === null) 
            return null;
        let t1 = t;
        if (t1.is_char(',')) 
            t1 = t1.next;
        if (t1 !== null) {
            if (t1.is_value("ПРИНАДЛЕЖАТЬ", "НАЛЕЖАТИ") || t1.is_value("СУДОВЛАДЕЛЕЦ", "СУДНОВЛАСНИК") || t1.is_value("ВЛАДЕЛЕЦ", "ВЛАСНИК")) 
                t1 = t1.next;
        }
        if (t1 instanceof ReferentToken) {
            if (t1.get_referent().type_name === "ORGANIZATION") 
                return TransItemToken._new2668(t, t1, TransItemTokenTyps.ORG, t1.get_referent(), t1.morph);
        }
        if (t1 !== null && t1.is_value("ФЛАГ", null)) {
            let tt = t1.next;
            while (tt !== null) {
                if (tt.is_hiphen || tt.is_char(':')) 
                    tt = tt.next;
                else 
                    break;
            }
            if ((tt instanceof ReferentToken) && (tt.get_referent() instanceof GeoReferent)) 
                return TransItemToken._new2669(t, tt, TransItemTokenTyps.GEO, tt.get_referent());
        }
        if (t1 !== null && t1.is_value("ПОРТ", null)) {
            let tt = t1.next;
            for (; tt !== null; tt = tt.next) {
                if (tt.is_value("ПРИПИСКА", null) || tt.is_char(':')) {
                }
                else 
                    break;
            }
            if (tt !== null && (tt.get_referent() instanceof GeoReferent)) 
                return TransItemToken._new2669(t, tt, TransItemTokenTyps.GEO, tt.get_referent());
        }
        let route = false;
        if (t1 !== null && ((t1.is_value("СЛЕДОВАТЬ", "СЛІДУВАТИ") || t1.is_value("ВЫПОЛНЯТЬ", "ВИКОНУВАТИ")))) {
            t1 = t1.next;
            route = true;
        }
        if (t1 !== null && t1.morph.class0.is_preposition) 
            t1 = t1.next;
        if (t1 !== null && ((t1.is_value("РЕЙС", null) || t1.is_value("МАРШРУТ", null)))) {
            t1 = t1.next;
            route = true;
        }
        if (t1 instanceof ReferentToken) {
            if (t1.get_referent() instanceof GeoReferent) {
                let _geo = Utils.as(t1.get_referent(), GeoReferent);
                if (_geo.is_state || _geo.is_city) {
                    let tit = TransItemToken._new2671(t, t1, TransItemTokenTyps.ROUTE, new Array());
                    tit.route_items.push(_geo);
                    for (t1 = t1.next; t1 !== null; t1 = t1.next) {
                        if (t1.is_hiphen) 
                            continue;
                        if (t1.morph.class0.is_preposition || t1.morph.class0.is_conjunction) 
                            continue;
                        _geo = Utils.as(t1.get_referent(), GeoReferent);
                        if (_geo === null) 
                            break;
                        if (!_geo.is_city && !_geo.is_state) 
                            break;
                        tit.route_items.push(_geo);
                        tit.end_token = t1;
                    }
                    if (tit.route_items.length > 1 || route) 
                        return tit;
                }
            }
            else if ((t1.get_referent() instanceof DateReferent) && (t1.whitespaces_before_count < 3)) {
                let tit = TransItemToken._new2669(t, t1, TransItemTokenTyps.DATE, t1.get_referent());
                if (t1.next !== null) {
                    if (t1.next.is_value("В", null) && t1.next.next !== null && t1.next.next.is_char('.')) 
                        tit.end_token = t1.next.next;
                    else if (t1.next.is_value("ВЫП", null) || t1.next.is_value("ВЫПУСК", null)) {
                        tit.end_token = t1.next;
                        if (t1.next.next !== null && t1.next.next.is_char('.')) 
                            tit.end_token = t1.next.next;
                    }
                }
                return tit;
            }
        }
        if (t instanceof TextToken) {
            let num = MiscHelper.check_number_prefix(t);
            if (num !== null) {
                let tit = TransItemToken._attach_rus_auto_number(num);
                if (tit === null) 
                    tit = TransItemToken._attach_number(num, false);
                if (tit !== null) {
                    tit.begin_token = t;
                    return tit;
                }
            }
            let tok = TransItemToken.m_ontology.try_parse(t, TerminParseAttr.NO);
            if (tok === null && ((t.is_value("С", null) || t.is_value("C", null) || t.is_value("ЗА", null)))) 
                tok = TransItemToken.m_ontology.try_parse(t.next, TerminParseAttr.NO);
            let is_br = false;
            if (tok === null && BracketHelper.is_bracket(t, true)) {
                let tok1 = TransItemToken.m_ontology.try_parse(t.next, TerminParseAttr.NO);
                if (tok1 !== null && BracketHelper.is_bracket(tok1.end_token.next, true)) {
                    tok = tok1;
                    tok.begin_token = t;
                    tok.end_token = tok.end_token.next;
                    tok.begin_token = t;
                    is_br = true;
                }
                else if (tok1 !== null) {
                    let tt = Utils.as(tok1.termin, TransItemToken.TransTermin);
                    if (tt.typ === TransItemTokenTyps.BRAND) {
                        tok = tok1;
                        tok.begin_token = t;
                    }
                }
                if (tok !== null && BracketHelper.can_be_end_of_sequence(tok.end_token.next, true, null, false)) {
                    tok.end_token = tok.end_token.next;
                    is_br = true;
                }
            }
            if (tok === null && t.is_value("МАРКА", null)) {
                let res1 = TransItemToken._try_parse(t.next, prev, after_conj, false);
                if (res1 !== null) {
                    if (res1.typ === TransItemTokenTyps.NAME || res1.typ === TransItemTokenTyps.BRAND) {
                        res1.begin_token = t;
                        res1.typ = TransItemTokenTyps.BRAND;
                        return res1;
                    }
                }
            }
            if (tok !== null) {
                let tt = Utils.as(tok.termin, TransItemToken.TransTermin);
                let tit = null;
                if (tt.typ === TransItemTokenTyps.NUMBER) {
                    tit = TransItemToken._attach_rus_auto_number(tok.end_token.next);
                    if (tit === null) 
                        tit = TransItemToken._attach_number(tok.end_token.next, false);
                    if (tit !== null) {
                        tit.begin_token = t;
                        return tit;
                    }
                    else 
                        return null;
                }
                if (tt.is_doubt && !attach_high) {
                    if (prev === null || prev.typ !== TransItemTokenTyps.NOUN) {
                        if ((prev !== null && prev.typ === TransItemTokenTyps.BRAND && tt.typ === TransItemTokenTyps.BRAND) && Utils.compareStrings(tt.canonic_text, prev.value, true) === 0) {
                        }
                        else 
                            return null;
                    }
                }
                if (tt.canonic_text === "СУДНО") {
                    if ((((tok.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) {
                        if (!BracketHelper.can_be_start_of_sequence(tok.end_token.next, false, false)) 
                            return null;
                    }
                }
                tit = TransItemToken._new2673(tok.begin_token, tok.end_token, tt.kind, tt.typ, tt.is_doubt && !is_br, tok.chars, tok.morph);
                tit.value = tt.canonic_text;
                if (tit.typ === TransItemTokenTyps.NOUN) {
                    tit.value = tit.value.toLowerCase();
                    if (((tit.end_token.next !== null && tit.end_token.next.is_hiphen && !tit.end_token.is_whitespace_after) && (tit.end_token.next.next instanceof TextToken) && !tit.end_token.next.is_whitespace_after) && tit.end_token.next.next.get_morph_class_in_dictionary().is_noun) {
                        tit.end_token = tit.end_token.next.next;
                        tit.value = (tit.value + "-" + (Utils.notNull(tit.end_token.get_normal_case_text(MorphClass.NOUN, false, MorphGender.UNDEFINED, false), "?"))).toLowerCase();
                    }
                }
                else 
                    tit.value = tit.value.toUpperCase();
                return tit;
            }
            if (tok === null && t.morph.class0.is_adjective) {
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.adjectives.length > 0) {
                    let _state = null;
                    for (let tt = t; tt !== null && tt.previous !== npt.end_token; tt = tt.next) {
                        tok = TransItemToken.m_ontology.try_parse(tt, TerminParseAttr.NO);
                        if (tok === null && _state === null) 
                            _state = tt.kit.process_referent("GEO", tt);
                        if (tok !== null && tok.end_token === npt.end_token) {
                            if ((tok.termin).typ === TransItemTokenTyps.NOUN) {
                                let tit = TransItemToken._new2673(t, tok.end_token, (tok.termin).kind, TransItemTokenTyps.NOUN, (tok.termin).is_doubt, tok.chars, npt.morph);
                                tit.value = (tok.termin).canonic_text.toLowerCase();
                                tit.alt_value = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false).toLowerCase();
                                if (LanguageHelper.ends_with_ex(tit.alt_value, "суд", "суда", null, null)) {
                                    if (!BracketHelper.can_be_start_of_sequence(tok.end_token.next, false, false)) 
                                        continue;
                                }
                                if (_state !== null) {
                                    if ((_state.referent).is_state) 
                                        tit.state = _state;
                                }
                                return tit;
                            }
                        }
                    }
                }
            }
        }
        if (t !== null && t.is_value("КЛАСС", null) && t.next !== null) {
            let br = BracketHelper.try_parse(t.next, BracketParseAttr.NO, 100);
            if (br !== null) 
                return TransItemToken._new2675(t, br.end_token, TransItemTokenTyps.CLASS, MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO));
        }
        let nt = Utils.as(t, NumberToken);
        if (nt !== null) {
            if (prev === null || nt.typ !== NumberSpellingType.DIGIT) 
                return null;
            if (prev.typ === TransItemTokenTyps.BRAND) 
                return TransItemToken._attach_model(t, false, prev);
            else 
                return null;
        }
        let res = null;
        if ((((res = TransItemToken._attach_rus_auto_number(t)))) !== null) {
            if (!res.is_doubt) 
                return res;
            if (prev !== null && prev.typ === TransItemTokenTyps.NOUN && prev.kind === TransportKind.AUTO) 
                return res;
            if (prev !== null && ((prev.typ === TransItemTokenTyps.BRAND || prev.typ === TransItemTokenTyps.MODEL))) 
                return res;
        }
        t1 = t;
        if (t.is_hiphen) 
            t1 = t.next;
        if (prev !== null && prev.typ === TransItemTokenTyps.BRAND && t1 !== null) {
            let tit = TransItemToken._attach_model(t1, true, prev);
            if (tit !== null) {
                tit.begin_token = t;
                return tit;
            }
        }
        if (prev !== null && ((prev.typ === TransItemTokenTyps.NOUN || after_conj))) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null && br.is_quote_type) {
                let tit = TransItemToken.try_parse(br.begin_token.next, prev, after_conj, false);
                if (tit !== null && tit.end_token.next === br.end_token) {
                    if (!tit.is_doubt || tit.typ === TransItemTokenTyps.BRAND) {
                        tit.begin_token = br.begin_token;
                        tit.end_token = br.end_token;
                        return tit;
                    }
                }
                let s = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                if (!Utils.isNullOrEmpty(s) && (s.length < 30)) {
                    let _chars = 0;
                    let digs = 0;
                    let un = 0;
                    for (const c of s) {
                        if (!Utils.isWhitespace(c)) {
                            if (Utils.isLetter(c)) 
                                _chars++;
                            else if (Utils.isDigit(c)) 
                                digs++;
                            else 
                                un++;
                        }
                    }
                    if (((digs === 0 && un === 0 && t.next.chars.is_capital_upper)) || prev.kind === TransportKind.SHIP || prev.kind === TransportKind.SPACE) 
                        return TransItemToken._new2675(br.begin_token, br.end_token, TransItemTokenTyps.NAME, s);
                    if (digs > 0 && (_chars < 5)) 
                        return TransItemToken._new2675(br.begin_token, br.end_token, TransItemTokenTyps.MODEL, Utils.replaceString(s, " ", ""));
                }
            }
        }
        if (prev !== null && (((prev.typ === TransItemTokenTyps.NOUN || prev.typ === TransItemTokenTyps.BRAND || prev.typ === TransItemTokenTyps.NAME) || prev.typ === TransItemTokenTyps.MODEL))) {
            let tit = TransItemToken._attach_model(t, prev.typ !== TransItemTokenTyps.NAME, prev);
            if (tit !== null) 
                return tit;
        }
        if (((prev !== null && prev.typ === TransItemTokenTyps.NOUN && prev.kind === TransportKind.AUTO) && (t instanceof TextToken) && t.chars.is_letter) && !t.chars.is_all_lower && (t.whitespaces_before_count < 2)) {
            let pt = t.kit.process_referent("PERSON", t);
            if (pt === null) {
                let tit = TransItemToken._new2678(t, t, TransItemTokenTyps.BRAND);
                tit.value = (t).term;
                let mc = t.get_morph_class_in_dictionary();
                if (mc.is_noun) 
                    tit.is_doubt = true;
                return tit;
            }
        }
        if (((prev !== null && prev.typ === TransItemTokenTyps.NOUN && ((prev.kind === TransportKind.SHIP || prev.kind === TransportKind.SPACE)))) || after_conj) {
            if (t.chars.is_capital_upper) {
                let ok = true;
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.adjectives.length > 0) 
                    ok = false;
                else {
                    let rt = t.kit.process_referent("PERSON", t);
                    if (rt !== null) 
                        ok = false;
                }
                if (t.get_morph_class_in_dictionary().is_proper_surname) {
                    if (!t.morph._case.is_nominative) 
                        ok = false;
                }
                if (ok) {
                    t1 = t;
                    let tit = null;
                    for (let tt = t.next; tt !== null; tt = tt.next) {
                        if (tt.whitespaces_before_count > 1) 
                            break;
                        if (CharsInfo.ooNoteq(tt.chars, t.chars)) 
                            break;
                        if ((((tit = TransItemToken.try_parse(tt, null, false, false)))) !== null) 
                            break;
                        t1 = tt;
                    }
                    let s = MiscHelper.get_text_value(t, t1, GetTextAttr.NO);
                    if (s !== null) {
                        let res1 = TransItemToken._new2679(t, t1, TransItemTokenTyps.NAME, true, s);
                        if (!t1.is_newline_after) {
                            let br = BracketHelper.try_parse(t1.next, BracketParseAttr.NO, 100);
                            if (br !== null) {
                                res1.end_token = br.end_token;
                                res1.alt_value = res1.value;
                                res1.value = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                            }
                        }
                        return res1;
                    }
                }
            }
        }
        return null;
    }
    
    static _attach_model(t, can_be_first_word, prev) {
        let res = TransItemToken._new2678(t, t, TransItemTokenTyps.MODEL);
        let cyr = new StringBuilder();
        let lat = new StringBuilder();
        let t0 = t;
        let num = false;
        for (; t !== null; t = t.next) {
            if (t !== t0 && t.whitespaces_before_count > 1) 
                break;
            if (t === t0) {
                if (t.is_hiphen || t.chars.is_all_lower) {
                    if (prev === null || prev.typ !== TransItemTokenTyps.BRAND) 
                        return null;
                }
            }
            else {
                let pp = TransItemToken.try_parse(t, null, false, false);
                if (pp !== null) 
                    break;
            }
            if (t.is_hiphen) {
                num = false;
                continue;
            }
            let nt = Utils.as(t, NumberToken);
            if (nt !== null) {
                if (num) 
                    break;
                num = true;
                if (nt.typ !== NumberSpellingType.DIGIT) 
                    break;
                if (cyr !== null) 
                    cyr.append(nt.value);
                if (lat !== null) 
                    lat.append(nt.value);
                res.end_token = t;
                continue;
            }
            if (t !== t0 && TransItemToken.try_parse(t, null, false, false) !== null) 
                break;
            if (num && t.is_whitespace_before) 
                break;
            num = false;
            let vv = MiscHelper.get_cyr_lat_word(t, 3);
            if (vv === null) {
                if (can_be_first_word && t === t0) {
                    if (t.chars.is_letter && t.chars.is_capital_upper) {
                        if ((((vv = MiscHelper.get_cyr_lat_word(t, 0)))) !== null) {
                            if (t.morph._case.is_genitive && ((prev === null || prev.typ !== TransItemTokenTyps.BRAND))) 
                                vv = null;
                            else if (prev !== null && prev.typ === TransItemTokenTyps.NOUN && ((prev.kind === TransportKind.SHIP || prev.kind === TransportKind.SPACE))) 
                                vv = null;
                            else 
                                res.is_doubt = true;
                        }
                    }
                    if (((vv === null && (t instanceof TextToken) && !t.chars.is_all_lower) && t.chars.is_latin_letter && prev !== null) && prev.typ === TransItemTokenTyps.BRAND) {
                        lat.append((t).term);
                        res.end_token = t;
                        continue;
                    }
                }
                if (vv === null) 
                    break;
            }
            if ((vv.length < 4) || t.morph.class0.is_preposition || t.morph.class0.is_conjunction) {
                if (t.is_whitespace_before && t.is_whitespace_after) {
                    if (t.previous !== null && !t.previous.is_hiphen) {
                        if (t.chars.is_all_lower) 
                            break;
                    }
                }
            }
            if (cyr !== null) {
                if (vv.cyr_word !== null) 
                    cyr.append(vv.cyr_word);
                else 
                    cyr = null;
            }
            if (lat !== null) {
                if (vv.lat_word !== null) 
                    lat.append(vv.lat_word);
                else 
                    lat = null;
            }
            res.end_token = t;
        }
        if (lat === null && cyr === null) 
            return null;
        if (lat !== null && lat.length > 0) {
            res.value = lat.toString();
            if (cyr !== null && cyr.length > 0 && res.value !== cyr.toString()) 
                res.alt_value = cyr.toString();
        }
        else if (cyr !== null && cyr.length > 0) 
            res.value = cyr.toString();
        if (Utils.isNullOrEmpty(res.value)) 
            return null;
        if (res.kit.process_referent("PERSON", res.begin_token) !== null) 
            return null;
        return res;
    }
    
    static _attach_number(t, ignore_region = false) {
        if (t === null) 
            return null;
        if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                let res1 = TransItemToken._attach_number(t.next, false);
                if (res1 !== null && res1.end_token.next === br.end_token) {
                    res1.begin_token = t;
                    res1.end_token = br.end_token;
                    return res1;
                }
            }
        }
        let t0 = t;
        let t1 = t;
        if (t.is_value("НА", null)) {
            let npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.noun.is_value("ФОН", null)) 
                t = npt.end_token.next;
        }
        let res = null;
        for (; t !== null; t = t.next) {
            if (t.is_newline_before) 
                break;
            if (t !== t0 && t.whitespaces_before_count > 1) 
                break;
            if (t.is_hiphen) 
                continue;
            let nt = Utils.as(t, NumberToken);
            if (nt !== null) {
                if (nt.typ !== NumberSpellingType.DIGIT || nt.morph.class0.is_adjective) 
                    break;
                if (res === null) 
                    res = new StringBuilder();
                else if (Utils.isDigit(res.charAt(res.length - 1))) 
                    res.append(' ');
                res.append(nt.get_source_text());
                t1 = t;
                continue;
            }
            let tt = Utils.as(t, TextToken);
            if (tt === null) {
                if ((t instanceof MetaToken) && ((t).begin_token.length_char < 3) && ((t).begin_token instanceof TextToken)) 
                    tt = Utils.as((t).begin_token, TextToken);
                else 
                    break;
            }
            if (!tt.chars.is_letter) 
                break;
            if (!tt.chars.is_all_upper && tt.is_whitespace_before) 
                break;
            if (tt.length_char > 3) 
                break;
            if (res === null) 
                res = new StringBuilder();
            res.append(tt.term);
            t1 = t;
        }
        if (res === null || (res.length < 4)) 
            return null;
        let re = TransItemToken._new2675(t0, t1, TransItemTokenTyps.NUMBER, res.toString());
        if (!ignore_region) {
            for (let k = 0, i = res.length - 1; i > 4; i--,k++) {
                if (!Utils.isDigit(res.charAt(i))) {
                    if (res.charAt(i) === ' ' && ((k === 2 || k === 3))) {
                        re.alt_value = re.value.substring(i + 1);
                        re.value = re.value.substring(0, 0 + i);
                    }
                    break;
                }
            }
        }
        re.value = Utils.replaceString(re.value, " ", "");
        if (ignore_region) 
            re.alt_value = MiscHelper.create_cyr_lat_alternative(re.value);
        return re;
    }
    
    static _attach_rus_auto_number(t) {
        if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                let res1 = TransItemToken._attach_rus_auto_number(t.next);
                if (res1 !== null && res1.end_token.next === br.end_token) {
                    res1.begin_token = t;
                    res1.end_token = br.end_token;
                    return res1;
                }
            }
        }
        let v1 = MiscHelper.get_cyr_lat_word(t, 1);
        if (v1 === null || v1.cyr_word === null) 
            return null;
        let t0 = t;
        let doubt = 0;
        if (!t.chars.is_all_upper || t.is_whitespace_after) 
            doubt++;
        t = t.next;
        let nt = Utils.as(t, NumberToken);
        if ((nt === null || nt.typ !== NumberSpellingType.DIGIT || nt.morph.class0.is_adjective) || (nt.end_char - nt.begin_char) !== 2) 
            return null;
        t = t.next;
        let v2 = MiscHelper.get_cyr_lat_word(t, 2);
        if (v2 === null || v2.cyr_word === null || v2.length !== 2) 
            return null;
        if (!t.chars.is_all_upper || t.is_whitespace_after) 
            doubt++;
        let res = TransItemToken._new2682(t0, t, TransItemTokenTyps.NUMBER, TransportKind.AUTO);
        res.value = (v1.cyr_word + nt.get_source_text() + v2.cyr_word);
        nt = Utils.as(t.next, NumberToken);
        if (((nt !== null && nt.int_value !== null && nt.typ === NumberSpellingType.DIGIT) && !nt.morph.class0.is_adjective && nt.int_value !== null) && (nt.int_value < 1000) && (t.whitespaces_after_count < 2)) {
            let n = nt.value;
            if (n.length < 2) 
                n = "0" + n;
            res.alt_value = n;
            res.end_token = nt;
        }
        if (res.end_token.next !== null && res.end_token.next.is_value("RUS", null)) {
            res.end_token = res.end_token.next;
            doubt = 0;
        }
        if (doubt > 1) 
            res.is_doubt = true;
        return res;
    }
    
    static check_number_keyword(t) {
        let tok = TransItemToken.m_ontology.try_parse(t, TerminParseAttr.NO);
        if (tok === null) 
            return null;
        let tt = Utils.as(tok.termin, TransItemToken.TransTermin);
        if (tt !== null && tt.typ === TransItemTokenTyps.NUMBER) 
            return tok.end_token.next;
        return null;
    }
    
    static initialize() {
        if (TransItemToken.m_ontology !== null) 
            return;
        TransItemToken.m_ontology = new TerminCollection();
        let t = null;
        t = TransItemToken.TransTermin._new2683("автомобиль", true, TransItemTokenTyps.NOUN, TransportKind.AUTO);
        t.add_abridge("а-м");
        t.add_variant("автомашина", false);
        t.add_variant("ТРАНСПОРТНОЕ СРЕДСТВО", false);
        t.add_variant("автомобіль", false);
        TransItemToken.m_ontology.add(t);
        for (const s of ["ВНЕДОРОЖНИК", "ПОЗАШЛЯХОВИК", "АВТОБУС", "МИКРОАВТОБУС", "ГРУЗОВИК", "МОТОЦИКЛ", "МОПЕД"]) {
            TransItemToken.m_ontology.add(TransItemToken.TransTermin._new2683(s, true, TransItemTokenTyps.NOUN, TransportKind.AUTO));
        }
        t = TransItemToken.TransTermin._new2683("", true, TransItemTokenTyps.NOUN, TransportKind.AUTO);
        t.add_abridge("а-м");
        TransItemToken.m_ontology.add(t);
        t = TransItemToken.TransTermin._new2686("государственный номер", true, TransItemTokenTyps.NUMBER, "ИМО");
        t.add_abridge("г-н");
        t.add_abridge("н\\з");
        t.add_abridge("г\\н");
        t.add_variant("госномер", false);
        t.add_abridge("гос.номер");
        t.add_abridge("гос.ном.");
        t.add_abridge("г.н.з.");
        t.add_abridge("г.р.з.");
        t.add_variant("ГРЗ", false);
        t.add_variant("ГНЗ", false);
        t.add_variant("регистрационный знак", false);
        t.add_abridge("рег. знак");
        t.add_variant("государственный регистрационный знак", false);
        t.add_variant("бортовой номер", false);
        TransItemToken.m_ontology.add(t);
        t = TransItemToken.TransTermin._new2687("державний номер", true, TransItemTokenTyps.NUMBER, MorphLang.UA);
        t.add_variant("держномер", false);
        t.add_abridge("держ.номер");
        t.add_abridge("держ.ном.");
        TransItemToken.m_ontology.add(t);
        t = TransItemToken.TransTermin._new2688("номер", true, TransItemTokenTyps.NUMBER);
        TransItemToken.m_ontology.add(t);
        for (const s of ["КРУИЗНЫЙ ЛАЙНЕР", "ТЕПЛОХОД", "ПАРОХОД", "ЯХТА", "ЛОДКА", "КАТЕР", "КОРАБЛЬ", "СУДНО", "ПОДВОДНАЯ ЛОДКА", "АПК", "ШХУНА", "ПАРОМ", "КРЕЙСЕР", "АВИАНОСЕЦ", "ЭСМИНЕЦ", "ФРЕГАТ", "ЛИНКОР", "АТОМОХОД", "ЛЕДОКОЛ", "ПЛАВБАЗА", "ТАНКЕР", "СУПЕРТАНКЕР", "СУХОГРУЗ", "ТРАУЛЕР", "РЕФРИЖЕРАТОР"]) {
            TransItemToken.m_ontology.add((t = TransItemToken.TransTermin._new2683(s, true, TransItemTokenTyps.NOUN, TransportKind.SHIP)));
            if (s === "АПК") 
                t.is_doubt = true;
        }
        for (const s of ["КРУЇЗНИЙ ЛАЙНЕР", "ПАРОПЛАВ", "ПАРОПЛАВ", "ЯХТА", "ЧОВЕН", "КОРАБЕЛЬ", "СУДНО", "ПІДВОДНИЙ ЧОВЕН", "АПК", "ШХУНА", "ПОРОМ", "КРЕЙСЕР", "АВІАНОСЕЦЬ", "ЕСМІНЕЦЬ", "ФРЕГАТ", "ЛІНКОР", "АТОМОХІД", "КРИГОЛАМ", "ПЛАВБАЗА", "ТАНКЕР", "СУПЕРТАНКЕР", "СУХОВАНТАЖ", "ТРАУЛЕР", "РЕФРИЖЕРАТОР"]) {
            TransItemToken.m_ontology.add((t = TransItemToken.TransTermin._new2690(s, true, TransItemTokenTyps.NOUN, MorphLang.UA, TransportKind.SHIP)));
            if (s === "АПК") 
                t.is_doubt = true;
        }
        for (const s of ["САМОЛЕТ", "АВИАЛАЙНЕР", "ИСТРЕБИТЕЛЬ", "БОМБАРДИРОВЩИК", "ВЕРТОЛЕТ"]) {
            TransItemToken.m_ontology.add(TransItemToken.TransTermin._new2683(s, true, TransItemTokenTyps.NOUN, TransportKind.FLY));
        }
        for (const s of ["ЛІТАК", "АВІАЛАЙНЕР", "ВИНИЩУВАЧ", "БОМБАРДУВАЛЬНИК", "ВЕРТОЛІТ"]) {
            TransItemToken.m_ontology.add(TransItemToken.TransTermin._new2690(s, true, TransItemTokenTyps.NOUN, MorphLang.UA, TransportKind.FLY));
        }
        for (const s of ["КОСМИЧЕСКИЙ КОРАБЛЬ", "ЗВЕЗДОЛЕТ", "КОСМИЧЕСКАЯ СТАНЦИЯ", "РАКЕТА-НОСИТЕЛЬ"]) {
            TransItemToken.m_ontology.add(TransItemToken.TransTermin._new2683(s, true, TransItemTokenTyps.NOUN, TransportKind.SPACE));
        }
        for (const s of ["КОСМІЧНИЙ КОРАБЕЛЬ", "ЗОРЕЛІТ", "КОСМІЧНА СТАНЦІЯ", "РАКЕТА-НОСІЙ"]) {
            TransItemToken.m_ontology.add(TransItemToken.TransTermin._new2690(s, true, TransItemTokenTyps.NOUN, MorphLang.UA, TransportKind.SPACE));
        }
        TransItemToken._load_brands(TransItemToken.m_cars, TransportKind.AUTO);
        TransItemToken._load_brands(TransItemToken.m_flys, TransportKind.FLY);
    }
    
    static _load_brands(str, _kind) {
        let cars = Utils.splitString(str, ';', false);
        let vars = new Array();
        for (const c of cars) {
            let its = Utils.splitString(c, ',', false);
            vars.splice(0, vars.length);
            let doubt = false;
            for (const it of its) {
                let s = it.trim();
                if (!Utils.isNullOrEmpty(s)) {
                    if (s === "true") 
                        doubt = true;
                    else 
                        vars.push(s);
                }
            }
            if (vars.length === 0) 
                continue;
            for (const v of vars) {
                let t = new TransItemToken.TransTermin(v);
                t.canonic_text = vars[0];
                t.kind = _kind;
                t.typ = TransItemTokenTyps.BRAND;
                t.is_doubt = doubt;
                TransItemToken.m_ontology.add(t);
            }
        }
    }
    
    static _new2668(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new TransItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new2669(_arg1, _arg2, _arg3, _arg4) {
        let res = new TransItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        return res;
    }
    
    static _new2671(_arg1, _arg2, _arg3, _arg4) {
        let res = new TransItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.route_items = _arg4;
        return res;
    }
    
    static _new2673(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new TransItemToken(_arg1, _arg2);
        res.kind = _arg3;
        res.typ = _arg4;
        res.is_doubt = _arg5;
        res.chars = _arg6;
        res.morph = _arg7;
        return res;
    }
    
    static _new2675(_arg1, _arg2, _arg3, _arg4) {
        let res = new TransItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new2678(_arg1, _arg2, _arg3) {
        let res = new TransItemToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new2679(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new TransItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.is_doubt = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static _new2682(_arg1, _arg2, _arg3, _arg4) {
        let res = new TransItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.kind = _arg4;
        return res;
    }
    
    static static_constructor() {
        TransItemToken.m_ontology = null;
        TransItemToken.m_flys = "\n        Boeing, Боинг;\n        Airbus, Аэробус, Эрбас;\n        Ил, Илюшин, true;\n        Ту, Туполев, true;\n        Ан, Антонов, true;\n        Су, Сухой, Sukhoi, Sukhoy, true;\n        Як, Яковлев, true;\n        BAE Systems, БАЕ Системз;\n        ATR, АТР, true;\n        AVIC;\n        Bombardier, Бомбардье;  \n        Britten-Norman, Бриттен-Норман;\n        Cessna, Цессна;\n        Dornier, Дорнье;\n        Embraer, Эмбраер;\n        Fairchild, Fairchild Aerospace, Фэйрчайлд;\n        Fokker, Фоккер;\n        Hawker Beechcraft, Хокер Бичкрафт;\n        Indonesian Aerospace, Индонезиан;\n        Lockheed Martin, Локхид Мартин;\n        LZ Auronautical Industries, LET;\n        Douglas, McDonnell Douglas, Дуглас;\n        NAMC, НАМК;\n        Pilatus, Пилатус, true;\n        Piper Aircraft;\n        Saab, Сааб, true;\n        Shorts, Шортс, true;\n";
        TransItemToken.m_cars = "\n        AC Cars;\n        Acura, Акура;\n        Abarth;\n        Alfa Romeo, Альфа Ромео;\n        ALPINA, Альпина, true;\n        Ariel Motor, Ариэль Мотор;\n        ARO, true;\n        Artega, true;\n        Aston Martin;\n        AUDI, Ауди;\n        Austin Healey;\n        BAW;\n        Beijing Jeep;\n        Bentley, Бентли;\n        Bitter, Биттер, true;\n        BMW, БМВ;\n        Brilliance;\n        Bristol, Бристоль, true;\n        Bugatti, Бугатти;\n        Buick, Бьюик;\n        BYD, true;\n        Cadillac, Кадиллак, Кадилак;\n        Caterham;\n        Chery, trye;\n        Chevrolet, Шевроле, Шеврале;\n        Chrysler, Крайслер;\n        Citroen, Ситроен, Ситроэн;\n        Dacia;\n        DADI;\n        Daewoo, Дэо;\n        Dodge, Додж;\n        Daihatsu;\n        Daimler, Даймлер;\n        DKW;\n        Derways;\n        Eagle, true;\n        Elfin Sports Cars;\n        FAW, true;\n        Ferrari, Феррари, Ферари;\n        FIAT, Фиат;\n        Fisker Karma;\n        Ford, Форд;\n        Geely;\n        GEO, true;\n        GMC, true;\n        Gonow;\n        Great Wall, true;\n        Gumpert;\n        Hafei;\n        Haima;\n        Honda, Хонда;\n        Horch;\n        Hudson, true;\n        Hummer, Хаммер;\n        Harley, Харлей;\n        Hyundai, Хюндай, Хундай;\n        Infiniti, true;\n        Isuzu, Исузу;\n        Jaguar, Ягуар, true;\n        Jeep, Джип, true;\n        Kia, Киа, true;\n        Koenigsegg;\n        Lamborghini, Ламборджини;\n        Land Rover, Лендровер, Лэндровер;\n        Landwind;\n        Lancia;\n        Lexus, Лексус;\n        Leyland;\n        Lifan;\n        Lincoln, Линкольн, true;\n        Lotus, true;\n        Mahindra;\n        Maserati;\n        Maybach;\n        Mazda, Мазда;\n        Mercedes-Benz, Mercedes, Мерседес, Мэрседес, Мерседес-бенц;\n        Mercury, true;\n        Mini, true;\n        Mitsubishi, Mitsubishi Motors, Мицубиши, Мицубиси;\n        Morgan, true;\n        Nissan, Nissan Motor, Ниссан, Нисан;\n        Opel, Опель;\n        Pagani;\n        Peugeot, Пежо;\n        Plymouth;\n        Pontiac, Понтиак;\n        Porsche, Порше;\n        Renault, Рено;\n        Rinspeed;\n        Rolls-Royce, Роллс-Ройс;\n        SAAB, Сааб;\n        Saleen;\n        Saturn, Сатурн, true;\n        Scion;\n        Seat, true;\n        Skoda, Шкода;\n        Smart, true;\n        Spyker, true;\n        Ssang Yong, Ссанг янг;\n        Subaru, Субару;\n        Suzuki, Судзуки;\n        Tesla, true;\n        Toyota, Тойота;\n        Vauxhall;\n        Volkswagen, Фольксваген;\n        Volvo, Вольво;\n        Wartburg;\n        Wiesmann;\n        Yamaha, Ямаха;\n        Zenvo;\n\n        ВАЗ, VAZ;\n        ГАЗ, GAZ, true;\n        ЗАЗ, ZAZ;\n        ЗИЛ, ZIL;\n        АЗЛК, AZLK;\n        Иж, true;\n        Москвич, true;\n        УАЗ, UAZ;\n        ТАГАЗ, TaGAZ;\n        Лада, Жигули, true;\n\n";
    }
}


TransItemToken.TransTermin = class  extends Termin {
    
    constructor(source, add_lemma_variant = false) {
        super(null, null, false);
        this.kind = TransportKind.UNDEFINED;
        this.typ = TransItemTokenTyps.NOUN;
        this.is_doubt = false;
        this.init_by_normal_text(source, null);
    }
    
    static _new2683(_arg1, _arg2, _arg3, _arg4) {
        let res = new TransItemToken.TransTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.kind = _arg4;
        return res;
    }
    
    static _new2686(_arg1, _arg2, _arg3, _arg4) {
        let res = new TransItemToken.TransTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.acronym = _arg4;
        return res;
    }
    
    static _new2687(_arg1, _arg2, _arg3, _arg4) {
        let res = new TransItemToken.TransTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.lang = _arg4;
        return res;
    }
    
    static _new2688(_arg1, _arg2, _arg3) {
        let res = new TransItemToken.TransTermin(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new2690(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new TransItemToken.TransTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.lang = _arg4;
        res.kind = _arg5;
        return res;
    }
}


TransItemToken.static_constructor();

module.exports = TransItemToken