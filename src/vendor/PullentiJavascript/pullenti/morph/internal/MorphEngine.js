/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");
const Stream = require("./../../unisharp/Stream");

const MorphClass = require("./../MorphClass");
const MorphNumber = require("./../MorphNumber");
const MorphGender = require("./../MorphGender");
const MorphCase = require("./../MorphCase");
const MorphTreeNode = require("./MorphTreeNode");
const MorphLang = require("./../MorphLang");
const LanguageHelper = require("./../LanguageHelper");
const MorphSerializeHelper = require("./MorphSerializeHelper");
const EpMorphInternalPropertiesResources = require("./properties/EpMorphInternalPropertiesResources");
const MorphWordForm = require("./../MorphWordForm");

class MorphEngine {
    
    constructor() {
        this.m_lock = new Object();
        this.m_lazy_buf = null;
        this.language = new MorphLang();
        this.m_root = new MorphTreeNode();
        this.m_root_reverce = new MorphTreeNode();
        this.m_vars_hash = new Hashtable();
        this.m_vars = new Array();
        this.m_rules = new Array();
    }
    
    initialize(lang) {
        const Morphology = require("./../Morphology");
        if (!this.language.is_undefined) 
            return false;
        /* this is synchronized block by this.m_lock, but this feature isn't supported in JS */ {
            if (!this.language.is_undefined) 
                return false;
            this.language = lang;
            // ignored: let assembly = ;
            let rsname = ("m_" + lang.toString() + ".dat");
            let names = EpMorphInternalPropertiesResources.getNames();
            for (const n of names) {
                if (Utils.endsWithString(n, rsname, true)) {
                    let inf = EpMorphInternalPropertiesResources.getResourceInfo(n);
                    if (inf === null) 
                        continue;
                    let stream = EpMorphInternalPropertiesResources.getStream(n); 
                    try {
                        stream.position = 0;
                        this.m_lazy_buf = MorphSerializeHelper.deserialize_all(stream, this, false, Morphology.LAZY_LOAD);
                    }
                    finally {
                        stream.close();
                    }
                    return true;
                }
            }
            return false;
        }
    }
    
    _load_tree_node(tn) {
        /* this is synchronized block by this.m_lock, but this feature isn't supported in JS */ {
            let pos = tn.lazy_pos;
            if (pos > 0) {
                let wrappos9 = new RefOutArgWrapper(pos);
                MorphSerializeHelper.deserialize_morph_tree_node_lazy(this.m_lazy_buf, tn, this, wrappos9);
                pos = wrappos9.value;
            }
            tn.lazy_pos = 0;
        }
    }
    
