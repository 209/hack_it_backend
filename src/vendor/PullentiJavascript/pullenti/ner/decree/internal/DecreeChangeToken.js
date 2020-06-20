/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const DecreeChangeValueKind = require("./../DecreeChangeValueKind");
const DecreeChangeValueReferent = require("./../DecreeChangeValueReferent");
const MetaToken = require("./../../MetaToken");
const MorphGender = require("./../../../morph/MorphGender");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const InstrToken1Types = require("./../../instrument/internal/InstrToken1Types");
const MorphLang = require("./../../../morph/MorphLang");
const DecreeChangeReferent = require("./../DecreeChangeReferent");
const NumberingHelper = require("./../../instrument/internal/NumberingHelper");
const Referent = require("./../../Referent");
const ReferentToken = require("./../../ReferentToken");
const Termin = require("./../../core/Termin");
const TerminCollection = require("./../../core/TerminCollection");
const DecreeChangeKind = require("./../DecreeChangeKind");
const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const BracketHelper = require("./../../core/BracketHelper");
const MiscHelper = require("./../../core/MiscHelper");
const PartTokenItemType = require("./PartTokenItemType");
const DecreeChangeTokenTyp = require("./DecreeChangeTokenTyp");
const DecreeTokenItemType = require("./DecreeTokenItemType");
const Token = require("./../../Token");
const DecreePartReferent = require("./../DecreePartReferent");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const NumberSpellingType = require("./../../NumberSpellingType");
const DecreeReferent = require("./../DecreeReferent");
const BracketParseAttr = require("./../../core/BracketParseAttr");

class DecreeChangeToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = DecreeChangeTokenTyp.UNDEFINED;
        this.decree = null;
        this.decree_tok = null;
        this.parts = null;
        this.new_parts = null;
        this.real_part = null;
        this.change_val = null;
        this.has_name = false;
        this.has_text = false;
        this.act_kind = DecreeChangeKind.UNDEFINED;
        this.part_typ = PartTokenItemType.UNDEFINED;
    }
    
    toString() {
        let tmp = new StringBuilder();
        tmp.append(this.typ.toString());
        if (this.act_kind !== DecreeChangeKind.UNDEFINED) 
            tmp.append(" Kind=").append(this.act_kind.toString());
        if (this.has_name) 
            tmp.append(" HasName");
        if (this.has_text) 
            tmp.append(" HasText");
        if (this.parts !== null) {
            for (const p of this.parts) {
                tmp.append(" ").append(p);
            }
        }
        if (this.real_part !== null) 
            tmp.append(" RealPart=").append(this.real_part.toString());
        if (this.new_parts !== null) {
            for (const p of this.new_parts) {
                tmp.append(" New=").append(p);
            }
        }
        if (this.part_typ !== PartTokenItemType.UNDEFINED) 
            tmp.append(" PTyp=").append(this.part_typ.toString());
        if (this.decree_tok !== null) 
            tmp.append(" DecTok=").append(this.decree_tok.toString());
        if (this.decree !== null) 
            tmp.append(" Ref=").append(this.decree.to_string(true, null, 0));
        if (this.change_val !== null) 
            tmp.append(" ChangeVal=").append(this.change_val.to_string(true, null, 0));
        return tmp.toString();
    }
    
    get is_start() {
        return this.typ === DecreeChangeTokenTyp.STARTSINGLE || this.typ === DecreeChangeTokenTyp.STARTMULTU || this.typ === DecreeChangeTokenTyp.SINGLE;
    }
    
    static try_attach(t, main = null, ignore_newlines = false, change_stack = null, is_in_edition = false) {
        const PartToken = require("./PartToken");
        const DecreeToken = require("./DecreeToken");
        const InstrToken1 = require("./../../instrument/internal/InstrToken1");
        if (t === null) 
            return null;
        let tt = t;
        if (t.is_newline_before && !ignore_newlines) {
            for (tt = t; tt !== null; tt = tt.next) {
                if (tt === t && BracketHelper.is_bracket(tt, false) && !tt.is_char('(')) 
                    break;
                else if ((tt === t && (tt instanceof TextToken) && (((tt).term === "СТАТЬЯ" || (tt).term === "СТАТТЯ"))) && (tt.next instanceof NumberToken)) {
                    let tt1 = tt.next.next;
                    if (tt1 !== null && tt1.is_char('.')) {
                        tt1 = tt1.next;
                        if (tt1 !== null && !tt1.is_newline_before && tt1.is_value("ВНЕСТИ", "УНЕСТИ")) 
                            continue;
                        if (tt1 !== null && tt1.is_newline_before) 
                            return null;
                        tt = tt1;
                    }
                    break;
                }
                else if (tt === t && PartToken.try_attach(tt, null, false, false) !== null) 
                    break;
                else if ((tt instanceof NumberToken) && (tt).typ === NumberSpellingType.DIGIT) {
                }
                else if (tt.is_hiphen) {
                }
                else if ((tt instanceof TextToken) && !tt.chars.is_letter && !tt.is_whitespace_before) {
                }
                else if (((tt instanceof TextToken) && tt.length_char === 1 && (tt.next instanceof TextToken)) && !tt.next.chars.is_letter) {
                }
                else 
                    break;
            }
        }
        if (tt === null) 
            return null;
        let res = null;
        if (((tt instanceof TextToken) && t.is_newline_before && !ignore_newlines) && tt.is_value("ВНЕСТИ", "УНЕСТИ") && ((((tt.next !== null && tt.next.is_value("В", "ДО"))) || (tt).term === "ВНЕСТИ" || (tt).term === "УНЕСТИ"))) {
            res = DecreeChangeToken._new791(tt, tt, DecreeChangeTokenTyp.STARTMULTU);
            if (tt.next !== null && tt.next.is_value("В", "ДО")) 
                res.end_token = (tt = tt.next);
            let has_change = false;
            for (tt = tt.next; tt !== null; tt = tt.next) {
                if (tt.is_newline_before) 
                    break;
                if (tt.get_referent() instanceof DecreeReferent) {
                    if (res.decree !== null && tt.get_referent() !== res.decree) 
                        break;
                    res.decree = Utils.as(tt.get_referent(), DecreeReferent);
                    res.end_token = tt;
                    continue;
                }
                let li = PartToken.try_attach_list(tt, false, 40);
                if (li !== null && li.length > 0) {
                    res.parts = li;
                    tt = res.end_token = li[li.length - 1].end_token;
                    continue;
                }
                if (tt.is_char('(')) {
                    let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        tt = br.end_token;
                        continue;
                    }
                }
                if (tt.is_newline_before) 
                    break;
                res.end_token = tt;
                if (tt.is_char(',') && has_change) {
                    res.typ = DecreeChangeTokenTyp.STARTSINGLE;
                    break;
                }
                if (tt.is_value("ИЗМЕНЕНИЕ", "ЗМІНА") || tt.is_value("ДОПОЛНЕНИЕ", "ДОДАТОК")) 
                    has_change = true;
                else if (tt.is_value("СЛЕДУЮЩИЙ", "НАСТУПНИЙ")) {
                }
                else if (tt.is_value("ТАКОЙ", "ТАКИЙ")) {
                }
            }
            if (!has_change) 
                return null;
            if (res.decree === null) 
                return null;
            tt = res.end_token.next;
            if (res.typ === DecreeChangeTokenTyp.STARTSINGLE && res.parts === null && tt !== null) {
                if ((tt.is_value("ИЗЛОЖИВ", "ВИКЛАВШИ") || tt.is_value("ДОПОЛНИВ", "ДОПОВНИВШИ") || tt.is_value("ИСКЛЮЧИВ", "ВИКЛЮЧИВШИ")) || tt.is_value("ЗАМЕНИВ", "ЗАМІНИВШИ")) {
                    tt = tt.next;
                    if (tt !== null && tt.morph.class0.is_preposition) 
                        tt = tt.next;
                    res.parts = PartToken.try_attach_list(tt, false, 40);
                    if (res.parts !== null) {
                        tt = res.end_token.next;
                        if (tt.is_value("ДОПОЛНИВ", "ДОПОВНИВШИ")) 
                            res.act_kind = DecreeChangeKind.APPEND;
                        else if (tt.is_value("ИСКЛЮЧИВ", "ВИКЛЮЧИВШИ")) 
                            res.act_kind = DecreeChangeKind.REMOVE;
                        else if (tt.is_value("ИЗЛОЖИВ", "ВИКЛАВШИ")) 
                            res.act_kind = DecreeChangeKind.NEW;
                        else if (tt.is_value("ЗАМЕНИВ", "ЗАМІНИВШИ")) 
                            res.act_kind = DecreeChangeKind.EXCHANGE;
                        res.end_token = res.parts[res.parts.length - 1];
                    }
                }
            }
            return res;
        }
        if (((!ignore_newlines && t.is_newline_before && ((tt.is_value("ПРИЗНАТЬ", "ВИЗНАТИ") || tt.is_value("СЧИТАТЬ", "ВВАЖАТИ")))) && tt.next !== null && tt.next.is_value("УТРАТИТЬ", "ВТРАТИТИ")) && tt.next.next !== null && tt.next.next.is_value("СИЛА", "ЧИННІСТЬ")) {
            res = DecreeChangeToken._new792(tt, tt.next.next, DecreeChangeTokenTyp.ACTION, DecreeChangeKind.EXPIRE);
            for (tt = tt.next.next.next; tt !== null; tt = tt.next) {
                if (tt.is_char(':')) {
                    res.typ = DecreeChangeTokenTyp.STARTMULTU;
                    res.end_token = tt;
                    break;
                }
                if (tt.get_referent() instanceof DecreeReferent) {
                    if (res.decree !== null) 
                        break;
                    res.typ = DecreeChangeTokenTyp.STARTSINGLE;
                    res.decree = Utils.as(tt.get_referent(), DecreeReferent);
                    res.end_token = tt;
                    continue;
                }
                let li = PartToken.try_attach_list(tt, false, 40);
                if (li !== null && li.length > 0) {
                    if (res.parts !== null) 
                        break;
                    res.typ = DecreeChangeTokenTyp.STARTSINGLE;
                    res.parts = li;
                    tt = res.end_token = li[li.length - 1].end_token;
                    continue;
                }
                if (tt.is_char('(')) {
                    let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        tt = br.end_token;
                        continue;
                    }
                }
                if (tt.is_newline_before) 
                    break;
            }
            return res;
        }
        if ((!ignore_newlines && ((t.is_newline_before || tt === t)) && tt.is_value("УТРАТИТЬ", "ВТРАТИТИ")) && tt.next !== null && tt.next.is_value("СИЛА", "ЧИННІСТЬ")) {
            res = DecreeChangeToken._new791(tt, tt.next, DecreeChangeTokenTyp.UNDEFINED);
            for (tt = tt.next; tt !== null; tt = tt.next) {
                res.end_token = tt;
                if (tt.is_newline_after) 
                    break;
            }
            return res;
        }
        if (!ignore_newlines && t.is_newline_before) {
            if (tt.is_value("СЛОВО", null)) {
            }
            res = DecreeChangeToken._new791(tt, tt, DecreeChangeTokenTyp.STARTSINGLE);
            for (; tt !== null; tt = tt.next) {
                if (tt !== t && tt.is_newline_before) 
                    break;
                if (tt.is_value("К", null) || tt.is_value("В", null) || tt.is_value("ИЗ", null)) 
                    continue;
                if (tt.is_value("ПЕРЕЧЕНЬ", "ПЕРЕЛІК") && tt.next !== null && tt.next.is_value("ИЗМЕНЕНИЕ", "ЗМІНА")) {
                    if (tt === t) 
                        res.begin_token = res.end_token = tt.next;
                    tt = tt.next.next;
                    res.typ = DecreeChangeTokenTyp.STARTMULTU;
                    if (tt !== null && tt.is_char(',')) 
                        tt = tt.next;
                    if (tt !== null && tt.is_value("ВНОСИМЫЙ", "ВНЕСЕНИЙ")) 
                        tt = tt.next;
                    if (tt === null) 
                        break;
                    continue;
                }
                if (tt.is_value("НАИМЕНОВАНИЕ", "НАЙМЕНУВАННЯ") || tt.is_value("НАЗВАНИЕ", "НАЗВА")) {
                    res.end_token = tt;
                    if ((tt.next !== null && tt.next.is_and && tt.next.next !== null) && tt.next.next.is_value("ТЕКСТ", null)) {
                        res.has_text = true;
                        res.end_token = (tt = tt.next.next);
                    }
                    res.has_name = true;
                    continue;
                }
                if (tt.is_value("ТЕКСТ", null)) {
                    let pt = PartToken.try_attach(tt.next, null, false, true);
                    if (pt !== null && pt.end_token.next !== null && pt.end_token.next.is_value("СЧИТАТЬ", "ВВАЖАТИ")) {
                        res.end_token = pt.end_token;
                        if (change_stack !== null && change_stack.length > 0 && (change_stack[0] instanceof DecreePartReferent)) 
                            res.real_part = Utils.as(change_stack[0], DecreePartReferent);
                        res.act_kind = DecreeChangeKind.CONSIDER;
                        res.part_typ = pt.typ;
                        res.has_text = true;
                        return res;
                    }
                }
                if ((res.parts === null && !res.has_name && tt.is_value("ДОПОЛНИТЬ", "ДОПОВНИТИ")) && tt.next !== null) {
                    res.act_kind = DecreeChangeKind.APPEND;
                    let tt1 = DecreeToken.is_keyword(tt.next, false);
                    if (tt1 === null || tt1.morph._case.is_instrumental) 
                        tt1 = tt.next;
                    else 
                        tt1 = tt1.next;
                    if (tt1 !== null && tt1.is_value("НОВЫЙ", "НОВИЙ")) 
                        tt1 = tt1.next;
                    if (tt1 !== null && tt1.morph._case.is_instrumental) {
                        let pt = PartToken.try_attach(tt1, null, false, false);
                        if (pt === null) 
                            pt = PartToken.try_attach(tt1, null, false, true);
                        if (pt !== null && pt.typ !== PartTokenItemType.PREFIX) {
                            res.part_typ = pt.typ;
                            tt = res.end_token = pt.end_token;
                            if (res.new_parts === null) 
                                res.new_parts = new Array();
                            res.new_parts.push(pt);
                            if (tt.next !== null && tt.next.is_and) {
                                pt = PartToken.try_attach(tt.next.next, null, false, false);
                                if (pt === null) 
                                    pt = PartToken.try_attach(tt.next.next, null, false, true);
                                if (pt !== null) {
                                    res.new_parts.push(pt);
                                    tt = res.end_token = pt.end_token;
                                }
                            }
                        }
                        continue;
                    }
                }
                let li = PartToken.try_attach_list(tt, false, 40);
                if (li === null && tt.is_value("ПРИМЕЧАНИЕ", "ПРИМІТКА")) {
                    li = new Array();
                    li.push(PartToken._new795(tt, tt, PartTokenItemType.NOTICE));
                }
                if (li !== null && li.length > 0 && li[0].typ === PartTokenItemType.PREFIX) 
                    li = null;
                if (li !== null && li.length > 0) {
                    if (li.length === 1 && PartToken._get_rank(li[0].typ) > 0 && tt === t) {
                        if (li[0].is_newline_after) 
                            return null;
                        if (li[0].end_token.next !== null && li[0].end_token.next.is_char('.')) 
                            return null;
                    }
                    if (res.act_kind !== DecreeChangeKind.APPEND) {
                        if (res.parts !== null) 
                            break;
                        res.parts = li;
                    }
                    tt = res.end_token = li[li.length - 1].end_token;
                    continue;
                }
                if ((tt.morph.class0.is_noun && change_stack !== null && change_stack.length > 0) && (change_stack[0] instanceof DecreePartReferent)) {
                    let pa = PartToken.try_attach(tt, null, false, true);
                    if (pa !== null) {
                        if (change_stack[0].get_string_value(PartToken._get_attr_name_by_typ(pa.typ)) !== null) {
                            res.real_part = Utils.as(change_stack[0], DecreePartReferent);
                            res.end_token = tt;
                            continue;
                        }
                    }
                }
                if (res.act_kind === DecreeChangeKind.APPEND) {
                    let pa = PartToken.try_attach(tt, null, false, true);
                    if (pa !== null) {
                        if (res.new_parts === null) 
                            res.new_parts = new Array();
                        res.new_parts.push(pa);
                        res.end_token = pa.end_token;
                        continue;
                    }
                }
                if (tt.get_referent() instanceof DecreeReferent) {
                    res.decree = Utils.as(tt.get_referent(), DecreeReferent);
                    res.end_token = tt;
                    if (tt.next !== null && tt.next.is_char('(')) {
                        let br = BracketHelper.try_parse(tt.next, BracketParseAttr.NO, 100);
                        if (br !== null) 
                            res.end_token = (tt = br.end_token);
                    }
                    continue;
                }
                let pt0 = PartToken.try_attach(tt, null, false, true);
                if (pt0 !== null && ((res.has_name || pt0.typ === PartTokenItemType.APPENDIX)) && pt0.typ !== PartTokenItemType.PREFIX) {
                    tt = res.end_token = pt0.end_token;
                    res.part_typ = pt0.typ;
                    if (pt0.typ === PartTokenItemType.APPENDIX && res.parts === null) {
                        res.parts = new Array();
                        res.parts.push(pt0);
                    }
                    continue;
                }
                if (res.change_val === null && !is_in_edition) {
                    let res1 = null;
                    if (tt === res.begin_token && BracketHelper.can_be_start_of_sequence(tt, false, false)) {
                    }
                    else 
                        res1 = DecreeChangeToken.try_attach(tt, main, true, null, false);
                    if (res1 !== null && res1.typ === DecreeChangeTokenTyp.VALUE && res1.change_val !== null) {
                        res.change_val = res1.change_val;
                        if (res.act_kind === DecreeChangeKind.UNDEFINED) 
                            res.act_kind = res1.act_kind;
                        tt = res.end_token = res1.end_token;
                        if (tt.next !== null && tt.next.is_value("К", null)) 
                            tt = tt.next;
                        continue;
                    }
                    if (tt.is_value("ПОСЛЕ", "ПІСЛЯ")) {
                        pt0 = PartToken.try_attach(tt.next, null, true, false);
                        if (pt0 !== null && pt0.typ !== PartTokenItemType.PREFIX) {
                            if (res.parts === null) {
                                res.parts = new Array();
                                res.parts.push(pt0);
                            }
                            tt = res.end_token = pt0.end_token;
                            continue;
                        }
                    }
                    if (tt.is_value("ТЕКСТ", null) && tt.previous !== null && tt.previous.is_value("В", "У")) 
                        continue;
                    if (tt.is_value("ИЗМЕНЕНИЕ", "ЗМІНА")) {
                        res.end_token = tt;
                        continue;
                    }
                }
                if (tt !== t && ((res.has_name || res.parts !== null)) && res.decree === null) {
                    let dts = DecreeToken.try_attach_list(tt, null, 10, false);
                    if (dts !== null && dts.length > 0 && dts[0].typ === DecreeTokenItemType.TYP) {
                        tt = res.end_token = dts[dts.length - 1].end_token;
                        if (main !== null && res.decree === null && res.decree_tok === null) {
                            let dec = null;
                            for (const v of main.owners) {
                                if (v instanceof DecreeReferent) {
                                    dec = Utils.as(v, DecreeReferent);
                                    break;
                                }
                                else if (v instanceof DecreePartReferent) {
                                    dec = (v).owner;
                                    if (dec !== null) 
                                        break;
                                }
                            }
                            if (dec !== null && dec.typ0 === dts[0].value) {
                                res.decree = dec;
                                res.decree_tok = dts[0];
                            }
                        }
                        continue;
                    }
                }
                if (tt === res.begin_token && main !== null) {
                    let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null) {
                        let tt1 = npt.end_token.next;
                        if ((tt1 !== null && tt1.is_value("ИЗЛОЖИТЬ", "ВИКЛАСТИ") && tt1.next !== null) && tt1.next.is_value("В", null)) {
                            let pt = PartToken._new795(tt, npt.end_token, PartTokenItemType.APPENDIX);
                            pt.name = npt.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                            res.parts = new Array();
                            res.parts.push(pt);
                            res.end_token = pt.end_token;
                            break;
                        }
                    }
                }
                let ttt = DecreeToken.is_keyword(tt, false);
                if (ttt !== null && res.parts === null) {
                    let ttt0 = ttt;
                    for (; ttt !== null; ttt = ttt.next) {
                        if (MiscHelper.can_be_start_of_sentence(ttt)) 
                            break;
                        if (ttt.is_char('(') && ttt.next !== null && ttt.next.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) {
                            if (ttt.is_newline_before) 
                                break;
                            let br = BracketHelper.try_parse(ttt, BracketParseAttr.NO, 100);
                            if (br === null) 
                                break;
                            let pt = PartToken.try_attach(ttt.next, null, false, false);
                            if (pt === null) 
                                PartToken.try_attach(ttt.next, null, false, true);
                            if (pt !== null) {
                                res.parts = new Array();
                                res.parts.push(pt);
                                tt = res.end_token = br.end_token;
                                break;
                            }
                        }
                    }
                    if (res.parts !== null) 
                        continue;
                    if (res.act_kind === DecreeChangeKind.APPEND) {
                        tt = res.end_token = ttt0;
                        continue;
                    }
                    tt = ttt0;
                    continue;
                }
                break;
            }
            if (((res.has_name || res.parts !== null || res.decree !== null) || res.real_part !== null || res.act_kind !== DecreeChangeKind.UNDEFINED) || res.change_val !== null) {
                if (res.end_token.next !== null && res.end_token.next.is_char(':') && res.end_token.next.is_newline_after) {
                    res.typ = DecreeChangeTokenTyp.SINGLE;
                    res.end_token = res.end_token.next;
                }
                return res;
            }
            if (res.begin_token === tt) {
                let tok1 = DecreeChangeToken.m_terms.try_parse(tt, TerminParseAttr.NO);
                if (tok1 !== null) {
                }
                else 
                    return null;
            }
            else 
                return null;
        }
        let tok = DecreeChangeToken.m_terms.try_parse(tt, TerminParseAttr.NO);
        if (tt.morph.class0.is_adjective && (((tt instanceof NumberToken) || tt.is_value("ПОСЛЕДНИЙ", "ОСТАННІЙ") || tt.is_value("ПРЕДПОСЛЕДНИЙ", "ПЕРЕДОСТАННІЙ")))) {
            tok = DecreeChangeToken.m_terms.try_parse(tt.next, TerminParseAttr.NO);
            if (tok !== null && (tok.termin.tag instanceof DecreeChangeValueKind)) {
            }
            else 
                tok = null;
        }
        if (tok !== null) {
            if (tok.termin.tag instanceof DecreeChangeKind) {
                res = DecreeChangeToken._new792(tt, tok.end_token, DecreeChangeTokenTyp.ACTION, DecreeChangeKind.of(tok.termin.tag));
                if (((res.act_kind === DecreeChangeKind.APPEND || res.act_kind === DecreeChangeKind.CONSIDER)) && tok.end_token.next !== null && tok.end_token.next.morph._case.is_instrumental) {
                    let pt = PartToken.try_attach(tok.end_token.next, null, false, false);
                    if (pt === null) 
                        pt = PartToken.try_attach(tok.end_token.next, null, false, true);
                    if (pt !== null && pt.typ !== PartTokenItemType.PREFIX) {
                        if (res.act_kind === DecreeChangeKind.APPEND) {
                            res.part_typ = pt.typ;
                            if (res.new_parts === null) 
                                res.new_parts = new Array();
                            res.new_parts.push(pt);
                        }
                        else if (res.act_kind === DecreeChangeKind.CONSIDER) {
                            res.change_val = new DecreeChangeValueReferent();
                            res.change_val.value = pt.get_source_text();
                        }
                        tt = res.end_token = pt.end_token;
                        if (tt.next !== null && tt.next.is_and && res.act_kind === DecreeChangeKind.APPEND) {
                            pt = PartToken.try_attach(tt.next.next, null, false, false);
                            if (pt === null) 
                                pt = PartToken.try_attach(tt.next.next, null, false, true);
                            if (pt !== null) {
                                res.new_parts.push(pt);
                                tt = res.end_token = pt.end_token;
                            }
                        }
                    }
                }
                return res;
            }
            if (tok.termin.tag instanceof DecreeChangeValueKind) {
                res = DecreeChangeToken._new791(tt, tok.end_token, DecreeChangeTokenTyp.VALUE);
                res.change_val = new DecreeChangeValueReferent();
                res.change_val.kind = DecreeChangeValueKind.of(tok.termin.tag);
                tt = tok.end_token.next;
                if (tt === null) 
                    return null;
                if (res.change_val.kind === DecreeChangeValueKind.SEQUENCE || res.change_val.kind === DecreeChangeValueKind.FOOTNOTE) {
                    if (tt instanceof NumberToken) {
                        res.change_val.number = (tt).value.toString();
                        res.end_token = tt;
                        tt = tt.next;
                    }
                    else if (res.begin_token instanceof NumberToken) 
                        res.change_val.number = (res.begin_token).value.toString();
                    else if (res.begin_token.morph.class0.is_adjective) 
                        res.change_val.number = res.begin_token.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                    else if (BracketHelper.can_be_start_of_sequence(tt, false, false) && (tt.next instanceof NumberToken) && BracketHelper.can_be_end_of_sequence(tt.next.next, false, null, false)) {
                        res.change_val.number = (tt.next).value.toString();
                        res.end_token = (tt = tt.next.next);
                        tt = tt.next;
                    }
                }
                if (tt !== null && tt.is_value("ИЗЛОЖИТЬ", "ВИКЛАСТИ") && res.act_kind === DecreeChangeKind.UNDEFINED) {
                    res.act_kind = DecreeChangeKind.NEW;
                    tt = tt.next;
                    if (tt !== null && tt.is_value("В", null)) 
                        tt = tt.next;
                }
                if ((tt !== null && ((tt.is_value("СЛЕДУЮЩИЙ", "НАСТУПНИЙ") || tt.is_value("ТАКОЙ", "ТАКИЙ"))) && tt.next !== null) && ((tt.next.is_value("СОДЕРЖАНИЕ", "ЗМІСТ") || tt.next.is_value("СОДЕРЖИМОЕ", "ВМІСТ") || tt.next.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")))) 
                    tt = tt.next.next;
                else if (tt !== null && tt.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) 
                    tt = tt.next;
                if (tt !== null && tt.is_char(':')) 
                    tt = tt.next;
                let can_be_start = false;
                if (BracketHelper.can_be_start_of_sequence(tt, true, false)) 
                    can_be_start = true;
                else if ((tt instanceof MetaToken) && BracketHelper.can_be_start_of_sequence((tt).begin_token, true, false)) 
                    can_be_start = true;
                else if (tt !== null && tt.is_newline_before && tt.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")) {
                    if ((tt.previous !== null && tt.previous.is_char(':') && tt.previous.previous !== null) && tt.previous.previous.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) 
                        can_be_start = true;
                }
                if (can_be_start) {
                    for (let ttt = (BracketHelper.can_be_start_of_sequence(tt, true, false) ? tt.next : tt); ttt !== null; ttt = ttt.next) {
                        if (ttt.is_char_of(".;") && ttt.is_newline_after) {
                            res.change_val.value = (new MetaToken(tt.next, ttt.previous)).get_source_text();
                            res.end_token = ttt;
                            break;
                        }
                        if (BracketHelper.is_bracket(ttt, true)) {
                        }
                        else if (((ttt instanceof MetaToken)) && BracketHelper.is_bracket((ttt).end_token, true)) {
                        }
                        else 
                            continue;
                        if (ttt.next === null || ttt.is_newline_after) {
                        }
                        else if (ttt.next.is_char_of(".;") && ttt.next.is_newline_after) {
                        }
                        else if (ttt.next.is_comma_and && DecreeChangeToken.try_attach(ttt.next.next, main, false, change_stack, true) !== null) {
                        }
                        else if (DecreeChangeToken.try_attach(ttt.next, main, false, change_stack, true) !== null || DecreeChangeToken.m_terms.try_parse(ttt.next, TerminParseAttr.NO) !== null) {
                        }
                        else 
                            continue;
                        let val = (new MetaToken((BracketHelper.is_bracket(tt, true) ? tt.next : tt), (BracketHelper.is_bracket(ttt, true) ? ttt.previous : ttt))).get_source_text();
                        res.end_token = ttt;
                        if (!BracketHelper.can_be_start_of_sequence(tt, true, false)) 
                            val = val.substring(1);
                        if (!BracketHelper.is_bracket(ttt, true)) 
                            val = val.substring(0, 0 + val.length - 1);
                        res.change_val.value = val;
                        break;
                    }
                    if (res.change_val.value === null) 
                        return null;
                    if (res.change_val.kind === DecreeChangeValueKind.WORDS) {
                        tok = DecreeChangeToken.m_terms.try_parse(res.end_token.next, TerminParseAttr.NO);
                        if (tok !== null && (tok.termin.tag instanceof DecreeChangeValueKind) && (DecreeChangeValueKind.of(tok.termin.tag)) === DecreeChangeValueKind.ROBUSTWORDS) {
                            res.change_val.kind = DecreeChangeValueKind.ROBUSTWORDS;
                            res.end_token = tok.end_token;
                        }
                    }
                }
                return res;
            }
        }
        let is_nex_change = 0;
        if (t !== null && t.is_value("В", "У") && t.next !== null) {
            t = t.next;
            if (t.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ") && t.next !== null) {
                is_nex_change = 1;
                t = t.next;
            }
        }
        if (((t.is_value("СЛЕДУЮЩИЙ", "НАСТУПНИЙ") || tt.is_value("ТАКОЙ", "ТАКИЙ"))) && t.next !== null && ((t.next.is_value("СОДЕРЖАНИЕ", "ЗМІСТ") || t.next.is_value("СОДЕРЖИМОЕ", "ВМІСТ") || t.next.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")))) {
            is_nex_change = 2;
            t = t.next.next;
        }
        if (t.is_char(':') && t.next !== null) {
            if (t.previous !== null && t.previous.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) 
                is_nex_change++;
            tt = (t = t.next);
            if (is_nex_change > 0) 
                is_nex_change++;
        }
        if ((t === tt && t.previous !== null && t.previous.is_char(':')) && BracketHelper.is_bracket(t, false) && !t.is_char('(')) 
            is_nex_change = 1;
        if (((is_nex_change > 0 && BracketHelper.is_bracket(t, true))) || ((is_nex_change > 1 && t.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК")))) {
            res = DecreeChangeToken._new791(t, t, DecreeChangeTokenTyp.VALUE);
            res.change_val = DecreeChangeValueReferent._new800(DecreeChangeValueKind.TEXT);
            if (is_in_edition) 
                return res;
            let t0 = (BracketHelper.is_bracket(t, true) ? t.next : t);
            let doubt1 = null;
            let clause_last = null;
            for (tt = t.next; tt !== null; tt = tt.next) {
                if (!tt.is_newline_after) 
                    continue;
                let is_doubt = false;
                let instr = InstrToken1.parse(tt.next, true, null, 0, null, false, 0, false, false);
                let dc_next = DecreeChangeToken.try_attach(tt.next, null, false, null, true);
                if (dc_next === null) 
                    dc_next = DecreeChangeToken.try_attach(tt.next, null, true, null, true);
                if (tt.next === null) {
                }
                else if (dc_next !== null && ((dc_next.is_start || dc_next.change_val !== null || dc_next.typ === DecreeChangeTokenTyp.UNDEFINED))) {
                }
                else {
                    is_doubt = true;
                    let pt = PartToken.try_attach(tt.next, null, false, false);
                    if (pt !== null && pt.typ === PartTokenItemType.CLAUSE && ((pt.is_newline_after || ((pt.end_token.next !== null && pt.end_token.next.is_char('.')))))) {
                        is_doubt = false;
                        if (clause_last !== null && instr !== null && NumberingHelper.calc_delta(clause_last, instr, true) === 1) 
                            is_doubt = true;
                    }
                }
                if (instr !== null && instr.typ === InstrToken1Types.CLAUSE) 
                    clause_last = instr;
                if (is_doubt && instr !== null) {
                    for (let ttt = tt; ttt !== null && ttt.end_char <= instr.end_char; ttt = ttt.next) {
                        if (ttt.is_value("УТРАТИТЬ", "ВТРАТИТИ") && ttt.next !== null && ttt.next.is_value("СИЛА", "ЧИННІСТЬ")) {
                            is_doubt = false;
                            break;
                        }
                    }
                }
                res.end_token = tt;
                let tt1 = tt;
                if (tt1.is_char_of(";.")) 
                    tt1 = res.end_token = tt1.previous;
                if (BracketHelper.is_bracket(tt1, true)) 
                    tt1 = tt1.previous;
                else if ((tt1 instanceof MetaToken) && BracketHelper.is_bracket((tt1).end_token, true)) {
                }
                else 
                    continue;
                if (is_doubt) {
                    if (doubt1 === null) 
                        doubt1 = tt1;
                    continue;
                }
                if (tt1.begin_char > t.end_char) {
                    res.change_val.value = (new MetaToken(t0, tt1)).get_source_text();
                    return res;
                }
                break;
            }
            if (doubt1 !== null) {
                res.change_val.value = (new MetaToken(t0, doubt1)).get_source_text();
                res.end_token = doubt1;
                if (BracketHelper.is_bracket(doubt1.next, true)) 
                    res.end_token = doubt1.next;
                return res;
            }
            return null;
        }
        if (t.is_value("ПОСЛЕ", "ПІСЛЯ")) {
            res = DecreeChangeToken.try_attach(t.next, null, false, null, false);
            if (res !== null && res.typ === DecreeChangeTokenTyp.VALUE) {
                res.typ = DecreeChangeTokenTyp.AFTERVALUE;
                res.begin_token = t;
                return res;
            }
        }
        return null;
    }
    
    static try_attach_list(t) {
        const PartToken = require("./PartToken");
        if (t === null || t.is_newline_before) 
            return null;
        let d0 = DecreeChangeToken.try_attach(t, null, false, null, false);
        if (d0 === null) 
            return null;
        let res = new Array();
        res.push(d0);
        t = d0.end_token.next;
        for (; t !== null; t = t.next) {
            if (t.is_newline_before) {
                if ((t.is_value("ПРИЛОЖЕНИЕ", "ДОДАТОК") && t.previous !== null && t.previous.is_char(':')) && t.previous.previous !== null && t.previous.previous.is_value("РЕДАКЦИЯ", "РЕДАКЦІЯ")) {
                }
                else 
                    break;
            }
            let d = DecreeChangeToken.try_attach(t, null, false, null, false);
            if (d === null && t.is_char('.') && !t.is_newline_after) 
                continue;
            if (d === null) {
                if (t.is_value("НОВЫЙ", "НОВИЙ")) 
                    continue;
                if (t.is_value("НА", null)) 
                    continue;
                if (t.is_char(':') && ((!t.is_newline_after || res[res.length - 1].act_kind === DecreeChangeKind.NEW))) 
                    continue;
                if ((t instanceof TextToken) && (t).term === "ТЕКСТОМ") 
                    continue;
                let pts = PartToken.try_attach_list(t, false, 40);
                if (pts !== null) 
                    d = DecreeChangeToken._new801(pts[0].begin_token, pts[pts.length - 1].end_token, DecreeChangeTokenTyp.UNDEFINED, pts);
                else {
                    let pt = PartToken.try_attach(t, null, true, false);
                    if (pt === null) 
                        pt = PartToken.try_attach(t, null, true, true);
                    if (pt !== null) {
                        d = new DecreeChangeToken(pt.begin_token, pt.end_token);
                        if (t.previous !== null && t.previous.is_value("НОВЫЙ", "НОВИЙ")) {
                            d.new_parts = new Array();
                            d.new_parts.push(pt);
                        }
                        else 
                            d.part_typ = pt.typ;
                    }
                }
            }
            if (d === null) 
                break;
            if (d.typ === DecreeChangeTokenTyp.SINGLE || d.typ === DecreeChangeTokenTyp.STARTMULTU || d.typ === DecreeChangeTokenTyp.STARTSINGLE) 
                break;
            res.push(d);
            t = d.end_token;
        }
        return res;
    }
    
    static initialize() {
        if (DecreeChangeToken.m_terms !== null) 
            return;
        DecreeChangeToken.m_terms = new TerminCollection();
        let t = null;
        t = Termin._new119("ИЗЛОЖИТЬ В СЛЕДУЮЩЕЙ РЕДАКЦИИ", DecreeChangeKind.NEW);
        t.add_variant("ИЗЛОЖИВ ЕГО В СЛЕДУЮЩЕЙ РЕДАКЦИИ", false);
        t.add_variant("ИЗЛОЖИТЬ В РЕДАКЦИИ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("ВИКЛАСТИ В НАСТУПНІЙ РЕДАКЦІЇ", MorphLang.UA, DecreeChangeKind.NEW);
        t.add_variant("ВИКЛАВШИ В ТАКІЙ РЕДАКЦІЇ", false);
        t.add_variant("ВИКЛАВШИ ЙОГО В НАСТУПНІЙ РЕДАКЦІЇ", false);
        t.add_variant("ВИКЛАСТИ В РЕДАКЦІЇ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("ПРИЗНАТЬ УТРАТИВШИМ СИЛУ", DecreeChangeKind.EXPIRE);
        t.add_variant("СЧИТАТЬ УТРАТИВШИМ СИЛУ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("ВИЗНАТИ таким, що ВТРАТИВ ЧИННІСТЬ", MorphLang.UA, DecreeChangeKind.EXPIRE);
        t.add_variant("ВВАЖАТИ таким, що ВТРАТИВ ЧИННІСТЬ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("ИСКЛЮЧИТЬ", DecreeChangeKind.REMOVE);
        t.add_variant("ИСКЛЮЧИВ ИЗ НЕГО", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("ВИКЛЮЧИТИ", MorphLang.UA, DecreeChangeKind.REMOVE);
        t.add_variant("ВИКЛЮЧИВШИ З НЬОГО", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("СЧИТАТЬ", DecreeChangeKind.CONSIDER);
        t.add_variant("СЧИТАТЬ СООТВЕТСТВЕННО", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("ВВАЖАТИ", MorphLang.UA, DecreeChangeKind.CONSIDER);
        t.add_variant("ВВАЖАТИ ВІДПОВІДНО", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("ЗАМЕНИТЬ", DecreeChangeKind.EXCHANGE);
        t.add_variant("ЗАМЕНИВ В НЕМ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("ЗАМІНИТИ", MorphLang.UA, DecreeChangeKind.EXCHANGE);
        t.add_variant("ЗАМІНИВШИ В НЬОМУ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("ДОПОЛНИТЬ", DecreeChangeKind.APPEND);
        t.add_variant("ДОПОЛНИВ ЕГО", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("ДОПОВНИТИ", MorphLang.UA, DecreeChangeKind.APPEND);
        t.add_variant("ДОПОВНИВШИ ЙОГО", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("СЛОВО", DecreeChangeValueKind.WORDS);
        t.add_variant("АББРЕВИАТУРА", false);
        t.add_variant("АБРЕВІАТУРА", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("ЦИФРА", DecreeChangeValueKind.NUMBERS);
        t.add_variant("ЧИСЛО", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("ПРЕДЛОЖЕНИЕ", DecreeChangeValueKind.SEQUENCE);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("ПРОПОЗИЦІЯ", MorphLang.UA, DecreeChangeValueKind.SEQUENCE);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("СНОСКА", DecreeChangeValueKind.FOOTNOTE);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("ВИНОСКА", MorphLang.UA, DecreeChangeValueKind.FOOTNOTE);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("БЛОК", DecreeChangeValueKind.BLOCK);
        t.add_variant("БЛОК СО СЛОВАМИ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("БЛОК", MorphLang.UA, DecreeChangeValueKind.BLOCK);
        t.add_variant("БЛОК ЗІ СЛОВАМИ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new119("В СООТВЕТСТВУЮЩИХ ЧИСЛЕ И ПАДЕЖЕ", DecreeChangeValueKind.ROBUSTWORDS);
        t.add_variant("В СООТВЕТСТВУЮЩЕМ ПАДЕЖЕ", false);
        t.add_variant("В СООТВЕТСТВУЮЩЕМ ЧИСЛЕ", false);
        DecreeChangeToken.m_terms.add(t);
        t = Termin._new456("У ВІДПОВІДНОМУ ЧИСЛІ ТА ВІДМІНКУ", MorphLang.UA, DecreeChangeValueKind.ROBUSTWORDS);
        t.add_variant("У ВІДПОВІДНОМУ ВІДМІНКУ", false);
        t.add_variant("У ВІДПОВІДНОМУ ЧИСЛІ", false);
        DecreeChangeToken.m_terms.add(t);
    }
    
    static attach_referents(dpr, tok0) {
        const PartToken = require("./PartToken");
        if (dpr === null || tok0 === null) 
            return null;
        let tt0 = tok0.end_token.next;
        if (tt0 !== null && tt0.is_comma_and && tok0.act_kind === DecreeChangeKind.UNDEFINED) 
            tt0 = tt0.next;
        if (tt0 !== null && tt0.is_char(':')) 
            tt0 = tt0.next;
        let toks = DecreeChangeToken.try_attach_list(tt0);
        if (toks === null) 
            toks = new Array();
        toks.splice(0, 0, tok0);
        let res = new Array();
        let dcr = new DecreeChangeReferent();
        dcr.add_slot(DecreeChangeReferent.ATTR_OWNER, dpr, false, 0);
        let rt = new ReferentToken(dcr, tok0.begin_token, tok0.end_token);
        res.push(rt);
        let new_items = null;
        while (true) {
            for (let i = 0; i < toks.length; i++) {
                let tok = toks[i];
                if (tok.has_text && tok.has_name) 
                    dcr.is_owner_name_and_text = true;
                else if (tok.has_name) 
                    dcr.is_owner_name = true;
                else if (tok.has_text) 
                    dcr.is_only_text = true;
                rt.end_token = tok.end_token;
                if (tok.typ === DecreeChangeTokenTyp.AFTERVALUE) {
                    if (tok.change_val !== null) {
                        dcr.param = tok.change_val;
                        if (tok.end_char > rt.end_char) 
                            rt.end_token = tok.end_token;
                        res.splice(res.length - 1, 0, new ReferentToken(tok.change_val, tok.begin_token, tok.end_token));
                    }
                    continue;
                }
                if (tok.act_kind !== DecreeChangeKind.UNDEFINED) {
                    dcr.kind = tok.act_kind;
                    if (tok.act_kind === DecreeChangeKind.EXPIRE) 
                        break;
                }
                if (tok.change_val !== null) {
                    if (((i + 2) < toks.length) && ((toks[i + 1].act_kind === DecreeChangeKind.EXCHANGE || toks[i + 1].act_kind === DecreeChangeKind.NEW)) && toks[i + 2].change_val !== null) {
                        dcr.param = tok.change_val;
                        let rt11 = new ReferentToken(tok.change_val, tok.begin_token, tok.end_token);
                        if (tok.parts !== null && tok.parts.length > 0) 
                            rt11.begin_token = tok.parts[tok.parts.length - 1].end_token.next;
                        res.splice(res.length - 1, 0, rt11);
                        dcr.value = toks[i + 2].change_val;
                        dcr.kind = toks[i + 1].act_kind;
                        i += 2;
                        tok = toks[i];
                    }
                    else if (((i + 1) < toks.length) && toks[i + 1].change_val !== null && dcr.kind === DecreeChangeKind.EXCHANGE) {
                        dcr.param = tok.change_val;
                        res.splice(res.length - 1, 0, new ReferentToken(tok.change_val, tok.begin_token, tok.end_token));
                        dcr.value = toks[i + 1].change_val;
                        i += 1;
                        tok = toks[i];
                    }
                    else if (dcr.value === null) 
                        dcr.value = tok.change_val;
                    else if ((dcr.value.kind !== DecreeChangeValueKind.TEXT && tok.change_val.kind === DecreeChangeValueKind.TEXT && tok.change_val.value !== null) && dcr.value.value === null) 
                        dcr.value.value = tok.change_val.value;
                    else 
                        dcr.value = tok.change_val;
                    if (tok.end_char > rt.end_char) 
                        rt.end_token = tok.end_token;
                    res.splice(res.length - 1, 0, new ReferentToken(tok.change_val, tok.begin_token, tok.end_token));
                    if (dcr.kind === DecreeChangeKind.CONSIDER || dcr.kind === DecreeChangeKind.NEW) 
                        break;
                }
                if (dcr.kind === DecreeChangeKind.APPEND && tok.new_parts !== null) {
                    for (const np of tok.new_parts) {
                        let rank = PartToken._get_rank(np.typ);
                        if (rank === 0) 
                            continue;
                        let eq_lev_val = null;
                        if (dpr instanceof DecreePartReferent) {
                            if (!(dpr).is_all_items_over_this_level(np.typ)) {
                                eq_lev_val = dpr.get_string_value(PartToken._get_attr_name_by_typ(np.typ));
                                if (eq_lev_val === null) 
                                    continue;
                            }
                        }
                        dcr.kind = DecreeChangeKind.APPEND;
                        if (new_items === null) 
                            new_items = new Array();
                        let nam = PartToken._get_attr_name_by_typ(np.typ);
                        if (nam === null) 
                            continue;
                        if (np.values.length === 0) {
                            if (eq_lev_val === null) 
                                new_items.push(nam);
                            else {
                                let n = 0;
                                let wrapn824 = new RefOutArgWrapper();
                                let inoutres825 = Utils.tryParseInt(eq_lev_val, wrapn824);
                                n = wrapn824.value;
                                if (inoutres825) 
                                    new_items.push((nam + " " + (n + 1)));
                                else 
                                    new_items.push(nam);
                            }
                        }
                        else if (np.values.length === 2 && np.values[0].end_token.next.is_hiphen) {
                            let vv = NumberingHelper.create_diap(np.values[0].value, np.values[1].value);
                            if (vv !== null) {
                                for (const v of vv) {
                                    new_items.push((nam + " " + v));
                                }
                            }
                        }
                        if (new_items.length === 0) {
                            for (const v of np.values) {
                                new_items.push((nam + " " + v.value));
                            }
                        }
                    }
                }
            }
            if (!dcr.check_correct()) 
                return null;
            if (new_items !== null && dcr.value !== null && dcr.kind === DecreeChangeKind.APPEND) {
                for (const v of new_items) {
                    dcr.value.add_slot(DecreeChangeValueReferent.ATTR_NEWITEM, v, false, 0);
                }
            }
            new_items = null;
            if (rt.end_token.next === null || !rt.end_token.next.is_comma) 
                break;
            toks = DecreeChangeToken.try_attach_list(rt.end_token.next.next);
            if (toks === null) 
                break;
            let dts1 = new DecreeChangeReferent();
            for (const o of dcr.owners) {
                dts1.add_slot(DecreeChangeReferent.ATTR_OWNER, o, false, 0);
            }
            rt = new ReferentToken(dts1, toks[0].begin_token, toks[0].end_token);
            res.push(rt);
            dcr = dts1;
        }
        return res;
    }
    
    static _new791(_arg1, _arg2, _arg3) {
        let res = new DecreeChangeToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new792(_arg1, _arg2, _arg3, _arg4) {
        let res = new DecreeChangeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.act_kind = _arg4;
        return res;
    }
    
    static _new801(_arg1, _arg2, _arg3, _arg4) {
        let res = new DecreeChangeToken(_arg1, _arg2);
        res.typ = _arg3;
        res.parts = _arg4;
        return res;
    }
    
    static static_constructor() {
        DecreeChangeToken.m_terms = null;
    }
}


DecreeChangeToken.static_constructor();

module.exports = DecreeChangeToken