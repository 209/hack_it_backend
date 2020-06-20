/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const DecreeChangeValueKind = require("./DecreeChangeValueKind");
const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const DecreePartReferent = require("./DecreePartReferent");
const MetaDecreeChangeValue = require("./internal/MetaDecreeChangeValue");

/**
 * Значение изменения СЭ НПА
 */
class DecreeChangeValueReferent extends Referent {
    
    constructor() {
        super(DecreeChangeValueReferent.OBJ_TYPENAME);
        this.instance_of = MetaDecreeChangeValue.GLOBAL_META;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        let nws = this.new_items;
        if (nws.length > 0) {
            for (const p of nws) {
                let dpr = new DecreePartReferent();
                let ii = p.indexOf(' ');
                if (ii < 0) 
                    dpr.add_slot(p, "", false, 0);
                else 
                    dpr.add_slot(p.substring(0, 0 + ii), p.substring(ii + 1), false, 0);
                res.append(" новый '").append(dpr.to_string(true, null, 0)).append("'");
            }
        }
        if (this.kind !== DecreeChangeValueKind.UNDEFINED) 
            res.append(" ").append(MetaDecreeChangeValue.KIND_FEATURE.convert_inner_value_to_outer_value(this.kind, lang).toString().toLowerCase());
        if (this.number !== null) 
            res.append(" ").append(this.number);
        let val = this.value;
        if (val !== null) {
            if (val.length > 100) 
                val = val.substring(0, 0 + 100) + "...";
            res.append(" '").append(val).append("'");
            res.replace('\n', ' ');
            res.replace('\r', ' ');
        }
        return res.toString().trim();
    }
    
    /**
     * [Get] Тип значение
     */
    get kind() {
        let s = this.get_string_value(DecreeChangeValueReferent.ATTR_KIND);
        if (s === null) 
            return DecreeChangeValueKind.UNDEFINED;
        try {
            let res = DecreeChangeValueKind.of(s);
            if (res instanceof DecreeChangeValueKind) 
                return DecreeChangeValueKind.of(res);
        } catch (ex1110) {
        }
        return DecreeChangeValueKind.UNDEFINED;
    }
    /**
     * [Set] Тип значение
     */
    set kind(_value) {
        if (_value !== DecreeChangeValueKind.UNDEFINED) 
            this.add_slot(DecreeChangeValueReferent.ATTR_KIND, _value.toString(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Значение
     */
    get value() {
        return this.get_string_value(DecreeChangeValueReferent.ATTR_VALUE);
    }
    /**
     * [Set] Значение
     */
    set value(_value) {
        this.add_slot(DecreeChangeValueReferent.ATTR_VALUE, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Номер (для предложений и сносок)
     */
    get number() {
        return this.get_string_value(DecreeChangeValueReferent.ATTR_NUMBER);
    }
    /**
     * [Set] Номер (для предложений и сносок)
     */
    set number(_value) {
        this.add_slot(DecreeChangeValueReferent.ATTR_NUMBER, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Новые структурные элементы, которые добавляются этим значением  
     *  (дополнить ... статьями 10.1 и 10.2 следующего содержания)
     */
    get new_items() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === DecreeChangeValueReferent.ATTR_NEWITEM && ((typeof s.value === 'string' || s.value instanceof String))) 
                res.push(Utils.asString(s.value));
        }
        return res;
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        return obj === this;
    }
    
    static _new800(_arg1) {
        let res = new DecreeChangeValueReferent();
        res.kind = _arg1;
        return res;
    }
    
    static static_constructor() {
        DecreeChangeValueReferent.OBJ_TYPENAME = "DECREECHANGEVALUE";
        DecreeChangeValueReferent.ATTR_KIND = "KIND";
        DecreeChangeValueReferent.ATTR_VALUE = "VALUE";
        DecreeChangeValueReferent.ATTR_NUMBER = "NUMBER";
        DecreeChangeValueReferent.ATTR_NEWITEM = "NEWITEM";
    }
}


DecreeChangeValueReferent.static_constructor();

module.exports = DecreeChangeValueReferent