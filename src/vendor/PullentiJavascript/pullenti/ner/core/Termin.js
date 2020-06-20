/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const LanguageHelper = require("./../../morph/LanguageHelper");
const MorphWordForm = require("./../../morph/MorphWordForm");
const MorphCollection = require("./../MorphCollection");
const TerminToken = require("./TerminToken");
const TerminParseAttr = require("./TerminParseAttr");
const NounPhraseParseAttr = require("./NounPhraseParseAttr");
const MorphGender = require("./../../morph/MorphGender");
const ReferentToken = require("./../ReferentToken");
const MorphLang = require("./../../morph/MorphLang");
const Token = require("./../Token");
const TextToken = require("./../TextToken");
const NumberSpellingType = require("./../NumberSpellingType");
const MetaToken = require("./../MetaToken");
const NumberToken = require("./../NumberToken");
const Morphology = require("./../../morph/Morphology");

/**
 * Термин, понятие, система обозначений чего-либо и варианты его написания
 */
class Termin {
    
    /**
     * Создать термин из строки с добавлением всех морфологических вариантов написания
     * @param source строка
     * @param _lang возможный язык
     * @param source_is_normal при true морфварианты не добавляются  
     *  (эквивалентно вызову InitByNormalText)
     */
    constructor(source = null, _lang = null, source_is_normal = false) {
        this.terms = new Array();
        this.additional_vars = null;
        this.m_canonic_text = null;
        this.ignore_terms_order = false;
        this.acronym = null;
        this.acronym_smart = null;
        this.acronym_can_be_lower = false;
        this.abridges = null;
        this.lang = new MorphLang();
        this.tag = null;
        this.tag2 = null;
        this.tag3 = null;
        if (source === null) 
            return;
        if (source_is_normal || Termin.ASSIGN_ALL_TEXTS_AS_NORMAL) {
            this.init_by_normal_text(source, _lang);
            return;
        }
        let toks = Morphology.process(source, _lang, null);
        if (toks !== null) {
            for (let i = 0; i < toks.length; i++) {
                let tt = new TextToken(toks[i], null);
                this.terms.push(new Termin.Term(tt, !source_is_normal));
            }
        }
        this.lang = new MorphLang(_lang);
    }
    
    /**
     * Быстрая инициализация без морф.вариантов, производится только 
     *  токенизация текста. Используется для ускорения работы со словарём в случае, 
     *  когда изначально известно, что на входе уже нормализованные строки
     * @param text исходно нормализованный текст
     * @param _lang возможный язык
     */
    init_by_normal_text(text, _lang = null) {
        if (Utils.isNullOrEmpty(text)) 
            return;
        text = text.toUpperCase();
        if (text.indexOf('\'') >= 0) 
            text = Utils.replaceString(text, "'", "");
        let tok = false;
        let sp = false;
        for (const ch of text) {
            if (!Utils.isLetter(ch)) {
                if (ch === ' ') 
                    sp = true;
                else {
                    tok = true;
                    break;
                }
            }
        }
        if (!tok && !sp) {
            let tt = new TextToken(null, null);
            tt.term = text;
            this.terms.push(new Termin.Term(tt, false));
        }
        else if (!tok && sp) {
            let wrds = Utils.splitString(text, ' ', false);
            for (let i = 0; i < wrds.length; i++) {
                if (Utils.isNullOrEmpty(wrds[i])) 
                    continue;
                let tt = new TextToken(null, null);
                tt.term = wrds[i];
                this.terms.push(new Termin.Term(tt, false));
            }
        }
        else {
            let toks = Morphology.tokenize(text);
            if (toks !== null) {
                for (let i = 0; i < toks.length; i++) {
                    let tt = new TextToken(toks[i], null);
                    this.terms.push(new Termin.Term(tt, false));
                }
            }
        }
        this.lang = new MorphLang(_lang);
    }
    
    init_by(begin, end, _tag = null, add_lemma_variant = false) {
        if (_tag !== null) 
            this.tag = _tag;
        for (let t = begin; t !== null; t = t.next) {
            if (this.lang.is_undefined && !t.morph.language.is_undefined) 
                this.lang = t.morph.language;
            let tt = Utils.as(t, TextToken);
            if (tt !== null) 
                this.terms.push(new Termin.Term(tt, add_lemma_variant));
            else if (t instanceof NumberToken) 
                this.terms.push(new Termin.Term(null, false, (t).value));
            if (t === end) 
                break;
        }
    }
    
    /**
     * Добавить дополнительный вариант полного написания
     * @param var0 строка варианта
     * @param source_is_normal при true морфварианты не добавляются, иначе добавляются
     */
    add_variant(var0, source_is_normal = false) {
        if (this.additional_vars === null) 
            this.additional_vars = new Array();
        this.additional_vars.push(new Termin(var0, MorphLang.UNKNOWN, source_is_normal));
    }
    
    /**
     * Добавить дополнительный вариант написания
     * @param t 
     */
    add_variant_term(t) {
        if (this.additional_vars === null) 
            this.additional_vars = new Array();
        this.additional_vars.push(t);
    }
    
    /**
     * [Get] Каноноический текст
     */
    get canonic_text() {
        if (this.m_canonic_text !== null) 
            return this.m_canonic_text;
        if (this.terms.length > 0) {
            let tmp = new StringBuilder();
            for (const v of this.terms) {
                if (tmp.length > 0) 
                    tmp.append(' ');
                tmp.append(v.canonical_text);
            }
            this.m_canonic_text = tmp.toString();
        }
        else if (this.acronym !== null) 
            this.m_canonic_text = this.acronym;
        return (this.m_canonic_text != null ? this.m_canonic_text : "?");
    }
    /**
     * [Set] Каноноический текст
     */
    set canonic_text(value) {
        this.m_canonic_text = value;
        return value;
    }
    
