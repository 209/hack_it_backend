/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const MorphWordForm = require("./../../morph/MorphWordForm");
const CharsInfo = require("./../../morph/CharsInfo");
const MorphGender = require("./../../morph/MorphGender");
const TextToken = require("./../TextToken");
const MiscHelper = require("./MiscHelper");

/**
 * Поддержка анализа биграммной зависимости токенов в тексте
 */
class StatisticCollection {
    
    constructor() {
        this.m_items = new Hashtable();
        this.m_bigramms = new Hashtable();
        this.m_bigramms_rev = new Hashtable();
        this.m_initials = new Hashtable();
        this.m_initials_rev = new Hashtable();
    }
    
    prepare(first) {
        let prev = null;
        let prevt = null;
        for (let t = first; t !== null; t = t.next) {
            if (t.is_hiphen) 
                continue;
            let it = null;
            if (((t instanceof TextToken) && t.chars.is_letter && t.length_char > 1) && !t.chars.is_all_lower) 
                it = this.add_token(Utils.as(t, TextToken));
            else if ((((t instanceof TextToken) && (t).length_char === 1 && t.chars.is_all_upper) && t.next !== null && t.next.is_char('.')) && !t.is_whitespace_after) {
                it = this.add_token(Utils.as(t, TextToken));
                t = t.next;
            }
            if (prev !== null && it !== null) {
                this.add_bigramm(prev, it);
                if (CharsInfo.ooEq(prevt.chars, t.chars)) {
                    prev.add_after(it);
                    it.add_before(prev);
                }
            }
            prev = it;
            prevt = t;
        }
        for (let t = first; t !== null; t = t.next) {
            if (t.chars.is_letter && (t instanceof TextToken)) {
                let it = this.find_item(Utils.as(t, TextToken), false);
                if (it !== null) {
                    if (t.chars.is_all_lower) 
                        it.lower_count++;
                    else if (t.chars.is_all_upper) 
                        it.upper_count++;
                    else if (t.chars.is_capital_upper) 
                        it.capital_count++;
                }
            }
        }
    }
    
    add_token(tt) {
        let vars = new Array();
        vars.push(tt.term);
        let s = MiscHelper.get_absolute_normal_value(tt.term, false);
        if (s !== null && !vars.includes(s)) 
            vars.push(s);
        for (const wff of tt.morph.items) {
            let wf = Utils.as(wff, MorphWordForm);
            if (wf === null) 
                continue;
            if (wf.normal_case !== null && !vars.includes(wf.normal_case)) 
                vars.push(wf.normal_case);
            if (wf.normal_full !== null && !vars.includes(wf.normal_full)) 
                vars.push(wf.normal_full);
        }
        let res = null;
        for (const v of vars) {
            let wrapres609 = new RefOutArgWrapper();
            let inoutres610 = this.m_items.tryGetValue(v, wrapres609);
            res = wrapres609.value;
            if (inoutres610) 
                break;
        }
        if (res === null) 
            res = StatisticCollection.WordInfo._new611(tt.lemma);
        for (const v of vars) {
            if (!this.m_items.containsKey(v)) 
                this.m_items.put(v, res);
        }
        res.total_count++;
        if ((tt.next instanceof TextToken) && tt.next.chars.is_all_lower) {
            if (tt.next.chars.is_cyrillic_letter && tt.next.get_morph_class_in_dictionary().is_verb) {
                let g = tt.next.morph.gender;
                if (g === MorphGender.FEMINIE) 
                    res.female_verbs_after_count++;
                else if ((((g.value()) & (MorphGender.MASCULINE.value()))) !== (MorphGender.UNDEFINED.value())) 
                    res.male_verbs_after_count++;
            }
        }
        if (tt.previous !== null) {
            if ((tt.previous instanceof TextToken) && tt.previous.chars.is_letter && !tt.previous.chars.is_all_lower) {
            }
            else 
                res.not_capital_before_count++;
        }
        return res;
    }
    
    find_item(tt, do_absolute = true) {
        if (tt === null) 
            return null;
        let res = null;
        let wrapres618 = new RefOutArgWrapper();
        let inoutres619 = this.m_items.tryGetValue(tt.term, wrapres618);
        res = wrapres618.value;
        if (inoutres619) 
            return res;
        if (do_absolute) {
            let s = MiscHelper.get_absolute_normal_value(tt.term, false);
            if (s !== null) {
                let wrapres612 = new RefOutArgWrapper();
                let inoutres613 = this.m_items.tryGetValue(s, wrapres612);
                res = wrapres612.value;
                if (inoutres613) 
                    return res;
            }
        }
        for (const wff of tt.morph.items) {
            let wf = Utils.as(wff, MorphWordForm);
            if (wf === null) 
                continue;
            let wrapres616 = new RefOutArgWrapper();
            let inoutres617 = this.m_items.tryGetValue((wf.normal_case != null ? wf.normal_case : ""), wrapres616);
            res = wrapres616.value;
            if (inoutres617) 
                return res;
            let wrapres614 = new RefOutArgWrapper();
            let inoutres615 = this.m_items.tryGetValue(wf.normal_full, wrapres614);
            res = wrapres614.value;
            if (wf.normal_full !== null && inoutres615) 
                return res;
        }
        return null;
    }
    
