/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MetaToken = require("./../MetaToken");
const MorphClass = require("./../../morph/MorphClass");
const MorphGender = require("./../../morph/MorphGender");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const Token = require("./../Token");
const NumberSpellingType = require("./../NumberSpellingType");
const Morphology = require("./../../morph/Morphology");
const BracketParseAttr = require("./BracketParseAttr");
const ReferentToken = require("./../ReferentToken");
const NounPhraseParseAttr = require("./NounPhraseParseAttr");
const MorphWordForm = require("./../../morph/MorphWordForm");
const NumberToken = require("./../NumberToken");
const MorphNumber = require("./../../morph/MorphNumber");
const MorphCase = require("./../../morph/MorphCase");
const NounPhraseHelper = require("./NounPhraseHelper");
const TextToken = require("./../TextToken");
const MiscHelper = require("./MiscHelper");
const BracketHelper = require("./BracketHelper");

/**
 * Поддержка работы с собственными именами
 */
class ProperNameHelper {
    
    static corr_chars(str, ci, keep_chars) {
        if (!keep_chars) 
            return str;
        if (ci.is_all_lower) 
            return str.toLowerCase();
        if (ci.is_capital_upper) 
            return MiscHelper.convert_first_char_upper_and_other_lower(str);
        return str;
    }
    
