/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Атрибуты функции CanBeEqualsEx
 */
class CanBeEqualsAttrs {

    constructor(val, str) {
        this.m_val = val;
        this.m_str = str;
    }
    toString() {
        return this.m_str;
    }
    value() {
        return this.m_val;
    }
    static of(val) {
        if(val instanceof CanBeEqualsAttrs) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(CanBeEqualsAttrs.mapStringToEnum.containsKey(val))
                return CanBeEqualsAttrs.mapStringToEnum.get(val);
            return null;
        }
        if(CanBeEqualsAttrs.mapIntToEnum.containsKey(val))
            return CanBeEqualsAttrs.mapIntToEnum.get(val);
        let it = new CanBeEqualsAttrs(val, val.toString());
        CanBeEqualsAttrs.mapIntToEnum.put(val, it);
        CanBeEqualsAttrs.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return CanBeEqualsAttrs.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return CanBeEqualsAttrs.m_Values;
    }
    static static_constructor() {
        CanBeEqualsAttrs.mapIntToEnum = new Hashtable();
        CanBeEqualsAttrs.mapStringToEnum = new Hashtable();
        CanBeEqualsAttrs.NO = new CanBeEqualsAttrs(0, "NO");
        CanBeEqualsAttrs.mapIntToEnum.put(CanBeEqualsAttrs.NO.value(), CanBeEqualsAttrs.NO); 
        CanBeEqualsAttrs.mapStringToEnum.put(CanBeEqualsAttrs.NO.m_str.toUpperCase(), CanBeEqualsAttrs.NO); 
        CanBeEqualsAttrs.IGNORENONLETTERS = new CanBeEqualsAttrs(1, "IGNORENONLETTERS");
        CanBeEqualsAttrs.mapIntToEnum.put(CanBeEqualsAttrs.IGNORENONLETTERS.value(), CanBeEqualsAttrs.IGNORENONLETTERS); 
        CanBeEqualsAttrs.mapStringToEnum.put(CanBeEqualsAttrs.IGNORENONLETTERS.m_str.toUpperCase(), CanBeEqualsAttrs.IGNORENONLETTERS); 
        CanBeEqualsAttrs.IGNOREUPPERCASE = new CanBeEqualsAttrs(2, "IGNOREUPPERCASE");
        CanBeEqualsAttrs.mapIntToEnum.put(CanBeEqualsAttrs.IGNOREUPPERCASE.value(), CanBeEqualsAttrs.IGNOREUPPERCASE); 
        CanBeEqualsAttrs.mapStringToEnum.put(CanBeEqualsAttrs.IGNOREUPPERCASE.m_str.toUpperCase(), CanBeEqualsAttrs.IGNOREUPPERCASE); 
        CanBeEqualsAttrs.CHECKMORPHEQUAFTERFIRSTNOUN = new CanBeEqualsAttrs(4, "CHECKMORPHEQUAFTERFIRSTNOUN");
        CanBeEqualsAttrs.mapIntToEnum.put(CanBeEqualsAttrs.CHECKMORPHEQUAFTERFIRSTNOUN.value(), CanBeEqualsAttrs.CHECKMORPHEQUAFTERFIRSTNOUN); 
        CanBeEqualsAttrs.mapStringToEnum.put(CanBeEqualsAttrs.CHECKMORPHEQUAFTERFIRSTNOUN.m_str.toUpperCase(), CanBeEqualsAttrs.CHECKMORPHEQUAFTERFIRSTNOUN); 
        CanBeEqualsAttrs.USEBRACKETS = new CanBeEqualsAttrs(8, "USEBRACKETS");
        CanBeEqualsAttrs.mapIntToEnum.put(CanBeEqualsAttrs.USEBRACKETS.value(), CanBeEqualsAttrs.USEBRACKETS); 
        CanBeEqualsAttrs.mapStringToEnum.put(CanBeEqualsAttrs.USEBRACKETS.m_str.toUpperCase(), CanBeEqualsAttrs.USEBRACKETS); 
        CanBeEqualsAttrs.IGNOREUPPERCASEFIRSTWORD = new CanBeEqualsAttrs(0x10, "IGNOREUPPERCASEFIRSTWORD");
        CanBeEqualsAttrs.mapIntToEnum.put(CanBeEqualsAttrs.IGNOREUPPERCASEFIRSTWORD.value(), CanBeEqualsAttrs.IGNOREUPPERCASEFIRSTWORD); 
        CanBeEqualsAttrs.mapStringToEnum.put(CanBeEqualsAttrs.IGNOREUPPERCASEFIRSTWORD.m_str.toUpperCase(), CanBeEqualsAttrs.IGNOREUPPERCASEFIRSTWORD); 
        CanBeEqualsAttrs.FIRSTCANBESHORTER = new CanBeEqualsAttrs(0x20, "FIRSTCANBESHORTER");
        CanBeEqualsAttrs.mapIntToEnum.put(CanBeEqualsAttrs.FIRSTCANBESHORTER.value(), CanBeEqualsAttrs.FIRSTCANBESHORTER); 
        CanBeEqualsAttrs.mapStringToEnum.put(CanBeEqualsAttrs.FIRSTCANBESHORTER.m_str.toUpperCase(), CanBeEqualsAttrs.FIRSTCANBESHORTER); 
        CanBeEqualsAttrs.m_Values = Array.from(CanBeEqualsAttrs.mapIntToEnum.values);
        CanBeEqualsAttrs.m_Keys = Array.from(CanBeEqualsAttrs.mapIntToEnum.keys);
    }
}


CanBeEqualsAttrs.static_constructor();

module.exports = CanBeEqualsAttrs