    /**
     * Установить стандартную аббревиатуру
     */
    set_std_acronim(smart) {
        let acr = new StringBuilder();
        for (const t of this.terms) {
            let s = t.canonical_text;
            if (Utils.isNullOrEmpty(s)) 
                continue;
            if (s.length > 2) 
                acr.append(s[0]);
        }
        if (acr.length > 1) {
            if (smart) 
                this.acronym_smart = acr.toString();
            else 
                this.acronym = acr.toString();
        }
    }
    
    add_abridge(abr) {
        if (abr === "В/ГОР") {
        }
        let a = new Termin.Abridge();
        if (this.abridges === null) 
            this.abridges = new Array();
        let i = 0;
        for (i = 0; i < abr.length; i++) {
            if (!Utils.isLetter(abr[i])) 
                break;
        }
        if (i === 0) 
            return null;
        a.parts.push(Termin.AbridgePart._new631(abr.substring(0, 0 + i).toUpperCase()));
        this.abridges.push(a);
        if (((i + 1) < abr.length) && abr[i] === '-') 
            a.tail = abr.substring(i + 1).toUpperCase();
        else if (i < abr.length) {
            if (!Utils.isWhitespace(abr[i])) 
                a.parts[0].has_delim = true;
            for (; i < abr.length; i++) {
                if (Utils.isLetter(abr[i])) {
                    let j = 0;
                    for (j = i + 1; j < abr.length; j++) {
                        if (!Utils.isLetter(abr[j])) 
                            break;
                    }
                    let p = Termin.AbridgePart._new631(abr.substring(i, i + j - i).toUpperCase());
                    if (j < abr.length) {
                        if (!Utils.isWhitespace(abr[j])) 
                            p.has_delim = true;
                    }
                    a.parts.push(p);
                    i = j;
                }
            }
        }
        return a;
    }
    
    /**
     * [Get] Род (первого термина)
     */
    get gender() {
        if (this.terms.length > 0) {
            if (this.terms.length > 0 && this.terms[0].is_adjective && this.terms[this.terms.length - 1].is_noun) 
                return this.terms[this.terms.length - 1].gender;
            return this.terms[0].gender;
        }
        else 
            return MorphGender.UNDEFINED;
    }
    /**
     * [Set] Род (первого термина)
     */
    set gender(value) {
        if (this.terms.length > 0) 
            this.terms[0].gender = value;
        return value;
    }
    
