/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const Token = require("./../Token");
const ReferentToken = require("./../ReferentToken");
const MorphWordForm = require("./../../morph/MorphWordForm");
const TextToken = require("./../TextToken");
const NumberToken = require("./../NumberToken");
const LanguageHelper = require("./../../morph/LanguageHelper");
const MorphLang = require("./../../morph/MorphLang");
const TerminParseAttr = require("./TerminParseAttr");
const Termin = require("./Termin");

/**
 * Коллекций некоторых обозначений, терминов
 */
class TerminCollection {
    
    constructor() {
        this.termins = new Array();
        this.all_add_strs_normalized = false;
        this.synonyms = null;
        this.m_root = new TerminCollection.CharNode();
        this.m_root_ua = new TerminCollection.CharNode();
        this.m_hash1 = new Hashtable();
        this.m_hash_canonic = null;
    }
    
    /**
     * Добавить термин. После добавления в термин нельзя вносить изменений, 
     *  кроме как в значения Tag и Tag2 (иначе потом нужно вызвать Reindex)
     * @param term 
     */
    add(term) {
        this.termins.push(term);
        this.m_hash_canonic = null;
        this.reindex(term);
    }
    
    /**
     * Добавить строку вместе с морфологическими вариантами
     * @param _termins 
     * @param tag 
     * @param lang 
     * @return 
     */
    add_str(_termins, tag = null, lang = null, is_normal_text = false) {
        let t = new Termin(_termins, lang, is_normal_text || this.all_add_strs_normalized);
        t.tag = tag;
        if (tag !== null && t.terms.length === 1) {
        }
        this.add(t);
        return t;
    }
    
    _get_root(lang, is_lat) {
        if (lang !== null && lang.is_ua && !lang.is_ru) 
            return this.m_root_ua;
        return this.m_root;
    }
    
    /**
     * Переиндексировать термин (если после добавления у него что-либо поменялось)
     * @param t 
     */
    reindex(t) {
        if (t === null) 
            return;
        if (t.terms.length > 20) {
        }
        if (t.acronym_smart !== null) 
            this.add_to_hash1(t.acronym_smart.charCodeAt(0), t);
        if (t.abridges !== null) {
            for (const a of t.abridges) {
                if (a.parts[0].value.length === 1) 
                    this.add_to_hash1(a.parts[0].value.charCodeAt(0), t);
            }
        }
        for (const v of t.get_hash_variants()) {
            this._add_to_tree(v, t);
        }
        if (t.additional_vars !== null) {
            for (const av of t.additional_vars) {
                av.ignore_terms_order = t.ignore_terms_order;
                for (const v of av.get_hash_variants()) {
                    this._add_to_tree(v, t);
                }
            }
        }
    }
    
    remove(t) {
        for (const v of t.get_hash_variants()) {
            this._remove_from_tree(v, t);
        }
        for (const li of this.m_hash1.values) {
            for (const tt of li) {
                if (tt === t) {
                    Utils.removeItem(li, tt);
                    break;
                }
            }
        }
        let i = this.termins.indexOf(t);
        if (i >= 0) 
            this.termins.splice(i, 1);
    }
    
    _add_to_tree(key, t) {
        if (key === null) 
            return;
        let nod = this._get_root(t.lang, t.lang.is_undefined && LanguageHelper.is_latin(key));
        for (let i = 0; i < key.length; i++) {
            let ch = key.charCodeAt(i);
            if (nod.children === null) 
                nod.children = new Hashtable();
            let nn = null;
            let wrapnn645 = new RefOutArgWrapper();
            let inoutres646 = nod.children.tryGetValue(ch, wrapnn645);
            nn = wrapnn645.value;
            if (!inoutres646) 
                nod.children.put(ch, (nn = new TerminCollection.CharNode()));
            nod = nn;
        }
        if (nod.termins === null) 
            nod.termins = new Array();
        if (!nod.termins.includes(t)) 
            nod.termins.push(t);
    }
    
    _remove_from_tree(key, t) {
        if (key === null) 
            return;
        let nod = this._get_root(t.lang, t.lang.is_undefined && LanguageHelper.is_latin(key));
        for (let i = 0; i < key.length; i++) {
            let ch = key.charCodeAt(i);
            if (nod.children === null) 
                return;
            let nn = null;
            let wrapnn647 = new RefOutArgWrapper();
            let inoutres648 = nod.children.tryGetValue(ch, wrapnn647);
            nn = wrapnn647.value;
            if (!inoutres648) 
                return;
            nod = nn;
        }
        if (nod.termins === null) 
            return;
        if (nod.termins.includes(t)) 
            Utils.removeItem(nod.termins, t);
    }
    
