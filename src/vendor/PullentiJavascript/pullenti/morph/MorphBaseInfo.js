/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const MorphGender = require("./MorphGender");
const MorphNumber = require("./MorphNumber");
const MorphLang = require("./MorphLang");
const MorphClass = require("./MorphClass");
const MorphCase = require("./MorphCase");

/**
 * Базовая часть морфологической информации
 */
class MorphBaseInfo {
    
    constructor(bi = null) {
        this.m_cla = new MorphClass();
        this._gender = MorphGender.UNDEFINED;
        this._number = MorphNumber.UNDEFINED;
        this.m_cas = new MorphCase();
        this.m_lang = new MorphLang();
        if (bi !== null) 
            bi.copy_to(this);
    }
    
    /**
     * [Get] Часть речи
     */
    get class0() {
        return this.m_cla;
    }
    /**
     * [Set] Часть речи
     */
    set class0(value) {
        this.m_cla = value;
        return value;
    }
    
    /**
     * [Get] Род
     */
    get gender() {
        return this._gender;
    }
    /**
     * [Set] Род
     */
    set gender(value) {
        this._gender = value;
        return this._gender;
    }
    
    /**
     * [Get] Число
     */
    get number() {
        return this._number;
    }
    /**
     * [Set] Число
     */
    set number(value) {
        this._number = value;
        return this._number;
    }
    
    /**
     * [Get] Падеж
     */
    get _case() {
        return this.m_cas;
    }
    /**
     * [Set] Падеж
     */
    set _case(value) {
        this.m_cas = value;
        return value;
    }
    
    /**
     * [Get] Язык
     */
    get language() {
        return this.m_lang;
    }
    /**
     * [Set] Язык
     */
    set language(value) {
        this.m_lang = value;
        return value;
    }
    
    toString() {
        let res = new StringBuilder();
        if (!this.class0.is_undefined) 
            res.append(this.class0.toString()).append(" ");
        if (this.number !== MorphNumber.UNDEFINED) {
            if (this.number === MorphNumber.SINGULAR) 
                res.append("ед.ч. ");
            else if (this.number === MorphNumber.PLURAL) 
                res.append("мн.ч. ");
            else 
                res.append("ед.мн.ч. ");
        }
        if (this.gender !== MorphGender.UNDEFINED) {
            if (this.gender === MorphGender.MASCULINE) 
                res.append("муж.р. ");
            else if (this.gender === MorphGender.NEUTER) 
                res.append("ср.р. ");
            else if (this.gender === MorphGender.FEMINIE) 
                res.append("жен.р. ");
            else if ((this.gender.value()) === (((MorphGender.MASCULINE.value()) | (MorphGender.NEUTER.value())))) 
                res.append("муж.ср.р. ");
            else if ((this.gender.value()) === (((MorphGender.FEMINIE.value()) | (MorphGender.NEUTER.value())))) 
                res.append("жен.ср.р. ");
            else if ((this.gender.value()) === 7) 
                res.append("муж.жен.ср.р. ");
            else if ((this.gender.value()) === (((MorphGender.FEMINIE.value()) | (MorphGender.MASCULINE.value())))) 
                res.append("муж.жен.р. ");
        }
        if (!this._case.is_undefined) 
            res.append(this._case.toString()).append(" ");
        if (!this.language.is_undefined && MorphLang.ooNoteq(this.language, MorphLang.RU)) 
            res.append(this.language.toString()).append(" ");
        return Utils.trimEndString(res.toString());
    }
    
    copy_to(dst) {
        dst.class0 = new MorphClass(this.class0);
        dst.gender = this.gender;
        dst.number = this.number;
        dst._case = new MorphCase(this._case);
        dst.language = new MorphLang(this.language);
    }
    
    contains_attr(attr_value, cla = null) {
        return false;
    }
    
    clone() {
        let res = new MorphBaseInfo();
        this.copy_to(res);
        return res;
    }
    
    check_accord(v, ignore_gender = false, ignore_number = false) {
        if (MorphLang.ooNoteq(v.language, this.language)) {
            if (MorphLang.ooEq(v.language, MorphLang.UNKNOWN) && MorphLang.ooEq(this.language, MorphLang.UNKNOWN)) 
                return false;
        }
        let num = (v.number.value()) & (this.number.value());
        if (num === (MorphNumber.UNDEFINED.value()) && !ignore_number) {
            if (v.number !== MorphNumber.UNDEFINED && this.number !== MorphNumber.UNDEFINED) {
                if (v.number === MorphNumber.SINGULAR && v._case.is_genitive) {
                    if (this.number === MorphNumber.PLURAL && this._case.is_genitive) {
                        if ((((v.gender.value()) & (MorphGender.MASCULINE.value()))) === (MorphGender.MASCULINE.value())) 
                            return true;
                    }
                }
                return false;
            }
        }
        if (!ignore_gender && num !== (MorphNumber.PLURAL.value())) {
            if ((((v.gender.value()) & (this.gender.value()))) === (MorphGender.UNDEFINED.value())) {
                if (v.gender !== MorphGender.UNDEFINED && this.gender !== MorphGender.UNDEFINED) 
                    return false;
            }
        }
        if ((MorphCase.ooBitand(v._case, this._case)).is_undefined) {
            if (!v._case.is_undefined && !this._case.is_undefined) 
                return false;
        }
        return true;
    }
    
