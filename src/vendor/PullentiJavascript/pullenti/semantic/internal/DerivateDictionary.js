/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const Stream = require("./../../unisharp/Stream");

const DerivateGroup = require("./../utils/DerivateGroup");
const ExplanTreeNode = require("./ExplanTreeNode");
const MorphLang = require("./../../morph/MorphLang");
const LanguageHelper = require("./../../morph/LanguageHelper");
const EpSemanticUtilsPropertiesResources = require("./../utils/properties/EpSemanticUtilsPropertiesResources");
const DeserializeHelper = require("./DeserializeHelper");

class DerivateDictionary {
    
    constructor() {
        this.lang = null;
        this.m_inited = false;
        this.m_buf = null;
        this.m_root = new ExplanTreeNode();
        this.m_all_groups = new Array();
        this.m_lock = new Object();
    }
    
    init(_lang) {
        if (this.m_inited) 
            return true;
        // ignored: let assembly = ;
        let rsname = ("d_" + _lang.toString() + ".dat");
        let names = EpSemanticUtilsPropertiesResources.getNames();
        for (const n of names) {
            if (Utils.endsWithString(n, rsname, true)) {
                let inf = EpSemanticUtilsPropertiesResources.getResourceInfo(n);
                if (inf === null) 
                    continue;
                let stream = EpSemanticUtilsPropertiesResources.getStream(n); 
                try {
                    stream.position = 0;
                    this.m_all_groups.splice(0, this.m_all_groups.length);
                    this.m_buf = DeserializeHelper.deserializedd(stream, this, true);
                    this.lang = _lang;
                }
                finally {
                    stream.close();
                }
                this.m_inited = true;
                return true;
            }
        }
        return false;
    }
    
    unload() {
        this.m_root = new ExplanTreeNode();
        this.m_all_groups.splice(0, this.m_all_groups.length);
        this.lang = new MorphLang();
    }
    
    add(dg) {
        this.m_all_groups.push(dg);
        for (const w of dg.words) {
            if (w.spelling === null) 
                continue;
            let tn = this.m_root;
            for (let i = 0; i < w.spelling.length; i++) {
                let k = w.spelling.charCodeAt(i);
                let tn1 = null;
                if (tn.nodes === null) 
                    tn.nodes = new Hashtable();
                let wraptn12908 = new RefOutArgWrapper();
                let inoutres2909 = tn.nodes.tryGetValue(k, wraptn12908);
                tn1 = wraptn12908.value;
                if (!inoutres2909) 
                    tn.nodes.put(k, (tn1 = new ExplanTreeNode()));
                tn = tn1;
            }
            tn.add_group(dg);
        }
    }
    
    _load_tree_node(tn) {
        /* this is synchronized block by this.m_lock, but this feature isn't supported in JS */ {
            let pos = tn.lazy_pos;
            if (pos > 0) {
                let wrappos2910 = new RefOutArgWrapper(pos);
                DeserializeHelper.deserialize_tree_node(this.m_buf, this, tn, true, wrappos2910);
                pos = wrappos2910.value;
            }
            tn.lazy_pos = 0;
        }
    }
    
    find(word, try_create, _lang) {
        if (Utils.isNullOrEmpty(word)) 
            return null;
        let tn = this.m_root;
        let i = 0;
        for (i = 0; i < word.length; i++) {
            let k = word.charCodeAt(i);
            let tn1 = null;
            if (tn.nodes === null) 
                break;
            let wraptn12911 = new RefOutArgWrapper();
            let inoutres2912 = tn.nodes.tryGetValue(k, wraptn12911);
            tn1 = wraptn12911.value;
            if (!inoutres2912) 
                break;
            tn = tn1;
            if (tn.lazy_pos > 0) 
                this._load_tree_node(tn);
        }
        let res = (i < word.length ? null : tn.groups);
        let li = null;
        if (res instanceof Array) {
            li = Array.from(Utils.as(res, Array));
            let gen = false;
            let nogen = false;
            for (const g of li) {
                if (g.is_generated) 
                    gen = true;
                else 
                    nogen = true;
            }
            if (gen && nogen) {
                for (i = li.length - 1; i >= 0; i--) {
                    if (li[i].is_generated) 
                        li.splice(i, 1);
                }
            }
        }
        else if (res instanceof DerivateGroup) {
            li = new Array();
            li.push(Utils.as(res, DerivateGroup));
        }
        if (li !== null && _lang !== null && !_lang.is_undefined) {
            for (i = li.length - 1; i >= 0; i--) {
                if (!li[i].contains_word(word, _lang)) 
                    li.splice(i, 1);
            }
        }
        if (li !== null && li.length > 0) 
            return li;
        if (word.length < 4) 
            return null;
        let ch0 = word[word.length - 1];
        let ch1 = word[word.length - 2];
        let ch2 = word[word.length - 3];
        if (ch0 === 'О' || ((ch0 === 'И' && ch1 === 'К'))) {
            let word1 = word.substring(0, 0 + word.length - 1);
            if ((((li = this.find(word1 + "ИЙ", false, _lang)))) !== null) 
                return li;
            if ((((li = this.find(word1 + "ЫЙ", false, _lang)))) !== null) 
                return li;
            if (ch0 === 'О' && ch1 === 'Н') {
                if ((((li = this.find(word1 + "СКИЙ", false, _lang)))) !== null) 
                    return li;
            }
        }
        else if (((ch0 === 'Я' || ch0 === 'Ь')) && ((word[word.length - 2] === 'С'))) {
            let word1 = word.substring(0, 0 + word.length - 2);
            if (word1 === "ЯТЬ") 
                return null;
            if ((((li = this.find(word1, false, _lang)))) !== null) 
                return li;
        }
        else if (ch0 === 'Е' && ch1 === 'Ь') {
            let word1 = word.substring(0, 0 + word.length - 2) + "ИЕ";
            if ((((li = this.find(word1, false, _lang)))) !== null) 
                return li;
        }
        else if (ch0 === 'Й' && ch2 === 'Н' && try_create) {
            let ch3 = word[word.length - 4];
            let word1 = null;
            if (ch3 !== 'Н') {
                if (LanguageHelper.is_cyrillic_vowel(ch3)) 
                    word1 = word.substring(0, 0 + word.length - 3) + "Н" + word.substring(word.length - 3);
            }
            else 
                word1 = word.substring(0, 0 + word.length - 4) + word.substring(word.length - 3);
            if (word1 !== null) {
                if ((((li = this.find(word1, false, _lang)))) !== null) 
                    return li;
            }
        }
        if (ch0 === 'Й' && ch1 === 'О') {
            let word2 = word.substring(0, 0 + word.length - 2);
            if ((((li = this.find(word2 + "ИЙ", false, _lang)))) !== null) 
                return li;
            if ((((li = this.find(word2 + "ЫЙ", false, _lang)))) !== null) 
                return li;
        }
        if (!try_create) 
            return null;
        let len = word.length - 4;
        for (i = 1; i <= len; i++) {
            let rest = word.substring(i);
            let li1 = this.find(rest, false, _lang);
            if (li1 === null) 
                continue;
            let pref = word.substring(0, 0 + i);
            let gen = new Array();
            for (const dg of li1) {
                if (!dg.is_dummy && !dg.is_generated) {
                    if (dg.not_generate) {
                        if (rest.length < 5) 
                            continue;
                    }
                    let gg = dg.create_by_prefix(pref, _lang);
                    if (gg !== null) {
                        gen.push(gg);
                        this.add(gg);
                    }
                }
            }
            if (gen.length === 0) 
                return null;
            return gen;
        }
        return null;
    }
}


module.exports = DerivateDictionary