    _find_in_tree(key, lang) {
        if (key === null) 
            return null;
        let nod = this._get_root(lang, ((lang === null || lang.is_undefined)) && LanguageHelper.is_latin(key));
        for (let i = 0; i < key.length; i++) {
            let ch = key.charCodeAt(i);
            let nn = null;
            if (nod.children !== null) {
                let wrapnn649 = new RefOutArgWrapper();
                nod.children.tryGetValue(ch, wrapnn649);
                nn = wrapnn649.value;
            }
            if (nn === null) {
                if (ch === (32)) {
                    if (nod.termins !== null) {
                        let pp = Utils.splitString(key, ' ', false);
                        let res = null;
                        for (const t of nod.termins) {
                            if (t.terms.length === pp.length) {
                                let k = 0;
                                for (k = 1; k < pp.length; k++) {
                                    if (!t.terms[k].variants.includes(pp[k])) 
                                        break;
                                }
                                if (k >= pp.length) {
                                    if (res === null) 
                                        res = new Array();
                                    res.push(t);
                                }
                            }
                        }
                        return res;
                    }
                }
                return null;
            }
            nod = nn;
        }
        return nod.termins;
    }
    
    add_to_hash1(key, t) {
        let li = null;
        let wrapli650 = new RefOutArgWrapper();
        let inoutres651 = this.m_hash1.tryGetValue(key, wrapli650);
        li = wrapli650.value;
        if (!inoutres651) 
            this.m_hash1.put(key, (li = new Array()));
        if (!li.includes(t)) 
            li.push(t);
    }
    
    find(key) {
        if (Utils.isNullOrEmpty(key)) 
            return null;
        let li = [ ];
        if (LanguageHelper.is_latin_char(key[0])) 
            li = this._find_in_tree(key, MorphLang.EN);
        else {
            li = this._find_in_tree(key, MorphLang.RU);
            if (li === null) 
                li = this._find_in_tree(key, MorphLang.UA);
        }
        return (li !== null && li.length > 0 ? li[0] : null);
    }
    
    /**
     * Попытка привязать к аналитическому контейнеру с указанной позиции
     * @param token начальная позиция
     * @param pars параметры выделения
     * @return 
     */
    try_parse(token, pars = TerminParseAttr.NO) {
        if (this.termins.length === 0) 
            return null;
        let li = this.try_parse_all(token, pars, 0);
        if (li !== null) 
            return li[0];
        else 
            return null;
    }
    
    /**
     * Попытка привязать все возможные варианты
     * @param token 
     * @param pars параметры выделения
     * @param simd параметр "похожесть (0.05..1)"
     * @return 
     */
    try_parse_all(token, pars = TerminParseAttr.NO, simd = 0) {
        if (token === null) 
            return null;
        if ((simd < 1) && simd > 0.05) 
            return this._try_attach_all_sim(token, simd);
        let re = this._try_attach_all_(token, pars, false);
        if (re === null && token.morph.language.is_ua) 
            re = this._try_attach_all_(token, pars, true);
        if (re === null && this.synonyms !== null) {
            let re0 = this.synonyms.try_parse(token, TerminParseAttr.NO);
            if (re0 !== null && (re0.termin.tag instanceof Array)) {
                let term = this.find(re0.termin.canonic_text);
                for (const syn of Utils.as(re0.termin.tag, Array)) {
                    if (term !== null) 
                        break;
                    term = this.find(syn);
                }
                if (term !== null) {
                    re0.termin = term;
                    let res1 = new Array();
                    res1.push(re0);
                    return res1;
                }
            }
        }
        return re;
    }
    
    _try_attach_all_sim(token, simd = 0) {
        if ((simd >= 1 || (simd < 0.05) || this.termins.length === 0) || token === null) 
            return null;
        let tt = Utils.as(token, TextToken);
        if (tt === null && (token instanceof ReferentToken)) 
            tt = Utils.as((token).begin_token, TextToken);
        let res = null;
        for (const t of this.termins) {
            if (!t.lang.is_undefined) {
                if (!token.morph.language.is_undefined) {
                    if ((MorphLang.ooBitand(token.morph.language, t.lang)).is_undefined) 
                        continue;
                }
            }
            let ar = t.try_parse(tt, TerminParseAttr.NO, simd);
            if (ar === null) 
                continue;
            ar.termin = t;
            if (res === null || ar.tokens_count > res[0].tokens_count) {
                res = new Array();
                res.push(ar);
            }
            else if (ar.tokens_count === res[0].tokens_count) 
                res.push(ar);
        }
        return res;
    }
    
