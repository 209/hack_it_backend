/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");

const MorphClass = require("./../../../morph/MorphClass");
const MorphCase = require("./../../../morph/MorphCase");
const MorphGender = require("./../../../morph/MorphGender");
const MorphNumber = require("./../../../morph/MorphNumber");
const MorphBaseInfo = require("./../../../morph/MorphBaseInfo");
const MorphWordForm = require("./../../../morph/MorphWordForm");

/**
 * Морфологический вариант для элемента именной группы
 */
class NounPhraseItemTextVar extends MorphBaseInfo {
    
    constructor(src = null, t = null) {
        super(src);
        this.normal_value = null;
        this.single_number_value = null;
        this.undef_coef = 0;
        let wf = Utils.as(src, MorphWordForm);
        if (wf !== null) {
            this.normal_value = wf.normal_case;
            if (wf.number === MorphNumber.PLURAL && wf.normal_full !== null) 
                this.single_number_value = wf.normal_full;
            this.undef_coef = wf.undef_coef;
        }
        else if (t !== null) 
            this.normal_value = t.get_normal_case_text(null, false, MorphGender.UNDEFINED, false);
        if (this._case.is_undefined && src !== null) {
            if (src.contains_attr("неизм.", null)) 
                this._case = MorphCase.ALL_CASES;
        }
    }
    
    toString() {
        return (this.normal_value + " " + super.toString());
    }
    
    clone() {
        let res = new NounPhraseItemTextVar();
        this.copy_to(res);
        res.normal_value = this.normal_value;
        res.single_number_value = this.single_number_value;
        res.undef_coef = this.undef_coef;
        return res;
    }
    
    correct_prefix(t, ignore_gender) {
        if (t === null) 
            return;
        for (const v of t.morph.items) {
            if (MorphClass.ooEq(v.class0, this.class0) && this.check_accord(v, ignore_gender, false)) {
                this.normal_value = ((v).normal_case + "-" + this.normal_value);
                if (this.single_number_value !== null) 
                    this.single_number_value = ((((v).normal_full != null ? (v).normal_full : (v).normal_case)) + "-" + this.single_number_value);
                return;
            }
        }
        this.normal_value = (t.term + "-" + this.normal_value);
        if (this.single_number_value !== null) 
            this.single_number_value = (t.term + "-" + this.single_number_value);
    }
}


module.exports = NounPhraseItemTextVar