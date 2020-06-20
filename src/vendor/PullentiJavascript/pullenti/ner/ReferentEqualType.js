/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../unisharp/Hashtable");

/**
 * Типы сравнение объектов
 */
class ReferentEqualType {

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
        if(val instanceof ReferentEqualType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(ReferentEqualType.mapStringToEnum.containsKey(val))
                return ReferentEqualType.mapStringToEnum.get(val);
            return null;
        }
        if(ReferentEqualType.mapIntToEnum.containsKey(val))
            return ReferentEqualType.mapIntToEnum.get(val);
        let it = new ReferentEqualType(val, val.toString());
        ReferentEqualType.mapIntToEnum.put(val, it);
        ReferentEqualType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return ReferentEqualType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return ReferentEqualType.m_Values;
    }
    static static_constructor() {
        ReferentEqualType.mapIntToEnum = new Hashtable();
        ReferentEqualType.mapStringToEnum = new Hashtable();
        ReferentEqualType.WITHINONETEXT = new ReferentEqualType(0, "WITHINONETEXT");
        ReferentEqualType.mapIntToEnum.put(ReferentEqualType.WITHINONETEXT.value(), ReferentEqualType.WITHINONETEXT); 
        ReferentEqualType.mapStringToEnum.put(ReferentEqualType.WITHINONETEXT.m_str.toUpperCase(), ReferentEqualType.WITHINONETEXT); 
        ReferentEqualType.DIFFERENTTEXTS = new ReferentEqualType(1, "DIFFERENTTEXTS");
        ReferentEqualType.mapIntToEnum.put(ReferentEqualType.DIFFERENTTEXTS.value(), ReferentEqualType.DIFFERENTTEXTS); 
        ReferentEqualType.mapStringToEnum.put(ReferentEqualType.DIFFERENTTEXTS.m_str.toUpperCase(), ReferentEqualType.DIFFERENTTEXTS); 
        ReferentEqualType.FORMERGING = new ReferentEqualType(2, "FORMERGING");
        ReferentEqualType.mapIntToEnum.put(ReferentEqualType.FORMERGING.value(), ReferentEqualType.FORMERGING); 
        ReferentEqualType.mapStringToEnum.put(ReferentEqualType.FORMERGING.m_str.toUpperCase(), ReferentEqualType.FORMERGING); 
        ReferentEqualType.m_Values = Array.from(ReferentEqualType.mapIntToEnum.values);
        ReferentEqualType.m_Keys = Array.from(ReferentEqualType.mapIntToEnum.keys);
    }
}


ReferentEqualType.static_constructor();

module.exports = ReferentEqualType