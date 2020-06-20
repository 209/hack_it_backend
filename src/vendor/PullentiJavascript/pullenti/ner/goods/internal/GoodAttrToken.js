/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const MorphCase = require("./../../../morph/MorphCase");
const DenominationReferent = require("./../../denomination/DenominationReferent");
const MorphNumber = require("./../../../morph/MorphNumber");
const Explanatory = require("./../../../semantic/utils/Explanatory");
const GetTextAttr = require("./../../core/GetTextAttr");
const NumberSpellingType = require("./../../NumberSpellingType");
const CharsInfo = require("./../../../morph/CharsInfo");
const UriReferent = require("./../../uri/UriReferent");
const NumberHelper = require("./../../core/NumberHelper");
const MeasureReferent = require("./../../measure/MeasureReferent");
const TerminCollection = require("./../../core/TerminCollection");
const VerbPhraseHelper = require("./../../core/VerbPhraseHelper");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const DenominationAnalyzer = require("./../../denomination/DenominationAnalyzer");
const BracketParseAttr = require("./../../core/BracketParseAttr");
const NumbersWithUnitToken = require("./../../measure/internal/NumbersWithUnitToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const MorphGender = require("./../../../morph/MorphGender");
const ReferentToken = require("./../../ReferentToken");
const RusLatAccord = require("./../../core/internal/RusLatAccord");
const Referent = require("./../../Referent");
const MorphClass = require("./../../../morph/MorphClass");
const GoodAttrType = require("./../GoodAttrType");
const GoodAttributeReferent = require("./../GoodAttributeReferent");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const TextToken = require("./../../TextToken");
const MetaToken = require("./../../MetaToken");
const NumberToken = require("./../../NumberToken");
const MiscHelper = require("./../../core/MiscHelper");
const Termin = require("./../../core/Termin");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const BracketHelper = require("./../../core/BracketHelper");
const MeasureToken = require("./../../measure/internal/MeasureToken");

class GoodAttrToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = GoodAttrType.UNDEFINED;
        this.value = null;
        this.alt_value = null;
        this.name = null;
        this.ref = null;
        this.ref_tok = null;
    }
    
    toString() {
        return (String(this.typ) + ": " + this.value + (this.alt_value === null ? "" : (" / " + this.alt_value)) + " " + (this.ref === null ? "" : this.ref.toString()));
    }
    
    _create_attr() {
        if (this.ref instanceof GoodAttributeReferent) 
            return Utils.as(this.ref, GoodAttributeReferent);
        let ar = new GoodAttributeReferent();
        if (this.typ !== GoodAttrType.UNDEFINED) 
            ar.typ = this.typ;
        if (this.name !== null) 
            ar.add_slot(GoodAttributeReferent.ATTR_NAME, this.name, false, 0);
        if (this.ref !== null) 
            ar.add_slot(GoodAttributeReferent.ATTR_REF, this.ref, true, 0);
        else if (this.ref_tok !== null) {
            ar.add_slot(GoodAttributeReferent.ATTR_REF, this.ref_tok.referent, true, 0);
            ar.add_ext_referent(this.ref_tok);
        }
        if (this.typ === GoodAttrType.NUMERIC) {
        }
        let vals = null;{
                vals = new Array();
                if (this.value !== null) 
                    vals.push(this.value);
                if (this.alt_value !== null) 
                    vals.push(this.alt_value);
            }
        for (const v of vals) {
            let v1 = v;
            if (ar.typ === GoodAttrType.PROPER) {
                v1 = v.toUpperCase();
                if (v1.indexOf('\'') >= 0) 
                    v1 = Utils.replaceString(v1, "'", "");
            }
            if (Utils.isNullOrEmpty(v1)) 
                continue;
            ar.add_slot((v === this.value ? GoodAttributeReferent.ATTR_VALUE : GoodAttributeReferent.ATTR_ALTVALUE), v1, false, 0);
            if ((v1.length < 10) && LanguageHelper.is_latin_char(v1[0]) && ar.typ === GoodAttrType.PROPER) {
                let rus = RusLatAccord.get_variants(v1);
                if (rus === null || rus.length === 0) 
                    continue;
                for (const vv of rus) {
                    if (ar.find_slot(null, vv, true) === null) {
                        ar.add_slot(GoodAttributeReferent.ATTR_ALTVALUE, vv, false, 0);
                        if (ar.slots.length > 20) 
                            break;
                    }
                }
            }
        }
        if (ar.find_slot(GoodAttributeReferent.ATTR_VALUE, null, true) === null && ar.find_slot(GoodAttributeReferent.ATTR_REF, null, true) === null) 
            return null;
        return ar;
    }
    
    static try_parse_list(t) {
        if (t === null) 
            return null;
        let li = GoodAttrToken._try_parse_list(t);
        if (li === null || li.length === 0) 
            return null;
        let res = new Array();
        for (const a of li) {
            let attr = a._create_attr();
            if (attr !== null) 
                res.push(new ReferentToken(attr, a.begin_token, a.end_token));
        }
        return res;
    }
    
    static _try_parse_list(t) {
        let res = new Array();
        let key = null;
        let next_seq = false;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt !== t && tt.is_newline_before) 
                break;
            if (tt !== t && MiscHelper.can_be_start_of_sentence(tt) && !tt.is_char('(')) {
                next_seq = true;
                if (key === null) 
                    break;
                let re2 = GoodAttrToken.try_parse(tt, key, t !== tt, false);
                if (re2 !== null && ((re2.typ === GoodAttrType.NUMERIC || re2.typ === GoodAttrType.MODEL))) {
                }
                else if (re2 !== null && ((re2.ref_tok !== null || re2.ref !== null))) 
                    next_seq = false;
                else if ((tt.get_morph_class_in_dictionary().is_verb && re2 !== null && re2.typ === GoodAttrType.CHARACTER) && GoodAttrToken._is_spec_verb(tt)) {
                }
                else {
                    let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                    if (npt === null) 
                        break;
                    let noun = npt.noun.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                    if (key.value === null) {
                        if (key.ref === null) 
                            break;
                        if (key.ref.toString().toUpperCase().includes(noun)) {
                        }
                        else 
                            break;
                    }
                    else if (noun.includes(key.value) || key.value.includes(noun)) {
                    }
                    else 
                        break;
                }
            }
            if ((tt instanceof TextToken) && next_seq) {
                let dc = tt.get_morph_class_in_dictionary();
                if (MorphClass.ooEq(dc, MorphClass.VERB)) {
                    if (!GoodAttrToken._is_spec_verb(tt)) 
                        break;
                }
            }
            if (tt.is_value("ДОЛЖЕН", null) || tt.is_value("ДОЛЖНА", null) || tt.is_value("ДОЛЖНО", null)) {
                if (tt.next !== null && tt.next.get_morph_class_in_dictionary().is_verb) 
                    tt = tt.next;
                continue;
            }
            let re = GoodAttrToken.try_parse(tt, key, tt !== t, false);
            if (re !== null) {
                if (key === null) {
                    if (re.typ === GoodAttrType.KEYWORD) 
                        key = re;
                    else if (re.typ === GoodAttrType.NUMERIC || re.typ === GoodAttrType.MODEL) 
                        return null;
                }
                res.push(re);
                tt = re.end_token;
                continue;
            }
            if ((tt instanceof TextToken) && !tt.chars.is_letter) 
                continue;
            if (tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) 
                continue;
            if (tt instanceof NumberToken) 
                res.push(GoodAttrToken._new1273(tt, tt, tt.get_source_text()));
        }
        if (res.length > 0 && res[res.length - 1].typ === GoodAttrType.CHARACTER) {
            if (res[res.length - 1].end_token === res[res.length - 1].begin_token && res[res.length - 1].end_token.get_morph_class_in_dictionary().is_adverb) 
                res.splice(res.length - 1, 1);
        }
        return res;
    }
    
    static _is_spec_verb(t) {
        if (t === null) 
            return false;
        if ((t.is_value("ПРИМЕНЯТЬ", null) || t.is_value("ИСПОЛЬЗОВАТЬ", null) || t.is_value("ИЗГОТАВЛИВАТЬ", null)) || t.is_value("ПРИМЕНЯТЬ", null) || t.is_value("ИЗГОТОВИТЬ", null)) 
            return true;
        return false;
    }
    
    static try_parse(t, key, can_be_measure, is_chars = false) {
        let res = GoodAttrToken._try_parse_(t, key, can_be_measure, is_chars);
        if (res === null || res.value === null) 
            return res;
        if ((res !== null && res.typ === GoodAttrType.CHARACTER && ((res.end_token === res.begin_token || (res.value.indexOf(' ') < 0)))) && res.alt_value === null) {
            if (res.value === "ДЛЯ") 
                return GoodAttrToken.try_parse(t.next, key, false, false);
            if (res.value !== null) {
                if (Utils.startsWithString(res.value, "ДВУ", true) && !Utils.startsWithString(res.value, "ДВУХ", true)) 
                    res.value = "ДВУХ" + res.value.substring(3);
            }
        }
        if ((res !== null && res.typ === GoodAttrType.CHARACTER && res.begin_token.morph.class0.is_preposition) && res.end_token !== res.begin_token && res.alt_value === null) {
            let npt = NounPhraseHelper.try_parse(res.begin_token.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.end_token === res.end_token) 
                res.alt_value = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
        }
        return res;
    }
    
    static _try_parse_(t, key, can_be_measure, is_chars) {
        if (t === null) 
            return null;
        if (t.is_value("ПРЕДНАЗНАЧЕН", null)) {
        }
        let res = null;
        let r = t.get_referent();
        if (r !== null) {
            if (r.type_name === "ORGANIZATION" || r.type_name === "GEO") 
                return GoodAttrToken._new1274(t, t, GoodAttrType.REFERENT, r);
        }
        if (can_be_measure) {
            if ((((res = GoodAttrToken._try_parse_num(t)))) !== null) 
                return res;
        }
        if (is_chars) {
            if ((((res = GoodAttrToken._try_parse_chars(t)))) !== null) 
                return res;
        }
        let ms = MeasureToken.try_parse(t, null, true, false, false, false);
        if (ms !== null && ms.nums !== null) {
            let nres = GoodAttrToken._new1275(t, ms.end_token, GoodAttrType.NUMERIC);
            nres.name = ms.name;
            nres.value = ms.get_norm_values();
            return nres;
        }
        if (t.kit.ontology !== null) {
            let li = t.kit.ontology.attach_token(GoodAttributeReferent.OBJ_TYPENAME, t);
            if (li !== null && li[0].item !== null && (li[0].item.referent instanceof GoodAttributeReferent)) {
                res = new GoodAttrToken(li[0].begin_token, li[0].end_token);
                res.typ = (li[0].item.referent).typ;
                res.ref = li[0].item.referent.clone();
                return res;
            }
        }
        let tok = null;
        if ((((tok = GoodAttrToken.m_std_abbrs.try_parse(t, TerminParseAttr.NO)))) !== null) {
            let ty = GoodAttrType.of(tok.termin.tag);
            if (ty === GoodAttrType.UNDEFINED && tok.termin.tag2 !== null) {
                let tt2 = tok.end_token.next;
                if (tt2 !== null && ((tt2.is_char(':') || tt2.is_hiphen))) 
                    tt2 = tt2.next;
                res = GoodAttrToken._try_parse_(tt2, key, false, is_chars);
                if (res !== null && ((res.typ === GoodAttrType.PROPER || res.typ === GoodAttrType.MODEL))) {
                    res.begin_token = t;
                    res.name = tok.termin.canonic_text;
                    return res;
                }
                let tok2 = GoodAttrToken.m_std_abbrs.try_parse(tt2, TerminParseAttr.NO);
                if (tok2 !== null && ((Utils.asString(tok2.termin.tag2))) === "NO") {
                    res = GoodAttrToken._new1275(t, tok2.end_token, GoodAttrType.UNDEFINED);
                    return res;
                }
                res = GoodAttrToken._try_parse_model(tt2);
                if (res !== null) {
                    res.begin_token = t;
                    res.name = tok.termin.canonic_text;
                    return res;
                }
            }
            if (ty !== GoodAttrType.REFERENT) {
                res = GoodAttrToken._new1277(t, tok.end_token, ty, tok.termin.canonic_text, tok.morph);
                if (res.end_token.next !== null && res.end_token.next.is_char('.')) 
                    res.end_token = res.end_token.next;
                return res;
            }
            if (ty === GoodAttrType.REFERENT) {
                let tt = tok.end_token.next;
                for (; tt !== null; tt = tt.next) {
                    if (tt.is_newline_before) 
                        break;
                    if (tt.is_hiphen || tt.is_char_of(":")) 
                        continue;
                    if (tt.get_morph_class_in_dictionary().is_adverb) 
                        continue;
                    let tok2 = GoodAttrToken.m_std_abbrs.try_parse(tt, TerminParseAttr.NO);
                    if (tok2 !== null) {
                        let ty2 = GoodAttrType.of(tok2.termin.tag);
                        if (ty2 === GoodAttrType.REFERENT || ty2 === GoodAttrType.UNDEFINED) {
                            tt = tok2.end_token;
                            continue;
                        }
                    }
                    break;
                }
                if (tt === null) 
                    return null;
                if (tt.get_referent() !== null) 
                    return GoodAttrToken._new1278(t, tt, tt.get_referent(), GoodAttrType.REFERENT);
                if ((tt instanceof TextToken) && !tt.chars.is_all_lower && tt.chars.is_letter) {
                    let rt = tt.kit.process_referent("ORGANIZATION", tt);
                    if (rt !== null) 
                        return GoodAttrToken._new1279(t, rt.end_token, rt, GoodAttrType.REFERENT);
                }
                if (BracketHelper.can_be_start_of_sequence(tt, false, false)) {
                    let rt = tt.kit.process_referent("ORGANIZATION", tt.next);
                    if (rt !== null) {
                        let t1 = rt.end_token;
                        if (BracketHelper.can_be_end_of_sequence(t1.next, false, null, false)) 
                            t1 = t1.next;
                        return GoodAttrToken._new1279(t, t1, rt, GoodAttrType.REFERENT);
                    }
                }
            }
        }
        if (t.is_value("КАТАЛОЖНЫЙ", null)) {
            let tt = MiscHelper.check_number_prefix(t.next);
            if (tt !== null) {
                if (tt.is_char_of(":") || tt.is_hiphen) 
                    tt = tt.next;
                res = GoodAttrToken._try_parse_model(tt);
                if (res !== null) {
                    res.begin_token = t;
                    res.name = "КАТАЛОЖНЫЙ НОМЕР";
                    return res;
                }
            }
        }
        if (t.is_value("ФАСОВКА", null) || t.is_value("УПАКОВКА", null)) {
            if (!((t.previous instanceof NumberToken))) {
                let tt = t.next;
                if (tt !== null) {
                    if (tt.is_char_of(":") || tt.is_hiphen) 
                        tt = tt.next;
                }
                if (tt === null) 
                    return null;
                res = GoodAttrToken._new1281(t, tt, GoodAttrType.NUMERIC, "ФАСОВКА");
                let et = null;
                for (; tt !== null; tt = tt.next) {
                    if (tt.is_comma) 
                        break;
                    if (MiscHelper.can_be_start_of_sentence(tt)) 
                        break;
                    if ((tt instanceof TextToken) && tt.chars.is_letter && !tt.chars.is_all_lower) 
                        break;
                    et = tt;
                }
                if (et !== null) {
                    res.value = MiscHelper.get_text_value(res.end_token, et, GetTextAttr.KEEPREGISTER);
                    res.end_token = et;
                }
                return res;
            }
        }
        if ((t instanceof ReferentToken) && (((t.get_referent() instanceof UriReferent) || t.get_referent().type_name === "DECREE"))) {
            res = GoodAttrToken._new1281(t, t, GoodAttrType.MODEL, "СПЕЦИФИКАЦИЯ");
            res.value = t.get_referent().toString();
            return res;
        }
        if (key === null && !is_chars) {
            let is_all_upper = true;
            for (let tt = t; tt !== null; tt = tt.next) {
                if (tt !== t && tt.is_newline_before) 
                    break;
                if (tt.chars.is_cyrillic_letter && !tt.chars.is_all_upper) {
                    is_all_upper = false;
                    break;
                }
            }
            if ((((!t.chars.is_all_upper || is_all_upper)) && ((t.morph.class0.is_noun || t.morph.class0.is_undefined)) && t.chars.is_cyrillic_letter) && (t instanceof TextToken)) {
                if (t.is_value("СООТВЕТСТВИЕ", null)) {
                    let tt1 = t.next;
                    if (tt1 !== null && ((tt1.is_char(':') || tt1.is_hiphen))) 
                        tt1 = tt1.next;
                    res = GoodAttrToken._try_parse_(tt1, key, false, is_chars);
                    if (res !== null) 
                        res.begin_token = t;
                    return res;
                }
                let ok = true;
                if (t.morph.class0.is_adjective || t.morph.class0.is_verb) {
                    let npt1 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSEVERBS, 0, null);
                    if (npt1 !== null && npt1.end_token !== t && npt1.adjectives.length > 0) 
                        ok = false;
                }
                if (ok) {
                    res = GoodAttrToken._new1283(t, t, GoodAttrType.KEYWORD, t.morph);
                    res.value = t.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false);
                    if ((t.next !== null && t.next.is_hiphen && (t.next.next instanceof TextToken)) && ((t.next.next.chars.is_all_lower || CharsInfo.ooEq(t.next.next.chars, t.chars)))) {
                        if (!t.is_whitespace_after && !t.next.is_whitespace_after) {
                            res.end_token = (t = t.next.next);
                            res.value = (res.value + "-" + (t).term);
                        }
                    }
                    return res;
                }
            }
        }
        if ((t.is_whitespace_before && (t instanceof TextToken) && t.chars.is_letter) && (t.length_char < 5) && !is_chars) {
            let rt = GoodAttrToken.m_denom_an.try_attach(t, false);
            if ((rt === null && t.whitespaces_after_count === 1 && (t.next instanceof NumberToken)) && (t.length_char < 3) && GoodAttrToken._try_parse_num(t.next) === null) 
                rt = GoodAttrToken.m_denom_an.try_attach(t, true);
            if (rt !== null) {
                res = GoodAttrToken._new1275(t, rt.end_token, GoodAttrType.MODEL);
                let dr = Utils.as(rt.referent, DenominationReferent);
                for (const s of dr.slots) {
                    if (s.type_name === DenominationReferent.ATTR_VALUE) {
                        if (res.value === null) 
                            res.value = Utils.asString(s.value);
                        else 
                            res.alt_value = Utils.asString(s.value);
                    }
                }
                return res;
            }
            if (!t.is_whitespace_after && (t.next instanceof NumberToken) && GoodAttrToken._try_parse_num(t.next) === null) {
                res = GoodAttrToken._try_parse_model(t);
                return res;
            }
        }
        if (t.chars.is_latin_letter && t.is_whitespace_before) {
            res = GoodAttrToken._new1275(t, t, GoodAttrType.PROPER);
            for (let ttt = t.next; ttt !== null; ttt = ttt.next) {
                if (ttt.chars.is_latin_letter && CharsInfo.ooEq(ttt.chars, t.chars)) 
                    res.end_token = ttt;
                else if (((ttt instanceof TextToken) && !ttt.is_letters && ttt.next !== null) && ttt.next.chars.is_latin_letter) {
                }
                else 
                    break;
            }
            if (res.end_token.is_whitespace_after) {
                res.value = MiscHelper.get_text_value_of_meta_token(res, GetTextAttr.NO);
                if (res.value.indexOf(' ') > 0) 
                    res.alt_value = Utils.replaceString(res.value, " ", "");
                if (res.length_char < 2) 
                    return null;
                return res;
            }
        }
        let pref = null;
        let t0 = t;
        if (t.morph.class0.is_preposition && t.next !== null && t.next.chars.is_letter) {
            pref = (t).get_normal_case_text(MorphClass.PREPOSITION, false, MorphGender.UNDEFINED, false);
            t = t.next;
            if ((t.is_comma_and && (t.next instanceof TextToken) && t.next.morph.class0.is_preposition) && t.next.next !== null) {
                pref = (pref + " И " + (t.next).get_normal_case_text(MorphClass.PREPOSITION, false, MorphGender.UNDEFINED, false));
                t = t.next.next;
            }
        }
        else if ((((((t.is_value("Д", null) || t.is_value("Б", null) || t.is_value("Н", null)) || t.is_value("H", null))) && t.next !== null && t.next.is_char_of("\\/")) && !t.is_whitespace_after && !t.next.is_whitespace_after) && (t.next.next instanceof TextToken)) {
            pref = (t.is_value("Д", null) ? "ДЛЯ" : ((t.is_value("Б", null) ? "БЕЗ" : "НЕ")));
            t = t.next.next;
            if (pref === "НЕ") {
                let re = GoodAttrToken._try_parse_(t, key, false, is_chars);
                if (re !== null && re.typ === GoodAttrType.CHARACTER && re.value !== null) {
                    re.begin_token = t0;
                    re.value = "НЕ" + re.value;
                    if (re.alt_value !== null) 
                        re.alt_value = "НЕ" + re.alt_value;
                    return re;
                }
            }
        }
        if (pref !== null) {
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt === null && t.get_morph_class_in_dictionary().is_adverb) 
                npt = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && ((npt.chars.is_all_lower || npt.chars.is_all_upper)) && npt.chars.is_cyrillic_letter) {
                let re = GoodAttrToken._new1275(t0, npt.end_token, GoodAttrType.CHARACTER);
                let cas = new MorphCase();
                for (let tt = npt.end_token.next; tt !== null; tt = tt.next) {
                    if (tt.is_newline_before || tt.is_char(';')) 
                        break;
                    if (tt.is_comma_and && tt.next !== null) 
                        tt = tt.next;
                    let npt1 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.PARSEPREPOSITION, 0, null);
                    if (npt1 === null && tt.get_morph_class_in_dictionary().is_adverb) 
                        npt1 = NounPhraseHelper.try_parse(tt.next, NounPhraseParseAttr.NO, 0, null);
                    if (npt1 === null) 
                        break;
                    if (CharsInfo.ooNoteq(npt1.chars, npt.chars)) 
                        break;
                    if (tt.previous.is_comma) {
                        if (!cas.is_undefined && (MorphCase.ooBitand(cas, npt1.morph._case)).is_undefined) 
                            break;
                        let re2 = GoodAttrToken._try_parse_num(tt);
                        if (re2 !== null && re2.typ === GoodAttrType.NUMERIC) 
                            break;
                    }
                    tt = re.end_token = npt1.end_token;
                    cas = npt1.morph._case;
                }
                re.value = MiscHelper.get_text_value(npt.begin_token, re.end_token, GetTextAttr.NO);
                if (npt.end_token === re.end_token && npt.adjectives.length === 0) {
                    if (pref === "ДЛЯ" || pref === "ИЗ") {
                        let noun = npt.noun.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false);
                        let grs = Explanatory.find_derivates(noun, true, null);
                        if (grs !== null) {
                            for (const g of grs) {
                                if (re.alt_value !== null) 
                                    break;
                                for (const v of g.words) {
                                    if (v.class0.is_adjective) {
                                        re.alt_value = v.spelling;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (pref !== null) 
                    re.value = (pref + " " + re.value);
                return re;
            }
        }
        if (t.chars.is_cyrillic_letter || (t instanceof NumberToken)) {
            let npt1 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.of((NounPhraseParseAttr.ADJECTIVECANBELAST.value()) | (NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value())), 0, null);
            if (npt1 !== null) {
                if (((npt1.noun.begin_token.is_value("СОРТ", null) || npt1.noun.begin_token.is_value("КЛАСС", null) || npt1.noun.begin_token.is_value("ГРУППА", null)) || npt1.noun.begin_token.is_value("КАТЕГОРИЯ", null) || npt1.noun.begin_token.is_value("ТИП", null)) || npt1.noun.begin_token.is_value("ПОДТИП", null)) {
                    res = GoodAttrToken._new1275(t, npt1.end_token, GoodAttrType.CHARACTER);
                    res.value = npt1.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
                    if (res.begin_token === res.end_token) {
                        if (t.next !== null && t.next.is_value("ВЫСШ", null)) {
                            res.value = ((((((npt1.noun.begin_token.morph.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value()) ? "ВЫСШАЯ" : "ВЫСШИЙ "))) + res.value;
                            res.end_token = t.next;
                            if (res.end_token.next !== null && res.end_token.next.is_char('.')) 
                                res.end_token = res.end_token.next;
                        }
                        else if (t.whitespaces_after_count < 2) {
                            if ((t.next instanceof NumberToken) && (t.next).int_value !== null) {
                                res.value = (NumberHelper.get_number_adjective((t.next).int_value, ((((npt1.morph.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value()) ? MorphGender.FEMINIE : MorphGender.MASCULINE), MorphNumber.SINGULAR) + " " + t.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false));
                                res.end_token = t.next;
                            }
                            else {
                                let rom = NumberHelper.try_parse_roman(t.next);
                                if (rom !== null && rom.int_value !== null) {
                                    res.value = (NumberHelper.get_number_adjective(rom.int_value, ((((npt1.morph.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value()) ? MorphGender.FEMINIE : MorphGender.MASCULINE), MorphNumber.SINGULAR) + " " + t.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false));
                                    res.end_token = rom.end_token;
                                }
                            }
                        }
                    }
                    if (res.begin_token !== res.end_token) 
                        return res;
                }
            }
            if (((t instanceof NumberToken) && (t).int_value !== null && (t).typ === NumberSpellingType.DIGIT) && (t.next instanceof TextToken) && (t.whitespaces_after_count < 2)) {
                if (((t.next.is_value("СОРТ", null) || t.next.is_value("КЛАСС", null) || t.next.is_value("ГРУППА", null)) || t.next.is_value("КАТЕГОРИЯ", null) || t.next.is_value("ТИП", null)) || t.next.is_value("ПОДТИП", null)) {
                    res = GoodAttrToken._new1275(t, t.next, GoodAttrType.CHARACTER);
                    res.value = (NumberHelper.get_number_adjective((t).int_value, ((((t.next.morph.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value()) ? MorphGender.FEMINIE : MorphGender.MASCULINE), MorphNumber.SINGULAR) + " " + t.next.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false));
                    return res;
                }
            }
            if (npt1 !== null && npt1.noun.begin_token.is_value("ХАРАКТЕРИСТИКА", null)) {
                let t11 = npt1.end_token.next;
                if (t11 !== null && ((t11.is_value("УКАЗАТЬ", null) || t11.is_value("УКАЗЫВАТЬ", null)))) {
                    res = GoodAttrToken._new1275(t, t11, GoodAttrType.UNDEFINED);
                    let npt2 = NounPhraseHelper.try_parse(t11.next, NounPhraseParseAttr.PARSEPREPOSITION, 0, null);
                    if (npt2 !== null) 
                        res.end_token = npt2.end_token;
                    else if (t11.next !== null && t11.next.is_value("В", null)) {
                        res.end_token = t11.next;
                        if (res.end_token.next !== null) 
                            res.end_token = res.end_token.next;
                    }
                    return res;
                }
            }
        }
        if ((t.chars.is_cyrillic_letter && pref === null && (t instanceof TextToken)) && t.morph.class0.is_adjective) {
            if (t.morph.contains_attr("к.ф.", null) && t.next !== null && t.next.is_hiphen) {
                let val = (t).term;
                let tt = null;
                for (tt = t.next.next; tt !== null; ) {
                    if (((tt instanceof TextToken) && tt.next !== null && tt.next.is_hiphen) && (tt.next.next instanceof TextToken)) {
                        val = (val + "-" + (tt).term);
                        tt = tt.next.next;
                        continue;
                    }
                    let re = GoodAttrToken._try_parse_(tt, key, false, is_chars);
                    if (re !== null && re.typ === GoodAttrType.CHARACTER) {
                        re.begin_token = t;
                        re.value = (val + "-" + re.value);
                        return re;
                    }
                    break;
                }
            }
            let _is_char = false;
            if (key !== null && t.morph.check_accord(key.morph, false, false) && ((t.chars.is_all_lower || MiscHelper.can_be_start_of_sentence(t)))) 
                _is_char = true;
            else if (t.get_morph_class_in_dictionary().is_adjective && !t.morph.contains_attr("неизм.", null)) 
                _is_char = true;
            if (_is_char && t.morph.class0.is_verb) {
                if ((t.is_value("ПРЕДНАЗНАЧИТЬ", null) || t.is_value("ПРЕДНАЗНАЧАТЬ", null) || t.is_value("ИЗГОТОВИТЬ", null)) || t.is_value("ИЗГОТОВЛЯТЬ", null)) 
                    _is_char = false;
            }
            if (_is_char) {
                res = GoodAttrToken._new1275(t, t, GoodAttrType.CHARACTER);
                res.value = t.get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.MASCULINE, false);
                return res;
            }
        }
        if ((t.chars.is_cyrillic_letter && pref === null && (t instanceof TextToken)) && t.morph.class0.is_verb) {
            let re = GoodAttrToken._try_parse_(t.next, key, false, is_chars);
            if (re !== null && re.typ === GoodAttrType.CHARACTER) {
                re.begin_token = t;
                re.alt_value = ((t).term + " " + re.value);
                return re;
            }
        }
        if (t.chars.is_cyrillic_letter) {
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.PARSEVERBS, 0, null);
            if ((npt !== null && npt.adjectives.length > 0 && npt.adjectives[0].chars.is_all_lower) && !npt.noun.chars.is_all_lower) 
                npt = null;
            if (pref === null && npt !== null && npt.noun.end_token.get_morph_class_in_dictionary().is_adjective) 
                npt = null;
            if (npt !== null && !npt.end_token.chars.is_cyrillic_letter) 
                npt = null;
            if (npt !== null) {
                let is_prop = false;
                if (pref !== null) 
                    is_prop = true;
                else if (npt.chars.is_all_lower) 
                    is_prop = true;
                if (npt.adjectives.length > 0 && pref === null) {
                    if (key === null) 
                        return GoodAttrToken._new1291(t0, npt.adjectives[0].end_token, GoodAttrType.CHARACTER, npt.adjectives[0].get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.MASCULINE, false));
                }
                if (pref === null && key !== null && npt.noun.is_value(key.value, null)) {
                    if (npt.adjectives.length === 0) 
                        return GoodAttrToken._new1277(t0, npt.end_token, GoodAttrType.KEYWORD, npt.noun.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false), npt.morph);
                    return GoodAttrToken._new1291(t0, npt.adjectives[0].end_token, GoodAttrType.CHARACTER, npt.adjectives[0].get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.MASCULINE, false));
                }
                if (is_prop) {
                    res = GoodAttrToken._new1275(t0, npt.end_token, GoodAttrType.CHARACTER);
                    res.value = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false);
                    return res;
                }
                if (!npt.chars.is_all_lower) 
                    return GoodAttrToken._new1277(t0, npt.end_token, GoodAttrType.PROPER, npt.get_source_text(), npt.morph);
            }
            if (t instanceof TextToken) {
                if (((t.get_morph_class_in_dictionary().is_adjective || MorphClass.ooEq(t.morph.class0, MorphClass.ADJECTIVE))) && pref === null) 
                    return GoodAttrToken._new1277(t0, t, GoodAttrType.CHARACTER, (t).get_lemma(), t.morph);
            }
            if ((t instanceof NumberToken) && pref !== null) {
                let num = GoodAttrToken._try_parse_num(t);
                if (num !== null) {
                    num.begin_token = t0;
                    return num;
                }
            }
            if (pref !== null && t.morph.class0.is_adjective && (t instanceof TextToken)) {
                res = GoodAttrToken._new1275(t0, t, GoodAttrType.CHARACTER);
                res.value = (t).get_normal_case_text(MorphClass.ADJECTIVE, true, MorphGender.MASCULINE, false);
                return res;
            }
            if (pref !== null && t.next !== null && t.next.is_value("WC", null)) 
                return GoodAttrToken._new1291(t, t.next, GoodAttrType.CHARACTER, "туалет");
            if (pref !== null) 
                return null;
        }
        if (t !== null && t.is_value("№", null) && (t.next instanceof NumberToken)) 
            return GoodAttrToken._new1291(t, t.next, GoodAttrType.MODEL, ("№" + (t.next).value));
        if ((t instanceof TextToken) && t.chars.is_letter) {
            if (t.length_char > 2 && ((!t.chars.is_all_lower || t.chars.is_latin_letter))) 
                return GoodAttrToken._new1291(t, t, GoodAttrType.PROPER, (t).term);
            return null;
        }
        if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                let res1 = GoodAttrToken._try_parse_(t.next, key, false, is_chars);
                if (res1 !== null && res1.end_token.next === br.end_token) {
                    if (res1.typ === GoodAttrType.CHARACTER) 
                        res1.typ = GoodAttrType.PROPER;
                    res1.begin_token = t;
                    res1.end_token = br.end_token;
                }
                else {
                    res1 = GoodAttrToken._new1275(br.begin_token, br.end_token, GoodAttrType.PROPER);
                    res1.value = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                }
                return res1;
            }
        }
        if (t.is_char('(')) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (br !== null) {
                if (t.next.is_value("ПРИЛОЖЕНИЕ", null)) 
                    return GoodAttrToken._new1275(t, br.end_token, GoodAttrType.UNDEFINED);
            }
        }
        let nnn = GoodAttrToken._try_parse_num2(t);
        if (nnn !== null) 
            return nnn;
        return null;
    }
    
    static _try_parse_model(t) {
        if (t === null) 
            return null;
        let res = GoodAttrToken._new1275(t, t, GoodAttrType.MODEL);
        let tmp = new StringBuilder();
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.is_whitespace_before && tt !== t) 
                break;
            if (tt instanceof NumberToken) {
                if (tmp.length > 0 && Utils.isDigit(tmp.charAt(tmp.length - 1))) 
                    tmp.append('-');
                tmp.append((tt).get_source_text());
                res.end_token = tt;
                continue;
            }
            if (tt instanceof ReferentToken) {
                let den = Utils.as(tt.get_referent(), DenominationReferent);
                if (den !== null) {
                    tmp.append(den.value);
                    continue;
                }
            }
            if (!((tt instanceof TextToken))) 
                break;
            if (!tt.chars.is_letter) {
                if (tt.is_char_of("\\/-:")) {
                    if (tt.is_char_of(":") && tt.is_whitespace_after) 
                        break;
                    tmp.append('-');
                }
                else if (tt.is_char('.')) {
                    if (tt.is_whitespace_after) 
                        break;
                    tmp.append('.');
                }
                else 
                    break;
            }
            else 
                tmp.append((tt).term);
            res.end_token = tt;
        }
        res.value = tmp.toString();
        return res;
    }
    
    static _try_parse_num(t) {
        if (t === null) 
            return null;
        let mt = MeasureToken.try_parse(t, null, true, false, false, false);
        if (mt === null) 
            mt = MeasureToken.try_parse_minimal(t, null, false);
        if (mt !== null) {
            let mrs = mt.create_refenets_tokens_with_register(null, false);
            if (mrs !== null && mrs.length > 0 && (mrs[mrs.length - 1].referent instanceof MeasureReferent)) {
                let mr = Utils.as(mrs[mrs.length - 1].referent, MeasureReferent);
                let res = GoodAttrToken._new1281(t, mt.end_token, GoodAttrType.NUMERIC, mr.get_string_value(MeasureReferent.ATTR_NAME));
                res.value = mr.to_string(true, null, 0);
                return res;
            }
        }
        let mts = NumbersWithUnitToken.try_parse_multi(t, null, false, false, false, false);
        if ((mts !== null && mts.length === 1 && mts[0].units !== null) && mts[0].units.length > 0) {
            let mrs = mts[0].create_refenets_tokens_with_register(null, null, true);
            let mr = mrs[mrs.length - 1];
            let res = GoodAttrToken._new1275(t, mr.end_token, GoodAttrType.NUMERIC);
            res.value = mr.referent.to_string(true, null, 0);
            return res;
        }
        return null;
    }
    
    static _try_parse_num2(t) {
        if (!((t instanceof NumberToken)) || (t).int_value === null) 
            return null;
        let tok = GoodAttrToken.m_num_suff.try_parse(t.next, TerminParseAttr.NO);
        if (tok !== null && (t.whitespaces_after_count < 3)) {
            let res = GoodAttrToken._new1275(t, tok.end_token, GoodAttrType.NUMERIC);
            res.value = (t).value + tok.termin.canonic_text.toLowerCase();
            if (res.end_token.next !== null && res.end_token.next.is_char('.')) 
                res.end_token = res.end_token.next;
            return res;
        }
        let num = NumberHelper.try_parse_real_number(t, true, false);
        if (num !== null) {
            let tt = num.end_token;
            if (tt instanceof MetaToken) {
                if ((tt).end_token.is_value("СП", null)) {
                    if (num.value === "1") 
                        return GoodAttrToken._new1291(t, tt, GoodAttrType.CHARACTER, "односпальный");
                    if (num.value === "1.5") 
                        return GoodAttrToken._new1291(t, tt, GoodAttrType.CHARACTER, "полутораспальный");
                    if (num.value === "2") 
                        return GoodAttrToken._new1291(t, tt, GoodAttrType.CHARACTER, "вдухспальный");
                }
            }
            tt = tt.next;
            if (tt !== null && tt.is_hiphen) 
                tt = tt.next;
            if (tt !== null && tt.is_value("СП", null)) {
                if (num.value === "1") 
                    return GoodAttrToken._new1291(t, tt, GoodAttrType.CHARACTER, "односпальный");
                if (num.value === "1.5") 
                    return GoodAttrToken._new1291(t, tt, GoodAttrType.CHARACTER, "полутораспальный");
                if (num.value === "2") 
                    return GoodAttrToken._new1291(t, tt, GoodAttrType.CHARACTER, "вдухспальный");
            }
            return GoodAttrToken._new1291(t, num.end_token, GoodAttrType.NUMERIC, num.value);
        }
        return null;
    }
    
    static _try_parse_chars(t) {
        if (t === null) 
            return null;
        let t1 = null;
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null) 
            t1 = npt.end_token;
        else if (((t instanceof TextToken) && t.length_char > 2 && t.get_morph_class_in_dictionary().is_undefined) && !t.chars.is_all_lower) 
            t1 = t;
        if (t1 === null) 
            return null;
        let t11 = t1;
        let t2 = null;
        for (let tt = t1.next; tt !== null; tt = tt.next) {
            if (MiscHelper.can_be_start_of_sentence(tt) || tt.is_char(';')) 
                break;
            if (tt.is_char(':') || tt.is_hiphen) {
                t2 = tt.next;
                break;
            }
            if (tt.is_value("ДА", null) || tt.is_value("НЕТ", null)) {
                t2 = tt;
                break;
            }
            let vvv = VerbPhraseHelper.try_parse(tt, false, false, false);
            if (vvv !== null) {
                t2 = vvv.end_token.next;
                break;
            }
            t1 = tt;
        }
        if (t2 === null) {
            if (t11.next !== null && t11.next.get_morph_class_in_dictionary().is_adjective && NounPhraseHelper.try_parse(t11.next, NounPhraseParseAttr.NO, 0, null) === null) {
                t1 = t11;
                t2 = t11.next;
            }
        }
        if (t2 === null) 
            return null;
        let t3 = t2;
        for (let tt = t2; tt !== null; tt = tt.next) {
            if (MiscHelper.can_be_start_of_sentence(tt)) 
                break;
            if (tt.is_char(';')) 
                break;
            t3 = tt;
        }
        let _name = MiscHelper.get_text_value(t, t1, GetTextAttr.NO);
        let val = MiscHelper.get_text_value(t2, (t3.is_char('.') ? t3.previous : t3), GetTextAttr.NO);
        if (Utils.isNullOrEmpty(val)) 
            return null;
        return GoodAttrToken._new1314(t, t3, GoodAttrType.CHARACTER, _name, val);
    }
    
    static initialize() {
        if (GoodAttrToken.m_inited) 
            return;
        GoodAttrToken.m_inited = true;
        let t = null;
        t = new Termin("ПР");
        t.add_variant("ПРЕДМЕТ", false);
        GoodAttrToken.m_num_suff.add(t);
        t = new Termin("ШТ");
        t.add_variant("ШТУКА", false);
        GoodAttrToken.m_num_suff.add(t);
        t = new Termin("УП");
        t.add_variant("УПАКОВКА", false);
        GoodAttrToken.m_num_suff.add(t);
        t = new Termin("ЯЩ");
        t.add_variant("ЯЩИК", false);
        GoodAttrToken.m_num_suff.add(t);
        t = new Termin("КОРОБ");
        t.add_variant("КОРОБКА", false);
        GoodAttrToken.m_num_suff.add(t);
        t = new Termin("БУТ");
        t.add_variant("БУТЫЛКА", false);
        GoodAttrToken.m_num_suff.add(t);
        t = new Termin("МЕШ");
        t.add_variant("МЕШОК", false);
        GoodAttrToken.m_num_suff.add(t);
        t = Termin._new119("ЕРШ", GoodAttrType.KEYWORD);
        t.add_variant("ЕРШИК", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("КОНДИЦИОНЕР", GoodAttrType.KEYWORD);
        t.add_variant("КОНДИЦ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("УДЛИНИТЕЛЬ", GoodAttrType.KEYWORD);
        t.add_abridge("УДЛ-ЛЬ");
        t.add_abridge("УДЛИН-ЛЬ");
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("УСТРОЙСТВО", GoodAttrType.KEYWORD);
        t.add_abridge("УСТР-ВО");
        t.add_abridge("УСТР.");
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("ПРОКЛАДКИ", GoodAttrType.KEYWORD);
        t.add_variant("ПРОКЛ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("ДЕЗОДОРАНТ", GoodAttrType.KEYWORD);
        t.add_variant("ДЕЗ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("ОХЛАЖДЕННЫЙ", GoodAttrType.CHARACTER);
        t.add_variant("ОХЛ", false);
        t.add_variant("ОХЛАЖД", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("МЕДИЦИНСКИЙ", GoodAttrType.CHARACTER);
        t.add_variant("МЕД", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("СТЕРИЛЬНЫЙ", GoodAttrType.CHARACTER);
        t.add_variant("СТЕР", false);
        t.add_variant("СТ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("ХЛОПЧАТОБУМАЖНЫЙ", GoodAttrType.CHARACTER);
        t.add_abridge("Х/Б");
        t.add_abridge("ХБ");
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("ДЕТСКИЙ", GoodAttrType.CHARACTER);
        t.add_variant("ДЕТ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("МУЖСКОЙ", GoodAttrType.CHARACTER);
        t.add_variant("МУЖ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("ЖЕНСКИЙ", GoodAttrType.CHARACTER);
        t.add_variant("ЖЕН", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("СТРАНА", GoodAttrType.REFERENT);
        t.add_variant("СТРАНА ПРОИСХОЖДЕНИЯ", false);
        t.add_variant("ПРОИСХОЖДЕНИЕ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("ПРОИЗВОДИТЕЛЬ", GoodAttrType.REFERENT);
        t.add_abridge("ПР-ЛЬ");
        t.add_abridge("ПРОИЗВ-ЛЬ");
        t.add_abridge("ПРОИЗВ.");
        t.add_variant("ПРОИЗВОДСТВО", false);
        t.add_abridge("ПР-ВО");
        t.add_variant("ПРОИЗВЕСТИ", false);
        t.add_variant("КОМПАНИЯ", false);
        t.add_variant("ФИРМА", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new121("ТОВАРНЫЙ ЗНАК", GoodAttrType.UNDEFINED, "");
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new121("КАТАЛОЖНЫЙ НОМЕР", GoodAttrType.UNDEFINED, "");
        t.add_variant("НОМЕР В КАТАЛОГЕ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new121("МАРКА", GoodAttrType.UNDEFINED, "");
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new121("ФИРМА", GoodAttrType.UNDEFINED, "");
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new121("МОДЕЛЬ", GoodAttrType.UNDEFINED, "");
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new121("НЕТ", GoodAttrType.UNDEFINED, "NO");
        t.add_variant("ОТСУТСТВОВАТЬ", false);
        t.add_variant("НЕ ИМЕТЬ", false);
        GoodAttrToken.m_std_abbrs.add(t);
        t = Termin._new119("БОЛЕЕ", GoodAttrType.UNDEFINED);
        t.add_variant("МЕНЕЕ", false);
        t.add_variant("НЕ БОЛЕЕ", false);
        t.add_variant("НЕ МЕНЕЕ", false);
        GoodAttrToken.m_std_abbrs.add(t);
    }
    
    static _new1273(_arg1, _arg2, _arg3) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.value = _arg3;
        return res;
    }
    
    static _new1274(_arg1, _arg2, _arg3, _arg4) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        return res;
    }
    
    static _new1275(_arg1, _arg2, _arg3) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new1277(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static _new1278(_arg1, _arg2, _arg3, _arg4) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.ref = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new1279(_arg1, _arg2, _arg3, _arg4) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.ref_tok = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new1281(_arg1, _arg2, _arg3, _arg4) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.name = _arg4;
        return res;
    }
    
    static _new1283(_arg1, _arg2, _arg3, _arg4) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.morph = _arg4;
        return res;
    }
    
    static _new1291(_arg1, _arg2, _arg3, _arg4) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new1314(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new GoodAttrToken(_arg1, _arg2);
        res.typ = _arg3;
        res.name = _arg4;
        res.value = _arg5;
        return res;
    }
    
    static static_constructor() {
        GoodAttrToken.m_num_suff = new TerminCollection();
        GoodAttrToken.m_std_abbrs = new TerminCollection();
        GoodAttrToken.m_denom_an = new DenominationAnalyzer();
        GoodAttrToken.m_inited = false;
    }
}


GoodAttrToken.static_constructor();

module.exports = GoodAttrToken