    /**
     * Обработка одного слова
     * @param word слово должно быть в верхнем регистре
     * @return 
     */
    process(word) {
        if (Utils.isNullOrEmpty(word)) 
            return null;
        let res = null;
        let i = 0;
        if (word.length > 1) {
            for (i = 0; i < word.length; i++) {
                let ch = word[i];
                if (LanguageHelper.is_cyrillic_vowel(ch) || LanguageHelper.is_latin_vowel(ch)) 
                    break;
            }
            if (i >= word.length) 
                return res;
        }
        let mvs = [ ];
        let tn = this.m_root;
        for (i = 0; i <= word.length; i++) {
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            if (tn.rules !== null) {
                let word_begin = null;
                let word_end = null;
                if (i === 0) 
                    word_end = word;
                else if (i < word.length) 
                    word_end = word.substring(i);
                else 
                    word_end = "";
                if (res === null) 
                    res = new Array();
                for (const r of tn.rules) {
                    let wrapmvs10 = new RefOutArgWrapper();
                    let inoutres11 = r.variants.tryGetValue(word_end, wrapmvs10);
                    mvs = wrapmvs10.value;
                    if (inoutres11) {
                        if (word_begin === null) {
                            if (i === word.length) 
                                word_begin = word;
                            else if (i > 0) 
                                word_begin = word.substring(0, 0 + i);
                            else 
                                word_begin = "";
                        }
                        r.process_result(res, word_begin, mvs);
                    }
                }
            }
            if (tn.nodes === null || i >= word.length) 
                break;
            let ch = word.charCodeAt(i);
            let wraptn12 = new RefOutArgWrapper();
            let inoutres13 = tn.nodes.tryGetValue(ch, wraptn12);
            tn = wraptn12.value;
            if (!inoutres13) 
                break;
        }
        let need_test_unknown_vars = true;
        if (res !== null) {
            for (const r of res) {
                if ((r.class0.is_pronoun || r.class0.is_noun || r.class0.is_adjective) || (r.class0.is_misc && r.class0.is_conjunction) || r.class0.is_preposition) 
                    need_test_unknown_vars = false;
                else if (r.class0.is_adverb && r.normal_case !== null) {
                    if (!LanguageHelper.ends_with_ex(r.normal_case, "О", "А", null, null)) 
                        need_test_unknown_vars = false;
                    else if (r.normal_case === "МНОГО") 
                        need_test_unknown_vars = false;
                }
                else if (r.class0.is_verb && res.length > 1) {
                    let ok = false;
                    for (const rr of res) {
                        if (rr !== r && MorphClass.ooNoteq(rr.class0, r.class0)) {
                            ok = true;
                            break;
                        }
                    }
                    if (ok && !LanguageHelper.ends_with(word, "ИМ")) 
                        need_test_unknown_vars = false;
                }
            }
        }
        if (need_test_unknown_vars && LanguageHelper.is_cyrillic_char(word[0])) {
            let gl = 0;
            let sog = 0;
            for (let j = 0; j < word.length; j++) {
                if (LanguageHelper.is_cyrillic_vowel(word[j])) 
                    gl++;
                else 
                    sog++;
            }
            if ((gl < 2) || (sog < 2)) 
                need_test_unknown_vars = false;
        }
        if (need_test_unknown_vars && res !== null && res.length === 1) {
            if (res[0].class0.is_verb) {
                if (res[0].misc.attrs.includes("н.вр.") && res[0].misc.attrs.includes("нес.в.") && !res[0].misc.attrs.includes("страд.з.")) 
                    need_test_unknown_vars = false;
                else if (res[0].misc.attrs.includes("б.вр.") && res[0].misc.attrs.includes("сов.в.")) 
                    need_test_unknown_vars = false;
                else if (res[0].misc.attrs.includes("инф.") && res[0].misc.attrs.includes("сов.в.")) 
                    need_test_unknown_vars = false;
                else if (res[0].normal_case !== null && LanguageHelper.ends_with(res[0].normal_case, "СЯ")) 
                    need_test_unknown_vars = false;
            }
            if (res[0].class0.is_undefined && res[0].misc.attrs.includes("прдктв.")) 
                need_test_unknown_vars = false;
        }
        if (need_test_unknown_vars) {
            if (this.m_root_reverce === null) 
                return res;
            tn = this.m_root_reverce;
            let tn0 = null;
            for (i = word.length - 1; i >= 0; i--) {
                if (tn.lazy_pos > 0) 
                    this._load_tree_node(tn);
                let ch = word.charCodeAt(i);
                if (tn.nodes === null) 
                    break;
                let next = null;
                let wrapnext14 = new RefOutArgWrapper();
                let inoutres15 = tn.nodes.tryGetValue(ch, wrapnext14);
                next = wrapnext14.value;
                if (!inoutres15) 
                    break;
                tn = next;
                if (tn.lazy_pos > 0) 
                    this._load_tree_node(tn);
                if (tn.reverce_variants !== null) {
                    tn0 = tn;
                    break;
                }
            }
            if (tn0 !== null) {
                let glas = i < 4;
                for (; i >= 0; i--) {
                    if (LanguageHelper.is_cyrillic_vowel(word[i]) || LanguageHelper.is_latin_vowel(word[i])) {
                        glas = true;
                        break;
                    }
                }
                if (glas) {
                    for (const mv of tn0.reverce_variants) {
                        if (((!mv.class0.is_verb && !mv.class0.is_adjective && !mv.class0.is_noun) && !mv.class0.is_proper_surname && !mv.class0.is_proper_geo) && !mv.class0.is_proper_secname) 
                            continue;
                        let ok = false;
                        for (const rr of res) {
                            if (rr.is_in_dictionary) {
                                if (MorphClass.ooEq(rr.class0, mv.class0) || rr.class0.is_noun) {
                                    ok = true;
                                    break;
                                }
                                if (!mv.class0.is_adjective && rr.class0.is_verb) {
                                    ok = true;
                                    break;
                                }
                            }
                        }
                        if (ok) 
                            continue;
                        if (mv.tail.length > 0 && !LanguageHelper.ends_with(word, mv.tail)) 
                            continue;
                        let r = new MorphWordForm(mv, word);
                        if (!MorphWordForm.has_morph_equals(res, r)) {
                            r.undef_coef = mv.coef;
                            if (res === null) 
                                res = new Array();
                            res.push(r);
                        }
                    }
                }
            }
        }
        if (word === "ПРИ" && res !== null) {
            for (i = res.length - 1; i >= 0; i--) {
                if (res[i].class0.is_proper_geo) 
                    res.splice(i, 1);
            }
        }
        if (res === null || res.length === 0) 
            return null;
        MorphEngine.sort(res, word);
        for (const v of res) {
            if (v.normal_case === null) 
                v.normal_case = word;
            if (v.class0.is_verb) {
                if (v.normal_full === null && LanguageHelper.ends_with(v.normal_case, "ТЬСЯ")) 
                    v.normal_full = v.normal_case.substring(0, 0 + v.normal_case.length - 2);
            }
            v.language = this.language;
            if (v.class0.is_preposition) 
                v.normal_case = LanguageHelper.normalize_preposition(v.normal_case);
        }
        let mc = new MorphClass();
        for (i = res.length - 1; i >= 0; i--) {
            if (!res[i].is_in_dictionary && res[i].class0.is_adjective && res.length > 1) {
                if (res[i].misc.attrs.includes("к.ф.") || res[i].misc.attrs.includes("неизм.")) {
                    res.splice(i, 1);
                    continue;
                }
            }
            if (res[i].is_in_dictionary) 
                mc.value |= res[i].class0.value;
        }
        if (MorphClass.ooEq(mc, MorphClass.VERB) && res.length > 1) {
            for (const r of res) {
                if (r.undef_coef > (100) && MorphClass.ooEq(r.class0, MorphClass.ADJECTIVE)) 
                    r.undef_coef = 0;
            }
        }
        if (res.length === 0) 
            return null;
        return res;
    }
    
