/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const IntOntologyItem = require("./../core/IntOntologyItem");
const Termin = require("./../core/Termin");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const GoodAttrType = require("./GoodAttrType");
const AttrMeta = require("./internal/AttrMeta");

/**
 * Атрибут товара
 */
class GoodAttributeReferent extends Referent {
    
    constructor() {
        super(GoodAttributeReferent.OBJ_TYPENAME);
        this.instance_of = AttrMeta.GLOBAL_META;
    }
    
    /**
     * [Get] Тип атрибута
     */
    get typ() {
        let str = this.get_string_value(GoodAttributeReferent.ATTR_TYPE);
        if (str === null) 
            return GoodAttrType.UNDEFINED;
        try {
            return GoodAttrType.of(str);
        } catch (ex1337) {
        }
        return GoodAttrType.UNDEFINED;
    }
    /**
     * [Set] Тип атрибута
     */
    set typ(value) {
        this.add_slot(GoodAttributeReferent.ATTR_TYPE, value.toString().toUpperCase(), true, 0);
        return value;
    }
    
    /**
     * [Get] Значения
     */
    get values() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === GoodAttributeReferent.ATTR_VALUE && ((typeof s.value === 'string' || s.value instanceof String))) {
                let v = Utils.asString(s.value);
                if (v.indexOf('(') > 0) {
                    if (this.typ === GoodAttrType.NUMERIC) 
                        v = v.substring(0, 0 + v.indexOf('(')).trim();
                }
                res.push(v);
            }
        }
        return res;
    }
    
    /**
     * [Get] Значения
     */
    get alt_values() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === GoodAttributeReferent.ATTR_ALTVALUE && ((typeof s.value === 'string' || s.value instanceof String))) 
                res.push(Utils.asString(s.value));
        }
        return res;
    }
    
    /**
     * [Get] Единицы измерения
     */
    get units() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === GoodAttributeReferent.ATTR_UNIT && ((typeof s.value === 'string' || s.value instanceof String))) 
                res.push(Utils.asString(s.value));
        }
        return res;
    }
    
    /**
     * [Get] Ссылка на внушнюю сущность
     */
    get ref() {
        return Utils.as(this.get_slot_value(GoodAttributeReferent.ATTR_REF), Referent);
    }
    /**
     * [Set] Ссылка на внушнюю сущность
     */
    set ref(value) {
        this.add_slot(GoodAttributeReferent.ATTR_REF, value, true, 0);
        return value;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        let _typ = this.typ;
        let nam = this.get_string_value(GoodAttributeReferent.ATTR_NAME);
        if (!short_variant) {
            if (_typ !== GoodAttrType.UNDEFINED) 
                res.append(AttrMeta.GLOBAL_META.typ_attr.convert_inner_value_to_outer_value(_typ, lang)).append((nam === null ? "" : (" (" + nam.toLowerCase() + ")"))).append(": ");
        }
        let s = this.get_string_value(GoodAttributeReferent.ATTR_VALUE);
        if (s !== null) {
            if (_typ === GoodAttrType.KEYWORD || _typ === GoodAttrType.CHARACTER) 
                res.append(s.toLowerCase());
            else if (_typ === GoodAttrType.NUMERIC) {
                let vals = this.values;
                let _units = this.units;
                for (let i = 0; i < vals.length; i++) {
                    if (i > 0) 
                        res.append(" x ");
                    res.append(vals[i]);
                    if (vals.length === _units.length) 
                        res.append(_units[i].toLowerCase());
                    else if (_units.length > 0) 
                        res.append(_units[0].toLowerCase());
                }
            }
            else 
                res.append(s);
        }
        let re = this.ref;
        if (re !== null) 
            res.append(re.to_string(short_variant, lang, 0));
        return res.toString();
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let a = Utils.as(obj, GoodAttributeReferent);
        if (a === null) 
            return false;
        if (a.typ !== this.typ) 
            return false;
        let u1 = this.get_string_value(GoodAttributeReferent.ATTR_UNIT);
        let u2 = a.get_string_value(GoodAttributeReferent.ATTR_UNIT);
        if (u1 !== null && u2 !== null) {
            if (u1 !== u2) {
                if (u1.length === (u2.length + 1) && u1 === (u2 + ".")) {
                }
                else if (u2.length === (u1.length + 1) && u2 === (u1 + ".")) {
                }
                return false;
            }
        }
        let nam1 = this.get_string_value(GoodAttributeReferent.ATTR_NAME);
        let nam2 = a.get_string_value(GoodAttributeReferent.ATTR_NAME);
        if (nam1 !== null || nam2 !== null) {
            if (nam1 !== nam2) 
                return false;
        }
        let eq = false;
        if (this.ref !== null || a.ref !== null) {
            if (this.ref === null || a.ref === null) 
                return false;
            if (!this.ref.can_be_equals(a.ref, _typ)) 
                return false;
            eq = true;
        }
        if (this.typ !== GoodAttrType.NUMERIC) {
            for (const s of this.slots) {
                if (s.type_name === GoodAttributeReferent.ATTR_VALUE || s.type_name === GoodAttributeReferent.ATTR_ALTVALUE) {
                    if (a.find_slot(GoodAttributeReferent.ATTR_VALUE, s.value, true) !== null || a.find_slot(GoodAttributeReferent.ATTR_ALTVALUE, s.value, true) !== null) {
                        eq = true;
                        break;
                    }
                }
            }
        }
        else {
            let vals1 = this.values;
            let vals2 = a.values;
            if (vals1.length !== vals2.length) 
                return false;
            for (const v of vals1) {
                if (!vals2.includes(v)) 
                    return false;
            }
        }
        if (!eq) 
            return false;
        return true;
    }
    
    merge_slots(obj, merge_statistic = true) {
        super.merge_slots(obj, merge_statistic);
        for (let i = this.slots.length - 1; i >= 0; i--) {
            if (this.slots[i].type_name === GoodAttributeReferent.ATTR_ALTVALUE) {
                if (this.find_slot(GoodAttributeReferent.ATTR_VALUE, this.slots[i].value, true) !== null) 
                    this.slots.splice(i, 1);
            }
        }
    }
    
    create_ontology_item() {
        let re = new IntOntologyItem(this);
        for (const s of this.slots) {
            if (s.type_name === GoodAttributeReferent.ATTR_VALUE || s.type_name === GoodAttributeReferent.ATTR_ALTVALUE) 
                re.termins.push(new Termin(Utils.asString(s.value)));
        }
        return re;
    }
    
    static static_constructor() {
        GoodAttributeReferent.OBJ_TYPENAME = "GOODATTR";
        GoodAttributeReferent.ATTR_TYPE = "TYPE";
        GoodAttributeReferent.ATTR_VALUE = "VALUE";
        GoodAttributeReferent.ATTR_ALTVALUE = "ALTVALUE";
        GoodAttributeReferent.ATTR_UNIT = "UNIT";
        GoodAttributeReferent.ATTR_NAME = "NAME";
        GoodAttributeReferent.ATTR_REF = "REF";
    }
}


GoodAttributeReferent.static_constructor();

module.exports = GoodAttributeReferent