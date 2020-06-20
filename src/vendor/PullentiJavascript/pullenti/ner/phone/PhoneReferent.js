/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const LanguageHelper = require("./../../morph/LanguageHelper");
const MetaPhone = require("./internal/MetaPhone");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const PhoneKind = require("./PhoneKind");

/**
 * Сущность, представляющая телефонные номера
 */
class PhoneReferent extends Referent {
    
    constructor() {
        super(PhoneReferent.OBJ_TYPENAME);
        this.m_template = null;
        this.instance_of = MetaPhone.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        if (this.country_code !== null) 
            res.append((this.country_code !== "8" ? "+" : "")).append(this.country_code).append(" ");
        let num = this.number;
        if (num !== null && num.length >= 9) {
            let cou = 3;
            if (num.length >= 11) 
                cou = num.length - 7;
            res.append("(").append(num.substring(0, 0 + cou)).append(") ");
            num = num.substring(cou);
        }
        else if (num !== null && num.length === 8) {
            res.append("(").append(num.substring(0, 0 + 2)).append(") ");
            num = num.substring(2);
        }
        if (num === null) 
            res.append("???-??-??");
        else {
            res.append(num);
            if (num.length > 5) {
                res.insert(res.length - 4, '-');
                res.insert(res.length - 2, '-');
            }
        }
        if (this.add_number !== null) 
            res.append(" (доб.").append(this.add_number).append(")");
        return res.toString();
    }
    
    /**
     * [Get] Основной номер (без кода города)
     */
    get number() {
        return this.get_string_value(PhoneReferent.ATTR_NUNBER);
    }
    /**
     * [Set] Основной номер (без кода города)
     */
    set number(value) {
        this.add_slot(PhoneReferent.ATTR_NUNBER, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Добавочный номер (если есть)
     */
    get add_number() {
        return this.get_string_value(PhoneReferent.ATTR_ADDNUMBER);
    }
    /**
     * [Set] Добавочный номер (если есть)
     */
    set add_number(value) {
        this.add_slot(PhoneReferent.ATTR_ADDNUMBER, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Код страны
     */
    get country_code() {
        return this.get_string_value(PhoneReferent.ATTR_COUNTRYCODE);
    }
    /**
     * [Set] Код страны
     */
    set country_code(value) {
        this.add_slot(PhoneReferent.ATTR_COUNTRYCODE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Тип телефона
     */
    get kind() {
        let str = this.get_string_value(PhoneReferent.ATTR_KIND);
        if (str === null) 
            return PhoneKind.UNDEFINED;
        try {
            return PhoneKind.of(str);
        } catch (ex) {
            return PhoneKind.UNDEFINED;
        }
    }
    /**
     * [Set] Тип телефона
     */
    set kind(value) {
        if (value !== PhoneKind.UNDEFINED) 
            this.add_slot(PhoneReferent.ATTR_KIND, value.toString().toLowerCase(), true, 0);
        return value;
    }
    
    get_compare_strings() {
        let num = this.number;
        if (num === null) 
            return null;
        if (num.length > 9) 
            num = num.substring(9);
        let res = new Array();
        res.push(num);
        let add = this.add_number;
        if (add !== null) 
            res.push((num + "*" + add));
        return res;
    }
    
    can_be_equals(obj, typ) {
        return this._can_be_equal(obj, typ, false);
    }
    
    _can_be_equal(obj, typ, ignore_add_number) {
        let ph = Utils.as(obj, PhoneReferent);
        if (ph === null) 
            return false;
        if (ph.country_code !== null && this.country_code !== null) {
            if (ph.country_code !== this.country_code) 
                return false;
        }
        if (ignore_add_number) {
            if (this.add_number !== null && ph.add_number !== null) {
                if (ph.add_number !== this.add_number) 
                    return false;
            }
        }
        else if (this.add_number !== null || ph.add_number !== null) {
            if (this.add_number !== ph.add_number) 
                return false;
        }
        if (this.number === null || ph.number === null) 
            return false;
        if (this.number === ph.number) 
            return true;
        if (typ !== ReferentEqualType.DIFFERENTTEXTS) {
            if (LanguageHelper.ends_with(this.number, ph.number) || LanguageHelper.ends_with(ph.number, this.number)) 
                return true;
        }
        return false;
    }
    
    can_be_general_for(obj) {
        if (!this._can_be_equal(obj, ReferentEqualType.WITHINONETEXT, true)) 
            return false;
        let ph = Utils.as(obj, PhoneReferent);
        if (this.country_code !== null && ph.country_code === null) 
            return false;
        if (this.add_number === null) {
            if (ph.add_number !== null) 
                return true;
        }
        else if (ph.add_number === null) 
            return false;
        if (LanguageHelper.ends_with(ph.number, this.number)) 
            return true;
        return false;
    }
    
    merge_slots(obj, merge_statistic = true) {
        let ph = Utils.as(obj, PhoneReferent);
        if (ph === null) 
            return;
        if (ph.country_code !== null && this.country_code === null) 
            this.country_code = ph.country_code;
        if (ph.number !== null && LanguageHelper.ends_with(ph.number, this.number)) 
            this.number = ph.number;
    }
    
    correct() {
        if (this.kind === PhoneKind.UNDEFINED) {
            if (this.find_slot(PhoneReferent.ATTR_ADDNUMBER, null, true) !== null) 
                this.kind = PhoneKind.WORK;
            else if (this.country_code === null || this.country_code === "7") {
                let num = this.number;
                if (num.length === 10 && num[0] === '9') 
                    this.kind = PhoneKind.MOBILE;
            }
        }
    }
    
    static static_constructor() {
        PhoneReferent.OBJ_TYPENAME = "PHONE";
        PhoneReferent.ATTR_NUNBER = "NUMBER";
        PhoneReferent.ATTR_KIND = "KIND";
        PhoneReferent.ATTR_COUNTRYCODE = "COUNTRYCODE";
        PhoneReferent.ATTR_ADDNUMBER = "ADDNUMBER";
    }
}


PhoneReferent.static_constructor();

module.exports = PhoneReferent