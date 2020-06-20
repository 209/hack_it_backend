/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphTense = require("./../MorphTense");
const MorphVoice = require("./../MorphVoice");
const MorphPerson = require("./../MorphPerson");
const MorphMood = require("./../MorphMood");
const MorphClass = require("./../MorphClass");
const MorphCase = require("./../MorphCase");
const MorphBaseInfo = require("./../MorphBaseInfo");

class MorphRuleVariant extends MorphBaseInfo {
    
    constructor(src = null) {
        super(null);
        this.coef = 0;
        this.tail = null;
        this.misc_info = null;
        this.rule = null;
        this.normal_tail = null;
        this.full_normal_tail = null;
        this.tag = null;
        if (src === null) 
            return;
        this.tail = src.tail;
        src.copy_to(this);
        this.misc_info = src.misc_info;
        this.normal_tail = src.normal_tail;
        this.full_normal_tail = src.full_normal_tail;
        this.rule = src.rule;
        this.tag = src.tag;
    }
    
    toString() {
        return this.to_string_ex(false);
    }
    
    to_string_ex(hide_tails) {
        let res = new StringBuilder();
        if (!hide_tails) {
            res.append("-").append(this.tail);
            if (this.normal_tail !== null) 
                res.append(" [-").append(this.normal_tail).append("]");
            if (this.full_normal_tail !== null && this.full_normal_tail !== this.normal_tail) 
                res.append(" [-").append(this.full_normal_tail).append("]");
        }
        res.append(" ").append(super.toString()).append(" ").append((this.misc_info === null ? "" : this.misc_info.toString()));
        return res.toString().trim();
    }
    
    compare(mrv) {
        if ((MorphClass.ooNoteq(mrv.class0, this.class0) || mrv.gender !== this.gender || mrv.number !== this.number) || MorphCase.ooNoteq(mrv._case, this._case)) 
            return false;
        if (mrv.misc_info !== this.misc_info) 
            return false;
        if (mrv.normal_tail !== this.normal_tail) 
            return false;
        return true;
    }
    
    calc_eq_coef(wf) {
        if (wf.class0.value !== (0)) {
            if ((((this.class0.value) & (wf.class0.value))) === 0) 
                return -1;
        }
        if (this.misc_info !== wf.misc) {
            if (this.misc_info.mood !== MorphMood.UNDEFINED && wf.misc.mood !== MorphMood.UNDEFINED) {
                if (this.misc_info.mood !== wf.misc.mood) 
                    return -1;
            }
            if (this.misc_info.tense !== MorphTense.UNDEFINED && wf.misc.tense !== MorphTense.UNDEFINED) {
                if ((((this.misc_info.tense.value()) & (wf.misc.tense.value()))) === (MorphTense.UNDEFINED.value())) 
                    return -1;
            }
            if (this.misc_info.voice !== MorphVoice.UNDEFINED && wf.misc.voice !== MorphVoice.UNDEFINED) {
                if (this.misc_info.voice !== wf.misc.voice) 
                    return -1;
            }
            if (this.misc_info.person !== MorphPerson.UNDEFINED && wf.misc.person !== MorphPerson.UNDEFINED) {
                if ((((this.misc_info.person.value()) & (wf.misc.person.value()))) === (MorphPerson.UNDEFINED.value())) 
                    return -1;
            }
            return 0;
        }
        if (!this.check_accord(wf, false, false)) 
            return -1;
        return 1;
    }
    
    static _new41(_arg1) {
        let res = new MorphRuleVariant();
        res.misc_info = _arg1;
        return res;
    }
}


module.exports = MorphRuleVariant