/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

class SentItemSubtype {

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
        if(val instanceof SentItemSubtype) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(SentItemSubtype.mapStringToEnum.containsKey(val))
                return SentItemSubtype.mapStringToEnum.get(val);
            return null;
        }
        if(SentItemSubtype.mapIntToEnum.containsKey(val))
            return SentItemSubtype.mapIntToEnum.get(val);
        let it = new SentItemSubtype(val, val.toString());
        SentItemSubtype.mapIntToEnum.put(val, it);
        SentItemSubtype.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return SentItemSubtype.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return SentItemSubtype.m_Values;
    }
    static static_constructor() {
        SentItemSubtype.mapIntToEnum = new Hashtable();
        SentItemSubtype.mapStringToEnum = new Hashtable();
        SentItemSubtype.UNDEFINED = new SentItemSubtype(0, "UNDEFINED");
        SentItemSubtype.mapIntToEnum.put(SentItemSubtype.UNDEFINED.value(), SentItemSubtype.UNDEFINED); 
        SentItemSubtype.mapStringToEnum.put(SentItemSubtype.UNDEFINED.m_str.toUpperCase(), SentItemSubtype.UNDEFINED); 
        SentItemSubtype.WICH = new SentItemSubtype(1, "WICH");
        SentItemSubtype.mapIntToEnum.put(SentItemSubtype.WICH.value(), SentItemSubtype.WICH); 
        SentItemSubtype.mapStringToEnum.put(SentItemSubtype.WICH.m_str.toUpperCase(), SentItemSubtype.WICH); 
        SentItemSubtype.WHAT = new SentItemSubtype(2, "WHAT");
        SentItemSubtype.mapIntToEnum.put(SentItemSubtype.WHAT.value(), SentItemSubtype.WHAT); 
        SentItemSubtype.mapStringToEnum.put(SentItemSubtype.WHAT.m_str.toUpperCase(), SentItemSubtype.WHAT); 
        SentItemSubtype.HOW = new SentItemSubtype(3, "HOW");
        SentItemSubtype.mapIntToEnum.put(SentItemSubtype.HOW.value(), SentItemSubtype.HOW); 
        SentItemSubtype.mapStringToEnum.put(SentItemSubtype.HOW.m_str.toUpperCase(), SentItemSubtype.HOW); 
        SentItemSubtype.HOWMANY = new SentItemSubtype(4, "HOWMANY");
        SentItemSubtype.mapIntToEnum.put(SentItemSubtype.HOWMANY.value(), SentItemSubtype.HOWMANY); 
        SentItemSubtype.mapStringToEnum.put(SentItemSubtype.HOWMANY.m_str.toUpperCase(), SentItemSubtype.HOWMANY); 
        SentItemSubtype.m_Values = Array.from(SentItemSubtype.mapIntToEnum.values);
        SentItemSubtype.m_Keys = Array.from(SentItemSubtype.mapIntToEnum.keys);
    }
}


SentItemSubtype.static_constructor();

module.exports = SentItemSubtype