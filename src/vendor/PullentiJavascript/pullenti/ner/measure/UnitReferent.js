/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const ReferentEqualType = require("./../ReferentEqualType");
const LanguageHelper = require("./../../morph/LanguageHelper");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const UnitMeta = require("./internal/UnitMeta");

/**
 * Ежиница измерения
 */
class UnitReferent extends Referent {
    
    constructor() {
        super(UnitReferent.OBJ_TYPENAME);
        this.m_unit = null;
        this.instance_of = UnitMeta.GLOBAL_META;
    }
    
    get parent_referent() {
        return Utils.as(this.get_slot_value(UnitReferent.ATTR_BASEUNIT), Referent);
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let nam = null;
        for (let l_ = 0; l_ < 2; l_++) {
            for (const s of this.slots) {
                if (((s.type_name === UnitReferent.ATTR_NAME && short_variant)) || ((s.type_name === UnitReferent.ATTR_FULLNAME && !short_variant))) {
                    let val = Utils.asString(s.value);
                    if (lang !== null && l_ === 0) {
                        if (lang.is_ru !== LanguageHelper.is_cyrillic(val)) 
                            continue;
                    }
                    nam = val;
                    break;
                }
            }
            if (nam !== null) 
                break;
        }
        if (nam === null) 
            nam = this.get_string_value(UnitReferent.ATTR_NAME);
        let pow = this.get_string_value(UnitReferent.ATTR_POW);
        if (Utils.isNullOrEmpty(pow) || lev > 0) 
            return (nam != null ? nam : "?");
        let res = ((pow[0] !== '-') ? (nam + pow) : (nam + "<" + pow + ">"));
        if (!short_variant && this.is_unknown) 
            res = "(?)" + res;
        return res;
    }
    
    /**
     * [Get] Признак того, что это неизвестная метрика
     */
    get is_unknown() {
        return this.get_string_value(UnitReferent.ATTR_UNKNOWN) === "true";
    }
    /**
     * [Set] Признак того, что это неизвестная метрика
     */
    set is_unknown(value) {
        this.add_slot(UnitReferent.ATTR_UNKNOWN, (value ? "true" : null), true, 0);
        return value;
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        let ur = Utils.as(obj, UnitReferent);
        if (ur === null) 
            return false;
        for (const s of this.slots) {
            if (ur.find_slot(s.type_name, s.value, true) === null) 
                return false;
        }
        for (const s of ur.slots) {
            if (this.find_slot(s.type_name, s.value, true) === null) 
                return false;
        }
        return true;
    }
    
    static static_constructor() {
        UnitReferent.OBJ_TYPENAME = "MEASUREUNIT";
        UnitReferent.ATTR_FULLNAME = "FULLNAME";
        UnitReferent.ATTR_NAME = "NAME";
        UnitReferent.ATTR_POW = "POW";
        UnitReferent.ATTR_BASEFACTOR = "BASEFACTOR";
        UnitReferent.ATTR_BASEUNIT = "BASEUNIT";
        UnitReferent.ATTR_UNKNOWN = "UNKNOWN";
    }
}


UnitReferent.static_constructor();

module.exports = UnitReferent