    static _new211(_arg1, _arg2) {
        let res = new MorphBaseInfo();
        res.class0 = _arg1;
        res.number = _arg2;
        return res;
    }
    
    static _new212(_arg1, _arg2) {
        let res = new MorphBaseInfo();
        res.class0 = _arg1;
        res.gender = _arg2;
        return res;
    }
    
    static _new240(_arg1, _arg2, _arg3, _arg4) {
        let res = new MorphBaseInfo();
        res._case = _arg1;
        res.class0 = _arg2;
        res.number = _arg3;
        res.gender = _arg4;
        return res;
    }
    
    static _new468(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new MorphBaseInfo();
        res.class0 = _arg1;
        res.gender = _arg2;
        res.number = _arg3;
        res._case = _arg4;
        res.language = _arg5;
        return res;
    }
    
    static _new564(_arg1, _arg2, _arg3, _arg4) {
        let res = new MorphBaseInfo();
        res.class0 = _arg1;
        res.gender = _arg2;
        res.number = _arg3;
        res.language = _arg4;
        return res;
    }
    
    static _new565(_arg1, _arg2, _arg3) {
        let res = new MorphBaseInfo();
        res.gender = _arg1;
        res._case = _arg2;
        res.number = _arg3;
        return res;
    }
    
    static _new567(_arg1, _arg2, _arg3, _arg4) {
        let res = new MorphBaseInfo();
        res.class0 = _arg1;
        res._case = _arg2;
        res.number = _arg3;
        res.gender = _arg4;
        return res;
    }
    
    static _new568(_arg1, _arg2, _arg3) {
        let res = new MorphBaseInfo();
        res.class0 = _arg1;
        res._case = _arg2;
        res.number = _arg3;
        return res;
    }
    
    static _new571(_arg1, _arg2) {
        let res = new MorphBaseInfo();
        res._case = _arg1;
        res.language = _arg2;
        return res;
    }
    
    static _new583(_arg1) {
        let res = new MorphBaseInfo();
        res.class0 = _arg1;
        return res;
    }
    
    static _new1810(_arg1, _arg2, _arg3) {
        let res = new MorphBaseInfo();
        res._case = _arg1;
        res.gender = _arg2;
        res.number = _arg3;
        return res;
    }
    
    static _new2342(_arg1, _arg2, _arg3) {
        let res = new MorphBaseInfo();
        res.class0 = _arg1;
        res.gender = _arg2;
        res.language = _arg3;
        return res;
    }
    
    static _new2465(_arg1) {
        let res = new MorphBaseInfo();
        res._case = _arg1;
        return res;
    }
    
    static _new2478(_arg1, _arg2) {
        let res = new MorphBaseInfo();
        res._case = _arg1;
        res.gender = _arg2;
        return res;
    }
    
    static _new2492(_arg1, _arg2) {
        let res = new MorphBaseInfo();
        res.gender = _arg1;
        res._case = _arg2;
        return res;
    }
    
    static _new2514(_arg1) {
        let res = new MorphBaseInfo();
        res.gender = _arg1;
        return res;
    }
    
    static _new2561(_arg1, _arg2, _arg3) {
        let res = new MorphBaseInfo();
        res._case = _arg1;
        res.gender = _arg2;
        res.class0 = _arg3;
        return res;
    }
    
    static _new2598(_arg1, _arg2) {
        let res = new MorphBaseInfo();
        res.number = _arg1;
        res.language = _arg2;
        return res;
    }
    
    static _new2603(_arg1, _arg2, _arg3) {
        let res = new MorphBaseInfo();
        res.gender = _arg1;
        res.number = _arg2;
        res.language = _arg3;
        return res;
    }
    
    static _new2605(_arg1, _arg2, _arg3) {
        let res = new MorphBaseInfo();
        res.number = _arg1;
        res.gender = _arg2;
        res.language = _arg3;
        return res;
    }
}


module.exports = MorphBaseInfo