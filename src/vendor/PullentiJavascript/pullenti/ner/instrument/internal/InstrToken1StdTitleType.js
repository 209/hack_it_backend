/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class InstrToken1StdTitleType {

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
        if(val instanceof InstrToken1StdTitleType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(InstrToken1StdTitleType.mapStringToEnum.containsKey(val))
                return InstrToken1StdTitleType.mapStringToEnum.get(val);
            return null;
        }
        if(InstrToken1StdTitleType.mapIntToEnum.containsKey(val))
            return InstrToken1StdTitleType.mapIntToEnum.get(val);
        let it = new InstrToken1StdTitleType(val, val.toString());
        InstrToken1StdTitleType.mapIntToEnum.put(val, it);
        InstrToken1StdTitleType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return InstrToken1StdTitleType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return InstrToken1StdTitleType.m_Values;
    }
    static static_constructor() {
        InstrToken1StdTitleType.mapIntToEnum = new Hashtable();
        InstrToken1StdTitleType.mapStringToEnum = new Hashtable();
        InstrToken1StdTitleType.UNDEFINED = new InstrToken1StdTitleType(0, "UNDEFINED");
        InstrToken1StdTitleType.mapIntToEnum.put(InstrToken1StdTitleType.UNDEFINED.value(), InstrToken1StdTitleType.UNDEFINED); 
        InstrToken1StdTitleType.mapStringToEnum.put(InstrToken1StdTitleType.UNDEFINED.m_str.toUpperCase(), InstrToken1StdTitleType.UNDEFINED); 
        InstrToken1StdTitleType.SUBJECT = new InstrToken1StdTitleType(1, "SUBJECT");
        InstrToken1StdTitleType.mapIntToEnum.put(InstrToken1StdTitleType.SUBJECT.value(), InstrToken1StdTitleType.SUBJECT); 
        InstrToken1StdTitleType.mapStringToEnum.put(InstrToken1StdTitleType.SUBJECT.m_str.toUpperCase(), InstrToken1StdTitleType.SUBJECT); 
        InstrToken1StdTitleType.REQUISITES = new InstrToken1StdTitleType(2, "REQUISITES");
        InstrToken1StdTitleType.mapIntToEnum.put(InstrToken1StdTitleType.REQUISITES.value(), InstrToken1StdTitleType.REQUISITES); 
        InstrToken1StdTitleType.mapStringToEnum.put(InstrToken1StdTitleType.REQUISITES.m_str.toUpperCase(), InstrToken1StdTitleType.REQUISITES); 
        InstrToken1StdTitleType.OTHERS = new InstrToken1StdTitleType(3, "OTHERS");
        InstrToken1StdTitleType.mapIntToEnum.put(InstrToken1StdTitleType.OTHERS.value(), InstrToken1StdTitleType.OTHERS); 
        InstrToken1StdTitleType.mapStringToEnum.put(InstrToken1StdTitleType.OTHERS.m_str.toUpperCase(), InstrToken1StdTitleType.OTHERS); 
        InstrToken1StdTitleType.m_Values = Array.from(InstrToken1StdTitleType.mapIntToEnum.values);
        InstrToken1StdTitleType.m_Keys = Array.from(InstrToken1StdTitleType.mapIntToEnum.keys);
    }
}


InstrToken1StdTitleType.static_constructor();

module.exports = InstrToken1StdTitleType