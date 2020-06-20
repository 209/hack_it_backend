/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MorphLang = require("./../../morph/MorphLang");
const DerivateWord = require("./DerivateWord");
const ControlModel = require("./ControlModel");
const ControlModelOld = require("./../internal/ControlModelOld");

/**
 * Дериватная группа
 */
class DerivateGroup {
    
    constructor() {
        this.words = new Array();
        this.prefix = null;
        this.is_dummy = false;
        this.not_generate = false;
        this.is_generated = false;
        this.model = new ControlModel();
        this.cm = new ControlModelOld();
        this.cm_rev = new ControlModelOld();
        this.lazy_pos = 0;
        this.tag = null;
    }
    
    /**
     * Содержит ли группа слово
     * @param word слово
     * @param lang возможный язык
     * @return 
     */
    contains_word(word, lang) {
        for (const w of this.words) {
            if (w.spelling === word) {
                if (lang === null || lang.is_undefined || w.lang === null) 
                    return true;
                if (!(MorphLang.ooBitand(lang, w.lang)).is_undefined) 
                    return true;
            }
        }
        return false;
    }
    
    toString() {
        let res = "?";
        if (this.words.length > 0) 
            res = ("<" + this.words[0].spelling + ">");
        if (this.is_dummy) 
            res = ("DUMMY: " + res);
        else if (this.is_generated) 
            res = ("GEN: " + res);
        return res;
    }
    
    create_by_prefix(pref, lang) {
        let res = DerivateGroup._new2967(true, pref);
        for (const w of this.words) {
            if (lang !== null && !lang.is_undefined && (MorphLang.ooBitand(w.lang, lang)).is_undefined) 
                continue;
            let rw = DerivateWord._new2968(res, pref + w.spelling, w.lang, w.class0, w.aspect, w.reflexive, w.tense, w.voice, w.attrs);
            res.words.push(rw);
        }
        return res;
    }
    
    static _new2967(_arg1, _arg2) {
        let res = new DerivateGroup();
        res.is_generated = _arg1;
        res.prefix = _arg2;
        return res;
    }
}


module.exports = DerivateGroup