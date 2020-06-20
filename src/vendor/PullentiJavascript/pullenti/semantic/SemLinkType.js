/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../unisharp/Hashtable");

/**
 * Тип семантической связи
 */
class SemLinkType {

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
        if(val instanceof SemLinkType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(SemLinkType.mapStringToEnum.containsKey(val))
                return SemLinkType.mapStringToEnum.get(val);
            return null;
        }
        if(SemLinkType.mapIntToEnum.containsKey(val))
            return SemLinkType.mapIntToEnum.get(val);
        let it = new SemLinkType(val, val.toString());
        SemLinkType.mapIntToEnum.put(val, it);
        SemLinkType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return SemLinkType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return SemLinkType.m_Values;
    }
    static static_constructor() {
        SemLinkType.mapIntToEnum = new Hashtable();
        SemLinkType.mapStringToEnum = new Hashtable();
        SemLinkType.UNDEFINED = new SemLinkType(0, "UNDEFINED");
        SemLinkType.mapIntToEnum.put(SemLinkType.UNDEFINED.value(), SemLinkType.UNDEFINED); 
        SemLinkType.mapStringToEnum.put(SemLinkType.UNDEFINED.m_str.toUpperCase(), SemLinkType.UNDEFINED); 
        SemLinkType.DETAIL = new SemLinkType(1, "DETAIL");
        SemLinkType.mapIntToEnum.put(SemLinkType.DETAIL.value(), SemLinkType.DETAIL); 
        SemLinkType.mapStringToEnum.put(SemLinkType.DETAIL.m_str.toUpperCase(), SemLinkType.DETAIL); 
        SemLinkType.NAMING = new SemLinkType(2, "NAMING");
        SemLinkType.mapIntToEnum.put(SemLinkType.NAMING.value(), SemLinkType.NAMING); 
        SemLinkType.mapStringToEnum.put(SemLinkType.NAMING.m_str.toUpperCase(), SemLinkType.NAMING); 
        SemLinkType.AGENT = new SemLinkType(3, "AGENT");
        SemLinkType.mapIntToEnum.put(SemLinkType.AGENT.value(), SemLinkType.AGENT); 
        SemLinkType.mapStringToEnum.put(SemLinkType.AGENT.m_str.toUpperCase(), SemLinkType.AGENT); 
        SemLinkType.PACIENT = new SemLinkType(4, "PACIENT");
        SemLinkType.mapIntToEnum.put(SemLinkType.PACIENT.value(), SemLinkType.PACIENT); 
        SemLinkType.mapStringToEnum.put(SemLinkType.PACIENT.m_str.toUpperCase(), SemLinkType.PACIENT); 
        SemLinkType.PARTICIPLE = new SemLinkType(5, "PARTICIPLE");
        SemLinkType.mapIntToEnum.put(SemLinkType.PARTICIPLE.value(), SemLinkType.PARTICIPLE); 
        SemLinkType.mapStringToEnum.put(SemLinkType.PARTICIPLE.m_str.toUpperCase(), SemLinkType.PARTICIPLE); 
        SemLinkType.ANAFOR = new SemLinkType(6, "ANAFOR");
        SemLinkType.mapIntToEnum.put(SemLinkType.ANAFOR.value(), SemLinkType.ANAFOR); 
        SemLinkType.mapStringToEnum.put(SemLinkType.ANAFOR.m_str.toUpperCase(), SemLinkType.ANAFOR); 
        SemLinkType.m_Values = Array.from(SemLinkType.mapIntToEnum.values);
        SemLinkType.m_Keys = Array.from(SemLinkType.mapIntToEnum.keys);
    }
}


SemLinkType.static_constructor();

module.exports = SemLinkType