    copy_to(dst) {
        dst.terms = this.terms;
        dst.ignore_terms_order = this.ignore_terms_order;
        dst.acronym = this.acronym;
        dst.abridges = this.abridges;
        dst.lang = this.lang;
        dst.m_canonic_text = this.m_canonic_text;
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.terms.length > 0) {
            for (let i = 0; i < this.terms.length; i++) {
                if (i > 0) 
                    res.append(' ');
                res.append(this.terms[i].canonical_text);
            }
        }
        if (this.acronym !== null) {
            if (res.length > 0) 
                res.append(", ");
            res.append(this.acronym);
        }
        if (this.acronym_smart !== null) {
            if (res.length > 0) 
                res.append(", ");
            res.append(this.acronym_smart);
        }
        if (this.abridges !== null) {
            for (const a of this.abridges) {
                if (res.length > 0) 
                    res.append(", ");
                res.append(a);
            }
        }
        return res.toString();
    }
    
    add_std_abridges() {
        if (this.terms.length !== 2) 
            return;
        let first = this.terms[0].canonical_text;
        let i = 0;
        for (i = 0; i < Termin.m_std_abride_prefixes.length; i++) {
            if (first.startsWith(Termin.m_std_abride_prefixes[i])) 
                break;
        }
        if (i >= Termin.m_std_abride_prefixes.length) 
            return;
        let head = Termin.m_std_abride_prefixes[i];
        let second = this.terms[1].canonical_text;
        for (i = 0; i < head.length; i++) {
            if (!LanguageHelper.is_cyrillic_vowel(head[i])) {
                let a = new Termin.Abridge();
                a.add_part(head.substring(0, 0 + i + 1), false);
                a.add_part(second, false);
                if (this.abridges === null) 
                    this.abridges = new Array();
                this.abridges.push(a);
            }
        }
    }
    
    /**
     * Добавить все сокращения (с первой буквы до любого согласного)
     */
    add_all_abridges(tail_len = 0, max_first_len = 0, min_first_len = 0) {
        if (this.terms.length < 1) 
            return;
        let txt = this.terms[0].canonical_text;
        if (tail_len === 0) {
            for (let i = txt.length - 2; i >= 0; i--) {
                if (!LanguageHelper.is_cyrillic_vowel(txt[i])) {
                    if (min_first_len > 0 && (i < (min_first_len - 1))) 
                        break;
                    let a = new Termin.Abridge();
                    a.add_part(txt.substring(0, 0 + i + 1), false);
                    for (let j = 1; j < this.terms.length; j++) {
                        a.add_part(this.terms[j].canonical_text, false);
                    }
                    if (this.abridges === null) 
                        this.abridges = new Array();
                    this.abridges.push(a);
                }
            }
        }
        else {
            let tail = txt.substring(txt.length - tail_len);
            txt = txt.substring(0, 0 + txt.length - tail_len - 1);
            for (let i = txt.length - 2; i >= 0; i--) {
                if (max_first_len > 0 && i >= max_first_len) {
                }
                else if (!LanguageHelper.is_cyrillic_vowel(txt[i])) 
                    this.add_abridge((txt.substring(0, 0 + i + 1) + "-" + tail));
            }
        }
    }
    
    get_hash_variants() {
        let res = new Array();
        for (let j = 0; j < this.terms.length; j++) {
            for (const v of this.terms[j].variants) {
                if (!res.includes(v)) 
                    res.push(v);
            }
            if (((j + 2) < this.terms.length) && this.terms[j + 1].is_hiphen) {
                let pref = this.terms[j].canonical_text;
                for (const v of this.terms[j + 2].variants) {
                    if (!res.includes(pref + v)) 
                        res.push(pref + v);
                }
            }
            if (!this.ignore_terms_order) 
                break;
        }
        if (this.acronym !== null) {
            if (!res.includes(this.acronym)) 
                res.push(this.acronym);
        }
        if (this.acronym_smart !== null) {
            if (!res.includes(this.acronym_smart)) 
                res.push(this.acronym_smart);
        }
        if (this.abridges !== null) {
            for (const a of this.abridges) {
                if (a.parts[0].value.length > 1) {
                    if (!res.includes(a.parts[0].value)) 
                        res.push(a.parts[0].value);
                }
            }
        }
        return res;
    }
    
    is_equal(t) {
        if (t.acronym !== null) {
            if (this.acronym === t.acronym || this.acronym_smart === t.acronym) 
                return true;
        }
        if (t.acronym_smart !== null) {
            if (this.acronym === t.acronym_smart || this.acronym_smart === t.acronym_smart) 
                return true;
        }
        if (t.terms.length !== this.terms.length) 
            return false;
        for (let i = 0; i < this.terms.length; i++) {
            if (!this.terms[i].check_by_term(t.terms[i])) 
                return false;
        }
        return true;
    }
    
    /**
     * Попробовать привязать термин
     * @param t0 
     * @param pars дополнительные параметры привязки
     * @param simd степень похожести (если меньше 1)
     * @return 
     */
    try_parse(t0, pars = TerminParseAttr.NO, simd = 0) {
        const NounPhraseHelper = require("./NounPhraseHelper");
        const MiscHelper = require("./MiscHelper");
        const BracketHelper = require("./BracketHelper");
        if (t0 === null) 
            return null;
        if ((simd < 1) && simd > 0.05) 
            return this.try_parse_sim(t0, simd, pars);
        let term = null;
        if (t0 instanceof TextToken) 
            term = (t0).term;
        if (this.acronym_smart !== null && (((pars.value()) & (TerminParseAttr.FULLWORDSONLY.value()))) === (TerminParseAttr.NO.value()) && term !== null) {
            if (this.acronym_smart === term) {
                if (t0.next !== null && t0.next.is_char('.') && !t0.is_whitespace_after) 
                    return TerminToken._new633(t0, t0.next, this);
                else 
                    return TerminToken._new633(t0, t0, this);
            }
            let i = 0;
            let t1 = Utils.as(t0, TextToken);
            let tt = Utils.as(t0, TextToken);
            for (i = 0; i < this.acronym.length; i++) {
                if (tt === null) 
                    break;
                let term1 = tt.term;
                if (term1.length !== 1 || tt.is_whitespace_after) 
                    break;
                if (i > 0 && tt.is_whitespace_before) 
                    break;
                if (term1[0] !== this.acronym[i]) 
                    break;
                if (tt.next === null || !tt.next.is_char('.')) 
                    break;
                t1 = Utils.as(tt.next, TextToken);
                tt = Utils.as(tt.next.next, TextToken);
            }
            if (i >= this.acronym.length) 
                return TerminToken._new633(t0, t1, this);
        }
        if (this.acronym !== null && term !== null && this.acronym === term) {
            if (t0.chars.is_all_upper || this.acronym_can_be_lower || ((!t0.chars.is_all_lower && term.length >= 3))) 
                return TerminToken._new633(t0, t0, this);
        }
        if (this.acronym !== null && t0.chars.is_last_lower && t0.length_char > 3) {
            if (t0.is_value(this.acronym, null)) 
                return TerminToken._new633(t0, t0, this);
        }
        let cou = 0;
        for (let i = 0; i < this.terms.length; i++) {
            if (this.terms[i].is_hiphen) 
                cou--;
            else 
                cou++;
        }
        if (this.terms.length > 0 && ((!this.ignore_terms_order || cou === 1))) {
            let t1 = t0;
            let tt = t0;
            let e = null;
            let eup = null;
            let ok = true;
            let mc = null;
            let dont_change_mc = false;
            let i = 0;
            for (i = 0; i < this.terms.length; i++) {
                if (this.terms[i].is_hiphen) 
                    continue;
                if (tt !== null && tt.is_hiphen && i > 0) 
                    tt = tt.next;
                if (i > 0 && tt !== null) {
                    if ((((pars.value()) & (TerminParseAttr.IGNOREBRACKETS.value()))) !== (TerminParseAttr.NO.value()) && !tt.chars.is_letter && BracketHelper.is_bracket(tt, false)) 
                        tt = tt.next;
                }
                if (((((pars.value()) & (TerminParseAttr.CANBEGEOOBJECT.value()))) !== (TerminParseAttr.NO.value()) && i > 0 && (tt instanceof ReferentToken)) && tt.get_referent().type_name === "GEO") 
                    tt = tt.next;
                if ((tt instanceof ReferentToken) && e === null) {
                    eup = tt;
                    e = (tt).end_token;
                    tt = (tt).begin_token;
                }
                if (tt === null) {
                    ok = false;
                    break;
                }
                if (!this.terms[i].check_by_token(tt)) {
                    if (tt.next !== null && tt.is_char_of(".,") && this.terms[i].check_by_token(tt.next)) 
                        tt = tt.next;
                    else if (((i > 0 && tt.next !== null && (tt instanceof TextToken)) && ((tt.morph.class0.is_preposition || MiscHelper.is_eng_article(tt))) && this.terms[i].check_by_token(tt.next)) && !this.terms[i - 1].is_pattern_any) 
                        tt = tt.next;
                    else {
                        ok = false;
                        if (((i + 2) < this.terms.length) && this.terms[i + 1].is_hiphen && this.terms[i + 2].check_by_pref_token(this.terms[i], Utils.as(tt, TextToken))) {
                            i += 2;
                            ok = true;
                        }
                        else if (((!tt.is_whitespace_after && tt.next !== null && (tt instanceof TextToken)) && (tt).length_char === 1 && tt.next.is_char_of("\"'`’“”")) && !tt.next.is_whitespace_after && (tt.next.next instanceof TextToken)) {
                            if (this.terms[i].check_by_str_pref_token((tt).term, Utils.as(tt.next.next, TextToken))) {
                                ok = true;
                                tt = tt.next.next;
                            }
                        }
                        if (!ok) {
                            if (i > 0 && (((pars.value()) & (TerminParseAttr.IGNORESTOPWORDS.value()))) !== (TerminParseAttr.NO.value())) {
                                if (tt instanceof TextToken) {
                                    if (!tt.chars.is_letter) {
                                        tt = tt.next;
                                        i--;
                                        continue;
                                    }
                                    let mc1 = tt.get_morph_class_in_dictionary();
                                    if (mc1.is_conjunction || mc1.is_preposition) {
                                        tt = tt.next;
                                        i--;
                                        continue;
                                    }
                                }
                                if (tt instanceof NumberToken) {
                                    tt = tt.next;
                                    i--;
                                    continue;
                                }
                            }
                            break;
                        }
                    }
                }
                if (tt.morph.items_count > 0 && !dont_change_mc) {
                    mc = new MorphCollection(tt.morph);
                    if (((mc.class0.is_noun || mc.class0.is_verb)) && !mc.class0.is_adjective) {
                        if (((i + 1) < this.terms.length) && this.terms[i + 1].is_hiphen) {
                        }
                        else 
                            dont_change_mc = true;
                    }
                }
                if (tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) 
                    dont_change_mc = true;
                if (tt === e) {
                    tt = eup;
                    eup = null;
                    e = null;
                }
                if (e === null) 
                    t1 = tt;
                tt = tt.next;
            }
            if (ok && i >= this.terms.length) {
                if (t1.next !== null && t1.next.is_char('.') && this.abridges !== null) {
                    for (const a of this.abridges) {
                        if (a.try_attach(t0) !== null) {
                            t1 = t1.next;
                            break;
                        }
                    }
                }
                if (t0 !== t1 && t0.morph.class0.is_adjective) {
                    let npt = NounPhraseHelper.try_parse(t0, NounPhraseParseAttr.NO, 0, null);
                    if (npt !== null && npt.end_char <= t1.end_char) 
                        mc = npt.morph;
                }
                return TerminToken._new638(t0, t1, mc);
            }
        }
        if (this.terms.length > 1 && this.ignore_terms_order) {
            let _terms = Array.from(this.terms);
            let t1 = t0;
            let tt = t0;
            while (_terms.length > 0) {
                if (tt !== t0 && tt !== null && tt.is_hiphen) 
                    tt = tt.next;
                if (tt === null) 
                    break;
                let j = 0;
                for (j = 0; j < _terms.length; j++) {
                    if (_terms[j].check_by_token(tt)) 
                        break;
                }
                if (j >= _terms.length) {
                    if (tt !== t0 && (((pars.value()) & (TerminParseAttr.IGNORESTOPWORDS.value()))) !== (TerminParseAttr.NO.value())) {
                        if (tt instanceof TextToken) {
                            if (!tt.chars.is_letter) {
                                tt = tt.next;
                                continue;
                            }
                            let mc1 = tt.get_morph_class_in_dictionary();
                            if (mc1.is_conjunction || mc1.is_preposition) {
                                tt = tt.next;
                                continue;
                            }
                        }
                        if (tt instanceof NumberToken) {
                            tt = tt.next;
                            continue;
                        }
                    }
                    break;
                }
                _terms.splice(j, 1);
                t1 = tt;
                tt = tt.next;
            }
            for (let i = _terms.length - 1; i >= 0; i--) {
                if (_terms[i].is_hiphen) 
                    _terms.splice(i, 1);
            }
            if (_terms.length === 0) 
                return new TerminToken(t0, t1);
        }
        if (this.abridges !== null && (((pars.value()) & (TerminParseAttr.FULLWORDSONLY.value()))) === (TerminParseAttr.NO.value())) {
            let res = null;
            for (const a of this.abridges) {
                let r = a.try_attach(t0);
                if (r === null) 
                    continue;
                if (r.abridge_without_point && this.terms.length > 0) {
                    if (!((t0 instanceof TextToken))) 
                        continue;
                    if (a.parts[0].value !== (t0).term) 
                        continue;
                }
                if (res === null || (res.length_char < r.length_char)) 
                    res = r;
            }
            if (res !== null) 
                return res;
        }
        return null;
    }
    
    /**
     * Попробовать привязать термин с использованием "похожести"
     * @param t0 начальный токен
     * @param simd похожесть (0.05..1)
     * @return 
     */
    try_parse_sim(t0, simd, pars = TerminParseAttr.NO) {
        if (t0 === null) 
            return null;
        let term = null;
        if (t0 instanceof TextToken) 
            term = (t0).term;
        if (this.acronym_smart !== null && (((pars.value()) & (TerminParseAttr.FULLWORDSONLY.value()))) === (TerminParseAttr.NO.value()) && term !== null) {
            if (this.acronym_smart === term) {
                if (t0.next !== null && t0.next.is_char('.') && !t0.is_whitespace_after) 
                    return TerminToken._new633(t0, t0.next, this);
                else 
                    return TerminToken._new633(t0, t0, this);
            }
            let i = 0;
            let t1 = Utils.as(t0, TextToken);
            let tt = Utils.as(t0, TextToken);
            for (i = 0; i < this.acronym.length; i++) {
                if (tt === null) 
                    break;
                let term1 = tt.term;
                if (term1.length !== 1 || tt.is_whitespace_after) 
                    break;
                if (i > 0 && tt.is_whitespace_before) 
                    break;
                if (term1[0] !== this.acronym[i]) 
                    break;
                if (tt.next === null || !tt.next.is_char('.')) 
                    break;
                t1 = Utils.as(tt.next, TextToken);
                tt = Utils.as(tt.next.next, TextToken);
            }
            if (i >= this.acronym.length) 
                return TerminToken._new633(t0, t1, this);
        }
        if (this.acronym !== null && term !== null && this.acronym === term) {
            if (t0.chars.is_all_upper || this.acronym_can_be_lower || ((!t0.chars.is_all_lower && term.length >= 3))) 
                return TerminToken._new633(t0, t0, this);
        }
        if (this.acronym !== null && t0.chars.is_last_lower && t0.length_char > 3) {
            if (t0.is_value(this.acronym, null)) 
                return TerminToken._new633(t0, t0, this);
        }
        if (this.terms.length > 0) {
            let t1 = null;
            let tt = t0;
            let mc = null;
            let term_ind = -1;
            let terms_len = 0;
            let tk_cnt = 0;
            let terms_found_cnt = 0;
            let wr_oder = false;
            for (const it of this.terms) {
                if ((it.canonical_text.length < 2) || it.is_hiphen || it.is_point) 
                    terms_len += 0.3;
                else if (it.is_number || it.is_pattern_any) 
                    terms_len += 0.7;
                else 
                    terms_len += (1);
            }
            let max_tks_len = terms_len / simd;
            let curjm = simd;
            let terms_found = new Array();
            while (tt !== null && (tk_cnt < max_tks_len) && (terms_found_cnt < terms_len)) {
                let mcls = null;
                let ttt = Utils.as(tt, TextToken);
                let mm = false;
                if (tt.length_char < 2) 
                    tk_cnt += 0.3;
                else if (tt.is_number) 
                    tk_cnt += 0.7;
                else if (ttt === null) 
                    tk_cnt++;
                else {
                    mcls = ttt.morph.class0;
                    mm = ((mcls.is_conjunction || mcls.is_preposition || mcls.is_pronoun) || mcls.is_misc || mcls.is_undefined);
                    if (mm) 
                        tk_cnt += 0.3;
                    else 
                        tk_cnt += (1);
                }
                for (let i = 0; i < this.terms.length; i++) {
                    if (!terms_found.includes(i)) {
                        let trm = this.terms[i];
                        if (trm.is_pattern_any) {
                            terms_found_cnt += 0.7;
                            terms_found.push(i);
                            break;
                        }
                        else if (trm.canonical_text.length < 2) {
                            terms_found_cnt += 0.3;
                            terms_found.push(i);
                            break;
                        }
                        else if (trm.check_by_token(tt)) {
                            terms_found.push(i);
                            if (mm) {
                                terms_len -= 0.7;
                                terms_found_cnt += 0.3;
                            }
                            else 
                                terms_found_cnt += (trm.is_number ? 0.7 : 1);
                            if (!wr_oder) {
                                if (i < term_ind) 
                                    wr_oder = true;
                                else 
                                    term_ind = i;
                            }
                            break;
                        }
                    }
                }
                if (terms_found_cnt < 0.2) 
                    return null;
                let newjm = (terms_found_cnt / (((tk_cnt + terms_len) - terms_found_cnt))) * (((wr_oder ? 0.7 : 1)));
                if (curjm < newjm) {
                    t1 = tt;
                    curjm = newjm;
                }
                tt = tt.next;
            }
            if (t1 === null) 
                return null;
            if (t0.morph.items_count > 0) 
                mc = new MorphCollection(t0.morph);
            return TerminToken._new644(t0, t1, mc, this);
        }
        if (this.abridges !== null && (((pars.value()) & (TerminParseAttr.FULLWORDSONLY.value()))) === (TerminParseAttr.NO.value())) {
            let res = null;
            for (const a of this.abridges) {
                let r = a.try_attach(t0);
                if (r === null) 
                    continue;
                if (r.abridge_without_point && this.terms.length > 0) {
                    if (!((t0 instanceof TextToken))) 
                        continue;
                    if (a.parts[0].value !== (t0).term) 
                        continue;
                }
                if (res === null || (res.length_char < r.length_char)) 
                    res = r;
            }
            if (res !== null) 
                return res;
        }
        return null;
    }
    
    static _new114(_arg1, _arg2) {
        let res = new Termin(_arg1);
        res.acronym = _arg2;
        return res;
    }
    
    static _new119(_arg1, _arg2) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        return res;
    }
    
    static _new120(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.lang = _arg3;
        return res;
    }
    
    static _new121(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.tag2 = _arg3;
        return res;
    }
    
    static _new143(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.tag = _arg3;
        return res;
    }
    
    static _new145(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.acronym = _arg3;
        return res;
    }
    
    static _new182(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1);
        res.acronym = _arg2;
        res.acronym_can_be_lower = _arg3;
        return res;
    }
    
    static _new260(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.gender = _arg3;
        return res;
    }
    
    static _new261(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.lang = _arg3;
        res.gender = _arg4;
        return res;
    }
    
    static _new263(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.tag2 = _arg3;
        res.gender = _arg4;
        return res;
    }
    
    static _new264(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.lang = _arg3;
        res.tag2 = _arg4;
        res.gender = _arg5;
        return res;
    }
    
    static _new290(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.acronym = _arg3;
        res.tag2 = _arg4;
        res.gender = _arg5;
        return res;
    }
    
    static _new303(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.tag = _arg3;
        res.tag2 = _arg4;
        res.gender = _arg5;
        return res;
    }
    
    static _new307(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.tag = _arg3;
        res.lang = _arg4;
        res.tag2 = _arg5;
        res.gender = _arg6;
        return res;
    }
    
    static _new308(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.acronym = _arg2;
        res.tag = _arg3;
        res.gender = _arg4;
        return res;
    }
    
    static _new312(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.acronym = _arg3;
        res.gender = _arg4;
        return res;
    }
    
    static _new331(_arg1, _arg2) {
        let res = new Termin();
        res.tag = _arg1;
        res.ignore_terms_order = _arg2;
        return res;
    }
    
    static _new416(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.tag2 = _arg3;
        res.lang = _arg4;
        return res;
    }
    
    static _new456(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1, _arg2);
        res.tag = _arg3;
        return res;
    }
    
    static _new483(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new Termin(_arg1, _arg2, _arg3);
        res.canonic_text = _arg4;
        res.tag = _arg5;
        return res;
    }
    
    static _new602(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1, _arg2, _arg3);
        res.tag = _arg4;
        return res;
    }
    
    static _new699(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1, _arg2, _arg3);
        res.canonic_text = _arg4;
        return res;
    }
    
    static _new899(_arg1, _arg2) {
        let res = new Termin(_arg1);
        res.lang = _arg2;
        return res;
    }
    
    static _new911(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1, _arg2);
        res.tag = _arg3;
        res.tag2 = _arg4;
        return res;
    }
    
    static _new915(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1, _arg2);
        res.tag = _arg3;
        res.acronym = _arg4;
        return res;
    }
    
    static _new921(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.lang = _arg3;
        res.tag = _arg4;
        return res;
    }
    
    static _new924(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.tag = _arg2;
        res.acronym = _arg3;
        res.tag2 = _arg4;
        return res;
    }
    
    static _new926(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new Termin(_arg1, _arg2);
        res.tag = _arg3;
        res.acronym = _arg4;
        res.tag2 = _arg5;
        return res;
    }
    
    static _new946(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.acronym = _arg2;
        res.tag = _arg3;
        res.tag2 = _arg4;
        return res;
    }
    
    static _new995(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1, _arg2);
        res.canonic_text = _arg3;
        res.tag = _arg4;
        return res;
    }
    
    static _new1114(_arg1, _arg2) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        return res;
    }
    
    static _new1150(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1, _arg2);
        res.canonic_text = _arg3;
        return res;
    }
    
    static _new1252(_arg1, _arg2) {
        let res = new Termin();
        res.acronym = _arg1;
        res.lang = _arg2;
        return res;
    }
    
    static _new1504(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1, _arg2);
        res.acronym = _arg3;
        return res;
    }
    
    static _new2365(_arg1, _arg2) {
        let res = new Termin(_arg1);
        res.tag2 = _arg2;
        return res;
    }
    
    static _new2608(_arg1, _arg2) {
        let res = new Termin(_arg1);
        res.ignore_terms_order = _arg2;
        return res;
    }
    
    static _new2630(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1, _arg2, _arg3);
        res.tag2 = _arg4;
        return res;
    }
    
    static _new2723(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.tag = _arg3;
        res.acronym = _arg4;
        return res;
    }
    
    static _new2733(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.tag = _arg3;
        res.acronym = _arg4;
        res.acronym_can_be_lower = _arg5;
        return res;
    }
    
    static _new2746(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new Termin(_arg1, _arg2, _arg3);
        res.canonic_text = _arg4;
        res.tag = _arg5;
        res.tag2 = _arg6;
        return res;
    }
    
    static _new2747(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.tag = _arg3;
        res.tag2 = _arg4;
        return res;
    }
    
    static _new2750(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.acronym = _arg3;
        res.tag = _arg4;
        res.tag2 = _arg5;
        res.acronym_can_be_lower = _arg6;
        return res;
    }
    
    static _new2774(_arg1, _arg2, _arg3) {
        let res = new Termin(_arg1);
        res.acronym = _arg2;
        res.tag = _arg3;
        return res;
    }
    
    static _new2785(_arg1, _arg2, _arg3, _arg4) {
        let res = new Termin(_arg1);
        res.canonic_text = _arg2;
        res.acronym = _arg3;
        res.tag = _arg4;
        return res;
    }
    
    static static_constructor() {
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        Termin.m_std_abride_prefixes = ["НИЖ", "ВЕРХ", "МАЛ", "БОЛЬШ", "НОВ", "СТАР"];
    }
}


