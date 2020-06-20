/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const NumberHelper = require("./../core/NumberHelper");
const ReferentClass = require("./../ReferentClass");
const MoneyMeta = require("./internal/MoneyMeta");

/**
 * Представление денежных сумм
 */
class MoneyReferent extends Referent {
    
    constructor() {
        super(MoneyReferent.OBJ_TYPENAME);
        this.instance_of = MoneyMeta.GLOBAL_META;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        let v = this.get_string_value(MoneyReferent.ATTR_VALUE);
        let r = this.rest;
        if (v !== null || r > 0) {
            res.append((v != null ? v : "0"));
            let cou = 0;
            for (let i = res.length - 1; i > 0; i--) {
                if ((++cou) === 3) {
                    res.insert(i, '.');
                    cou = 0;
                }
            }
        }
        else 
            res.append("?");
        if (r > 0) 
            res.append(",").append(Utils.correctToString((r).toString(10), 2, true));
        res.append(" ").append(this.currency);
        return res.toString();
    }
    
    /**
     * [Get] Тип валюты (3-х значный код ISO 4217)
     */
    get currency() {
        return this.get_string_value(MoneyReferent.ATTR_CURRENCY);
    }
    /**
     * [Set] Тип валюты (3-х значный код ISO 4217)
     */
    set currency(_value) {
        this.add_slot(MoneyReferent.ATTR_CURRENCY, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Значение
     */
    get value() {
        let val = this.get_string_value(MoneyReferent.ATTR_VALUE);
        if (val === null) 
            return 0;
        let v = 0;
        let wrapv1741 = new RefOutArgWrapper();
        let inoutres1742 = Utils.tryParseFloat(val, wrapv1741);
        v = wrapv1741.value;
        if (!inoutres1742) 
            return 0;
        return v;
    }
    
    /**
     * [Get] Альтернативное значение (если есть, то значит неправильно написали сумму 
     *  числом и далее прописью в скобках)
     */
    get alt_value() {
        let val = this.get_string_value(MoneyReferent.ATTR_ALTVALUE);
        if (val === null) 
            return null;
        let v = 0;
        let wrapv1743 = new RefOutArgWrapper();
        let inoutres1744 = Utils.tryParseFloat(val, wrapv1743);
        v = wrapv1743.value;
        if (!inoutres1744) 
            return null;
        return v;
    }
    
    /**
     * [Get] Остаток (от 0 до 99) - копеек, центов и т.п.
     */
    get rest() {
        let val = this.get_string_value(MoneyReferent.ATTR_REST);
        if (val === null) 
            return 0;
        let v = 0;
        let wrapv1745 = new RefOutArgWrapper();
        let inoutres1746 = Utils.tryParseInt(val, wrapv1745);
        v = wrapv1745.value;
        if (!inoutres1746) 
            return 0;
        return v;
    }
    
    /**
     * [Get] Остаток (от 0 до 99) - копеек, центов и т.п.
     */
    get alt_rest() {
        let val = this.get_string_value(MoneyReferent.ATTR_ALTREST);
        if (val === null) 
            return null;
        let v = 0;
        let wrapv1747 = new RefOutArgWrapper();
        let inoutres1748 = Utils.tryParseInt(val, wrapv1747);
        v = wrapv1747.value;
        if (!inoutres1748) 
            return null;
        return v;
    }
    
    /**
     * [Get] Действительное значение (вместе с копейками)
     */
    get real_value() {
        return (this.value) + (((this.rest) / (100)));
    }
    /**
     * [Set] Действительное значение (вместе с копейками)
     */
    set real_value(_value) {
        let val = NumberHelper.double_to_string(_value);
        let ii = val.indexOf('.');
        if (ii > 0) 
            val = val.substring(0, 0 + ii);
        this.add_slot(MoneyReferent.ATTR_VALUE, val, true, 0);
        let re = ((_value - this.value)) * (100);
        this.add_slot(MoneyReferent.ATTR_REST, (Math.floor((re + 0.0001))).toString(), true, 0);
        return _value;
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        let s = Utils.as(obj, MoneyReferent);
        if (s === null) 
            return false;
        if (s.currency !== this.currency) 
            return false;
        if (s.value !== this.value) 
            return false;
        if (s.rest !== this.rest) 
            return false;
        if (s.alt_value !== this.alt_value) 
            return false;
        if (s.alt_rest !== this.alt_rest) 
            return false;
        return true;
    }
    
    static _new836(_arg1, _arg2) {
        let res = new MoneyReferent();
        res.currency = _arg1;
        res.real_value = _arg2;
        return res;
    }
    
    static static_constructor() {
        MoneyReferent.OBJ_TYPENAME = "MONEY";
        MoneyReferent.ATTR_CURRENCY = "CURRENCY";
        MoneyReferent.ATTR_VALUE = "VALUE";
        MoneyReferent.ATTR_ALTVALUE = "ALTVALUE";
        MoneyReferent.ATTR_REST = "REST";
        MoneyReferent.ATTR_ALTREST = "ALTREST";
    }
}


MoneyReferent.static_constructor();

module.exports = MoneyReferent