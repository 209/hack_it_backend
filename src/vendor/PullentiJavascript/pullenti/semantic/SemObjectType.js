/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../unisharp/Hashtable");

/**
 * Типы семантических объектов
 */
class SemObjectType {

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
        if(val instanceof SemObjectType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(SemObjectType.mapStringToEnum.containsKey(val))
                return SemObjectType.mapStringToEnum.get(val);
            return null;
        }
        if(SemObjectType.mapIntToEnum.containsKey(val))
            return SemObjectType.mapIntToEnum.get(val);
        let it = new SemObjectType(val, val.toString());
        SemObjectType.mapIntToEnum.put(val, it);
        SemObjectType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return SemObjectType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return SemObjectType.m_Values;
    }
    static static_constructor() {
        SemObjectType.mapIntToEnum = new Hashtable();
        SemObjectType.mapStringToEnum = new Hashtable();
        SemObjectType.UNDEFINED = new SemObjectType(0, "UNDEFINED");
        SemObjectType.mapIntToEnum.put(SemObjectType.UNDEFINED.value(), SemObjectType.UNDEFINED); 
        SemObjectType.mapStringToEnum.put(SemObjectType.UNDEFINED.m_str.toUpperCase(), SemObjectType.UNDEFINED); 
        SemObjectType.NOUN = new SemObjectType(1, "NOUN");
        SemObjectType.mapIntToEnum.put(SemObjectType.NOUN.value(), SemObjectType.NOUN); 
        SemObjectType.mapStringToEnum.put(SemObjectType.NOUN.m_str.toUpperCase(), SemObjectType.NOUN); 
        SemObjectType.ADJECTIVE = new SemObjectType(2, "ADJECTIVE");
        SemObjectType.mapIntToEnum.put(SemObjectType.ADJECTIVE.value(), SemObjectType.ADJECTIVE); 
        SemObjectType.mapStringToEnum.put(SemObjectType.ADJECTIVE.m_str.toUpperCase(), SemObjectType.ADJECTIVE); 
        SemObjectType.VERB = new SemObjectType(3, "VERB");
        SemObjectType.mapIntToEnum.put(SemObjectType.VERB.value(), SemObjectType.VERB); 
        SemObjectType.mapStringToEnum.put(SemObjectType.VERB.m_str.toUpperCase(), SemObjectType.VERB); 
        SemObjectType.PARTICIPLE = new SemObjectType(4, "PARTICIPLE");
        SemObjectType.mapIntToEnum.put(SemObjectType.PARTICIPLE.value(), SemObjectType.PARTICIPLE); 
        SemObjectType.mapStringToEnum.put(SemObjectType.PARTICIPLE.m_str.toUpperCase(), SemObjectType.PARTICIPLE); 
        SemObjectType.ADVERB = new SemObjectType(5, "ADVERB");
        SemObjectType.mapIntToEnum.put(SemObjectType.ADVERB.value(), SemObjectType.ADVERB); 
        SemObjectType.mapStringToEnum.put(SemObjectType.ADVERB.m_str.toUpperCase(), SemObjectType.ADVERB); 
        SemObjectType.PRONOUN = new SemObjectType(6, "PRONOUN");
        SemObjectType.mapIntToEnum.put(SemObjectType.PRONOUN.value(), SemObjectType.PRONOUN); 
        SemObjectType.mapStringToEnum.put(SemObjectType.PRONOUN.m_str.toUpperCase(), SemObjectType.PRONOUN); 
        SemObjectType.PERSONALPRONOUN = new SemObjectType(7, "PERSONALPRONOUN");
        SemObjectType.mapIntToEnum.put(SemObjectType.PERSONALPRONOUN.value(), SemObjectType.PERSONALPRONOUN); 
        SemObjectType.mapStringToEnum.put(SemObjectType.PERSONALPRONOUN.m_str.toUpperCase(), SemObjectType.PERSONALPRONOUN); 
        SemObjectType.QUESTION = new SemObjectType(8, "QUESTION");
        SemObjectType.mapIntToEnum.put(SemObjectType.QUESTION.value(), SemObjectType.QUESTION); 
        SemObjectType.mapStringToEnum.put(SemObjectType.QUESTION.m_str.toUpperCase(), SemObjectType.QUESTION); 
        SemObjectType.m_Values = Array.from(SemObjectType.mapIntToEnum.values);
        SemObjectType.m_Keys = Array.from(SemObjectType.mapIntToEnum.keys);
    }
}


SemObjectType.static_constructor();

module.exports = SemObjectType