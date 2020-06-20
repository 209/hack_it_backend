/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class ParticipantTokenKinds {

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
        if(val instanceof ParticipantTokenKinds) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(ParticipantTokenKinds.mapStringToEnum.containsKey(val))
                return ParticipantTokenKinds.mapStringToEnum.get(val);
            return null;
        }
        if(ParticipantTokenKinds.mapIntToEnum.containsKey(val))
            return ParticipantTokenKinds.mapIntToEnum.get(val);
        let it = new ParticipantTokenKinds(val, val.toString());
        ParticipantTokenKinds.mapIntToEnum.put(val, it);
        ParticipantTokenKinds.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return ParticipantTokenKinds.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return ParticipantTokenKinds.m_Values;
    }
    static static_constructor() {
        ParticipantTokenKinds.mapIntToEnum = new Hashtable();
        ParticipantTokenKinds.mapStringToEnum = new Hashtable();
        ParticipantTokenKinds.UNDEFINED = new ParticipantTokenKinds(0, "UNDEFINED");
        ParticipantTokenKinds.mapIntToEnum.put(ParticipantTokenKinds.UNDEFINED.value(), ParticipantTokenKinds.UNDEFINED); 
        ParticipantTokenKinds.mapStringToEnum.put(ParticipantTokenKinds.UNDEFINED.m_str.toUpperCase(), ParticipantTokenKinds.UNDEFINED); 
        ParticipantTokenKinds.PURE = new ParticipantTokenKinds(1, "PURE");
        ParticipantTokenKinds.mapIntToEnum.put(ParticipantTokenKinds.PURE.value(), ParticipantTokenKinds.PURE); 
        ParticipantTokenKinds.mapStringToEnum.put(ParticipantTokenKinds.PURE.m_str.toUpperCase(), ParticipantTokenKinds.PURE); 
        ParticipantTokenKinds.NAMEDAS = new ParticipantTokenKinds(2, "NAMEDAS");
        ParticipantTokenKinds.mapIntToEnum.put(ParticipantTokenKinds.NAMEDAS.value(), ParticipantTokenKinds.NAMEDAS); 
        ParticipantTokenKinds.mapStringToEnum.put(ParticipantTokenKinds.NAMEDAS.m_str.toUpperCase(), ParticipantTokenKinds.NAMEDAS); 
        ParticipantTokenKinds.NAMEDASPARTS = new ParticipantTokenKinds(3, "NAMEDASPARTS");
        ParticipantTokenKinds.mapIntToEnum.put(ParticipantTokenKinds.NAMEDASPARTS.value(), ParticipantTokenKinds.NAMEDASPARTS); 
        ParticipantTokenKinds.mapStringToEnum.put(ParticipantTokenKinds.NAMEDASPARTS.m_str.toUpperCase(), ParticipantTokenKinds.NAMEDASPARTS); 
        ParticipantTokenKinds.m_Values = Array.from(ParticipantTokenKinds.mapIntToEnum.values);
        ParticipantTokenKinds.m_Keys = Array.from(ParticipantTokenKinds.mapIntToEnum.keys);
    }
}


ParticipantTokenKinds.static_constructor();

module.exports = ParticipantTokenKinds