    get_all_wordforms(word) {
        let res = new Array();
        let i = 0;
        let tn = this.m_root;
        for (i = 0; i <= word.length; i++) {
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            if (tn.rules !== null) {
                let word_begin = "";
                let word_end = "";
                if (i > 0) 
                    word_begin = word.substring(0, 0 + i);
                else 
                    word_end = word;
                if (i < word.length) 
                    word_end = word.substring(i);
                else 
                    word_begin = word;
                for (const r of tn.rules) {
                    if (r.variants.containsKey(word_end)) {
                        for (const vl of r.variants_list) {
                            for (const v of vl) {
                                let wf = new MorphWordForm(v, null);
                                if (!MorphWordForm.has_morph_equals(res, wf)) {
                                    wf.normal_case = word_begin + v.tail;
                                    wf.undef_coef = 0;
                                    res.push(wf);
                                }
                            }
                        }
                    }
                }
            }
            if (tn.nodes === null || i >= word.length) 
                break;
            let ch = word.charCodeAt(i);
            let wraptn16 = new RefOutArgWrapper();
            let inoutres17 = tn.nodes.tryGetValue(ch, wraptn16);
            tn = wraptn16.value;
            if (!inoutres17) 
                break;
        }
        for (i = 0; i < res.length; i++) {
            let wf = res[i];
            if (wf.contains_attr("инф.", null)) 
                continue;
            for (let j = i + 1; j < res.length; j++) {
                let wf1 = res[j];
                if (wf1.contains_attr("инф.", null)) 
                    continue;
                if ((MorphClass.ooEq(wf.class0, wf1.class0) && wf.gender === wf1.gender && wf.number === wf1.number) && wf.normal_case === wf1.normal_case) {
                    wf._case = MorphCase.ooBitor(wf._case, wf1._case);
                    res.splice(j, 1);
                    j--;
                }
            }
        }
        for (i = 0; i < res.length; i++) {
            let wf = res[i];
            if (wf.contains_attr("инф.", null)) 
                continue;
            for (let j = i + 1; j < res.length; j++) {
                let wf1 = res[j];
                if (wf1.contains_attr("инф.", null)) 
                    continue;
                if ((MorphClass.ooEq(wf.class0, wf1.class0) && MorphCase.ooEq(wf._case, wf1._case) && wf.number === wf1.number) && wf.normal_case === wf1.normal_case) {
                    wf.gender = MorphGender.of((wf.gender.value()) | (wf1.gender.value()));
                    res.splice(j, 1);
                    j--;
                }
            }
        }
        return res;
    }
    
