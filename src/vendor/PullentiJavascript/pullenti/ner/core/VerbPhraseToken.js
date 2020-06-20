/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphGender = require("./../../morph/MorphGender");
const MetaToken = require("./../MetaToken");
const MorphVoice = require("./../../morph/MorphVoice");
const MorphClass = require("./../../morph/MorphClass");

/**
 * Глагольная группа
 */
class VerbPhraseToken extends MetaToken {
    
    constructor(begin, end) {
        super(begin, end, null);
        this.items = new Array();
        this.preposition = null;
    }
    
    /**
     * [Get] Первый глагол (всегда есть, иначе это не группа)
     */
    get first_verb() {
        for (const it of this.items) {
            if (!it.is_adverb) 
                return it;
        }
        return null;
    }
    
    /**
     * [Get] Последний глагол (если один, то совпадает с первым)
     */
    get last_verb() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (!this.items[i].is_adverb) 
                return this.items[i];
        }
        return null;
    }
    
    /**
     * [Get] Признак того, что вся группа в пассивном залоге (по первому глаголу)
     */
    get is_verb_passive() {
        let fi = this.first_verb;
        if (fi === null || fi.verb_morph === null) 
            return false;
        return fi.verb_morph.misc.voice === MorphVoice.PASSIVE;
    }
    
    merge_with(v) {
        this.items.splice(this.items.length, 0, ...v.items);
        this.end_token = v.end_token;
    }
    
    toString() {
        if (this.items.length === 1) 
            return (this.items[0].toString() + ", " + this.morph.toString());
        let tmp = new StringBuilder();
        for (const it of this.items) {
            if (tmp.length > 0) 
                tmp.append(' ');
            tmp.append(it);
        }
        tmp.append(", ").append(this.morph.toString());
        return tmp.toString();
    }
    
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        return super.get_normal_case_text(MorphClass.VERB, single_number, gender, keep_chars);
    }
}


module.exports = VerbPhraseToken