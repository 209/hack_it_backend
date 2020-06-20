/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const GeoReferent = require("./../../geo/GeoReferent");
const GetTextAttr = require("./../../core/GetTextAttr");
const NumberSpellingType = require("./../../NumberSpellingType");
const CharsInfo = require("./../../../morph/CharsInfo");
const MetaToken = require("./../../MetaToken");
const OrgItemEponymTokenPersonItemType = require("./OrgItemEponymTokenPersonItemType");
const Token = require("./../../Token");
const ReferentToken = require("./../../ReferentToken");
const TextToken = require("./../../TextToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const NumberHelper = require("./../../core/NumberHelper");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const MiscHelper = require("./../../core/MiscHelper");

class OrgItemEponymToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.eponyms = new Array();
    }
    
    toString() {
        let res = new StringBuilder();
        res.append("имени");
        for (const e of this.eponyms) {
            res.append(" ").append(e);
        }
        return res.toString();
    }
    
    static try_attach(t, must_has_prefix = false) {
        const OrgItemNameToken = require("./OrgItemNameToken");
        let tt = Utils.as(t, TextToken);
        if (tt === null) {
            if (t === null) 
                return null;
            let r1 = t.get_referent();
            if (r1 !== null && r1.type_name === "DATE") {
                let str = r1.toString().toUpperCase();
                if ((str === "1 МАЯ" || str === "7 ОКТЯБРЯ" || str === "9 МАЯ") || str === "8 МАРТА") {
                    let dt = OrgItemEponymToken._new1788(t, t, new Array());
                    dt.eponyms.push(str);
                    return dt;
                }
            }
            let age = NumberHelper.try_parse_age(t);
            if ((age !== null && (((age.end_token.next instanceof TextToken) || (age.end_token.next instanceof ReferentToken))) && (age.whitespaces_after_count < 3)) && !age.end_token.next.chars.is_all_lower && age.end_token.next.chars.is_cyrillic_letter) {
                let dt = OrgItemEponymToken._new1788(t, age.end_token.next, new Array());
                dt.eponyms.push((age.value + " " + dt.end_token.get_source_text().toUpperCase()));
                return dt;
            }
            return null;
        }
        let t1 = null;
        let full = false;
        let has_name = false;
        if (tt.term === "ИМЕНИ" || tt.term === "ІМЕНІ") {
            t1 = t.next;
            full = true;
            has_name = true;
        }
        else if (((tt.term === "ИМ" || tt.term === "ІМ")) && tt.next !== null) {
            if (tt.next.is_char('.')) {
                t1 = tt.next.next;
                full = true;
            }
            else if ((tt.next instanceof TextToken) && tt.chars.is_all_lower && !tt.next.chars.is_all_lower) 
                t1 = tt.next;
            has_name = true;
        }
        else if (tt.previous !== null && ((tt.previous.is_value("ФОНД", null) || tt.previous.is_value("ХРАМ", null) || tt.previous.is_value("ЦЕРКОВЬ", "ЦЕРКВА")))) {
            if ((!tt.chars.is_cyrillic_letter || tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) || !tt.chars.is_letter) 
                return null;
            if (tt.whitespaces_before_count !== 1) 
                return null;
            if (tt.chars.is_all_lower) 
                return null;
            if (tt.morph.class0.is_adjective) {
                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && npt.begin_token !== npt.end_token) 
                    return null;
            }
            let na = OrgItemNameToken.try_attach(tt, null, false, true);
            if (na !== null) {
                if (na.is_empty_word || na.is_std_name || na.is_std_tail) 
                    return null;
            }
            t1 = tt;
        }
        if (t1 === null || ((t1.is_newline_before && !full))) 
            return null;
        if (tt.previous !== null && tt.previous.morph.class0.is_preposition) 
            return null;
        if (must_has_prefix && !has_name) 
            return null;
        let r = t1.get_referent();
        if ((r !== null && r.type_name === "DATE" && full) && r.find_slot("DAY", null, true) !== null && r.find_slot("YEAR", null, true) === null) {
            let dt = OrgItemEponymToken._new1788(t, t1, new Array());
            dt.eponyms.push(r.toString().toUpperCase());
            return dt;
        }
        let holy = false;
        if ((t1.is_value("СВЯТОЙ", null) || t1.is_value("СВЯТИЙ", null) || t1.is_value("СВ", null)) || t1.is_value("СВЯТ", null)) {
            t1 = t1.next;
            holy = true;
            if (t1 !== null && t1.is_char('.')) 
                t1 = t1.next;
        }
        if (t1 === null) 
            return null;
        let cl = t1.get_morph_class_in_dictionary();
        if (cl.is_noun || cl.is_adjective) {
            let rt = t1.kit.process_referent("PERSON", t1);
            if (rt !== null && rt.referent.type_name === "PERSON" && rt.begin_token !== rt.end_token) {
                let e = rt.referent.get_string_value("LASTNAME");
                if (e !== null) {
                    if (rt.end_token.is_value(e, null)) {
                        let re = new OrgItemEponymToken(t, rt.end_token);
                        re.eponyms.push(rt.end_token.get_source_text());
                        return re;
                    }
                }
            }
        }
        let nt = NumberHelper.try_parse_anniversary(t1);
        if (nt !== null && nt.typ === NumberSpellingType.AGE) {
            let npt = NounPhraseHelper.try_parse(nt.end_token.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                let s = (nt.value + "-" + (t.kit.base_language.is_ua ? "РОКІВ" : "ЛЕТ") + " " + MiscHelper.get_text_value(npt.begin_token, npt.end_token, GetTextAttr.NO));
                let res = new OrgItemEponymToken(t, npt.end_token);
                res.eponyms.push(s);
                return res;
            }
        }
        let its = OrgItemEponymToken.PersonItemToken.try_attach(t1);
        if (its === null) {
            if ((t1 instanceof ReferentToken) && ((t1.get_referent() instanceof GeoReferent))) {
                let s = MiscHelper.get_text_value(t1, t1, GetTextAttr.NO);
                let re = new OrgItemEponymToken(t, t1);
                re.eponyms.push(s);
                return re;
            }
            return null;
        }
        let eponims = new Array();
        let i = 0;
        let j = 0;
        if (its[i].typ === OrgItemEponymTokenPersonItemType.LOCASEWORD) 
            i++;
        if (i >= its.length) 
            return null;
        if (!full) {
            if (its[i].begin_token.morph.class0.is_adjective && !its[i].begin_token.morph.class0.is_proper_surname) 
                return null;
        }
        if (its[i].typ === OrgItemEponymTokenPersonItemType.INITIAL) {
            i++;
            while (true) {
                if ((i < its.length) && its[i].typ === OrgItemEponymTokenPersonItemType.INITIAL) 
                    i++;
                if (i >= its.length || ((its[i].typ !== OrgItemEponymTokenPersonItemType.SURNAME && its[i].typ !== OrgItemEponymTokenPersonItemType.NAME))) 
                    break;
                eponims.push(its[i].value);
                t1 = its[i].end_token;
                if ((i + 2) >= its.length || its[i + 1].typ !== OrgItemEponymTokenPersonItemType.AND || its[i + 2].typ !== OrgItemEponymTokenPersonItemType.INITIAL) 
                    break;
                i += 3;
            }
        }
        else if (((i + 1) < its.length) && its[i].typ === OrgItemEponymTokenPersonItemType.NAME && its[i + 1].typ === OrgItemEponymTokenPersonItemType.SURNAME) {
            eponims.push(its[i + 1].value);
            t1 = its[i + 1].end_token;
            i += 2;
            if ((((i + 2) < its.length) && its[i].typ === OrgItemEponymTokenPersonItemType.AND && its[i + 1].typ === OrgItemEponymTokenPersonItemType.NAME) && its[i + 2].typ === OrgItemEponymTokenPersonItemType.SURNAME) {
                eponims.push(its[i + 2].value);
                t1 = its[i + 2].end_token;
            }
        }
        else if (its[i].typ === OrgItemEponymTokenPersonItemType.SURNAME) {
            if (its.length === (i + 2) && CharsInfo.ooEq(its[i].chars, its[i + 1].chars)) {
                its[i].value += (" " + its[i + 1].value);
                its[i].end_token = its[i + 1].end_token;
                its.splice(i + 1, 1);
            }
            eponims.push(its[i].value);
            if (((i + 1) < its.length) && its[i + 1].typ === OrgItemEponymTokenPersonItemType.NAME) {
                if ((i + 2) === its.length) 
                    i++;
                else if (its[i + 2].typ !== OrgItemEponymTokenPersonItemType.SURNAME) 
                    i++;
            }
            else if (((i + 1) < its.length) && its[i + 1].typ === OrgItemEponymTokenPersonItemType.INITIAL) {
                if ((i + 2) === its.length) 
                    i++;
                else if (its[i + 2].typ === OrgItemEponymTokenPersonItemType.INITIAL && (i + 3) === its.length) 
                    i += 2;
            }
            else if (((i + 2) < its.length) && its[i + 1].typ === OrgItemEponymTokenPersonItemType.AND && its[i + 2].typ === OrgItemEponymTokenPersonItemType.SURNAME) {
                let ok = true;
                let npt = NounPhraseHelper.try_parse(its[i + 2].begin_token, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null && !npt.morph._case.is_genitive && !npt.morph._case.is_undefined) 
                    ok = false;
                if (ok) {
                    eponims.push(its[i + 2].value);
                    i += 2;
                }
            }
            t1 = its[i].end_token;
        }
        else if (its[i].typ === OrgItemEponymTokenPersonItemType.NAME && holy) {
            t1 = its[i].end_token;
            let sec = false;
            if (((i + 1) < its.length) && CharsInfo.ooEq(its[i].chars, its[i + 1].chars) && its[i + 1].typ !== OrgItemEponymTokenPersonItemType.INITIAL) {
                sec = true;
                t1 = its[i + 1].end_token;
            }
            if (sec) 
                eponims.push(("СВЯТ." + its[i].value + " " + its[i + 1].value));
            else 
                eponims.push(("СВЯТ." + its[i].value));
        }
        else if (full && (i + 1) === its.length && ((its[i].typ === OrgItemEponymTokenPersonItemType.NAME || its[i].typ === OrgItemEponymTokenPersonItemType.SURNAME))) {
            t1 = its[i].end_token;
            eponims.push(its[i].value);
        }
        else if ((its[i].typ === OrgItemEponymTokenPersonItemType.NAME && its.length === 3 && its[i + 1].typ === OrgItemEponymTokenPersonItemType.NAME) && its[i + 2].typ === OrgItemEponymTokenPersonItemType.SURNAME) {
            t1 = its[i + 2].end_token;
            eponims.push((its[i].value + " " + its[i + 1].value + " " + its[i + 2].value));
            i += 2;
        }
        if (eponims.length === 0) 
            return null;
        return OrgItemEponymToken._new1788(t, t1, eponims);
    }
    
    static _new1788(_arg1, _arg2, _arg3) {
        let res = new OrgItemEponymToken(_arg1, _arg2);
        res.eponyms = _arg3;
        return res;
    }
}