    add_bigramm(b1, b2) {
        let di = null;
        let wrapdi622 = new RefOutArgWrapper();
        let inoutres623 = this.m_bigramms.tryGetValue(b1.normal, wrapdi622);
        di = wrapdi622.value;
        if (!inoutres623) 
            this.m_bigramms.put(b1.normal, (di = new Hashtable()));
        if (di.containsKey(b2.normal)) 
            di.put(b2.normal, di.get(b2.normal) + 1);
        else 
            di.put(b2.normal, 1);
        let wrapdi620 = new RefOutArgWrapper();
        let inoutres621 = this.m_bigramms_rev.tryGetValue(b2.normal, wrapdi620);
        di = wrapdi620.value;
        if (!inoutres621) 
            this.m_bigramms_rev.put(b2.normal, (di = new Hashtable()));
        if (di.containsKey(b1.normal)) 
            di.put(b1.normal, di.get(b1.normal) + 1);
        else 
            di.put(b1.normal, 1);
    }
    
    get_bigramm_info(t1, t2) {
        let si1 = this.find_item(Utils.as(t1, TextToken), true);
        let si2 = this.find_item(Utils.as(t2, TextToken), true);
        if (si1 === null || si2 === null) 
            return null;
        return this._get_bigrams_info(si1, si2);
    }
    
    _get_bigrams_info(si1, si2) {
        let res = StatisticCollection.BigrammInfo._new624(si1.total_count, si2.total_count);
        let di12 = null;
        let wrapdi12626 = new RefOutArgWrapper();
        this.m_bigramms.tryGetValue(si1.normal, wrapdi12626);
        di12 = wrapdi12626.value;
        let di21 = null;
        let wrapdi21625 = new RefOutArgWrapper();
        this.m_bigramms_rev.tryGetValue(si2.normal, wrapdi21625);
        di21 = wrapdi21625.value;
        if (di12 !== null) {
            if (!di12.containsKey(si2.normal)) 
                res.first_has_other_second = true;
            else {
                res.pair_count = di12.get(si2.normal);
                if (di12.length > 1) 
                    res.first_has_other_second = true;
            }
        }
        if (di21 !== null) {
            if (!di21.containsKey(si1.normal)) 
                res.second_has_other_first = true;
            else if (!di21.containsKey(si1.normal)) 
                res.second_has_other_first = true;
            else if (di21.length > 1) 
                res.second_has_other_first = true;
        }
        return res;
    }
    
    get_initial_info(ini, sur) {
        if (Utils.isNullOrEmpty(ini)) 
            return null;
        let si2 = this.find_item(Utils.as(sur, TextToken), true);
        if (si2 === null) 
            return null;
        let si1 = null;
        let wrapsi1627 = new RefOutArgWrapper();
        let inoutres628 = this.m_items.tryGetValue(ini.substring(0, 0 + 1), wrapsi1627);
        si1 = wrapsi1627.value;
        if (!inoutres628) 
            return null;
        if (si1 === null) 
            return null;
        return this._get_bigrams_info(si1, si2);
    }
    
    get_word_info(t) {
        let tt = Utils.as(t, TextToken);
        if (tt === null) 
            return null;
        return this.find_item(tt, true);
    }
}


StatisticCollection.BigrammInfo = class  {
    
    constructor() {
        this.first_count = 0;
        this.second_count = 0;
        this.pair_count = 0;
        this.first_has_other_second = false;
        this.second_has_other_first = false;
    }
    
    static _new624(_arg1, _arg2) {
        let res = new StatisticCollection.BigrammInfo();
        res.first_count = _arg1;
        res.second_count = _arg2;
        return res;
    }
}


StatisticCollection.WordInfo = class  {
    
    constructor() {
        this.normal = null;
        this.total_count = 0;
        this.lower_count = 0;
        this.upper_count = 0;
        this.capital_count = 0;
        this.male_verbs_after_count = 0;
        this.female_verbs_after_count = 0;
        this.has_before_person_attr = false;
        this.not_capital_before_count = 0;
        this.like_chars_before_words = null;
        this.like_chars_after_words = null;
    }
    
    toString() {
        return this.normal;
    }
    
    add_before(w) {
        if (this.like_chars_before_words === null) 
            this.like_chars_before_words = new Hashtable();
        if (!this.like_chars_before_words.containsKey(w)) 
            this.like_chars_before_words.put(w, 1);
        else 
            this.like_chars_before_words.put(w, this.like_chars_before_words.get(w) + 1);
    }
    
    add_after(w) {
        if (this.like_chars_after_words === null) 
            this.like_chars_after_words = new Hashtable();
        if (!this.like_chars_after_words.containsKey(w)) 
            this.like_chars_after_words.put(w, 1);
        else 
            this.like_chars_after_words.put(w, this.like_chars_after_words.get(w) + 1);
    }
    
    static _new611(_arg1) {
        let res = new StatisticCollection.WordInfo();
        res.normal = _arg1;
        return res;
    }
}


module.exports = StatisticCollection