/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Семантические роли
 */
class SemanticRole {

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
        if(val instanceof SemanticRole) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(SemanticRole.mapStringToEnum.containsKey(val))
                return SemanticRole.mapStringToEnum.get(val);
            return null;
        }
        if(SemanticRole.mapIntToEnum.containsKey(val))
            return SemanticRole.mapIntToEnum.get(val);
        let it = new SemanticRole(val, val.toString());
        SemanticRole.mapIntToEnum.put(val, it);
        SemanticRole.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return SemanticRole.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return SemanticRole.m_Values;
    }
    static static_constructor() {
        SemanticRole.mapIntToEnum = new Hashtable();
        SemanticRole.mapStringToEnum = new Hashtable();
        SemanticRole.UNDEFINED = new SemanticRole(0, "UNDEFINED");
        SemanticRole.mapIntToEnum.put(SemanticRole.UNDEFINED.value(), SemanticRole.UNDEFINED); 
        SemanticRole.mapStringToEnum.put(SemanticRole.UNDEFINED.m_str.toUpperCase(), SemanticRole.UNDEFINED); 
        SemanticRole.AGENT = new SemanticRole(1, "AGENT");
        SemanticRole.mapIntToEnum.put(SemanticRole.AGENT.value(), SemanticRole.AGENT); 
        SemanticRole.mapStringToEnum.put(SemanticRole.AGENT.m_str.toUpperCase(), SemanticRole.AGENT); 
        SemanticRole.PACIENT = new SemanticRole(2, "PACIENT");
        SemanticRole.mapIntToEnum.put(SemanticRole.PACIENT.value(), SemanticRole.PACIENT); 
        SemanticRole.mapStringToEnum.put(SemanticRole.PACIENT.m_str.toUpperCase(), SemanticRole.PACIENT); 
        SemanticRole.INSTRUMENT = new SemanticRole(3, "INSTRUMENT");
        SemanticRole.mapIntToEnum.put(SemanticRole.INSTRUMENT.value(), SemanticRole.INSTRUMENT); 
        SemanticRole.mapStringToEnum.put(SemanticRole.INSTRUMENT.m_str.toUpperCase(), SemanticRole.INSTRUMENT); 
        SemanticRole.AGENTORINSTRUMENT = new SemanticRole(4, "AGENTORINSTRUMENT");
        SemanticRole.mapIntToEnum.put(SemanticRole.AGENTORINSTRUMENT.value(), SemanticRole.AGENTORINSTRUMENT); 
        SemanticRole.mapStringToEnum.put(SemanticRole.AGENTORINSTRUMENT.m_str.toUpperCase(), SemanticRole.AGENTORINSTRUMENT); 
        SemanticRole.m_Values = Array.from(SemanticRole.mapIntToEnum.values);
        SemanticRole.m_Keys = Array.from(SemanticRole.mapIntToEnum.keys);
    }
}


SemanticRole.static_constructor();

module.exports = SemanticRole