/**
 * Элемент термина (слово или число)
 */
Termin.Term = class  {
    
    constructor(src, add_lemma_variant = false, number = null) {
        const MorphGender = require("./../../morph/MorphGender");
        const MorphWordForm = require("./../../morph/MorphWordForm");
        const Token = require("./../Token");
        const NumberSpellingType = require("./../NumberSpellingType");
        const NumberToken = require("./../NumberToken");
        this.m_source = null;
        this.is_pattern_any = false;
        this.m_number = null;
        this.m_variants = new Array();
        this.m_gender = MorphGender.UNDEFINED;
        this.m_source = src;
        if (src !== null) {
            this.variants.push(src.term);
            if (src.term.length > 0 && Utils.isDigit(src.term[0])) {
                let nt = new NumberToken(src, src, src.term, NumberSpellingType.DIGIT);
                this.m_number = nt.value;
                this.m_source = null;
                return;
            }
            if (add_lemma_variant) {
                let lemma = src.lemma;
                if (lemma !== null && lemma !== src.term) 
                    this.variants.push(lemma);
                for (const wff of src.morph.items) {
                    let wf = Utils.as(wff, MorphWordForm);
                    if (wf !== null && wf.is_in_dictionary) {
                        let s = (wf.normal_full != null ? wf.normal_full : wf.normal_case);
                        if (s !== lemma && s !== src.term) 
                            this.variants.push(s);
                    }
                }
            }
        }
        if (number !== null) {
            this.m_number = number;
            this.variants.push(number);
        }
    }
    
    /**
     * [Get] Варианты морфологического написания
     */
    get variants() {
        return this.m_variants;
    }
    
    /**
     * [Get] Каноническое изображение (первый вариант)
     */
    get canonical_text() {
        return (this.m_variants.length > 0 ? this.m_variants[0] : "?");
    }
    
    toString() {
        if (this.is_pattern_any) 
            return "IsPatternAny";
        let res = new StringBuilder();
        for (const v of this.variants) {
            if (res.length > 0) 
                res.append(", ");
            res.append(v);
        }
        return res.toString();
    }
    
    /**
     * [Get] Признак того, что это число
     */
    get is_number() {
        return this.m_source === null || this.m_number !== null;
    }
    
    /**
     * [Get] Это перенос
     */
    get is_hiphen() {
        return this.m_source !== null && this.m_source.term === "-";
    }
    
    /**
     * [Get] Это точка
     */
    get is_point() {
        return this.m_source !== null && this.m_source.term === ".";
    }
    
    /**
     * [Get] Род
     */
    get gender() {
        const MorphGender = require("./../../morph/MorphGender");
        const MorphWordForm = require("./../../morph/MorphWordForm");
        if (this.m_gender !== MorphGender.UNDEFINED) 
            return this.m_gender;
        let res = MorphGender.UNDEFINED;
        if (this.m_source !== null) {
            for (const wf of this.m_source.morph.items) {
                if ((wf).is_in_dictionary) 
                    res = MorphGender.of((res.value()) | (wf.gender.value()));
            }
        }
        return res;
    }
    /**
     * [Set] Род
     */
    set gender(value) {
        const MorphGender = require("./../../morph/MorphGender");
        this.m_gender = value;
        if (this.m_source !== null) {
            for (let i = this.m_source.morph.items_count - 1; i >= 0; i--) {
                if ((((this.m_source.morph.get_indexer_item(i).gender.value()) & (value.value()))) === (MorphGender.UNDEFINED.value())) 
                    this.m_source.morph.remove_item(i);
            }
        }
        return value;
    }
    
    get is_noun() {
        if (this.m_source !== null) {
            for (const wf of this.m_source.morph.items) {
                if (wf.class0.is_noun) 
                    return true;
            }
        }
        return false;
    }
    
    get is_adjective() {
        if (this.m_source !== null) {
            for (const wf of this.m_source.morph.items) {
                if (wf.class0.is_adjective) 
                    return true;
            }
        }
        return false;
    }
    
    get morph_word_forms() {
        const MorphWordForm = require("./../../morph/MorphWordForm");
        let res = new Array();
        if (this.m_source !== null) {
            for (const wf of this.m_source.morph.items) {
                if (wf instanceof MorphWordForm) 
                    res.push(Utils.as(wf, MorphWordForm));
            }
        }
        return res;
    }
    
    check_by_term(t) {
        if (this.is_number) 
            return this.m_number === t.m_number;
        if (this.m_variants !== null && t.m_variants !== null) {
            for (const v of this.m_variants) {
                if (t.m_variants.includes(v)) 
                    return true;
            }
        }
        return false;
    }
    
    /**
     * Сравнение с токеном
     * @param t 
     * @return 
     */
    check_by_token(t) {
        return this._check(t, 0);
    }
    
    _check(t, lev) {
        const MetaToken = require("./../MetaToken");
        const TextToken = require("./../TextToken");
        const NumberToken = require("./../NumberToken");
        if (lev > 10) 
            return false;
        if (this.is_pattern_any) 
            return true;
        if (t instanceof TextToken) {
            if (this.is_number) 
                return false;
            for (const v of this.variants) {
                if (t.is_value(v, null)) 
                    return true;
            }
            return false;
        }
        if (t instanceof NumberToken) {
            if (this.is_number) 
                return this.m_number === (t).value;
            let num = Utils.as(t, NumberToken);
            if (num.begin_token === num.end_token) 
                return this._check(num.begin_token, lev);
            return false;
        }
        if (t instanceof MetaToken) {
            let mt = Utils.as(t, MetaToken);
            if (mt.begin_token === mt.end_token) {
                if (this._check(mt.begin_token, lev + 1)) 
                    return true;
            }
        }
        return false;
    }
    
    check_by_pref_token(prefix, t) {
        if (prefix === null || prefix.m_source === null || t === null) 
            return false;
        let pref = prefix.canonical_text;
        let tterm = t.term;
        if (pref[0] !== tterm[0]) 
            return false;
        if (!tterm.startsWith(pref)) 
            return false;
        for (const v of this.variants) {
            if (t.is_value(pref + v, null)) 
                return true;
        }
        return false;
    }
    
    check_by_str_pref_token(pref, t) {
        if (pref === null || t === null) 
            return false;
        for (const v of this.variants) {
            if (v.startsWith(pref) && v.length > pref.length) {
                if (t.is_value(v.substring(pref.length), null)) 
                    return true;
            }
        }
        return false;
    }
    
    static _new1957(_arg1, _arg2) {
        let res = new Termin.Term(_arg1);
        res.is_pattern_any = _arg2;
        return res;
    }
}


