/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const MetaUri = require("./internal/MetaUri");

/**
 * URI, а также ISBN, УДК, ББК, ICQ и пр. (всё, что укладывается в СХЕМА:ЗНАЧЕНИЕ)
 */
class UriReferent extends Referent {
    
    constructor() {
        super(UriReferent.OBJ_TYPENAME);
        this.instance_of = MetaUri.global_meta;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        if (this.scheme !== null) {
            let split = ":";
            if (this.scheme === "ISBN" || this.scheme === "ББК" || this.scheme === "УДК") 
                split = " ";
            else if (this.scheme === "http" || this.scheme === "ftp" || this.scheme === "https") 
                split = "://";
            return (this.scheme + split + (Utils.notNull(this.value, "?")));
        }
        else 
            return this.value;
    }
    
    /**
     * [Get] Значение
     */
    get value() {
        return this.get_string_value(UriReferent.ATTR_VALUE);
    }
    /**
     * [Set] Значение
     */
    set value(_value) {
        let val = _value;
        this.add_slot(UriReferent.ATTR_VALUE, val, true, 0);
        return _value;
    }
    
    /**
     * [Get] Схема
     */
    get scheme() {
        return this.get_string_value(UriReferent.ATTR_SCHEME);
    }
    /**
     * [Set] Схема
     */
    set scheme(_value) {
        this.add_slot(UriReferent.ATTR_SCHEME, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Детализация кода (если есть)
     */
    get detail() {
        return this.get_string_value(UriReferent.ATTR_DETAIL);
    }
    /**
     * [Set] Детализация кода (если есть)
     */
    set detail(_value) {
        this.add_slot(UriReferent.ATTR_DETAIL, _value, true, 0);
        return _value;
    }
    
    can_be_equals(obj, typ) {
        let _uri = Utils.as(obj, UriReferent);
        if (_uri === null) 
            return false;
        return Utils.compareStrings(this.value, _uri.value, true) === 0;
    }
    
    static _new2707(_arg1, _arg2) {
        let res = new UriReferent();
        res.scheme = _arg1;
        res.value = _arg2;
        return res;
    }
    
    static _new2710(_arg1, _arg2) {
        let res = new UriReferent();
        res.value = _arg1;
        res.scheme = _arg2;
        return res;
    }
    
    static static_constructor() {
        UriReferent.OBJ_TYPENAME = "URI";
        UriReferent.ATTR_VALUE = "VALUE";
        UriReferent.ATTR_DETAIL = "DETAIL";
        UriReferent.ATTR_SCHEME = "SCHEME";
    }
}


UriReferent.static_constructor();

module.exports = UriReferent