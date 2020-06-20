/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const LanguageHelper = require("./../../morph/LanguageHelper");
const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const MiscHelper = require("./../core/MiscHelper");
const ReferentClass = require("./../ReferentClass");
const MetaWeapon = require("./internal/MetaWeapon");

/**
 * Оружие
 */
class WeaponReferent extends Referent {
    
    constructor() {
        super(WeaponReferent.OBJ_TYPENAME);
        this.instance_of = MetaWeapon.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        let str = null;
        for (const s of this.slots) {
            if (s.type_name === WeaponReferent.ATTR_TYPE) {
                let n = String(s.value);
                if (str === null || (n.length < str.length)) 
                    str = n;
            }
        }
        if (str !== null) 
            res.append(str.toLowerCase());
        if ((((str = this.get_string_value(WeaponReferent.ATTR_BRAND)))) !== null) 
            res.append(" ").append(MiscHelper.convert_first_char_upper_and_other_lower(str));
        if ((((str = this.get_string_value(WeaponReferent.ATTR_MODEL)))) !== null) 
            res.append(" ").append(str);
        if ((((str = this.get_string_value(WeaponReferent.ATTR_NAME)))) !== null) {
            res.append(" \"").append(MiscHelper.convert_first_char_upper_and_other_lower(str)).append("\"");
            for (const s of this.slots) {
                if (s.type_name === WeaponReferent.ATTR_NAME && str !== (String(s.value))) {
                    if (LanguageHelper.is_cyrillic_char(str[0]) !== LanguageHelper.is_cyrillic_char((String(s.value))[0])) {
                        res.append(" (").append(MiscHelper.convert_first_char_upper_and_other_lower(String(s.value))).append(")");
                        break;
                    }
                }
            }
        }
        if ((((str = this.get_string_value(WeaponReferent.ATTR_NUMBER)))) !== null) 
            res.append(", номер ").append(str);
        return res.toString();
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        let tr = Utils.as(obj, WeaponReferent);
        if (tr === null) 
            return false;
        let s1 = this.get_string_value(WeaponReferent.ATTR_NUMBER);
        let s2 = tr.get_string_value(WeaponReferent.ATTR_NUMBER);
        if (s1 !== null || s2 !== null) {
            if (s1 === null || s2 === null) {
                if (typ === ReferentEqualType.DIFFERENTTEXTS) 
                    return false;
            }
            else {
                if (s1 !== s2) 
                    return false;
                return true;
            }
        }
        let eq_types = false;
        for (const t of this.get_string_values(WeaponReferent.ATTR_TYPE)) {
            if (tr.find_slot(WeaponReferent.ATTR_TYPE, t, true) !== null) {
                eq_types = true;
                break;
            }
        }
        if (!eq_types) 
            return false;
        s1 = this.get_string_value(WeaponReferent.ATTR_BRAND);
        s2 = tr.get_string_value(WeaponReferent.ATTR_BRAND);
        if (s1 !== null || s2 !== null) {
            if (s1 === null || s2 === null) {
                if (typ === ReferentEqualType.DIFFERENTTEXTS) 
                    return false;
            }
            else if (s1 !== s2) 
                return false;
        }
        s1 = this.get_string_value(WeaponReferent.ATTR_MODEL);
        s2 = tr.get_string_value(WeaponReferent.ATTR_MODEL);
        if (s1 !== null || s2 !== null) {
            if (s1 === null || s2 === null) {
                if (typ === ReferentEqualType.DIFFERENTTEXTS) 
                    return false;
            }
            else {
                if (this.find_slot(WeaponReferent.ATTR_MODEL, s2, true) !== null) 
                    return true;
                if (tr.find_slot(WeaponReferent.ATTR_MODEL, s1, true) !== null) 
                    return true;
                return false;
            }
        }
        for (const s of this.slots) {
            if (s.type_name === WeaponReferent.ATTR_NAME) {
                if (tr.find_slot(WeaponReferent.ATTR_NAME, s.value, true) !== null) 
                    return true;
            }
        }
        if (s1 !== null && s2 !== null) 
            return true;
        return false;
    }
    
    merge_slots(obj, merge_statistic = true) {
        super.merge_slots(obj, merge_statistic);
    }
    
    static static_constructor() {
        WeaponReferent.OBJ_TYPENAME = "WEAPON";
        WeaponReferent.ATTR_TYPE = "TYPE";
        WeaponReferent.ATTR_BRAND = "BRAND";
        WeaponReferent.ATTR_MODEL = "MODEL";
        WeaponReferent.ATTR_NAME = "NAME";
        WeaponReferent.ATTR_NUMBER = "NUMBER";
        WeaponReferent.ATTR_DATE = "DATE";
        WeaponReferent.ATTR_REF = "REF";
        WeaponReferent.ATTR_CALIBER = "CALIBER";
    }
}


WeaponReferent.static_constructor();

module.exports = WeaponReferent