    _try_attach_all_(token, pars = TerminParseAttr.NO, main_root = false) {
        if (this.termins.length === 0 || token === null) 
            return null;
        let s = null;
        let tt = Utils.as(token, TextToken);
        if (tt === null && (token instanceof ReferentToken)) 
            tt = Utils.as((token).begin_token, TextToken);
        let res = null;
        let was_vars = false;
        let root = (main_root ? this.m_root : this._get_root(token.morph.language, token.chars.is_latin_letter));
        if (tt !== null) {
            s = tt.term;
            let nod = root;
            let no_vars = false;
            let len0 = 0;
            if ((((pars.value()) & (TerminParseAttr.TERMONLY.value()))) !== (TerminParseAttr.NO.value())) {
            }
            else if (tt.invariant_prefix_length <= s.length) {
                len0 = tt.invariant_prefix_length;
                for (let i = 0; i < tt.invariant_prefix_length; i++) {
                    let ch = s.charCodeAt(i);
                    if (nod.children === null) {
                        no_vars = true;
                        break;
                    }
                    let nn = null;
                    let wrapnn652 = new RefOutArgWrapper();
                    let inoutres653 = nod.children.tryGetValue(ch, wrapnn652);
                    nn = wrapnn652.value;
                    if (!inoutres653) {
                        no_vars = true;
                        break;
                    }
                    nod = nn;
                }
            }
            if (!no_vars) {
                let wrapres658 = new RefOutArgWrapper(res);
                let inoutres659 = this._manage_var(token, pars, s, nod, len0, wrapres658);
                res = wrapres658.value;
                if (inoutres659) 
                    was_vars = true;
                for (let i = 0; i < tt.morph.items_count; i++) {
                    if ((((pars.value()) & (TerminParseAttr.TERMONLY.value()))) !== (TerminParseAttr.NO.value())) 
                        continue;
                    let wf = Utils.as(tt.morph.get_indexer_item(i), MorphWordForm);
                    if (wf === null) 
                        continue;
                    if ((((pars.value()) & (TerminParseAttr.INDICTIONARYONLY.value()))) !== (TerminParseAttr.NO.value())) {
                        if (!wf.is_in_dictionary) 
                            continue;
                    }
                    let j = 0;
                    let ok = true;
                    if (wf.normal_case === null || wf.normal_case === s) 
                        ok = false;
                    else {
                        for (j = 0; j < i; j++) {
                            let wf2 = Utils.as(tt.morph.get_indexer_item(j), MorphWordForm);
                            if (wf2 !== null) {
                                if (wf2.normal_case === wf.normal_case || wf2.normal_full === wf.normal_case) 
                                    break;
                            }
                        }
                        if (j < i) 
                            ok = false;
                    }
                    if (ok) {
                        let wrapres654 = new RefOutArgWrapper(res);
                        let inoutres655 = this._manage_var(token, pars, wf.normal_case, nod, tt.invariant_prefix_length, wrapres654);
                        res = wrapres654.value;
                        if (inoutres655) 
                            was_vars = true;
                    }
                    if (wf.normal_full === null || wf.normal_full === wf.normal_case || wf.normal_full === s) 
                        continue;
                    for (j = 0; j < i; j++) {
                        let wf2 = Utils.as(tt.morph.get_indexer_item(j), MorphWordForm);
                        if (wf2 !== null && wf2.normal_full === wf.normal_full) 
                            break;
                    }
                    if (j < i) 
                        continue;
                    let wrapres656 = new RefOutArgWrapper(res);
                    let inoutres657 = this._manage_var(token, pars, wf.normal_full, nod, tt.invariant_prefix_length, wrapres656);
                    res = wrapres656.value;
                    if (inoutres657) 
                        was_vars = true;
                }
            }
        }
        else if (token instanceof NumberToken) {
            let wrapres660 = new RefOutArgWrapper(res);
            let inoutres661 = this._manage_var(token, pars, (token).value.toString(), root, 0, wrapres660);
            res = wrapres660.value;
            if (inoutres661) 
                was_vars = true;
        }
        else 
            return null;
        if (!was_vars && s !== null && s.length === 1) {
            let vars = [ ];
            let wrapvars662 = new RefOutArgWrapper();
            let inoutres663 = this.m_hash1.tryGetValue(s.charCodeAt(0), wrapvars662);
            vars = wrapvars662.value;
            if (inoutres663) {
                for (const t of vars) {
                    if (!t.lang.is_undefined) {
                        if (!token.morph.language.is_undefined) {
                            if ((MorphLang.ooBitand(token.morph.language, t.lang)).is_undefined) 
                                continue;
                        }
                    }
                    let ar = t.try_parse(tt, TerminParseAttr.NO, 0);
                    if (ar === null) 
                        continue;
                    ar.termin = t;
                    if (res === null) {
                        res = new Array();
                        res.push(ar);
                    }
                    else if (ar.tokens_count > res[0].tokens_count) {
                        res.splice(0, res.length);
                        res.push(ar);
                    }
                    else if (ar.tokens_count === res[0].tokens_count) 
                        res.push(ar);
                }
            }
        }
        if (res !== null) {
            let ii = 0;
            let max = 0;
            for (let i = 0; i < res.length; i++) {
                if (res[i].length_char > max) {
                    max = res[i].length_char;
                    ii = i;
                }
            }
            if (ii > 0) {
                let v = res[ii];
                res.splice(ii, 1);
                res.splice(0, 0, v);
            }
        }
        return res;
    }
    