Termin.Abridge = class  {
    
    constructor() {
        this.parts = new Array();
        this.tail = null;
    }
    
    add_part(val, has_delim = false) {
        this.parts.push(Termin.AbridgePart._new629(val, has_delim));
    }
    
    toString() {
        if (this.tail !== null) 
            return (String(this.parts[0]) + "-" + this.tail);
        let res = new StringBuilder();
        for (const p of this.parts) {
            res.append(p);
        }
        return res.toString();
    }
    
    try_attach(t0) {
        const Token = require("./../Token");
        const TextToken = require("./../TextToken");
        const MetaToken = require("./../MetaToken");
        const MorphCollection = require("./../MorphCollection");
        const TerminToken = require("./TerminToken");
        let t1 = Utils.as(t0, TextToken);
        if (t1 === null) 
            return null;
        if (t1.term !== this.parts[0].value) {
            if (this.parts.length !== 1 || !t1.is_value(this.parts[0].value, null)) 
                return null;
        }
        if (this.tail === null) {
            let te = t1;
            let point = false;
            if (te.next !== null) {
                if (te.next.is_char('.')) {
                    te = te.next;
                    point = true;
                }
                else if (this.parts.length > 1) {
                    while (te.next !== null) {
                        if (te.next.is_char_of("\\/.") || te.next.is_hiphen) {
                            te = te.next;
                            point = true;
                        }
                        else 
                            break;
                    }
                }
            }
            if (te === null) 
                return null;
            let tt = te.next;
            for (let i = 1; i < this.parts.length; i++) {
                if (tt !== null && tt.whitespaces_before_count > 2) 
                    return null;
                if (tt !== null && ((tt.is_hiphen || tt.is_char_of("\\/.")))) 
                    tt = tt.next;
                else if (!point && this.parts[i - 1].has_delim) 
                    return null;
                if (tt === null) 
                    return null;
                if (tt instanceof TextToken) {
                    let tet = Utils.as(tt, TextToken);
                    if (tet.term !== this.parts[i].value) {
                        if (!tet.is_value(this.parts[i].value, null)) 
                            return null;
                    }
                }
                else if (tt instanceof MetaToken) {
                    let mt = Utils.as(tt, MetaToken);
                    if (mt.begin_token !== mt.end_token) 
                        return null;
                    if (!mt.begin_token.is_value(this.parts[i].value, null)) 
                        return null;
                }
                te = tt;
                if (tt.next !== null && ((tt.next.is_char_of(".\\/") || tt.next.is_hiphen))) {
                    tt = tt.next;
                    point = true;
                    if (tt !== null) 
                        te = tt;
                }
                else 
                    point = false;
                tt = tt.next;
            }
            let res = TerminToken._new630(t0, te, t0 === te);
            if (point) 
                res.morph = new MorphCollection();
            return res;
        }
        t1 = Utils.as(t1.next, TextToken);
        if (t1 === null || !t1.is_char_of("-\\/")) 
            return null;
        t1 = Utils.as(t1.next, TextToken);
        if (t1 === null) 
            return null;
        if (t1.term[0] !== this.tail[0]) 
            return null;
        return new TerminToken(t0, t1);
    }
}


Termin.AbridgePart = class  {
    
    constructor() {
        this.value = null;
        this.has_delim = false;
    }
    
    toString() {
        if (this.has_delim) 
            return this.value + ".";
        else 
            return this.value;
    }
    
    static _new629(_arg1, _arg2) {
        let res = new Termin.AbridgePart();
        res.value = _arg1;
        res.has_delim = _arg2;
        return res;
    }
    
    static _new631(_arg1) {
        let res = new Termin.AbridgePart();
        res.value = _arg1;
        return res;
    }
}


Termin.static_constructor();

module.exports = Termin