    /**
     * Получить строковое значение между токенами, при этом исключая кавычки и скобки
     * @param begin начальный токен
     * @param end конечный токен
     * @param normalize_first_noun_group нормализовывать ли первую именную группу (именит. падеж)
     * @param normal_first_group_single приводить ли к единственному числу первую именную группу
     * @param ignore_geo_referent игнорировать внутри географические сущности
     * @return 
     */
    static get_name_without_brackets(begin, end, normalize_first_noun_group = false, normal_first_group_single = false, ignore_geo_referent = false) {
        let res = null;
        if (BracketHelper.can_be_start_of_sequence(begin, false, false) && BracketHelper.can_be_end_of_sequence(end, false, begin, false)) {
            begin = begin.next;
            end = end.previous;
        }
        if (normalize_first_noun_group && !begin.morph.class0.is_preposition) {
            let npt = NounPhraseHelper.try_parse(begin, NounPhraseParseAttr.REFERENTCANBENOUN, 0, null);
            if (npt !== null) {
                if (npt.noun.get_morph_class_in_dictionary().is_undefined && npt.adjectives.length === 0) 
                    npt = null;
            }
            if (npt !== null && npt.end_token.end_char > end.end_char) 
                npt = null;
            if (npt !== null) {
                res = npt.get_normal_case_text(null, normal_first_group_single, MorphGender.UNDEFINED, false);
                let te = npt.end_token.next;
                if (((te !== null && te.next !== null && te.is_comma) && (te.next instanceof TextToken) && te.next.end_char <= end.end_char) && te.next.morph.class0.is_verb && te.next.morph.class0.is_adjective) {
                    for (const it of te.next.morph.items) {
                        if (it.gender === npt.morph.gender || (((it.gender.value()) & (npt.morph.gender.value()))) !== (MorphGender.UNDEFINED.value())) {
                            if (!(MorphCase.ooBitand(it._case, npt.morph._case)).is_undefined) {
                                if (it.number === npt.morph.number || (((it.number.value()) & (npt.morph.number.value()))) !== (MorphNumber.UNDEFINED.value())) {
                                    let var0 = (te.next).term;
                                    if (it instanceof MorphWordForm) 
                                        var0 = (it).normal_case;
                                    let bi = MorphBaseInfo._new564(MorphClass.ADJECTIVE, npt.morph.gender, npt.morph.number, npt.morph.language);
                                    var0 = Morphology.get_wordform(var0, bi);
                                    if (var0 !== null) {
                                        res = (res + ", " + var0);
                                        te = te.next.next;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                if (te !== null && te.end_char <= end.end_char) {
                    let s = ProperNameHelper.get_name_ex(te, end, MorphClass.UNDEFINED, MorphCase.UNDEFINED, MorphGender.UNDEFINED, true, ignore_geo_referent);
                    if (!Utils.isNullOrEmpty(s)) {
                        if (!Utils.isLetterOrDigit(s[0])) 
                            res = (res + s);
                        else 
                            res = (res + " " + s);
                    }
                }
            }
            else if ((begin instanceof TextToken) && begin.chars.is_cyrillic_letter) {
                let mm = begin.get_morph_class_in_dictionary();
                if (!mm.is_undefined) {
                    res = begin.get_normal_case_text(mm, false, MorphGender.UNDEFINED, false);
                    if (begin.end_char < end.end_char) 
                        res = (res + " " + ProperNameHelper.get_name_ex(begin.next, end, MorphClass.UNDEFINED, MorphCase.UNDEFINED, MorphGender.UNDEFINED, true, false));
                }
            }
        }
        if (res === null) 
            res = ProperNameHelper.get_name_ex(begin, end, MorphClass.UNDEFINED, MorphCase.UNDEFINED, MorphGender.UNDEFINED, true, ignore_geo_referent);
        if (!Utils.isNullOrEmpty(res)) {
            let k = 0;
            for (let i = res.length - 1; i >= 0; i--,k++) {
                if (res[i] === '*' || Utils.isWhitespace(res[i])) {
                }
                else 
                    break;
            }
            if (k > 0) {
                if (k === res.length) 
                    return null;
                res = res.substring(0, 0 + res.length - k);
            }
        }
        return res;
    }
    
    /**
     * Получить строковое значение между токенами без нормализации первой группы, всё в верхнем регистре.
     * @param begin 
     * @param end 
     * @return 
     */
    static get_name(begin, end) {
        let res = ProperNameHelper.get_name_ex(begin, end, MorphClass.UNDEFINED, MorphCase.UNDEFINED, MorphGender.UNDEFINED, false, false);
        return res;
    }
    
    static get_name_ex(begin, end, cla, mc, gender = MorphGender.UNDEFINED, ignore_brackets_and_hiphens = false, ignore_geo_referent = false) {
        if (end === null || begin === null) 
            return null;
        if (begin.end_char > end.begin_char && begin !== end) 
            return null;
        let res = new StringBuilder();
        let prefix = null;
        for (let t = begin; t !== null && t.end_char <= end.end_char; t = t.next) {
            if (res.length > 1000) 
                break;
            if (t.is_table_control_char) 
                continue;
            if (ignore_brackets_and_hiphens) {
                if (BracketHelper.is_bracket(t, false)) {
                    if (t === end) 
                        break;
                    if (t.is_char_of("(<[")) {
                        let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                        if (br !== null && br.end_char <= end.end_char) {
                            let tmp = ProperNameHelper.get_name_ex(br.begin_token.next, br.end_token.previous, MorphClass.UNDEFINED, MorphCase.UNDEFINED, MorphGender.UNDEFINED, ignore_brackets_and_hiphens, false);
                            if (tmp !== null) {
                                if ((br.end_char === end.end_char && br.begin_token.next === br.end_token.previous && !br.begin_token.next.chars.is_letter) && !((br.begin_token.next instanceof ReferentToken))) {
                                }
                                else 
                                    res.append(" ").append(t.get_source_text()).append(tmp).append(br.end_token.get_source_text());
                            }
                            t = br.end_token;
                        }
                    }
                    continue;
                }
                if (t.is_hiphen) {
                    if (t === end) 
                        break;
                    else if (t.is_whitespace_before || t.is_whitespace_after) 
                        continue;
                }
            }
            let tt = Utils.as(t, TextToken);
            if (tt !== null) {
                if (!ignore_brackets_and_hiphens) {
                    if ((tt.next !== null && tt.next.is_hiphen && (tt.next.next instanceof TextToken)) && tt !== end && tt.next !== end) {
                        if (prefix === null) 
                            prefix = tt.term;
                        else 
                            prefix = (prefix + "-" + tt.term);
                        t = tt.next;
                        if (t === end) 
                            break;
                        else 
                            continue;
                    }
                }
                let s = null;
                if (cla.value !== (0) || !mc.is_undefined || gender !== MorphGender.UNDEFINED) {
                    for (const wff of tt.morph.items) {
                        let wf = Utils.as(wff, MorphWordForm);
                        if (wf === null) 
                            continue;
                        if (cla.value !== (0)) {
                            if ((((wf.class0.value) & (cla.value))) === 0) 
                                continue;
                        }
                        if (!mc.is_undefined) {
                            if ((MorphCase.ooBitand(wf._case, mc)).is_undefined) 
                                continue;
                        }
                        if (gender !== MorphGender.UNDEFINED) {
                            if ((((wf.gender.value()) & (gender.value()))) === (MorphGender.UNDEFINED.value())) 
                                continue;
                        }
                        if (s === null || wf.normal_case === tt.term) 
                            s = wf.normal_case;
                    }
                    if (s === null && gender !== MorphGender.UNDEFINED) {
                        for (const wff of tt.morph.items) {
                            let wf = Utils.as(wff, MorphWordForm);
                            if (wf === null) 
                                continue;
                            if (cla.value !== (0)) {
                                if ((((wf.class0.value) & (cla.value))) === 0) 
                                    continue;
                            }
                            if (!mc.is_undefined) {
                                if ((MorphCase.ooBitand(wf._case, mc)).is_undefined) 
                                    continue;
                            }
                            if (s === null || wf.normal_case === tt.term) 
                                s = wf.normal_case;
                        }
                    }
                }
                if (s === null) {
                    s = tt.term;
                    if (tt.chars.is_last_lower && tt.length_char > 2) {
                        s = tt.get_source_text();
                        for (let i = s.length - 1; i >= 0; i--) {
                            if (Utils.isUpperCase(s[i])) {
                                s = s.substring(0, 0 + i + 1);
                                break;
                            }
                        }
                    }
                }
                if (prefix !== null) {
                    let delim = "-";
                    if (ignore_brackets_and_hiphens) 
                        delim = " ";
                    s = (prefix + delim + s);
                }
                prefix = null;
                if (res.length > 0 && s.length > 0) {
                    if (Utils.isLetterOrDigit(s[0])) {
                        let ch0 = res.charAt(res.length - 1);
                        if (ch0 === '-') {
                        }
                        else 
                            res.append(' ');
                    }
                    else if (!ignore_brackets_and_hiphens && BracketHelper.can_be_start_of_sequence(tt, false, false)) 
                        res.append(' ');
                }
                res.append(s);
            }
            else if (t instanceof NumberToken) {
                if (res.length > 0) {
                    if (!t.is_whitespace_before && res.charAt(res.length - 1) === '-') {
                    }
                    else 
                        res.append(' ');
                }
                let nt = Utils.as(t, NumberToken);
                if ((t.morph.class0.is_adjective && nt.typ === NumberSpellingType.WORDS && nt.begin_token === nt.end_token) && (nt.begin_token instanceof TextToken)) 
                    res.append((nt.begin_token).term);
                else 
                    res.append(nt.value);
            }
            else if (t instanceof MetaToken) {
                if ((ignore_geo_referent && t !== begin && t.get_referent() !== null) && t.get_referent().type_name === "GEO") 
                    continue;
                let s = ProperNameHelper.get_name_ex((t).begin_token, (t).end_token, cla, mc, gender, ignore_brackets_and_hiphens, ignore_geo_referent);
                if (!Utils.isNullOrEmpty(s)) {
                    if (res.length > 0) {
                        if (!t.is_whitespace_before && res.charAt(res.length - 1) === '-') {
                        }
                        else 
                            res.append(' ');
                    }
                    res.append(s);
                }
            }
            if (t === end) 
                break;
        }
        if (res.length === 0) 
            return null;
        return res.toString();
    }
}


module.exports = ProperNameHelper