OrgItemEponymToken.PersonItemToken = class  extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.typ = OrgItemEponymTokenPersonItemType.SURNAME;
        this.value = null;
    }
    
    toString() {
        return (String(this.typ) + " " + ((this.value != null ? this.value : "")));
    }
    
    static try_attach(t) {
        const OrgItemEponymTokenPersonItemType = require("./OrgItemEponymTokenPersonItemType");
        const TextToken = require("./../../TextToken");
        let res = new Array();
        for (; t !== null; t = t.next) {
            if (t.is_newline_before && res.length > 0) 
                break;
            let tt = Utils.as(t, TextToken);
            if (tt === null) 
                break;
            let s = tt.term;
            if (!Utils.isLetter(s[0])) 
                break;
            if (((s.length === 1 || s === "ДЖ")) && !tt.chars.is_all_lower) {
                let t1 = t;
                if (t1.next !== null && t1.next.is_char('.')) 
                    t1 = t1.next;
                res.push(OrgItemEponymToken.PersonItemToken._new1792(t, t1, OrgItemEponymTokenPersonItemType.INITIAL, s));
                t = t1;
                continue;
            }
            if (tt.is_and) {
                res.push(OrgItemEponymToken.PersonItemToken._new1793(t, t, OrgItemEponymTokenPersonItemType.AND));
                continue;
            }
            if (tt.morph.class0.is_pronoun || tt.morph.class0.is_personal_pronoun) 
                break;
            if (tt.chars.is_all_lower) {
                let mc = tt.get_morph_class_in_dictionary();
                if (mc.is_preposition || mc.is_verb || mc.is_adverb) 
                    break;
                let t1 = t;
                if (t1.next !== null && !t1.is_whitespace_after && t1.next.is_char('.')) 
                    t1 = t1.next;
                res.push(OrgItemEponymToken.PersonItemToken._new1792(t, t1, OrgItemEponymTokenPersonItemType.LOCASEWORD, s));
                t = t1;
                continue;
            }
            if (tt.morph.class0.is_proper_name) 
                res.push(OrgItemEponymToken.PersonItemToken._new1792(t, t, OrgItemEponymTokenPersonItemType.NAME, s));
            else if ((t.next !== null && t.next.is_hiphen && (t.next.next instanceof TextToken)) && !t.next.is_whitespace_after) {
                res.push(OrgItemEponymToken.PersonItemToken._new1792(t, t.next.next, OrgItemEponymTokenPersonItemType.SURNAME, (s + "-" + (t.next.next).term)));
                t = t.next.next;
            }
            else 
                res.push(OrgItemEponymToken.PersonItemToken._new1792(t, t, OrgItemEponymTokenPersonItemType.SURNAME, s));
        }
        return (res.length > 0 ? res : null);
    }
    
    static _new1792(_arg1, _arg2, _arg3, _arg4) {
        let res = new OrgItemEponymToken.PersonItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.value = _arg4;
        return res;
    }
    
    static _new1793(_arg1, _arg2, _arg3) {
        let res = new OrgItemEponymToken.PersonItemToken(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
}


module.exports = OrgItemEponymToken