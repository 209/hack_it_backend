/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../unisharp/Hashtable");

/**
 * Типы семантических атрибутов
 */
class SemAttributeType {

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
        if(val instanceof SemAttributeType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(SemAttributeType.mapStringToEnum.containsKey(val))
                return SemAttributeType.mapStringToEnum.get(val);
            return null;
        }
        if(SemAttributeType.mapIntToEnum.containsKey(val))
            return SemAttributeType.mapIntToEnum.get(val);
        let it = new SemAttributeType(val, val.toString());
        SemAttributeType.mapIntToEnum.put(val, it);
        SemAttributeType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return SemAttributeType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return SemAttributeType.m_Values;
    }
    static static_constructor() {
        SemAttributeType.mapIntToEnum = new Hashtable();
        SemAttributeType.mapStringToEnum = new Hashtable();
        SemAttributeType.UNDEFINED = new SemAttributeType(0, "UNDEFINED");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.UNDEFINED.value(), SemAttributeType.UNDEFINED); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.UNDEFINED.m_str.toUpperCase(), SemAttributeType.UNDEFINED); 
        SemAttributeType.VERY = new SemAttributeType(1, "VERY");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.VERY.value(), SemAttributeType.VERY); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.VERY.m_str.toUpperCase(), SemAttributeType.VERY); 
        SemAttributeType.ALREADY = new SemAttributeType(2, "ALREADY");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.ALREADY.value(), SemAttributeType.ALREADY); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.ALREADY.m_str.toUpperCase(), SemAttributeType.ALREADY); 
        SemAttributeType.STILL = new SemAttributeType(3, "STILL");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.STILL.value(), SemAttributeType.STILL); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.STILL.m_str.toUpperCase(), SemAttributeType.STILL); 
        SemAttributeType.ALL = new SemAttributeType(4, "ALL");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.ALL.value(), SemAttributeType.ALL); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.ALL.m_str.toUpperCase(), SemAttributeType.ALL); 
        SemAttributeType.ANY = new SemAttributeType(5, "ANY");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.ANY.value(), SemAttributeType.ANY); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.ANY.m_str.toUpperCase(), SemAttributeType.ANY); 
        SemAttributeType.SOME = new SemAttributeType(6, "SOME");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.SOME.value(), SemAttributeType.SOME); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.SOME.m_str.toUpperCase(), SemAttributeType.SOME); 
        SemAttributeType.ONE = new SemAttributeType(7, "ONE");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.ONE.value(), SemAttributeType.ONE); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.ONE.m_str.toUpperCase(), SemAttributeType.ONE); 
        SemAttributeType.ONEOF = new SemAttributeType(8, "ONEOF");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.ONEOF.value(), SemAttributeType.ONEOF); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.ONEOF.m_str.toUpperCase(), SemAttributeType.ONEOF); 
        SemAttributeType.OTHER = new SemAttributeType(9, "OTHER");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.OTHER.value(), SemAttributeType.OTHER); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.OTHER.m_str.toUpperCase(), SemAttributeType.OTHER); 
        SemAttributeType.EACHOTHER = new SemAttributeType(10, "EACHOTHER");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.EACHOTHER.value(), SemAttributeType.EACHOTHER); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.EACHOTHER.m_str.toUpperCase(), SemAttributeType.EACHOTHER); 
        SemAttributeType.HIMELF = new SemAttributeType(11, "HIMELF");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.HIMELF.value(), SemAttributeType.HIMELF); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.HIMELF.m_str.toUpperCase(), SemAttributeType.HIMELF); 
        SemAttributeType.WHOLE = new SemAttributeType(12, "WHOLE");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.WHOLE.value(), SemAttributeType.WHOLE); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.WHOLE.m_str.toUpperCase(), SemAttributeType.WHOLE); 
        SemAttributeType.LESS = new SemAttributeType(13, "LESS");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.LESS.value(), SemAttributeType.LESS); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.LESS.m_str.toUpperCase(), SemAttributeType.LESS); 
        SemAttributeType.GREAT = new SemAttributeType(14, "GREAT");
        SemAttributeType.mapIntToEnum.put(SemAttributeType.GREAT.value(), SemAttributeType.GREAT); 
        SemAttributeType.mapStringToEnum.put(SemAttributeType.GREAT.m_str.toUpperCase(), SemAttributeType.GREAT); 
        SemAttributeType.m_Values = Array.from(SemAttributeType.mapIntToEnum.values);
        SemAttributeType.m_Keys = Array.from(SemAttributeType.mapIntToEnum.keys);
    }
}


SemAttributeType.static_constructor();

module.exports = SemAttributeType