    _manage_var(token, pars, v, nod, i0, res) {
        for (let i = i0; i < v.length; i++) {
            let ch = v.charCodeAt(i);
            if (nod.children === null) 
                return false;
            let nn = null;
            let wrapnn664 = new RefOutArgWrapper();
            let inoutres665 = nod.children.tryGetValue(ch, wrapnn664);
            nn = wrapnn664.value;
            if (!inoutres665) 
                return false;
            nod = nn;
        }
        let vars = nod.termins;
        if (vars === null || vars.length === 0) 
            return false;
        for (const t of vars) {
            let ar = t.try_parse(token, pars, 0);
            if (ar !== null) {
                ar.termin = t;
                if (res.value === null) {
                    res.value = new Array();
                    res.value.push(ar);
                }
                else if (ar.tokens_count > res.value[0].tokens_count) {
                    res.value.splice(0, res.value.length);
                    res.value.push(ar);
                }
                else if (ar.tokens_count === res.value[0].tokens_count) {
                    let j = 0;
                    for (j = 0; j < res.value.length; j++) {
                        if (res.value[j].termin === ar.termin) 
                            break;
                    }
                    if (j >= res.value.length) 
                        res.value.push(ar);
                }
            }
            if (t.additional_vars !== null) {
                for (const av of t.additional_vars) {
                    ar = av.try_parse(token, pars, 0);
                    if (ar === null) 
                        continue;
                    ar.termin = t;
                    if (res.value === null) {
                        res.value = new Array();
                        res.value.push(ar);
                    }
                    else if (ar.tokens_count > res.value[0].tokens_count) {
                        res.value.splice(0, res.value.length);
                        res.value.push(ar);
                    }
                    else if (ar.tokens_count === res.value[0].tokens_count) {
                        let j = 0;
                        for (j = 0; j < res.value.length; j++) {
                            if (res.value[j].termin === ar.termin) 
                                break;
                        }
                        if (j >= res.value.length) 
                            res.value.push(ar);
                    }
                }
            }
        }
        return v.length > 1;
    }
    
    /**
     * Поискать эквивалентные термины
     * @param termin 
     * @return 
     */
    try_attach(termin) {
        let res = null;
        for (const v of termin.get_hash_variants()) {
            let vars = this._find_in_tree(v, termin.lang);
            if (vars === null) 
                continue;
            for (const t of vars) {
                if (t.is_equal(termin)) {
                    if (res === null) 
                        res = new Array();
                    if (!res.includes(t)) 
                        res.push(t);
                }
            }
        }
        return res;
    }
    
    try_attach_str(termin, lang = null) {
        return this._find_in_tree(termin, lang);
    }
    
    find_termin_by_canonic_text(text) {
        if (this.m_hash_canonic === null) {
            this.m_hash_canonic = new Hashtable();
            for (const t of this.termins) {
                let ct = t.canonic_text;
                let li = [ ];
                let wrapli666 = new RefOutArgWrapper();
                let inoutres667 = this.m_hash_canonic.tryGetValue(ct, wrapli666);
                li = wrapli666.value;
                if (!inoutres667) 
                    this.m_hash_canonic.put(ct, (li = new Array()));
                if (!li.includes(t)) 
                    li.push(t);
            }
        }
        let res = [ ];
        let wrapres668 = new RefOutArgWrapper();
        let inoutres669 = this.m_hash_canonic.tryGetValue(text, wrapres668);
        res = wrapres668.value;
        if (!inoutres669) 
            return null;
        else 
            return res;
    }
}


TerminCollection.CharNode = class  {
    
    constructor() {
        this.children = null;
        this.termins = null;
    }
}


module.exports = TerminCollection