/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../unisharp/Hashtable");

/**
 * Типы связей между фрагментами
 */
class SemFraglinkType {

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
        if(val instanceof SemFraglinkType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(SemFraglinkType.mapStringToEnum.containsKey(val))
                return SemFraglinkType.mapStringToEnum.get(val);
            return null;
        }
        if(SemFraglinkType.mapIntToEnum.containsKey(val))
            return SemFraglinkType.mapIntToEnum.get(val);
        let it = new SemFraglinkType(val, val.toString());
        SemFraglinkType.mapIntToEnum.put(val, it);
        SemFraglinkType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return SemFraglinkType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return SemFraglinkType.m_Values;
    }
    static static_constructor() {
        SemFraglinkType.mapIntToEnum = new Hashtable();
        SemFraglinkType.mapStringToEnum = new Hashtable();
        SemFraglinkType.UNDEFINED = new SemFraglinkType(0, "UNDEFINED");
        SemFraglinkType.mapIntToEnum.put(SemFraglinkType.UNDEFINED.value(), SemFraglinkType.UNDEFINED); 
        SemFraglinkType.mapStringToEnum.put(SemFraglinkType.UNDEFINED.m_str.toUpperCase(), SemFraglinkType.UNDEFINED); 
        SemFraglinkType.IFTHEN = new SemFraglinkType(1, "IFTHEN");
        SemFraglinkType.mapIntToEnum.put(SemFraglinkType.IFTHEN.value(), SemFraglinkType.IFTHEN); 
        SemFraglinkType.mapStringToEnum.put(SemFraglinkType.IFTHEN.m_str.toUpperCase(), SemFraglinkType.IFTHEN); 
        SemFraglinkType.IFELSE = new SemFraglinkType(2, "IFELSE");
        SemFraglinkType.mapIntToEnum.put(SemFraglinkType.IFELSE.value(), SemFraglinkType.IFELSE); 
        SemFraglinkType.mapStringToEnum.put(SemFraglinkType.IFELSE.m_str.toUpperCase(), SemFraglinkType.IFELSE); 
        SemFraglinkType.BECAUSE = new SemFraglinkType(3, "BECAUSE");
        SemFraglinkType.mapIntToEnum.put(SemFraglinkType.BECAUSE.value(), SemFraglinkType.BECAUSE); 
        SemFraglinkType.mapStringToEnum.put(SemFraglinkType.BECAUSE.m_str.toUpperCase(), SemFraglinkType.BECAUSE); 
        SemFraglinkType.BUT = new SemFraglinkType(4, "BUT");
        SemFraglinkType.mapIntToEnum.put(SemFraglinkType.BUT.value(), SemFraglinkType.BUT); 
        SemFraglinkType.mapStringToEnum.put(SemFraglinkType.BUT.m_str.toUpperCase(), SemFraglinkType.BUT); 
        SemFraglinkType.FOR = new SemFraglinkType(5, "FOR");
        SemFraglinkType.mapIntToEnum.put(SemFraglinkType.FOR.value(), SemFraglinkType.FOR); 
        SemFraglinkType.mapStringToEnum.put(SemFraglinkType.FOR.m_str.toUpperCase(), SemFraglinkType.FOR); 
        SemFraglinkType.WHAT = new SemFraglinkType(6, "WHAT");
        SemFraglinkType.mapIntToEnum.put(SemFraglinkType.WHAT.value(), SemFraglinkType.WHAT); 
        SemFraglinkType.mapStringToEnum.put(SemFraglinkType.WHAT.m_str.toUpperCase(), SemFraglinkType.WHAT); 
        SemFraglinkType.m_Values = Array.from(SemFraglinkType.mapIntToEnum.values);
        SemFraglinkType.m_Keys = Array.from(SemFraglinkType.mapIntToEnum.keys);
    }
}


SemFraglinkType.static_constructor();

module.exports = SemFraglinkType