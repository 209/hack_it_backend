/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const MorphGender = require("./../../../morph/MorphGender");
const MorphWordForm = require("./../../../morph/MorphWordForm");
const MorphCollection = require("./../../MorphCollection");
const GetTextAttr = require("./../GetTextAttr");
const LanguageHelper = require("./../../../morph/LanguageHelper");
const CharsInfo = require("./../../../morph/CharsInfo");
const MetaToken = require("./../../MetaToken");
const NounPhraseParseAttr = require("./../NounPhraseParseAttr");
const TerminParseAttr = require("./../TerminParseAttr");
const NounPhraseHelper = require("./../NounPhraseHelper");
const TextToken = require("./../../TextToken");
const NumberToken = require("./../../NumberToken");
const MorphCase = require("./../../../morph/MorphCase");
const MorphNumber = require("./../../../morph/MorphNumber");
const ReferentToken = require("./../../ReferentToken");
const MorphClass = require("./../../../morph/MorphClass");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const Morphology = require("./../../../morph/Morphology");
const MiscHelper = require("./../MiscHelper");
const Termin = require("./../Termin");
const TerminCollection = require("./../TerminCollection");
const NumberHelper = require("./../NumberHelper");
const NounPhraseItemTextVar = require("./NounPhraseItemTextVar");

/**
 * Элемент именной группы
 */