    get_wordform(word, cla, gender, cas, num, add_info) {
        let i = 0;
        let tn = this.m_root;
        let find = false;
        let res = null;
        let max_coef = -10;
        for (i = 0; i <= word.length; i++) {
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            if (tn.rules !== null) {
                let word_begin = "";
                let word_end = "";
                if (i > 0) 
                    word_begin = word.substring(0, 0 + i);
                else 
                    word_end = word;
                if (i < word.length) 
                    word_end = word.substring(i);
                else 
                    word_begin = word;
                for (const r of tn.rules) {
                    if (r.variants.containsKey(word_end)) {
                        for (const li of r.variants_list) {
                            for (const v of li) {
                                if ((((cla.value) & (v.class0.value))) !== 0 && v.normal_tail !== null) {
                                    if (cas.is_undefined) {
                                        if (v._case.is_nominative || v._case.is_undefined) {
                                        }
                                        else 
                                            continue;
                                    }
                                    else if ((MorphCase.ooBitand(v._case, cas)).is_undefined) 
                                        continue;
                                    let sur = cla.is_proper_surname;
                                    let sur0 = v.class0.is_proper_surname;
                                    if (sur || sur0) {
                                        if (sur !== sur0) 
                                            continue;
                                    }
                                    find = true;
                                    if (gender !== MorphGender.UNDEFINED) {
                                        if ((((gender.value()) & (v.gender.value()))) === (MorphGender.UNDEFINED.value())) {
                                            if (num !== null && num === MorphNumber.PLURAL) {
                                            }
                                            else 
                                                continue;
                                        }
                                    }
                                    if (num !== MorphNumber.UNDEFINED) {
                                        if ((((num.value()) & (v.number.value()))) === (MorphNumber.UNDEFINED.value())) 
                                            continue;
                                    }
                                    let re = word_begin + v.tail;
                                    let co = 0;
                                    if (add_info !== null) 
                                        co = v.calc_eq_coef(add_info);
                                    if (res === null || co > max_coef) {
                                        res = re;
                                        max_coef = co;
                                    }
                                    if (max_coef === 0) {
                                        if ((word_begin + v.normal_tail) === word) 
                                            return re;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (tn.nodes === null || i >= word.length) 
                break;
            let ch = word.charCodeAt(i);
            let wraptn18 = new RefOutArgWrapper();
            let inoutres19 = tn.nodes.tryGetValue(ch, wraptn18);
            tn = wraptn18.value;
            if (!inoutres19) 
                break;
        }
        if (find) 
            return res;
        tn = this.m_root_reverce;
        let tn0 = null;
        for (i = word.length - 1; i >= 0; i--) {
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            let ch = word.charCodeAt(i);
            if (tn.nodes === null) 
                break;
            let next = null;
            let wrapnext20 = new RefOutArgWrapper();
            let inoutres21 = tn.nodes.tryGetValue(ch, wrapnext20);
            next = wrapnext20.value;
            if (!inoutres21) 
                break;
            tn = next;
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            if (tn.reverce_variants !== null) {
                tn0 = tn;
                break;
            }
        }
        if (tn0 === null) 
            return null;
        for (const mv of tn0.reverce_variants) {
            if ((((mv.class0.value) & (cla.value))) !== 0 && mv.rule !== null) {
                if (mv.tail.length > 0 && !LanguageHelper.ends_with(word, mv.tail)) 
                    continue;
                let word_begin = word.substring(0, 0 + word.length - mv.tail.length);
                for (const liv of mv.rule.variants_list) {
                    for (const v of liv) {
                        if ((((v.class0.value) & (cla.value))) !== 0) {
                            let sur = cla.is_proper_surname;
                            let sur0 = v.class0.is_proper_surname;
                            if (sur || sur0) {
                                if (sur !== sur0) 
                                    continue;
                            }
                            if (!cas.is_undefined) {
                                if ((MorphCase.ooBitand(cas, v._case)).is_undefined && !v._case.is_undefined) 
                                    continue;
                            }
                            if (num !== MorphNumber.UNDEFINED) {
                                if (v.number !== MorphNumber.UNDEFINED) {
                                    if ((((v.number.value()) & (num.value()))) === (MorphNumber.UNDEFINED.value())) 
                                        continue;
                                }
                            }
                            if (gender !== MorphGender.UNDEFINED) {
                                if (v.gender !== MorphGender.UNDEFINED) {
                                    if ((((v.gender.value()) & (gender.value()))) === (MorphGender.UNDEFINED.value())) 
                                        continue;
                                }
                            }
                            if (add_info !== null) {
                                if (v.calc_eq_coef(add_info) < 0) 
                                    continue;
                            }
                            res = word_begin + v.tail;
                            if (res === word) 
                                return word;
                            return res;
                        }
                    }
                }
            }
        }
        if (cla.is_proper_surname) {
            if ((gender === MorphGender.FEMINIE && cla.is_proper_surname && !cas.is_undefined) && !cas.is_nominative) {
                if (word.endsWith("ВА") || word.endsWith("НА")) {
                    if (cas.is_accusative) 
                        return word.substring(0, 0 + word.length - 1) + "У";
                    return word.substring(0, 0 + word.length - 1) + "ОЙ";
                }
            }
            if (gender === MorphGender.FEMINIE) {
                let last = word[word.length - 1];
                if (last === 'А' || last === 'Я' || last === 'О') 
                    return word;
                if (LanguageHelper.is_cyrillic_vowel(last)) 
                    return word.substring(0, 0 + word.length - 1) + "А";
                else if (last === 'Й') 
                    return word.substring(0, 0 + word.length - 2) + "АЯ";
                else 
                    return word + "А";
            }
        }
        return res;
    }
    
    correct_word_by_morph(word) {
        let vars = new Array();
        let tmp = new StringBuilder(word.length);
        for (let ch = 1; ch < word.length; ch++) {
            tmp.length = 0;
            tmp.append(word);
            tmp.setCharAt(ch, '*');
            let var0 = this._check_corr_var(tmp.toString(), this.m_root, 0);
            if (var0 !== null) {
                if (!vars.includes(var0)) 
                    vars.push(var0);
            }
        }
        if (vars.length === 0) {
            for (let ch = 1; ch < word.length; ch++) {
                tmp.length = 0;
                tmp.append(word);
                tmp.insert(ch, '*');
                let var0 = this._check_corr_var(tmp.toString(), this.m_root, 0);
                if (var0 !== null) {
                    if (!vars.includes(var0)) 
                        vars.push(var0);
                }
            }
        }
        if (vars.length === 0) {
            for (let ch = 1; ch < (word.length - 1); ch++) {
                tmp.length = 0;
                tmp.append(word);
                tmp.remove(ch, 1);
                let var0 = this._check_corr_var(tmp.toString(), this.m_root, 0);
                if (var0 !== null) {
                    if (!vars.includes(var0)) 
                        vars.push(var0);
                }
            }
        }
        if (vars.length !== 1) 
            return null;
        return vars[0];
    }
    
    _check_corr_var(word, tn, i) {
        for (; i <= word.length; i++) {
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            if (tn.rules !== null) {
                let word_begin = "";
                let word_end = "";
                if (i > 0) 
                    word_begin = word.substring(0, 0 + i);
                else 
                    word_end = word;
                if (i < word.length) 
                    word_end = word.substring(i);
                else 
                    word_begin = word;
                for (const r of tn.rules) {
                    if (r.variants.containsKey(word_end)) 
                        return word_begin + word_end;
                    if (word_end.indexOf('*') >= 0) {
                        for (const v of r.variants_key) {
                            if (v.length === word_end.length) {
                                let j = 0;
                                for (j = 0; j < v.length; j++) {
                                    if (word_end[j] === '*' || word_end[j] === v[j]) {
                                    }
                                    else 
                                        break;
                                }
                                if (j >= v.length) 
                                    return word_begin + v;
                            }
                        }
                    }
                }
            }
            if (tn.nodes === null || i >= word.length) 
                break;
            let ch = word.charCodeAt(i);
            if (ch !== (0x2A)) {
                let wraptn22 = new RefOutArgWrapper();
                let inoutres23 = tn.nodes.tryGetValue(ch, wraptn22);
                tn = wraptn22.value;
                if (inoutres23) 
                    continue;
                break;
            }
            if (tn.nodes !== null) {
                for (const tnn of tn.nodes.entries) {
                    let ww = Utils.replaceString(word, '*', String.fromCharCode(tnn.key));
                    let res = this._check_corr_var(ww, tnn.value, i + 1);
                    if (res !== null) 
                        return res;
                }
            }
            break;
        }
        return null;
    }
    
    process_surname_variants(word, res) {
        this.process_proper_variants(word, res, false);
    }
    
    process_geo_variants(word, res) {
        this.process_proper_variants(word, res, true);
    }
    
    process_proper_variants(word, res, geo) {
        let tn = this.m_root_reverce;
        let tn0 = null;
        let nodes_with_vars = null;
        let i = 0;
        for (i = word.length - 1; i >= 0; i--) {
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            let ch = word.charCodeAt(i);
            if (tn.nodes === null) 
                break;
            let next = null;
            let wrapnext24 = new RefOutArgWrapper();
            let inoutres25 = tn.nodes.tryGetValue(ch, wrapnext24);
            next = wrapnext24.value;
            if (!inoutres25) 
                break;
            tn = next;
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            if (tn.reverce_variants !== null) {
                if (nodes_with_vars === null) 
                    nodes_with_vars = new Array();
                nodes_with_vars.push(tn);
                tn0 = tn;
            }
        }
        if (nodes_with_vars === null) 
            return;
        for (let j = nodes_with_vars.length - 1; j >= 0; j--) {
            tn = nodes_with_vars[j];
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
            let ok = false;
            for (const v of tn.reverce_variants) {
                if (geo && v.class0.is_proper_geo) {
                }
                else if (!geo && v.class0.is_proper_surname) {
                }
                else 
                    continue;
                let r = new MorphWordForm(v, word);
                if (!MorphWordForm.has_morph_equals(res, r)) {
                    r.undef_coef = v.coef;
                    res.push(r);
                }
                ok = true;
            }
            if (ok) 
                break;
        }
    }
    
    static _compare(x, y) {
        if (x.is_in_dictionary && !y.is_in_dictionary) 
            return -1;
        if (!x.is_in_dictionary && y.is_in_dictionary) 
            return 1;
        if (x.undef_coef > (0)) {
            if (x.undef_coef > ((y.undef_coef) * 2)) 
                return -1;
            if (((x.undef_coef) * 2) < y.undef_coef) 
                return 1;
        }
        if (MorphClass.ooNoteq(x.class0, y.class0)) {
            if ((x.class0.is_preposition || x.class0.is_conjunction || x.class0.is_pronoun) || x.class0.is_personal_pronoun) 
                return -1;
            if ((y.class0.is_preposition || y.class0.is_conjunction || y.class0.is_pronoun) || y.class0.is_personal_pronoun) 
                return 1;
            if (x.class0.is_verb) 
                return 1;
            if (y.class0.is_verb) 
                return -1;
            if (x.class0.is_noun) 
                return -1;
            if (y.class0.is_noun) 
                return 1;
        }
        let cx = MorphEngine._calc_coef(x);
        let cy = MorphEngine._calc_coef(y);
        if (cx > cy) 
            return -1;
        if (cx < cy) 
            return 1;
        if (x.number === MorphNumber.PLURAL && y.number !== MorphNumber.PLURAL) 
            return 1;
        if (y.number === MorphNumber.PLURAL && x.number !== MorphNumber.PLURAL) 
            return -1;
        return 0;
    }
    
    static _calc_coef(wf) {
        let k = 0;
        if (!wf._case.is_undefined) 
            k++;
        if (wf.gender !== MorphGender.UNDEFINED) 
            k++;
        if (wf.number !== MorphNumber.UNDEFINED) 
            k++;
        if (wf.misc.is_synonym_form) 
            k -= 3;
        if (wf.normal_case === null || (wf.normal_case.length < 4)) 
            return k;
        if (wf.class0.is_adjective && wf.number !== MorphNumber.PLURAL) {
            let last = wf.normal_case[wf.normal_case.length - 1];
            let last1 = wf.normal_case[wf.normal_case.length - 2];
            let ok = false;
            if (wf.gender === MorphGender.FEMINIE) {
                if (last === 'Я') 
                    ok = true;
            }
            if (wf.gender === MorphGender.MASCULINE) {
                if (last === 'Й') {
                    if (last1 === 'И') 
                        k++;
                    ok = true;
                }
            }
            if (wf.gender === MorphGender.NEUTER) {
                if (last === 'Е') 
                    ok = true;
            }
            if (ok) {
                if (LanguageHelper.is_cyrillic_vowel(last1)) 
                    k++;
            }
        }
        else if (wf.class0.is_adjective && wf.number === MorphNumber.PLURAL) {
            let last = wf.normal_case[wf.normal_case.length - 1];
            let last1 = wf.normal_case[wf.normal_case.length - 2];
            if (last === 'Й' || last === 'Е') 
                k++;
        }
        return k;
    }
    
    static sort(res, word) {
        if (res === null || (res.length < 2)) 
            return;
        for (let k = 0; k < res.length; k++) {
            let ch = false;
            for (let i = 0; i < (res.length - 1); i++) {
                let j = MorphEngine._compare(res[i], res[i + 1]);
                if (j > 0) {
                    let r = res[i];
                    res[i] = res[i + 1];
                    res[i + 1] = r;
                    ch = true;
                }
            }
            if (!ch) 
                break;
        }
        for (let i = 0; i < (res.length - 1); i++) {
            for (let j = i + 1; j < res.length; j++) {
                if (MorphEngine.comp1(res[i], res[j])) {
                    if ((res[i].class0.is_adjective && res[j].class0.is_noun && !res[j].is_in_dictionary) && !res[i].is_in_dictionary) 
                        res.splice(j, 1);
                    else if ((res[i].class0.is_noun && res[j].class0.is_adjective && !res[j].is_in_dictionary) && !res[i].is_in_dictionary) 
                        res.splice(i, 1);
                    else if (res[i].class0.is_adjective && res[j].class0.is_pronoun) 
                        res.splice(i, 1);
                    else if (res[i].class0.is_pronoun && res[j].class0.is_adjective) {
                        if (res[j].normal_full === "ОДИН" || res[j].normal_case === "ОДИН") 
                            continue;
                        res.splice(j, 1);
                    }
                    else 
                        continue;
                    i--;
                    break;
                }
            }
        }
    }
    
    static comp1(r1, r2) {
        if (r1.number !== r2.number || r1.gender !== r2.gender) 
            return false;
        if (MorphCase.ooNoteq(r1._case, r2._case)) 
            return false;
        if (r1.normal_case !== r2.normal_case) 
            return false;
        return true;
    }
    
    register_morph_info(var0) {
        let key = var0.toString();
        let v = null;
        let wrapv26 = new RefOutArgWrapper();
        let inoutres27 = this.m_vars_hash.tryGetValue(key, wrapv26);
        v = wrapv26.value;
        if (inoutres27) 
            return v;
        this.m_vars_hash.put(key, var0);
        this.m_vars.push(var0);
        return var0;
    }
    
    _reset() {
        this.m_root = new MorphTreeNode();
        this.m_root_reverce = new MorphTreeNode();
        this.m_vars = new Array();
        this.m_vars_hash = new Hashtable();
        this.language = new MorphLang();
    }
}


module.exports = MorphEngine