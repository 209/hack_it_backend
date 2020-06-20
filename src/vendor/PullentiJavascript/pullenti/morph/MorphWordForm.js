/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const MorphNumber = require("./MorphNumber");
const MorphPerson = require("./MorphPerson");
const MorphGender = require("./MorphGender");
const MorphCase = require("./MorphCase");
const MorphBaseInfo = require("./MorphBaseInfo");
const MorphClass = require("./MorphClass");
const LanguageHelper = require("./LanguageHelper");

/**
 * Словоформа (вариант морфанализа лексемы)
 */
class MorphWordForm extends MorphBaseInfo {
    
    /**
     * [Get] Находится ли словоформа в словаре (если false, то восстановлена по аналогии)
     */
    get is_in_dictionary() {
        return this.undef_coef === (0);
    }
    
    clone() {
        let res = new MorphWordForm();
        this.copy_to_word_form(res);
        return res;
    }
    
    copy_to_word_form(dst) {
        super.copy_to(dst);
        dst.undef_coef = this.undef_coef;
        dst.normal_case = this.normal_case;
        dst.normal_full = this.normal_full;
        dst.misc = this.misc;
        dst.tag = this.tag;
    }
    
    constructor(v = null, word = null) {
        super(null);
        this.normal_full = null;
        this.normal_case = null;
        this.misc = null;
        this.undef_coef = 0;
        this.tag = null;
        if (v === null) 
            return;
        v.copy_to(this);
        this.misc = v.misc_info;
        this.tag = v;
        if (v.normal_tail !== null && word !== null) {
            let word_begin = word;
            if (LanguageHelper.ends_with(word, v.tail)) 
                word_begin = word.substring(0, 0 + word.length - v.tail.length);
            if (v.normal_tail.length > 0) 
                this.normal_case = word_begin + v.normal_tail;
            else 
                this.normal_case = word_begin;
        }
        if (v.full_normal_tail !== null && word !== null) {
            let word_begin = word;
            if (LanguageHelper.ends_with(word, v.tail)) 
                word_begin = word.substring(0, 0 + word.length - v.tail.length);
            if (v.full_normal_tail.length > 0) 
                this.normal_full = word_begin + v.full_normal_tail;
            else 
                this.normal_full = word_begin;
        }
    }
    
    toString() {
        return this.to_string_ex(false);
    }
    
    to_string_ex(ignore_normals) {
        let res = new StringBuilder();
        if (!ignore_normals) {
            res.append((this.normal_case != null ? this.normal_case : ""));
            if (this.normal_full !== null && this.normal_full !== this.normal_case) 
                res.append("\\").append(this.normal_full);
            if (res.length > 0) 
                res.append(' ');
        }
        res.append(super.toString());
        let s = (this.misc === null ? null : this.misc.toString());
        if (!Utils.isNullOrEmpty(s)) 
            res.append(" ").append(s);
        if (this.undef_coef > (0)) 
            res.append(" (? ").append(this.undef_coef).append(")");
        return res.toString();
    }
    
    contains_attr(attr_value, cla = null) {
        if (this.misc !== null && this.misc.attrs !== null) 
            return this.misc.attrs.includes(attr_value);
        return false;
    }
    
    static has_morph_equals(list, mv) {
        for (const mr of list) {
            if ((MorphClass.ooEq(mv.class0, mr.class0) && mv.number === mr.number && mv.gender === mr.gender) && mv.normal_case === mr.normal_case && mv.normal_full === mr.normal_full) {
                mr._case = MorphCase.ooBitor(mr._case, mv._case);
                let p = mv.misc.person;
                if (p !== MorphPerson.UNDEFINED && p !== mr.misc.person) {
                    mr.misc = mr.misc.clone();
                    mr.misc.person = MorphPerson.of((mr.misc.person.value()) | (mv.misc.person.value()));
                }
                return true;
            }
        }
        for (const mr of list) {
            if ((MorphClass.ooEq(mv.class0, mr.class0) && mv.number === mr.number && MorphCase.ooEq(mv._case, mr._case)) && mv.normal_case === mr.normal_case && mv.normal_full === mr.normal_full) {
                mr.gender = MorphGender.of((mr.gender.value()) | (mv.gender.value()));
                return true;
            }
        }
        for (const mr of list) {
            if ((MorphClass.ooEq(mv.class0, mr.class0) && mv.gender === mr.gender && MorphCase.ooEq(mv._case, mr._case)) && mv.normal_case === mr.normal_case && mv.normal_full === mr.normal_full) {
                mr.number = MorphNumber.of((mr.number.value()) | (mv.number.value()));
                return true;
            }
        }
        return false;
    }
    
    static _new6(_arg1, _arg2, _arg3) {
        let res = new MorphWordForm();
        res.normal_case = _arg1;
        res.class0 = _arg2;
        res.undef_coef = _arg3;
        return res;
    }
    
    static _new671(_arg1, _arg2, _arg3) {
        let res = new MorphWordForm();
        res._case = _arg1;
        res.number = _arg2;
        res.gender = _arg3;
        return res;
    }
    
    static _new672(_arg1, _arg2) {
        let res = new MorphWordForm();
        res.class0 = _arg1;
        res.misc = _arg2;
        return res;
    }
    
    static _new2928(_arg1, _arg2, _arg3, _arg4) {
        let res = new MorphWordForm();
        res.class0 = _arg1;
        res.number = _arg2;
        res.gender = _arg3;
        res._case = _arg4;
        return res;
    }
}


module.exports = MorphWordForm