class NounPhraseItem extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.conj_before = false;
        this.adj_morph = new Array();
        this.can_be_adj = false;
        this.noun_morph = new Array();
        this.can_be_noun = false;
        this.multi_nouns = false;
        this.can_be_surname = false;
        this.is_std_adjective = false;
        this.is_doubt_adjective = false;
    }
    
    /**
     * [Get] Это признак количественного (число, НЕСКОЛЬКО, МНОГО)
     */
    get can_be_numeric_adj() {
        let num = Utils.as(this.begin_token, NumberToken);
        if (num !== null) {
            if (num.int_value !== null && num.int_value > 1) 
                return true;
            else 
                return false;
        }
        if ((this.begin_token.is_value("НЕСКОЛЬКО", null) || this.begin_token.is_value("МНОГО", null) || this.begin_token.is_value("ПАРА", null)) || this.begin_token.is_value("ПОЛТОРА", null)) 
            return true;
        return false;
    }
    
    get is_pronoun() {
        return this.begin_token.morph.class0.is_pronoun;
    }
    
    get is_personal_pronoun() {
        return this.begin_token.morph.class0.is_personal_pronoun;
    }
    
    /**
     * [Get] Это признак причастия
     */
    get is_verb() {
        return this.begin_token.morph.class0.is_verb;
    }
    
    get is_adverb() {
        return this.begin_token.morph.class0.is_adverb;
    }
    
    get can_be_adj_for_personal_pronoun() {
        if (this.is_pronoun && this.can_be_adj) {
            if (this.begin_token.is_value("ВСЕ", null) || this.begin_token.is_value("ВЕСЬ", null) || this.begin_token.is_value("САМ", null)) 
                return true;
        }
        return false;
    }
    
    _corr_chars(str, keep) {
        if (!keep) 
            return str;
        if (this.chars.is_all_lower) 
            return str.toLowerCase();
        if (this.chars.is_capital_upper) 
            return MiscHelper.convert_first_char_upper_and_other_lower(str);
        return str;
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        if ((this.begin_token instanceof ReferentToken) && this.begin_token === this.end_token) 
            return this.begin_token.get_normal_case_text(mc, single_number, gender, keep_chars);
        let res = null;
        let max_coef = 0;
        let def_coef = -1;
        for (const it of this.morph.items) {
            let v = Utils.as(it, NounPhraseItemTextVar);
            if (v.undef_coef > 0 && (((v.undef_coef < max_coef) || def_coef >= 0))) 
                continue;
            if (single_number && v.single_number_value !== null) {
                if (mc !== null && ((gender === MorphGender.NEUTER || gender === MorphGender.FEMINIE)) && mc.is_adjective) {
                    let bi = MorphBaseInfo._new468(new MorphClass(mc), gender, MorphNumber.SINGULAR, MorphCase.NOMINATIVE, this.morph.language);
                    let str = Morphology.get_wordform(v.single_number_value, bi);
                    if (str !== null) 
                        res = str;
                }
                else 
                    res = v.single_number_value;
                if (v.undef_coef === 0) 
                    break;
                max_coef = v.undef_coef;
                continue;
            }
            if (Utils.isNullOrEmpty(v.normal_value)) 
                continue;
            if (Utils.isDigit(v.normal_value[0]) && mc !== null && mc.is_adjective) {
                let val = 0;
                let wrapval469 = new RefOutArgWrapper();
                let inoutres470 = Utils.tryParseInt(v.normal_value, wrapval469);
                val = wrapval469.value;
                if (inoutres470) {
                    let str = NumberHelper.get_number_adjective(val, gender, (single_number || val === 1 ? MorphNumber.SINGULAR : MorphNumber.PLURAL));
                    if (str !== null) {
                        res = str;
                        if (v.undef_coef === 0) 
                            break;
                        max_coef = v.undef_coef;
                        continue;
                    }
                }
            }
            let res1 = (it).normal_value;
            if (single_number) {
                if (res1 === "ДЕТИ") 
                    res1 = "РЕБЕНОК";
                else if (res1 === "ЛЮДИ") 
                    res1 = "ЧЕЛОВЕК";
            }
            max_coef = v.undef_coef;
            if (v.undef_coef > 0) {
                res = res1;
                continue;
            }
            let def_co = 0;
            if (mc !== null && mc.is_adjective && v.undef_coef === 0) {
            }
            else if (((this.begin_token instanceof TextToken) && res1 === (this.begin_token).term && it._case.is_nominative) && it.number === MorphNumber.SINGULAR) 
                def_co = 1;
            if (res === null || def_co > def_coef) {
                res = res1;
                def_coef = def_co;
                if (def_co > 0) 
                    break;
            }
        }
        if (res !== null) 
            return this._corr_chars(res, keep_chars);
        if (res === null && this.begin_token === this.end_token) 
            res = this.begin_token.get_normal_case_text(mc, single_number, gender, keep_chars);
        else if (res === null) {
            res = this.begin_token.get_normal_case_text(mc, single_number, gender, keep_chars);
            if (res === null) 
                res = MiscHelper.get_text_value_of_meta_token(this, (keep_chars ? GetTextAttr.KEEPREGISTER : GetTextAttr.NO));
            else 
                res = (res + " " + MiscHelper.get_text_value(this.begin_token.next, this.end_token, (keep_chars ? GetTextAttr.KEEPREGISTER : GetTextAttr.NO)));
        }
        return (res != null ? res : "?");
    }
    
    is_value(term, term2 = null) {
        if (this.begin_token !== null) 
            return this.begin_token.is_value(term, term2);
        else 
            return false;
    }
    
    static try_parse(t, items, attrs) {
        if (t === null) 
            return null;
        let t0 = t;
        let _can_be_surname = false;
        let _is_doubt_adj = false;
        let rt = Utils.as(t, ReferentToken);
        if (rt !== null && rt.begin_token === rt.end_token && (rt.begin_token instanceof TextToken)) {
            let res = NounPhraseItem.try_parse(rt.begin_token, items, attrs);
            if (res !== null) {
                res.begin_token = res.end_token = t;
                res.can_be_noun = true;
                return res;
            }
        }
        if (rt !== null) {
            let res = new NounPhraseItem(t, t);
            for (const m of t.morph.items) {
                let v = new NounPhraseItemTextVar(m, null);
                v.normal_value = t.get_referent().toString();
                res.noun_morph.push(v);
            }
            res.can_be_noun = true;
            return res;
        }
        if (t instanceof NumberToken) {
        }
        let has_legal_verb = false;
        if (t instanceof TextToken) {
            if (!t.chars.is_letter) 
                return null;
            let str = (t).term;
            if (str[str.length - 1] === 'А' || str[str.length - 1] === 'О') {
                for (const wf of t.morph.items) {
                    if ((wf instanceof MorphWordForm) && (wf).is_in_dictionary) {
                        if (wf.class0.is_verb) {
                            let mc = t.get_morph_class_in_dictionary();
                            if (!mc.is_noun && (((attrs.value()) & (NounPhraseParseAttr.IGNOREPARTICIPLES.value()))) === (NounPhraseParseAttr.NO.value())) {
                                if (!LanguageHelper.ends_with_ex(str, "ОГО", "ЕГО", null, null)) 
                                    return null;
                            }
                            has_legal_verb = true;
                        }
                        if (wf.class0.is_adverb) {
                            if (t.next === null || !t.next.is_hiphen) {
                                if ((str === "ВСЕГО" || str === "ДОМА" || str === "НЕСКОЛЬКО") || str === "МНОГО" || str === "ПОРЯДКА") {
                                }
                                else 
                                    return null;
                            }
                        }
                        if (wf.class0.is_adjective) {
                            if (wf.contains_attr("к.ф.", null)) {
                                if (MorphClass.ooEq(t.get_morph_class_in_dictionary(), MorphClass.ADJECTIVE)) {
                                }
                                else 
                                    _is_doubt_adj = true;
                            }
                        }
                    }
                }
            }
            let mc0 = t.morph.class0;
            if (mc0.is_proper_surname && !t.chars.is_all_lower) {
                for (const wf of t.morph.items) {
                    if (wf.class0.is_proper_surname && wf.number !== MorphNumber.PLURAL) {
                        let wff = Utils.as(wf, MorphWordForm);
                        if (wff === null) 
                            continue;
                        let s = Utils.notNull(((wff.normal_full != null ? wff.normal_full : wff.normal_case)), "");
                        if (LanguageHelper.ends_with_ex(s, "ИН", "ЕН", "ЫН", null)) {
                            if (!wff.is_in_dictionary) 
                                _can_be_surname = true;
                            else 
                                return null;
                        }
                        if (wff.is_in_dictionary && LanguageHelper.ends_with(s, "ОВ")) 
                            _can_be_surname = true;
                    }
                }
            }
            if (mc0.is_proper_name && !t.chars.is_all_lower) {
                for (const wff of t.morph.items) {
                    let wf = Utils.as(wff, MorphWordForm);
                    if (wf === null) 
                        continue;
                    if (wf.normal_case === "ГОР") 
                        continue;
                    if (wf.class0.is_proper_name && wf.is_in_dictionary) {
                        if (wf.normal_case === null || !wf.normal_case.startsWith("ЛЮБ")) {
                            if (mc0.is_adjective && t.morph.contains_attr("неизм.", null)) {
                            }
                            else if ((((attrs.value()) & (NounPhraseParseAttr.REFERENTCANBENOUN.value()))) === (NounPhraseParseAttr.REFERENTCANBENOUN.value())) {
                            }
                            else {
                                if (items === null || (items.length < 1)) 
                                    return null;
                                if (!items[0].is_std_adjective) 
                                    return null;
                            }
                        }
                    }
                }
            }
            if (mc0.is_adjective && t.morph.items_count === 1) {
                if (t.morph.get_indexer_item(0).contains_attr("в.ср.ст.", null)) 
                    return null;
            }
            let mc1 = t.get_morph_class_in_dictionary();
            if (MorphClass.ooEq(mc1, MorphClass.VERB) && t.morph._case.is_undefined) 
                return null;
            if (((((attrs.value()) & (NounPhraseParseAttr.IGNOREPARTICIPLES.value()))) === (NounPhraseParseAttr.IGNOREPARTICIPLES.value()) && t.morph.class0.is_verb && !t.morph.class0.is_noun) && !t.morph.class0.is_proper) {
                for (const wf of t.morph.items) {
                    if (wf.class0.is_verb) {
                        if (wf.contains_attr("дейст.з.", null)) {
                            if (LanguageHelper.ends_with((t).term, "СЯ")) {
                            }
                            else 
                                return null;
                        }
                    }
                }
            }
        }
        let t1 = null;
        for (let k = 0; k < 2; k++) {
            t = (t1 != null ? t1 : t0);
            if (k === 0) {
                if ((((t0 instanceof TextToken)) && t0.next !== null && t0.next.is_hiphen) && t0.next.next !== null) {
                    if (!t0.is_whitespace_after && !t0.morph.class0.is_pronoun && !((t0.next.next instanceof NumberToken))) {
                        if (!t0.next.is_whitespace_after) 
                            t = t0.next.next;
                        else if (t0.next.next.chars.is_all_lower && LanguageHelper.ends_with((t0).term, "О")) 
                            t = t0.next.next;
                    }
                }
            }
            let it = NounPhraseItem._new471(t0, t, _can_be_surname);
            if (t0 === t && (t0 instanceof ReferentToken)) {
                it.can_be_noun = true;
                it.morph = new MorphCollection(t0.morph);
            }
            let can_be_prepos = false;
            for (const v of t.morph.items) {
                let wf = Utils.as(v, MorphWordForm);
                if (v.class0.is_verb && !v._case.is_undefined) {
                    it.can_be_adj = true;
                    it.adj_morph.push(new NounPhraseItemTextVar(v, t));
                    continue;
                }
                if (v.class0.is_preposition) 
                    can_be_prepos = true;
                if (v.class0.is_adjective || ((v.class0.is_pronoun && !v.class0.is_personal_pronoun)) || ((v.class0.is_noun && (t instanceof NumberToken)))) {
                    if (NounPhraseItem.try_accord_variant(items, (items === null ? 0 : items.length), v, false)) {
                        let is_doub = false;
                        if (v.contains_attr("к.ф.", null)) 
                            continue;
                        if (v.contains_attr("собир.", null) && !((t instanceof NumberToken))) {
                            if (wf !== null && wf.is_in_dictionary) 
                                return null;
                            continue;
                        }
                        if (v.contains_attr("сравн.", null)) 
                            continue;
                        let ok = true;
                        if (t instanceof TextToken) {
                            let s = (t).term;
                            if (s === "ПРАВО" || s === "ПРАВА") 
                                ok = false;
                            else if (LanguageHelper.ends_with(s, "ОВ") && t.get_morph_class_in_dictionary().is_noun) 
                                ok = false;
                        }
                        else if (t instanceof NumberToken) {
                            if (v.class0.is_noun && t.morph.class0.is_adjective) 
                                ok = false;
                            else if (t.morph.class0.is_noun && (((attrs.value()) & (NounPhraseParseAttr.PARSENUMERICASADJECTIVE.value()))) === (NounPhraseParseAttr.NO.value())) 
                                ok = false;
                        }
                        if (ok) {
                            it.adj_morph.push(new NounPhraseItemTextVar(v, t));
                            it.can_be_adj = true;
                            if (_is_doubt_adj && t0 === t) 
                                it.is_doubt_adjective = true;
                            if (has_legal_verb && wf !== null && wf.is_in_dictionary) {
                                it.can_be_noun = true;
                                if ((((attrs.value()) & (NounPhraseParseAttr.PARSEVERBS.value()))) === (NounPhraseParseAttr.NO.value())) {
                                    it.can_be_adj = false;
                                    break;
                                }
                            }
                            if (wf !== null && wf.class0.is_pronoun) {
                                it.can_be_noun = true;
                                it.noun_morph.push(new NounPhraseItemTextVar(v, t));
                            }
                        }
                    }
                }
                let _can_be_noun = false;
                if (t instanceof NumberToken) {
                }
                else if (v.class0.is_noun || ((wf !== null && wf.normal_case === "САМ"))) 
                    _can_be_noun = true;
                else if (v.class0.is_personal_pronoun) {
                    if (items === null || items.length === 0) 
                        _can_be_noun = true;
                    else {
                        for (const it1 of items) {
                            if (it1.is_verb) 
                                return null;
                        }
                        if (items.length === 1) {
                            if (items[0].can_be_adj_for_personal_pronoun) 
                                _can_be_noun = true;
                        }
                    }
                }
                else if ((v.class0.is_pronoun && ((items === null || items.length === 0 || ((items.length === 1 && items[0].can_be_adj_for_personal_pronoun)))) && wf !== null) && (((((wf.normal_case === "ТОТ" || wf.normal_full === "ТО" || wf.normal_case === "ТО") || wf.normal_case === "ЭТО" || wf.normal_case === "ВСЕ") || wf.normal_case === "ЧТО" || wf.normal_case === "КТО") || wf.normal_full === "КОТОРЫЙ" || wf.normal_case === "КОТОРЫЙ"))) {
                    if (wf.normal_case === "ВСЕ") {
                        if (t.next !== null && t.next.is_value("РАВНО", null)) 
                            return null;
                    }
                    _can_be_noun = true;
                }
                else if (wf !== null && (((wf.normal_full != null ? wf.normal_full : wf.normal_case))) === "КОТОРЫЙ" && (((attrs.value()) & (NounPhraseParseAttr.PARSEPRONOUNS.value()))) === (NounPhraseParseAttr.NO.value())) 
                    return null;
                else if (v.class0.is_proper && (t instanceof TextToken)) {
                    if (t.length_char > 4 || v.class0.is_proper_name) 
                        _can_be_noun = true;
                }
                if (_can_be_noun) {
                    let added = false;
                    if (items !== null && items.length > 1 && (((attrs.value()) & (NounPhraseParseAttr.MULTINOUNS.value()))) !== (NounPhraseParseAttr.NO.value())) {
                        let ok1 = true;
                        for (let ii = 1; ii < items.length; ii++) {
                            if (!items[ii].conj_before) {
                                ok1 = false;
                                break;
                            }
                        }
                        if (ok1) {
                            if (NounPhraseItem.try_accord_variant(items, (items === null ? 0 : items.length), v, true)) {
                                it.noun_morph.push(new NounPhraseItemTextVar(v, t));
                                it.can_be_noun = true;
                                it.multi_nouns = true;
                                added = true;
                            }
                        }
                    }
                    if (!added) {
                        if (NounPhraseItem.try_accord_variant(items, (items === null ? 0 : items.length), v, false)) {
                            it.noun_morph.push(new NounPhraseItemTextVar(v, t));
                            it.can_be_noun = true;
                        }
                        else if ((items.length > 0 && items[0].adj_morph.length > 0 && items[0].adj_morph[0].number === MorphNumber.PLURAL) && !(MorphCase.ooBitand(items[0].adj_morph[0]._case, v._case)).is_undefined && !items[0].adj_morph[0].class0.is_verb) {
                            if (t.next !== null && t.next.is_comma_and && (t.next.next instanceof TextToken)) {
                                let npt2 = NounPhraseHelper.try_parse(t.next.next, attrs, 0, null);
                                if (npt2 !== null && npt2.preposition === null && !(MorphCase.ooBitand(npt2.morph._case, MorphCase.ooBitand(v._case, items[0].adj_morph[0]._case))).is_undefined) {
                                    it.noun_morph.push(new NounPhraseItemTextVar(v, t));
                                    it.can_be_noun = true;
                                }
                            }
                        }
                    }
                }
            }
            if (t0 !== t) {
                for (const v of it.adj_morph) {
                    v.correct_prefix(Utils.as(t0, TextToken), false);
                }
                for (const v of it.noun_morph) {
                    v.correct_prefix(Utils.as(t0, TextToken), true);
                }
            }
            if (k === 1 && it.can_be_noun && !it.can_be_adj) {
                if (t1 !== null) 
                    it.end_token = t1;
                else 
                    it.end_token = t0.next.next;
                for (const v of it.noun_morph) {
                    if (v.normal_value !== null && (v.normal_value.indexOf('-') < 0)) 
                        v.normal_value = (v.normal_value + "-" + it.end_token.get_normal_case_text(null, false, MorphGender.UNDEFINED, false));
                }
            }
            if (it.can_be_adj) {
                if (NounPhraseItem.m_std_adjectives.try_parse(it.begin_token, TerminParseAttr.NO) !== null) 
                    it.is_std_adjective = true;
            }
            if (can_be_prepos && it.can_be_noun) {
                if (items !== null && items.length > 0) {
                    let npt1 = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSEPREPOSITION.value()) | (NounPhraseParseAttr.PARSEPRONOUNS.value()) | (NounPhraseParseAttr.PARSEVERBS.value())), 0, null);
                    if (npt1 !== null && npt1.end_char > t.end_char) 
                        return null;
                }
                else {
                    let npt1 = NounPhraseHelper.try_parse(t.next, NounPhraseParseAttr.of((NounPhraseParseAttr.PARSEPRONOUNS.value()) | (NounPhraseParseAttr.PARSEVERBS.value())), 0, null);
                    if (npt1 !== null) {
                        let mc = LanguageHelper.get_case_after_preposition((t).lemma);
                        if (!(MorphCase.ooBitand(mc, npt1.morph._case)).is_undefined) 
                            return null;
                    }
                }
            }
            if (it.can_be_noun || it.can_be_adj || k === 1) {
                if (it.begin_token.morph.class0.is_pronoun) {
                    let tt2 = it.end_token.next;
                    if ((tt2 !== null && tt2.is_hiphen && !tt2.is_whitespace_after) && !tt2.is_whitespace_before) 
                        tt2 = tt2.next;
                    if (tt2 instanceof TextToken) {
                        let ss = (tt2).term;
                        if ((ss === "ЖЕ" || ss === "БЫ" || ss === "ЛИ") || ss === "Ж") 
                            it.end_token = tt2;
                        else if (ss === "НИБУДЬ" || ss === "ЛИБО" || (((ss === "ТО" && tt2.previous.is_hiphen)) && it.can_be_adj)) {
                            it.end_token = tt2;
                            for (const m of it.adj_morph) {
                                m.normal_value = (m.normal_value + "-" + ss);
                                if (m.single_number_value !== null) 
                                    m.single_number_value = (m.single_number_value + "-" + ss);
                            }
                        }
                    }
                }
                return it;
            }
            if (t0 === t) {
                if (t0.is_value("БИЗНЕС", null) && t0.next !== null && CharsInfo.ooEq(t0.next.chars, t0.chars)) {
                    t1 = t0.next;
                    continue;
                }
                return it;
            }
        }
        return null;
    }
    
    try_accord_var(v, multinouns = false) {
        for (const vv of this.adj_morph) {
            if (vv.check_accord(v, false, multinouns)) {
                if (multinouns) {
                }
                return true;
            }
            else if (vv.normal_value === "СКОЛЬКО") 
                return true;
        }
        if (this.can_be_numeric_adj) {
            if (v.number === MorphNumber.PLURAL) 
                return true;
            if (this.begin_token instanceof NumberToken) {
                let val = (this.begin_token).int_value;
                if (val === null) 
                    return false;
                let num = (this.begin_token).value;
                if (Utils.isNullOrEmpty(num)) 
                    return false;
                let dig = num[num.length - 1];
                if ((((dig === '2' || dig === '3' || dig === '4')) && (val < 10)) || val > 20) {
                    if (v._case.is_genitive) 
                        return true;
                }
            }
            let term = null;
            if (v instanceof MorphWordForm) 
                term = (v).normal_case;
            if (v instanceof NounPhraseItemTextVar) 
                term = (v).normal_value;
            if (term === "ЛЕТ" || term === "ЧЕЛОВЕК") 
                return true;
        }
        return false;
    }
    
    static try_accord_variant(items, count, v, multinouns = false) {
        if (items === null || items.length === 0) 
            return true;
        for (let i = 0; i < count; i++) {
            let ok = items[i].try_accord_var(v, multinouns);
            if (!ok) 
                return false;
        }
        return true;
    }
    
    static try_accord_adj_and_noun(adj, noun) {
        for (const v of adj.adj_morph) {
            for (const vv of noun.noun_morph) {
                if (v.check_accord(vv, false, false)) 
                    return true;
            }
        }
        return false;
    }
    
    static initialize() {
        if (NounPhraseItem.m_std_adjectives !== null) 
            return;
        NounPhraseItem.m_std_adjectives = new TerminCollection();
        for (const s of ["СЕВЕРНЫЙ", "ЮЖНЫЙ", "ЗАПАДНЫЙ", "ВОСТОЧНЫЙ"]) {
            NounPhraseItem.m_std_adjectives.add(new Termin(s));
        }
    }
    
    static _new471(_arg1, _arg2, _arg3) {
        let res = new NounPhraseItem(_arg1, _arg2);
        res.can_be_surname = _arg3;
        return res;
    }
    
    static static_constructor() {
        NounPhraseItem.m_std_adjectives = null;
    }
}


NounPhraseItem.static_constructor();

module.exports = NounPhraseItem