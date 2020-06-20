/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const DateReferent = require("./DateReferent");
const MetaDateRange = require("./internal/MetaDateRange");

/**
 * Сущность, представляющая диапазон дат
 */
class DateRangeReferent extends Referent {
    
    constructor() {
        super(DateRangeReferent.OBJ_TYPENAME);
        this.instance_of = MetaDateRange.GLOBAL_META;
    }
    
    /**
     * [Get] Начало диапазона
     */
    get date_from() {
        return Utils.as(this.get_slot_value(DateRangeReferent.ATTR_FROM), DateReferent);
    }
    /**
     * [Set] Начало диапазона
     */
    set date_from(value) {
        this.add_slot(DateRangeReferent.ATTR_FROM, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Конец диапазона
     */
    get date_to() {
        return Utils.as(this.get_slot_value(DateRangeReferent.ATTR_TO), DateReferent);
    }
    /**
     * [Set] Конец диапазона
     */
    set date_to(value) {
        this.add_slot(DateRangeReferent.ATTR_TO, value, true, 0);
        return value;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let fr = (this.date_from === null ? null : this.date_from._to_string(short_variant, lang, lev, 1));
        let to = (this.date_to === null ? null : this.date_to._to_string(short_variant, lang, lev, 2));
        if (fr !== null && to !== null) 
            return (fr + " " + (this.date_to.century > 0 && this.date_to.year === 0 ? to : to.toLowerCase()));
        if (fr !== null) 
            return fr.toString();
        if (to !== null) 
            return to;
        return ((lang.is_ua ? 'з' : 'с') + " ? по ?");
    }
    
    can_be_equals(obj, typ) {
        let dr = Utils.as(obj, DateRangeReferent);
        if (dr === null) 
            return false;
        if (this.date_from !== null) {
            if (!this.date_from.can_be_equals(dr.date_from, typ)) 
                return false;
        }
        else if (dr.date_from !== null) 
            return false;
        if (this.date_to !== null) {
            if (!this.date_to.can_be_equals(dr.date_to, typ)) 
                return false;
        }
        else if (dr.date_to !== null) 
            return false;
        return true;
    }
    
    /**
     * [Get] Проверка, что диапазон задаёт квартал, возвращает номер 1..4
     */
    get quarter_number() {
        if (this.date_from === null || this.date_to === null || this.date_from.year !== this.date_to.year) 
            return 0;
        let m1 = this.date_from.month;
        let m2 = this.date_to.month;
        if (m1 === 1 && m2 === 3) 
            return 1;
        if (m1 === 4 && m2 === 6) 
            return 2;
        if (m1 === 7 && m2 === 9) 
            return 3;
        if (m1 === 10 && m2 === 12) 
            return 4;
        return 0;
    }
    
    /**
     * [Get] Проверка, что диапазон задаёт полугодие, возвращает номер 1..2
     */
    get halfyear_number() {
        if (this.date_from === null || this.date_to === null || this.date_from.year !== this.date_to.year) 
            return 0;
        let m1 = this.date_from.month;
        let m2 = this.date_to.month;
        if (m1 === 1 && m2 === 6) 
            return 1;
        if (m1 === 7 && m2 === 12) 
            return 2;
        return 0;
    }
    
    static _new724(_arg1, _arg2) {
        let res = new DateRangeReferent();
        res.date_from = _arg1;
        res.date_to = _arg2;
        return res;
    }
    
    static _new730(_arg1) {
        let res = new DateRangeReferent();
        res.date_to = _arg1;
        return res;
    }
    
    static static_constructor() {
        DateRangeReferent.OBJ_TYPENAME = "DATERANGE";
        DateRangeReferent.ATTR_FROM = "FROM";
        DateRangeReferent.ATTR_TO = "TO";
    }
}


DateRangeReferent.static_constructor();

module.exports = DateRangeReferent