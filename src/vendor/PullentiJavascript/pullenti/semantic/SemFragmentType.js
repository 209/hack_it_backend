/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../unisharp/Hashtable");

/**
 * Типы фрагментов
 */
class SemFragmentType {

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
        if(val instanceof SemFragmentType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(SemFragmentType.mapStringToEnum.containsKey(val))
                return SemFragmentType.mapStringToEnum.get(val);
            return null;
        }
        if(SemFragmentType.mapIntToEnum.containsKey(val))
            return SemFragmentType.mapIntToEnum.get(val);
        let it = new SemFragmentType(val, val.toString());
        SemFragmentType.mapIntToEnum.put(val, it);
        SemFragmentType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return SemFragmentType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return SemFragmentType.m_Values;
    }
    static static_constructor() {
        SemFragmentType.mapIntToEnum = new Hashtable();
        SemFragmentType.mapStringToEnum = new Hashtable();
        SemFragmentType.UNDEFINED = new SemFragmentType(0, "UNDEFINED");
        SemFragmentType.mapIntToEnum.put(SemFragmentType.UNDEFINED.value(), SemFragmentType.UNDEFINED); 
        SemFragmentType.mapStringToEnum.put(SemFragmentType.UNDEFINED.m_str.toUpperCase(), SemFragmentType.UNDEFINED); 
        SemFragmentType.m_Values = Array.from(SemFragmentType.mapIntToEnum.values);
        SemFragmentType.m_Keys = Array.from(SemFragmentType.mapIntToEnum.keys);
    }
}


SemFragmentType.static_constructor();

module.exports = SemFragmentType