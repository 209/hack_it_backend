/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const MorphGender = require("./../../morph/MorphGender");
const MorphClass = require("./../../morph/MorphClass");
const MorphPerson = require("./../../morph/MorphPerson");
const MorphMiscInfo = require("./../../morph/MorphMiscInfo");
const MorphNumber = require("./../../morph/MorphNumber");
const MetaToken = require("./../MetaToken");
const MorphWordForm = require("./../../morph/MorphWordForm");
const MorphVoice = require("./../../morph/MorphVoice");
const Morphology = require("./../../morph/Morphology");
const TextToken = require("./../TextToken");

/**
 * Элемент глагольной группы
 */
class VerbPhraseItemToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.not = false;
        this.is_adverb = false;
        this.m_is_participle = -1;
        this.m_normal = null;
        this.m_verb_morph = null;
    }
    
    /**
     * [Get] Причастие
     */
    get is_participle() {
        if (this.m_is_participle >= 0) 
            return this.m_is_participle > 0;
        for (const f of this.morph.items) {
            if (f.class0.is_adjective && (f instanceof MorphWordForm) && !(f).misc.attrs.includes("к.ф.")) 
                return true;
            else if (f.class0.is_verb && !f._case.is_undefined) 
                return true;
        }
        this.m_is_participle = 0;
        let tt = Utils.as(this.end_token, TextToken);
        if (tt !== null && tt.term.endsWith("СЯ")) {
            let mb = Morphology.get_word_base_info(tt.term.substring(0, 0 + tt.term.length - 2), null, false, false);
            if (mb !== null) {
                if (mb.class0.is_adjective) 
                    this.m_is_participle = 1;
            }
        }
        return this.m_is_participle > 0;
    }
    /**
     * [Set] Причастие
     */
    set is_participle(value) {
        this.m_is_participle = (value ? 1 : 0);
        return value;
    }
    
    /**
     * [Get] Признак деепричастия
     */
    get is_dee_participle() {
        let tt = Utils.as(this.end_token, TextToken);
        if (tt === null) 
            return false;
        if (!tt.term.endsWith("Я") && !tt.term.endsWith("В")) 
            return false;
        if (tt.morph.class0.is_verb && !tt.morph.class0.is_adjective) {
            if (tt.morph.gender === MorphGender.UNDEFINED && tt.morph._case.is_undefined && tt.morph.number === MorphNumber.UNDEFINED) 
                return true;
        }
        return false;
    }
    
    /**
     * [Get] Глагол-инфиниитив
     */
    get is_verb_infinitive() {
        for (const f of this.morph.items) {
            if (f.class0.is_verb && (f instanceof MorphWordForm) && (f).misc.attrs.includes("инф.")) 
                return true;
        }
        return false;
    }
    
    /**
     * [Get] Глаголы быть, являться...
     */
    get is_verb_be() {
        let wf = this.verb_morph;
        if (wf !== null) {
            if (wf.normal_case === "БЫТЬ" || wf.normal_case === "ЯВЛЯТЬСЯ") 
                return true;
        }
        return false;
    }
    
    /**
     * [Get] Возвратный глагол или в страдательном залоге
     */
    get is_verb_reversive() {
        if (this.is_verb_be) 
            return false;
        if (this.morph.contains_attr("страд.з", null)) 
            return true;
        if (this.verb_morph !== null) {
            if (this.verb_morph.misc.voice === MorphVoice.PASSIVE) 
                return true;
            if (this.verb_morph.contains_attr("возвр.", null)) 
                return true;
            if (this.verb_morph.normal_case !== null) {
                if (this.verb_morph.normal_case.endsWith("СЯ") || this.verb_morph.normal_case.endsWith("СЬ")) 
                    return true;
            }
        }
        return false;
    }
    
    /**
     * [Get] Нормализованное значение
     */
    get normal() {
        let wf = this.verb_morph;
        if (wf !== null) {
            if (!wf.class0.is_adjective && !wf._case.is_undefined && this.m_normal !== null) 
                return this.m_normal;
            if (wf.class0.is_adjective && !wf.class0.is_verb) 
                return (wf.normal_full != null ? wf.normal_full : wf.normal_case);
            return wf.normal_case;
        }
        return this.m_normal;
    }
    /**
     * [Set] Нормализованное значение
     */
    set normal(value) {
        this.m_normal = value;
        return value;
    }
    
    /**
     * [Get] Полное морф.информация о глаголе глагола
     */
    get verb_morph() {
        if (this.m_verb_morph !== null) 
            return this.m_verb_morph;
        for (const f of this.morph.items) {
            if (f.class0.is_verb && (f instanceof MorphWordForm) && ((((f).misc.person.value()) & (MorphPerson.THIRD.value()))) !== (MorphPerson.UNDEFINED.value())) 
                return (Utils.as(f, MorphWordForm));
        }
        for (const f of this.morph.items) {
            if (f.class0.is_verb && (f instanceof MorphWordForm)) 
                return (Utils.as(f, MorphWordForm));
        }
        for (const f of this.morph.items) {
            if (f.class0.is_adjective && (f instanceof MorphWordForm)) 
                return (Utils.as(f, MorphWordForm));
        }
        if (this.m_normal === "НЕТ") 
            return MorphWordForm._new672(MorphClass.VERB, new MorphMiscInfo());
        return null;
    }
    /**
     * [Set] Полное морф.информация о глаголе глагола
     */
    set verb_morph(value) {
        this.m_verb_morph = value;
        return value;
    }
    
    toString() {
        return (((this.not ? "НЕ " : ""))) + this.normal;
    }
    
    static _new670(_arg1, _arg2, _arg3) {
        let res = new VerbPhraseItemToken(_arg1, _arg2);
        res.morph = _arg3;
        return res;
    }
}


module.exports = VerbPhraseItemToken