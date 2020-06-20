/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MeasureKind = require("./MeasureKind");
const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const UnitReferent = require("./UnitReferent");
const ReferentClass = require("./../ReferentClass");
const MeasureMeta = require("./internal/MeasureMeta");
const NumberHelper = require("./../core/NumberHelper");
const MeasureHelper = require("./internal/MeasureHelper");

/**
 * Величина или диапазон величин, измеряемая в некоторых единицах
 */
class MeasureReferent extends Referent {
    
    constructor() {
        super(MeasureReferent.OBJ_TYPENAME);
        this.instance_of = MeasureMeta.GLOBAL_META;
    }
    
    /**
     * [Get] Шаблон для значений, например, [1..2], 1x2, 1 ]..1]
     */
    get template() {
        return Utils.notNull(this.get_string_value(MeasureReferent.ATTR_TEMPLATE), "1");
    }
    /**
     * [Set] Шаблон для значений, например, [1..2], 1x2, 1 ]..1]
     */
    set template(value) {
        this.add_slot(MeasureReferent.ATTR_TEMPLATE, value, true, 0);
        return value;
    }
    
    get double_values() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === MeasureReferent.ATTR_VALUE && ((typeof s.value === 'string' || s.value instanceof String))) {
                let d = 0;
                let wrapd1738 = new RefOutArgWrapper();
                let inoutres1739 = MeasureHelper.try_parse_double(Utils.asString(s.value), wrapd1738);
                d = wrapd1738.value;
                if (inoutres1739) 
                    res.push(d);
            }
        }
        return res;
    }
    
    add_value(d) {
        this.add_slot(MeasureReferent.ATTR_VALUE, NumberHelper.double_to_string(d), false, 0);
    }
    
    get units() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === MeasureReferent.ATTR_UNIT && (s.value instanceof UnitReferent)) 
                res.push(Utils.as(s.value, UnitReferent));
        }
        return res;
    }
    
    get kind() {
        let str = this.get_string_value(MeasureReferent.ATTR_KIND);
        if (str === null) 
            return MeasureKind.UNDEFINED;
        try {
            return MeasureKind.of(str);
        } catch (ex1740) {
        }
        return MeasureKind.UNDEFINED;
    }
    set kind(value) {
        if (value !== MeasureKind.UNDEFINED) 
            this.add_slot(MeasureReferent.ATTR_KIND, value.toString().toUpperCase(), true, 0);
        return value;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder(this.template);
        let vals = new Array();
        for (const s of this.slots) {
            if (s.type_name === MeasureReferent.ATTR_VALUE) {
                if ((typeof s.value === 'string' || s.value instanceof String)) {
                    let val = Utils.asString(s.value);
                    if (val === "NaN") 
                        val = "?";
                    vals.push(val);
                }
                else if (s.value instanceof Referent) 
                    vals.push((s.value).to_string(true, lang, 0));
            }
        }
        for (let i = res.length - 1; i >= 0; i--) {
            let ch = res.charAt(i);
            if (!Utils.isDigit(ch)) 
                continue;
            let j = ((ch.charCodeAt(0)) - ('1'.charCodeAt(0)));
            if ((j < 0) || j >= vals.length) 
                continue;
            res.remove(i, 1);
            res.insert(i, vals[j]);
        }
        this.out_units(res, lang);
        if (!short_variant) {
            let nam = this.get_string_value(MeasureReferent.ATTR_NAME);
            if (nam !== null) 
                res.append(" - ").append(nam);
            for (const s of this.slots) {
                if (s.type_name === MeasureReferent.ATTR_REF && (s.value instanceof MeasureReferent)) 
                    res.append(" / ").append((s.value).to_string(true, lang, 0));
            }
            let ki = this.kind;
            if (ki !== MeasureKind.UNDEFINED) 
                res.append(" (").append(ki.toString().toUpperCase()).append(")");
        }
        return res.toString();
    }
    
    out_units(res, lang = null) {
        let uu = this.units;
        if (uu.length === 0) 
            return;
        res.append(uu[0].to_string(true, lang, 0));
        for (let i = 1; i < uu.length; i++) {
            let pow = uu[i].get_string_value(UnitReferent.ATTR_POW);
            if (!Utils.isNullOrEmpty(pow) && pow[0] === '-') {
                res.append("/").append(uu[i].to_string(true, lang, 1));
                if (pow !== "-1") 
                    res.append("<").append(pow.substring(1)).append(">");
            }
            else 
                res.append("*").append(uu[i].to_string(true, lang, 0));
        }
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        let mr = Utils.as(obj, MeasureReferent);
        if (mr === null) 
            return false;
        if (this.template !== mr.template) 
            return false;
        let vals1 = this.get_string_values(MeasureReferent.ATTR_VALUE);
        let vals2 = mr.get_string_values(MeasureReferent.ATTR_VALUE);
        if (vals1.length !== vals2.length) 
            return false;
        for (let i = 0; i < vals2.length; i++) {
            if (vals1[i] !== vals2[i]) 
                return false;
        }
        let units1 = this.units;
        let units2 = mr.units;
        if (units1.length !== units2.length) 
            return false;
        for (let i = 0; i < units2.length; i++) {
            if (units1[i] !== units2[i]) 
                return false;
        }
        for (const s of this.slots) {
            if (s.type_name === MeasureReferent.ATTR_REF || s.type_name === MeasureReferent.ATTR_NAME) {
                if (mr.find_slot(s.type_name, s.value, true) === null) 
                    return false;
            }
        }
        for (const s of mr.slots) {
            if (s.type_name === MeasureReferent.ATTR_REF || s.type_name === MeasureReferent.ATTR_NAME) {
                if (this.find_slot(s.type_name, s.value, true) === null) 
                    return false;
            }
        }
        return true;
    }
    
    static static_constructor() {
        MeasureReferent.OBJ_TYPENAME = "MEASURE";
        MeasureReferent.ATTR_TEMPLATE = "TEMPLATE";
        MeasureReferent.ATTR_VALUE = "VALUE";
        MeasureReferent.ATTR_UNIT = "UNIT";
        MeasureReferent.ATTR_REF = "REF";
        MeasureReferent.ATTR_NAME = "NAME";
        MeasureReferent.ATTR_KIND = "KIND";
    }
}


MeasureReferent.static_constructor();

module.exports = MeasureReferent